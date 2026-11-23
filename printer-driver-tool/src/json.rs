//! JSON parser tối thiểu, chỉ để đọc lại manifest do chính tool này
//! ghi ra (không thay thế serde cho JSON lạ). Hỗ trợ đầy đủ object,
//! array, string (kể cả escape \u và surrogate pair), số, true/false,
//! null. Viết tay để giữ 0 dependency ngoài Windows.

/// Một giá trị JSON.
#[derive(Debug, Clone, PartialEq)]
pub enum JsonValue {
    Null,
    Bool(bool),
    /// Số, lưu dạng f64 (manifest chỉ cần số nguyên nhỏ: version...).
    Number(f64),
    Str(String),
    Array(Vec<JsonValue>),
    /// Object giữ thứ tự key như trong file.
    Object(Vec<(String, JsonValue)>),
}

impl JsonValue {
    /// Lấy field của object theo key. None nếu không phải object
    /// hoặc không có key.
    pub fn get(&self, key: &str) -> Option<&JsonValue> {
        match self {
            JsonValue::Object(fields) => fields.iter().find(|(k, _)| k == key).map(|(_, v)| v),
            _ => None,
        }
    }

    /// Chuỗi, hoặc None nếu không phải string.
    pub fn as_str(&self) -> Option<&str> {
        match self {
            JsonValue::Str(s) => Some(s),
            _ => None,
        }
    }

    /// Số nguyên không âm, hoặc None nếu không phải số nguyên hợp lệ.
    pub fn as_u64(&self) -> Option<u64> {
        match self {
            JsonValue::Number(n) if *n >= 0.0 && n.fract() == 0.0 && *n <= u64::MAX as f64 => {
                Some(*n as u64)
            }
            _ => None,
        }
    }

    /// Mảng, hoặc None nếu không phải array.
    pub fn as_array(&self) -> Option<&[JsonValue]> {
        match self {
            JsonValue::Array(items) => Some(items),
            _ => None,
        }
    }

    /// true nếu là null.
    pub fn is_null(&self) -> bool {
        matches!(self, JsonValue::Null)
    }
}

struct Parser<'a> {
    chars: Vec<char>,
    pos: usize,
    input: &'a str,
}

impl<'a> Parser<'a> {
    fn new(input: &'a str) -> Self {
        Parser {
            chars: input.chars().collect(),
            pos: 0,
            input,
        }
    }

    fn err(&self, what: &str) -> String {
        format!(
            "JSON lỗi ở ký tự {}: {what} (gần: {:?})",
            self.pos,
            self.context()
        )
    }

    fn context(&self) -> String {
        let start = self.pos.saturating_sub(20);
        let end = (self.pos + 20).min(self.chars.len());
        self.chars[start..end].iter().collect()
    }

    fn peek(&self) -> Option<char> {
        self.chars.get(self.pos).copied()
    }

    fn next(&mut self) -> Option<char> {
        let c = self.peek();
        if c.is_some() {
            self.pos += 1;
        }
        c
    }

    fn skip_ws(&mut self) {
        while matches!(self.peek(), Some(' ' | '\t' | '\n' | '\r')) {
            self.pos += 1;
        }
    }

    fn expect(&mut self, c: char) -> Result<(), String> {
        if self.next() == Some(c) {
            Ok(())
        } else {
            Err(self.err(&format!("muốn có {c:?}")))
        }
    }

    fn parse_value(&mut self) -> Result<JsonValue, String> {
        self.skip_ws();
        match self.peek() {
            Some('{') => self.parse_object(),
            Some('[') => self.parse_array(),
            Some('"') => Ok(JsonValue::Str(self.parse_string()?)),
            Some('t') => self.parse_literal("true", JsonValue::Bool(true)),
            Some('f') => self.parse_literal("false", JsonValue::Bool(false)),
            Some('n') => self.parse_literal("null", JsonValue::Null),
            Some(c) if c == '-' || c.is_ascii_digit() => self.parse_number(),
            Some(c) => Err(self.err(&format!("ký tự không ngờ tới {c:?}"))),
            None => Err(self.err("hết dữ liệu giữa chừng")),
        }
    }

    fn parse_literal(&mut self, word: &str, value: JsonValue) -> Result<JsonValue, String> {
        for expected in word.chars() {
            if self.next() != Some(expected) {
                return Err(self.err(&format!("muốn có {word:?}")));
            }
        }
        Ok(value)
    }

    fn parse_object(&mut self) -> Result<JsonValue, String> {
        self.expect('{')?;
        let mut fields = Vec::new();
        self.skip_ws();
        if self.peek() == Some('}') {
            self.pos += 1;
            return Ok(JsonValue::Object(fields));
        }
        loop {
            self.skip_ws();
            if self.peek() != Some('"') {
                return Err(self.err("muốn có key dạng chuỗi trong object"));
            }
            let key = self.parse_string()?;
            self.skip_ws();
            self.expect(':')?;
            let value = self.parse_value()?;
            fields.push((key, value));
            self.skip_ws();
            match self.next() {
                Some(',') => continue,
                Some('}') => break,
                _ => return Err(self.err("muốn có ',' hoặc '}' trong object")),
            }
        }
        Ok(JsonValue::Object(fields))
    }

    fn parse_array(&mut self) -> Result<JsonValue, String> {
        self.expect('[')?;
        let mut items = Vec::new();
        self.skip_ws();
        if self.peek() == Some(']') {
            self.pos += 1;
            return Ok(JsonValue::Array(items));
        }
        loop {
            let value = self.parse_value()?;
            items.push(value);
            self.skip_ws();
            match self.next() {
                Some(',') => continue,
                Some(']') => break,
                _ => return Err(self.err("muốn có ',' hoặc ']' trong array")),
            }
        }
        Ok(JsonValue::Array(items))
    }

    fn parse_string(&mut self) -> Result<String, String> {
        self.expect('"')?;
        let mut out = String::new();
        loop {
            match self.next() {
                None => return Err(self.err("chuỗi chưa đóng ngoặc")),
                Some('"') => return Ok(out),
                Some('\\') => {
                    let esc = self.next().ok_or_else(|| self.err("escape dở dang"))?;
                    match esc {
                        '"' => out.push('"'),
                        '\\' => out.push('\\'),
                        '/' => out.push('/'),
                        'b' => out.push('\u{0008}'),
                        'f' => out.push('\u{000C}'),
                        'n' => out.push('\n'),
                        'r' => out.push('\r'),
                        't' => out.push('\t'),
                        'u' => {
                            let cp = self.parse_hex4()?;
                            if (0xD800..0xDC00).contains(&cp) {
                                // High surrogate: phải có \uDC00-\uDFFF theo sau.
                                if self.next() != Some('\\') || self.next() != Some('u') {
                                    return Err(self.err("thiếu low surrogate sau high surrogate"));
                                }
                                let lo = self.parse_hex4()?;
                                if !(0xDC00..0xE000).contains(&lo) {
                                    return Err(self.err("low surrogate không hợp lệ"));
                                }
                                let c = 0x10000 + ((cp - 0xD800) << 10) + (lo - 0xDC00);
                                out.push(
                                    char::from_u32(c)
                                        .ok_or_else(|| self.err("mã ký tự không hợp lệ"))?,
                                );
                            } else if (0xDC00..0xE000).contains(&cp) {
                                return Err(self.err("low surrogate đứng một mình"));
                            } else {
                                out.push(
                                    char::from_u32(cp)
                                        .ok_or_else(|| self.err("mã ký tự không hợp lệ"))?,
                                );
                            }
                        }
                        _ => return Err(self.err(&format!("escape không hợp lệ \\{esc}"))),
                    }
                }
                Some(c) if (c as u32) < 0x20 => {
                    return Err(self.err("ký tự điều khiển trong chuỗi phải escape"));
                }
                Some(c) => out.push(c),
            }
        }
    }

    fn parse_hex4(&mut self) -> Result<u32, String> {
        let mut v: u32 = 0;
        for _ in 0..4 {
            let c = self.next().ok_or_else(|| self.err("mã \\u dở dang"))?;
            let d = c
                .to_digit(16)
                .ok_or_else(|| self.err("mã \\u không phải hex"))?;
            v = v * 16 + d;
        }
        Ok(v)
    }

    fn parse_number(&mut self) -> Result<JsonValue, String> {
        let start = self.pos;
        if self.peek() == Some('-') {
            self.pos += 1;
        }
        // Phần nguyên theo grammar JSON: "0" đứng một mình, hoặc
        // [1-9][0-9]* — cấm số 0 ở đầu (vd "01" không hợp lệ).
        if self.peek() == Some('0') {
            self.pos += 1;
        } else if self.peek().is_some_and(|c| c.is_ascii_digit()) {
            while self.peek().is_some_and(|c| c.is_ascii_digit()) {
                self.pos += 1;
            }
        } else {
            return Err(self.err("số không có chữ số"));
        }
        if self.peek() == Some('.') {
            self.pos += 1;
            let mut frac = 0;
            while self.peek().is_some_and(|c| c.is_ascii_digit()) {
                self.pos += 1;
                frac += 1;
            }
            if frac == 0 {
                return Err(self.err("số thiếu chữ số sau dấu chấm"));
            }
        }
        if matches!(self.peek(), Some('e' | 'E')) {
            self.pos += 1;
            if matches!(self.peek(), Some('+' | '-')) {
                self.pos += 1;
            }
            let mut exp = 0;
            while self.peek().is_some_and(|c| c.is_ascii_digit()) {
                self.pos += 1;
                exp += 1;
            }
            if exp == 0 {
                return Err(self.err("số thiếu chữ số sau e"));
            }
        }
        let text: String = self.chars[start..self.pos].iter().collect();
        text.parse::<f64>()
            .map(JsonValue::Number)
            .map_err(|_| self.err("số không parse được"))
    }
}

/// Parse toàn bộ chuỗi thành JsonValue. Trả lỗi nếu còn nội dung
/// thừa sau giá trị JSON đầu tiên.
pub fn parse(input: &str) -> Result<JsonValue, String> {
    let mut p = Parser::new(input);
    let v = p.parse_value()?;
    p.skip_ws();
    if p.pos != p.chars.len() {
        return Err(p.err("còn nội dung thừa sau JSON"));
    }
    let _ = p.input;
    Ok(v)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn primitives() {
        assert_eq!(parse("null").unwrap(), JsonValue::Null);
        assert_eq!(parse("true").unwrap(), JsonValue::Bool(true));
        assert_eq!(parse("42").unwrap(), JsonValue::Number(42.0));
        assert_eq!(parse("-1.5e3").unwrap(), JsonValue::Number(-1500.0));
        assert_eq!(
            parse("\"a\\n\\t\\\"b\\\\\"").unwrap(),
            JsonValue::Str("a\n\t\"b\\".to_string())
        );
    }

    #[test]
    fn unicode_escapes() {
        // \u0041 = 'A'; surrogate pair = U+1F600 (😀).
        assert_eq!(
            parse("\"\\u0041\"").unwrap(),
            JsonValue::Str("A".to_string())
        );
        assert_eq!(
            parse("\"\\uD83D\\uDE00\"").unwrap(),
            JsonValue::Str("\u{1F600}".to_string())
        );
        assert!(
            parse("\"\\uD83D\"").is_err(),
            "high surrogate đơn độc phải lỗi"
        );
        assert!(
            parse("\"\\uDE00\"").is_err(),
            "low surrogate đơn độc phải lỗi"
        );
    }

    #[test]
    fn nested_structures() {
        let v = parse("{\"a\": [1, \"x\", null], \"b\": {\"c\": true}}").unwrap();
        assert_eq!(v.get("a").unwrap().as_array().unwrap().len(), 3);
        assert_eq!(
            v.get("b").unwrap().get("c").unwrap(),
            &JsonValue::Bool(true)
        );
        assert!(v.get("a").unwrap().as_array().unwrap()[2].is_null());
    }

    #[test]
    fn rejects_bad_input() {
        assert!(parse("").is_err());
        assert!(parse("{").is_err());
        assert!(parse("{\"a\":}").is_err());
        assert!(parse("[1,]").is_err());
        assert!(parse("\"abc").is_err());
        assert!(parse("123 456").is_err());
        assert!(parse("tru").is_err());
    }

    #[test]
    fn trailing_garbage_rejected() {
        assert!(parse("01").is_err());
        assert!(parse("{} x").is_err());
    }
}
