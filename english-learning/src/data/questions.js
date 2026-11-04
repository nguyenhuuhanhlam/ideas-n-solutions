// Ngân hàng câu hỏi — SINH TỰ ĐỘNG bằng tools/generate-questions.mjs, đừng sửa tay.
// Câu hỏi mới soạn theo chủ đề/dạng bài chuẩn, không sao chép giáo trình có bản quyền.
export const questionBanks = {
  "greetings": [
    {
      "type": "choice",
      "prompt": "\"hello\" có nghĩa là gì?",
      "options": [
        "chào buổi sáng",
        "xin chào",
        "xin lỗi",
        "tên tôi là"
      ],
      "answer": "xin chào",
      "explanation": "hello = xin chào."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"xin chào\"?",
      "options": [
        "sorry",
        "good morning",
        "please",
        "hello"
      ],
      "answer": "hello",
      "explanation": "hello = xin chào."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"xin chào\"",
      "answers": [
        "hello"
      ],
      "explanation": "hello = xin chào."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______, Lan!",
      "answers": [
        "hello"
      ],
      "explanation": "Câu đầy đủ: Hello, Lan!"
    },
    {
      "type": "choice",
      "prompt": "\"good morning\" có nghĩa là gì?",
      "options": [
        "chào buổi sáng",
        "tạm biệt",
        "cảm ơn",
        "xin chào"
      ],
      "answer": "chào buổi sáng",
      "explanation": "good morning = chào buổi sáng."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"chào buổi sáng\"?",
      "options": [
        "good morning",
        "please",
        "sorry",
        "my name is"
      ],
      "answer": "good morning",
      "explanation": "good morning = chào buổi sáng."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"chào buổi sáng\"",
      "answers": [
        "good morning"
      ],
      "explanation": "good morning = chào buổi sáng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______, teacher!",
      "answers": [
        "good morning"
      ],
      "explanation": "Câu đầy đủ: Good morning, teacher!"
    },
    {
      "type": "choice",
      "prompt": "\"goodbye\" có nghĩa là gì?",
      "options": [
        "xin chào",
        "tạm biệt",
        "rất vui được gặp bạn",
        "xin lỗi"
      ],
      "answer": "tạm biệt",
      "explanation": "goodbye = tạm biệt."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"tạm biệt\"?",
      "options": [
        "good morning",
        "nice to meet you",
        "my name is",
        "goodbye"
      ],
      "answer": "goodbye",
      "explanation": "goodbye = tạm biệt."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"tạm biệt\"",
      "answers": [
        "goodbye"
      ],
      "explanation": "goodbye = tạm biệt."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______, see you tomorrow!",
      "answers": [
        "goodbye"
      ],
      "explanation": "Câu đầy đủ: Goodbye, see you tomorrow!"
    },
    {
      "type": "choice",
      "prompt": "\"please\" có nghĩa là gì?",
      "options": [
        "xin chào",
        "làm ơn",
        "tạm biệt",
        "tên tôi là"
      ],
      "answer": "làm ơn",
      "explanation": "please = làm ơn."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"làm ơn\"?",
      "options": [
        "hello",
        "my name is",
        "please",
        "sorry"
      ],
      "answer": "please",
      "explanation": "please = làm ơn."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"làm ơn\"",
      "answers": [
        "please"
      ],
      "explanation": "please = làm ơn."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ sit down.",
      "answers": [
        "please"
      ],
      "explanation": "Câu đầy đủ: Please sit down."
    },
    {
      "type": "choice",
      "prompt": "\"thank you\" có nghĩa là gì?",
      "options": [
        "làm ơn",
        "cảm ơn",
        "rất vui được gặp bạn",
        "tạm biệt"
      ],
      "answer": "cảm ơn",
      "explanation": "thank you = cảm ơn."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"cảm ơn\"?",
      "options": [
        "good morning",
        "sorry",
        "thank you",
        "my name is"
      ],
      "answer": "thank you",
      "explanation": "thank you = cảm ơn."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cảm ơn\"",
      "answers": [
        "thank you"
      ],
      "explanation": "thank you = cảm ơn."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ very much!",
      "answers": [
        "thank you"
      ],
      "explanation": "Câu đầy đủ: Thank you very much!"
    },
    {
      "type": "choice",
      "prompt": "\"sorry\" có nghĩa là gì?",
      "options": [
        "rất vui được gặp bạn",
        "xin chào",
        "xin lỗi",
        "chào buổi sáng"
      ],
      "answer": "xin lỗi",
      "explanation": "sorry = xin lỗi."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"xin lỗi\"?",
      "options": [
        "nice to meet you",
        "thank you",
        "good morning",
        "sorry"
      ],
      "answer": "sorry",
      "explanation": "sorry = xin lỗi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"xin lỗi\"",
      "answers": [
        "sorry"
      ],
      "explanation": "sorry = xin lỗi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______, I am late.",
      "answers": [
        "sorry"
      ],
      "explanation": "Câu đầy đủ: Sorry, I am late."
    },
    {
      "type": "choice",
      "prompt": "\"my name is\" có nghĩa là gì?",
      "options": [
        "làm ơn",
        "chào buổi sáng",
        "cảm ơn",
        "tên tôi là"
      ],
      "answer": "tên tôi là",
      "explanation": "my name is = tên tôi là."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"tên tôi là\"?",
      "options": [
        "sorry",
        "my name is",
        "nice to meet you",
        "hello"
      ],
      "answer": "my name is",
      "explanation": "my name is = tên tôi là."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"tên tôi là\"",
      "answers": [
        "my name is"
      ],
      "explanation": "my name is = tên tôi là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ Minh.",
      "answers": [
        "my name is"
      ],
      "explanation": "Câu đầy đủ: My name is Minh."
    },
    {
      "type": "choice",
      "prompt": "\"nice to meet you\" có nghĩa là gì?",
      "options": [
        "rất vui được gặp bạn",
        "cảm ơn",
        "chào buổi sáng",
        "tạm biệt"
      ],
      "answer": "rất vui được gặp bạn",
      "explanation": "nice to meet you = rất vui được gặp bạn."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"rất vui được gặp bạn\"?",
      "options": [
        "goodbye",
        "please",
        "nice to meet you",
        "thank you"
      ],
      "answer": "nice to meet you",
      "explanation": "nice to meet you = rất vui được gặp bạn."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"rất vui được gặp bạn\"",
      "answers": [
        "nice to meet you"
      ],
      "explanation": "nice to meet you = rất vui được gặp bạn."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______!",
      "answers": [
        "nice to meet you"
      ],
      "explanation": "Câu đầy đủ: Nice to meet you!"
    },
    {
      "type": "choice",
      "prompt": "Khi muốn cảm ơn, bạn nói gì?",
      "options": [
        "Sorry",
        "Goodbye",
        "Thank you",
        "Please"
      ],
      "answer": "Thank you",
      "explanation": "Thank you = cảm ơn."
    },
    {
      "type": "choice",
      "prompt": "Câu nào dùng để tự giới thiệu tên?",
      "options": [
        "How are you?",
        "My name is Lan.",
        "Good night!",
        "See you later."
      ],
      "answer": "My name is Lan.",
      "explanation": "My name is + tên = Tôi tên là…"
    },
    {
      "type": "choice",
      "prompt": "\"Nice to meet you!\" có nghĩa là gì?",
      "options": [
        "Tạm biệt nhé!",
        "Rất vui được gặp bạn!",
        "Bạn khỏe không?",
        "Xin lỗi nhé!"
      ],
      "answer": "Rất vui được gặp bạn!",
      "explanation": "Câu này nói khi lần đầu gặp ai đó."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ to meet you!",
      "answers": [
        "nice"
      ],
      "explanation": "Nice to meet you! = Rất vui được gặp bạn!"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______, sit down.",
      "answers": [
        "please"
      ],
      "explanation": "Please = làm ơn, dùng khi nhờ ai làm gì."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My ______ is Hoa.",
      "answers": [
        "name"
      ],
      "explanation": "My name is Hoa. = Tôi tên là Hoa."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tạm biệt, hẹn gặp lại ngày mai!\"",
      "answers": [
        "goodbye, see you tomorrow"
      ],
      "explanation": "Goodbye = tạm biệt, see you tomorrow = hẹn gặp lại ngày mai."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Xin chào, tôi tên là Nam.\"",
      "answers": [
        "hello, my name is nam"
      ],
      "explanation": "Hello = xin chào, My name is Nam = Tôi tên là Nam."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Cảm ơn bạn rất nhiều!\"",
      "answers": [
        "thank you very much"
      ],
      "explanation": "Thank you very much = Cảm ơn bạn rất nhiều!"
    },
    {
      "type": "choice",
      "prompt": "buổi sáng gặp bạn bè, bạn chào thế nào?",
      "options": [
        "Good afternoon",
        "Good evening",
        "Good night",
        "Good morning"
      ],
      "answer": "Good morning",
      "explanation": "Good morning dùng vào buổi sáng."
    },
    {
      "type": "choice",
      "prompt": "buổi chiều gặp bạn bè, bạn chào thế nào?",
      "options": [
        "Good night",
        "Good morning",
        "Good evening",
        "Good afternoon"
      ],
      "answer": "Good afternoon",
      "explanation": "Good afternoon dùng vào buổi chiều."
    },
    {
      "type": "choice",
      "prompt": "buổi tối gặp bạn bè, bạn chào thế nào?",
      "options": [
        "Good evening",
        "Good afternoon",
        "Good morning",
        "Good night"
      ],
      "answer": "Good evening",
      "explanation": "Good evening dùng vào buổi tối."
    },
    {
      "type": "choice",
      "prompt": "trước khi đi ngủ gặp bạn bè, bạn chào thế nào?",
      "options": [
        "Good night",
        "Good evening",
        "Good afternoon",
        "Good morning"
      ],
      "answer": "Good night",
      "explanation": "Good night dùng vào trước khi đi ngủ."
    },
    {
      "type": "choice",
      "prompt": "Câu nào dùng để tạm biệt?",
      "options": [
        "Please",
        "Hello",
        "Goodbye",
        "Thank you"
      ],
      "answer": "Goodbye",
      "explanation": "Goodbye = tạm biệt."
    },
    {
      "type": "choice",
      "prompt": "Câu nào dùng để cảm ơn?",
      "options": [
        "Thank you",
        "Goodbye",
        "Sorry",
        "Please"
      ],
      "answer": "Thank you",
      "explanation": "Thank you = cảm ơn."
    },
    {
      "type": "choice",
      "prompt": "Muốn nhờ ai đó làm gì, bạn nói gì trước câu nhờ?",
      "options": [
        "Please",
        "Sorry",
        "Thank you",
        "Goodbye"
      ],
      "answer": "Please",
      "explanation": "Please = làm ơn, dùng khi nhờ ai làm gì."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My ______ is Lan.",
      "answers": [
        "name"
      ],
      "explanation": "My name is Lan. = Tôi tên là Lan."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My ______ is Minh.",
      "answers": [
        "name"
      ],
      "explanation": "My name is Minh. = Tôi tên là Minh."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My ______ is Nam.",
      "answers": [
        "name"
      ],
      "explanation": "My name is Nam. = Tôi tên là Nam."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My ______ is An.",
      "answers": [
        "name"
      ],
      "explanation": "My name is An. = Tôi tên là An."
    }
  ],
  "numbers": [
    {
      "type": "choice",
      "prompt": "\"one\" có nghĩa là gì?",
      "options": [
        "số 5",
        "số 12",
        "số 1",
        "số 10"
      ],
      "answer": "số 1",
      "explanation": "one = số 1."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"số 1\"?",
      "options": [
        "years old",
        "ten",
        "one",
        "two"
      ],
      "answer": "one",
      "explanation": "one = số 1."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"số 1\"",
      "answers": [
        "one"
      ],
      "explanation": "one = số 1."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ pen.",
      "answers": [
        "one"
      ],
      "explanation": "Câu đầy đủ: I have one pen."
    },
    {
      "type": "choice",
      "prompt": "\"two\" có nghĩa là gì?",
      "options": [
        "số 12",
        "số 1",
        "số 2",
        "số 3"
      ],
      "answer": "số 2",
      "explanation": "two = số 2."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"số 2\"?",
      "options": [
        "twenty",
        "two",
        "one",
        "five"
      ],
      "answer": "two",
      "explanation": "two = số 2."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"số 2\"",
      "answers": [
        "two"
      ],
      "explanation": "two = số 2."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ books.",
      "answers": [
        "two"
      ],
      "explanation": "Câu đầy đủ: I have two books."
    },
    {
      "type": "choice",
      "prompt": "\"three\" có nghĩa là gì?",
      "options": [
        "số 2",
        "số 3",
        "tuổi",
        "số 5"
      ],
      "answer": "số 3",
      "explanation": "three = số 3."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"số 3\"?",
      "options": [
        "two",
        "three",
        "one",
        "ten"
      ],
      "answer": "three",
      "explanation": "three = số 3."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"số 3\"",
      "answers": [
        "three"
      ],
      "explanation": "three = số 3."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ cats.",
      "answers": [
        "three"
      ],
      "explanation": "Câu đầy đủ: Three cats."
    },
    {
      "type": "choice",
      "prompt": "\"five\" có nghĩa là gì?",
      "options": [
        "số 5",
        "số 10",
        "số 3",
        "số 12"
      ],
      "answer": "số 5",
      "explanation": "five = số 5."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"số 5\"?",
      "options": [
        "five",
        "two",
        "twenty",
        "twelve"
      ],
      "answer": "five",
      "explanation": "five = số 5."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"số 5\"",
      "answers": [
        "five"
      ],
      "explanation": "five = số 5."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I am ______ years old.",
      "answers": [
        "five"
      ],
      "explanation": "Câu đầy đủ: I am five years old."
    },
    {
      "type": "choice",
      "prompt": "\"ten\" có nghĩa là gì?",
      "options": [
        "số 20",
        "số 10",
        "số 1",
        "số 12"
      ],
      "answer": "số 10",
      "explanation": "ten = số 10."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"số 10\"?",
      "options": [
        "five",
        "three",
        "one",
        "ten"
      ],
      "answer": "ten",
      "explanation": "ten = số 10."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"số 10\"",
      "answers": [
        "ten"
      ],
      "explanation": "ten = số 10."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I am ______ years old.",
      "answers": [
        "ten"
      ],
      "explanation": "Câu đầy đủ: I am ten years old."
    },
    {
      "type": "choice",
      "prompt": "\"twelve\" có nghĩa là gì?",
      "options": [
        "số 2",
        "số 12",
        "số 20",
        "số 5"
      ],
      "answer": "số 12",
      "explanation": "twelve = số 12."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"số 12\"?",
      "options": [
        "one",
        "twelve",
        "two",
        "five"
      ],
      "answer": "twelve",
      "explanation": "twelve = số 12."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"số 12\"",
      "answers": [
        "twelve"
      ],
      "explanation": "twelve = số 12."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ students.",
      "answers": [
        "twelve"
      ],
      "explanation": "Câu đầy đủ: Twelve students."
    },
    {
      "type": "choice",
      "prompt": "\"twenty\" có nghĩa là gì?",
      "options": [
        "số 3",
        "số 20",
        "số 12",
        "số 1"
      ],
      "answer": "số 20",
      "explanation": "twenty = số 20."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"số 20\"?",
      "options": [
        "years old",
        "twenty",
        "five",
        "one"
      ],
      "answer": "twenty",
      "explanation": "twenty = số 20."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"số 20\"",
      "answers": [
        "twenty"
      ],
      "explanation": "twenty = số 20."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ chairs.",
      "answers": [
        "twenty"
      ],
      "explanation": "Câu đầy đủ: Twenty chairs."
    },
    {
      "type": "choice",
      "prompt": "\"years old\" có nghĩa là gì?",
      "options": [
        "số 3",
        "tuổi",
        "số 2",
        "số 10"
      ],
      "answer": "tuổi",
      "explanation": "years old = tuổi."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"tuổi\"?",
      "options": [
        "two",
        "three",
        "ten",
        "years old"
      ],
      "answer": "years old",
      "explanation": "years old = tuổi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"tuổi\"",
      "answers": [
        "years old"
      ],
      "explanation": "years old = tuổi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I am nine ______.",
      "answers": [
        "years old"
      ],
      "explanation": "Câu đầy đủ: I am nine years old."
    },
    {
      "type": "choice",
      "prompt": "\"Seven\" là số mấy?",
      "options": [
        "6",
        "7",
        "8",
        "9"
      ],
      "answer": "7",
      "explanation": "Seven = 7."
    },
    {
      "type": "choice",
      "prompt": "Câu hỏi tuổi đúng là câu nào?",
      "options": [
        "How old are you?",
        "How are you old?",
        "What old are you?",
        "How many old are you?"
      ],
      "answer": "How old are you?",
      "explanation": "Hỏi tuổi luôn dùng \"How old are you?\""
    },
    {
      "type": "choice",
      "prompt": "\"I am twelve years old.\" nghĩa là gì?",
      "options": [
        "Tôi có 12 quyển sách.",
        "Tôi 12 tuổi.",
        "Tôi học lớp 12.",
        "Tôi có 12 người bạn."
      ],
      "answer": "Tôi 12 tuổi.",
      "explanation": "Twelve years old = 12 tuổi."
    },
    {
      "type": "choice",
      "prompt": "Số 20 trong tiếng Anh là gì?",
      "options": [
        "Twelve",
        "Twenty",
        "Ten",
        "Two"
      ],
      "answer": "Twenty",
      "explanation": "Twenty = 20, twelve = 12."
    },
    {
      "type": "fill",
      "prompt": "Điền số còn thiếu: one, two, ______, four.",
      "answers": [
        "three"
      ],
      "explanation": "Thứ tự: one (1), two (2), three (3), four (4)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: How ______ are you?",
      "answers": [
        "old"
      ],
      "explanation": "How old are you? = Bạn bao nhiêu tuổi?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I am nine ______ old.",
      "answers": [
        "years"
      ],
      "explanation": "Nine years old = 9 tuổi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi 8 tuổi.\"",
      "answers": [
        "i am eight years old"
      ],
      "explanation": "Eight = 8. Nói tuổi: I am + số + years old."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Bạn bao nhiêu tuổi?\"",
      "answers": [
        "how old are you"
      ],
      "explanation": "How old are you? = Bạn bao nhiêu tuổi?"
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi có 3 quyển sách.\"",
      "answers": [
        "i have three books"
      ],
      "explanation": "I have three books. = Tôi có 3 quyển sách."
    },
    {
      "type": "choice",
      "prompt": "Số 1 trong tiếng Anh là gì?",
      "options": [
        "three",
        "five",
        "fifteen",
        "one"
      ],
      "answer": "one",
      "explanation": "one = số 1."
    },
    {
      "type": "choice",
      "prompt": "\"one\" là số mấy?",
      "options": [
        "16",
        "7",
        "1",
        "17"
      ],
      "answer": "1",
      "explanation": "one = số 1."
    },
    {
      "type": "choice",
      "prompt": "I have one pens. Tôi có mấy cây bút?",
      "options": [
        "15",
        "12",
        "18",
        "1"
      ],
      "answer": "1",
      "explanation": "I have one pens. = Tôi có 1 cây bút."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ pens. (1)",
      "answers": [
        "one"
      ],
      "explanation": "I have one pens. = Tôi có 1 cây bút."
    },
    {
      "type": "choice",
      "prompt": "Số 2 trong tiếng Anh là gì?",
      "options": [
        "thirteen",
        "two",
        "nineteen",
        "ten"
      ],
      "answer": "two",
      "explanation": "two = số 2."
    },
    {
      "type": "choice",
      "prompt": "\"two\" là số mấy?",
      "options": [
        "2",
        "16",
        "15",
        "4"
      ],
      "answer": "2",
      "explanation": "two = số 2."
    },
    {
      "type": "choice",
      "prompt": "I have two books. Tôi có mấy quyển sách?",
      "options": [
        "5",
        "2",
        "1",
        "8"
      ],
      "answer": "2",
      "explanation": "I have two books. = Tôi có 2 quyển sách."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ books. (2)",
      "answers": [
        "two"
      ],
      "explanation": "I have two books. = Tôi có 2 quyển sách."
    },
    {
      "type": "choice",
      "prompt": "Số 3 trong tiếng Anh là gì?",
      "options": [
        "one",
        "eight",
        "three",
        "eighteen"
      ],
      "answer": "three",
      "explanation": "three = số 3."
    },
    {
      "type": "choice",
      "prompt": "\"three\" là số mấy?",
      "options": [
        "18",
        "3",
        "7",
        "2"
      ],
      "answer": "3",
      "explanation": "three = số 3."
    },
    {
      "type": "choice",
      "prompt": "I have three cats. Tôi có mấy con mèo?",
      "options": [
        "7",
        "3",
        "17",
        "18"
      ],
      "answer": "3",
      "explanation": "I have three cats. = Tôi có 3 con mèo."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ cats. (3)",
      "answers": [
        "three"
      ],
      "explanation": "I have three cats. = Tôi có 3 con mèo."
    },
    {
      "type": "choice",
      "prompt": "Số 4 trong tiếng Anh là gì?",
      "options": [
        "four",
        "twenty",
        "sixteen",
        "nineteen"
      ],
      "answer": "four",
      "explanation": "four = số 4."
    },
    {
      "type": "choice",
      "prompt": "\"four\" là số mấy?",
      "options": [
        "8",
        "13",
        "4",
        "5"
      ],
      "answer": "4",
      "explanation": "four = số 4."
    },
    {
      "type": "choice",
      "prompt": "I have four dogs. Tôi có mấy con chó?",
      "options": [
        "12",
        "4",
        "2",
        "15"
      ],
      "answer": "4",
      "explanation": "I have four dogs. = Tôi có 4 con chó."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ dogs. (4)",
      "answers": [
        "four"
      ],
      "explanation": "I have four dogs. = Tôi có 4 con chó."
    },
    {
      "type": "choice",
      "prompt": "Số 5 trong tiếng Anh là gì?",
      "options": [
        "sixteen",
        "five",
        "seventeen",
        "ten"
      ],
      "answer": "five",
      "explanation": "five = số 5."
    },
    {
      "type": "choice",
      "prompt": "\"five\" là số mấy?",
      "options": [
        "2",
        "8",
        "5",
        "13"
      ],
      "answer": "5",
      "explanation": "five = số 5."
    },
    {
      "type": "choice",
      "prompt": "I have five apples. Tôi có mấy quả táo?",
      "options": [
        "5",
        "16",
        "12",
        "19"
      ],
      "answer": "5",
      "explanation": "I have five apples. = Tôi có 5 quả táo."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ apples. (5)",
      "answers": [
        "five"
      ],
      "explanation": "I have five apples. = Tôi có 5 quả táo."
    },
    {
      "type": "choice",
      "prompt": "Số 6 trong tiếng Anh là gì?",
      "options": [
        "eighteen",
        "one",
        "seventeen",
        "six"
      ],
      "answer": "six",
      "explanation": "six = số 6."
    },
    {
      "type": "choice",
      "prompt": "\"six\" là số mấy?",
      "options": [
        "6",
        "13",
        "12",
        "20"
      ],
      "answer": "6",
      "explanation": "six = số 6."
    },
    {
      "type": "choice",
      "prompt": "I have six balls. Tôi có mấy quả bóng?",
      "options": [
        "20",
        "7",
        "11",
        "6"
      ],
      "answer": "6",
      "explanation": "I have six balls. = Tôi có 6 quả bóng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ balls. (6)",
      "answers": [
        "six"
      ],
      "explanation": "I have six balls. = Tôi có 6 quả bóng."
    },
    {
      "type": "choice",
      "prompt": "Số 7 trong tiếng Anh là gì?",
      "options": [
        "eleven",
        "five",
        "ten",
        "seven"
      ],
      "answer": "seven",
      "explanation": "seven = số 7."
    },
    {
      "type": "choice",
      "prompt": "I have seven chairs. Tôi có mấy cái ghế?",
      "options": [
        "20",
        "7",
        "8",
        "10"
      ],
      "answer": "7",
      "explanation": "I have seven chairs. = Tôi có 7 cái ghế."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ chairs. (7)",
      "answers": [
        "seven"
      ],
      "explanation": "I have seven chairs. = Tôi có 7 cái ghế."
    },
    {
      "type": "choice",
      "prompt": "Số 8 trong tiếng Anh là gì?",
      "options": [
        "eight",
        "fourteen",
        "nineteen",
        "sixteen"
      ],
      "answer": "eight",
      "explanation": "eight = số 8."
    },
    {
      "type": "choice",
      "prompt": "\"eight\" là số mấy?",
      "options": [
        "8",
        "15",
        "4",
        "7"
      ],
      "answer": "8",
      "explanation": "eight = số 8."
    },
    {
      "type": "choice",
      "prompt": "I have eight birds. Tôi có mấy con chim?",
      "options": [
        "8",
        "10",
        "14",
        "15"
      ],
      "answer": "8",
      "explanation": "I have eight birds. = Tôi có 8 con chim."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ birds. (8)",
      "answers": [
        "eight"
      ],
      "explanation": "I have eight birds. = Tôi có 8 con chim."
    },
    {
      "type": "choice",
      "prompt": "Số 9 trong tiếng Anh là gì?",
      "options": [
        "nine",
        "twelve",
        "two",
        "eleven"
      ],
      "answer": "nine",
      "explanation": "nine = số 9."
    },
    {
      "type": "choice",
      "prompt": "\"nine\" là số mấy?",
      "options": [
        "9",
        "4",
        "3",
        "15"
      ],
      "answer": "9",
      "explanation": "nine = số 9."
    },
    {
      "type": "choice",
      "prompt": "I have nine pens. Tôi có mấy cây bút?",
      "options": [
        "7",
        "11",
        "18",
        "9"
      ],
      "answer": "9",
      "explanation": "I have nine pens. = Tôi có 9 cây bút."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ pens. (9)",
      "answers": [
        "nine"
      ],
      "explanation": "I have nine pens. = Tôi có 9 cây bút."
    },
    {
      "type": "choice",
      "prompt": "Số 10 trong tiếng Anh là gì?",
      "options": [
        "nineteen",
        "fourteen",
        "eighteen",
        "ten"
      ],
      "answer": "ten",
      "explanation": "ten = số 10."
    },
    {
      "type": "choice",
      "prompt": "\"ten\" là số mấy?",
      "options": [
        "9",
        "19",
        "8",
        "10"
      ],
      "answer": "10",
      "explanation": "ten = số 10."
    },
    {
      "type": "choice",
      "prompt": "I have ten books. Tôi có mấy quyển sách?",
      "options": [
        "4",
        "17",
        "10",
        "7"
      ],
      "answer": "10",
      "explanation": "I have ten books. = Tôi có 10 quyển sách."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ books. (10)",
      "answers": [
        "ten"
      ],
      "explanation": "I have ten books. = Tôi có 10 quyển sách."
    },
    {
      "type": "choice",
      "prompt": "Số 11 trong tiếng Anh là gì?",
      "options": [
        "six",
        "one",
        "nineteen",
        "eleven"
      ],
      "answer": "eleven",
      "explanation": "eleven = số 11."
    },
    {
      "type": "choice",
      "prompt": "\"eleven\" là số mấy?",
      "options": [
        "5",
        "14",
        "13",
        "11"
      ],
      "answer": "11",
      "explanation": "eleven = số 11."
    },
    {
      "type": "choice",
      "prompt": "I have eleven cats. Tôi có mấy con mèo?",
      "options": [
        "11",
        "1",
        "3",
        "19"
      ],
      "answer": "11",
      "explanation": "I have eleven cats. = Tôi có 11 con mèo."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ cats. (11)",
      "answers": [
        "eleven"
      ],
      "explanation": "I have eleven cats. = Tôi có 11 con mèo."
    },
    {
      "type": "choice",
      "prompt": "Số 12 trong tiếng Anh là gì?",
      "options": [
        "twelve",
        "three",
        "seven",
        "fourteen"
      ],
      "answer": "twelve",
      "explanation": "twelve = số 12."
    },
    {
      "type": "choice",
      "prompt": "\"twelve\" là số mấy?",
      "options": [
        "12",
        "8",
        "14",
        "4"
      ],
      "answer": "12",
      "explanation": "twelve = số 12."
    },
    {
      "type": "choice",
      "prompt": "I have twelve dogs. Tôi có mấy con chó?",
      "options": [
        "12",
        "16",
        "10",
        "11"
      ],
      "answer": "12",
      "explanation": "I have twelve dogs. = Tôi có 12 con chó."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ dogs. (12)",
      "answers": [
        "twelve"
      ],
      "explanation": "I have twelve dogs. = Tôi có 12 con chó."
    },
    {
      "type": "choice",
      "prompt": "Số 13 trong tiếng Anh là gì?",
      "options": [
        "six",
        "one",
        "thirteen",
        "ten"
      ],
      "answer": "thirteen",
      "explanation": "thirteen = số 13."
    },
    {
      "type": "choice",
      "prompt": "\"thirteen\" là số mấy?",
      "options": [
        "5",
        "13",
        "15",
        "14"
      ],
      "answer": "13",
      "explanation": "thirteen = số 13."
    },
    {
      "type": "choice",
      "prompt": "I have thirteen apples. Tôi có mấy quả táo?",
      "options": [
        "13",
        "17",
        "11",
        "12"
      ],
      "answer": "13",
      "explanation": "I have thirteen apples. = Tôi có 13 quả táo."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ apples. (13)",
      "answers": [
        "thirteen"
      ],
      "explanation": "I have thirteen apples. = Tôi có 13 quả táo."
    },
    {
      "type": "choice",
      "prompt": "Số 14 trong tiếng Anh là gì?",
      "options": [
        "two",
        "twelve",
        "fourteen",
        "eight"
      ],
      "answer": "fourteen",
      "explanation": "fourteen = số 14."
    },
    {
      "type": "choice",
      "prompt": "\"fourteen\" là số mấy?",
      "options": [
        "14",
        "2",
        "18",
        "1"
      ],
      "answer": "14",
      "explanation": "fourteen = số 14."
    },
    {
      "type": "choice",
      "prompt": "I have fourteen balls. Tôi có mấy quả bóng?",
      "options": [
        "15",
        "14",
        "2",
        "20"
      ],
      "answer": "14",
      "explanation": "I have fourteen balls. = Tôi có 14 quả bóng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ balls. (14)",
      "answers": [
        "fourteen"
      ],
      "explanation": "I have fourteen balls. = Tôi có 14 quả bóng."
    },
    {
      "type": "choice",
      "prompt": "Số 15 trong tiếng Anh là gì?",
      "options": [
        "eight",
        "eighteen",
        "fifteen",
        "five"
      ],
      "answer": "fifteen",
      "explanation": "fifteen = số 15."
    },
    {
      "type": "choice",
      "prompt": "\"fifteen\" là số mấy?",
      "options": [
        "9",
        "4",
        "16",
        "15"
      ],
      "answer": "15",
      "explanation": "fifteen = số 15."
    },
    {
      "type": "choice",
      "prompt": "I have fifteen chairs. Tôi có mấy cái ghế?",
      "options": [
        "14",
        "15",
        "1",
        "9"
      ],
      "answer": "15",
      "explanation": "I have fifteen chairs. = Tôi có 15 cái ghế."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ chairs. (15)",
      "answers": [
        "fifteen"
      ],
      "explanation": "I have fifteen chairs. = Tôi có 15 cái ghế."
    },
    {
      "type": "choice",
      "prompt": "Số 16 trong tiếng Anh là gì?",
      "options": [
        "eight",
        "sixteen",
        "twenty",
        "two"
      ],
      "answer": "sixteen",
      "explanation": "sixteen = số 16."
    },
    {
      "type": "choice",
      "prompt": "\"sixteen\" là số mấy?",
      "options": [
        "16",
        "11",
        "15",
        "9"
      ],
      "answer": "16",
      "explanation": "sixteen = số 16."
    },
    {
      "type": "choice",
      "prompt": "I have sixteen birds. Tôi có mấy con chim?",
      "options": [
        "12",
        "17",
        "15",
        "16"
      ],
      "answer": "16",
      "explanation": "I have sixteen birds. = Tôi có 16 con chim."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ birds. (16)",
      "answers": [
        "sixteen"
      ],
      "explanation": "I have sixteen birds. = Tôi có 16 con chim."
    },
    {
      "type": "choice",
      "prompt": "Số 17 trong tiếng Anh là gì?",
      "options": [
        "two",
        "seven",
        "one",
        "seventeen"
      ],
      "answer": "seventeen",
      "explanation": "seventeen = số 17."
    },
    {
      "type": "choice",
      "prompt": "\"seventeen\" là số mấy?",
      "options": [
        "1",
        "17",
        "14",
        "19"
      ],
      "answer": "17",
      "explanation": "seventeen = số 17."
    },
    {
      "type": "choice",
      "prompt": "I have seventeen pens. Tôi có mấy cây bút?",
      "options": [
        "6",
        "12",
        "17",
        "14"
      ],
      "answer": "17",
      "explanation": "I have seventeen pens. = Tôi có 17 cây bút."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ pens. (17)",
      "answers": [
        "seventeen"
      ],
      "explanation": "I have seventeen pens. = Tôi có 17 cây bút."
    },
    {
      "type": "choice",
      "prompt": "Số 18 trong tiếng Anh là gì?",
      "options": [
        "one",
        "sixteen",
        "eighteen",
        "seventeen"
      ],
      "answer": "eighteen",
      "explanation": "eighteen = số 18."
    },
    {
      "type": "choice",
      "prompt": "\"eighteen\" là số mấy?",
      "options": [
        "18",
        "19",
        "2",
        "4"
      ],
      "answer": "18",
      "explanation": "eighteen = số 18."
    },
    {
      "type": "choice",
      "prompt": "I have eighteen books. Tôi có mấy quyển sách?",
      "options": [
        "15",
        "8",
        "17",
        "18"
      ],
      "answer": "18",
      "explanation": "I have eighteen books. = Tôi có 18 quyển sách."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ books. (18)",
      "answers": [
        "eighteen"
      ],
      "explanation": "I have eighteen books. = Tôi có 18 quyển sách."
    },
    {
      "type": "choice",
      "prompt": "Số 19 trong tiếng Anh là gì?",
      "options": [
        "eighteen",
        "five",
        "fifteen",
        "nineteen"
      ],
      "answer": "nineteen",
      "explanation": "nineteen = số 19."
    },
    {
      "type": "choice",
      "prompt": "\"nineteen\" là số mấy?",
      "options": [
        "19",
        "4",
        "8",
        "11"
      ],
      "answer": "19",
      "explanation": "nineteen = số 19."
    },
    {
      "type": "choice",
      "prompt": "I have nineteen cats. Tôi có mấy con mèo?",
      "options": [
        "11",
        "16",
        "12",
        "19"
      ],
      "answer": "19",
      "explanation": "I have nineteen cats. = Tôi có 19 con mèo."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ cats. (19)",
      "answers": [
        "nineteen"
      ],
      "explanation": "I have nineteen cats. = Tôi có 19 con mèo."
    },
    {
      "type": "choice",
      "prompt": "\"twenty\" là số mấy?",
      "options": [
        "7",
        "18",
        "20",
        "4"
      ],
      "answer": "20",
      "explanation": "twenty = số 20."
    },
    {
      "type": "choice",
      "prompt": "I have twenty dogs. Tôi có mấy con chó?",
      "options": [
        "15",
        "4",
        "8",
        "20"
      ],
      "answer": "20",
      "explanation": "I have twenty dogs. = Tôi có 20 con chó."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ dogs. (20)",
      "answers": [
        "twenty"
      ],
      "explanation": "I have twenty dogs. = Tôi có 20 con chó."
    }
  ],
  "family": [
    {
      "type": "choice",
      "prompt": "\"mother\" có nghĩa là gì?",
      "options": [
        "gia đình",
        "mẹ",
        "anh/em trai",
        "chị/em gái"
      ],
      "answer": "mẹ",
      "explanation": "mother = mẹ."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"mẹ\"?",
      "options": [
        "baby",
        "mother",
        "grandmother",
        "father"
      ],
      "answer": "mother",
      "explanation": "mother = mẹ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"mẹ\"",
      "answers": [
        "mother"
      ],
      "explanation": "mother = mẹ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is my ______.",
      "answers": [
        "mother"
      ],
      "explanation": "Câu đầy đủ: This is my mother."
    },
    {
      "type": "choice",
      "prompt": "\"father\" có nghĩa là gì?",
      "options": [
        "chị/em gái",
        "gia đình",
        "bố",
        "mẹ"
      ],
      "answer": "bố",
      "explanation": "father = bố."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"bố\"?",
      "options": [
        "brother",
        "baby",
        "father",
        "sister"
      ],
      "answer": "father",
      "explanation": "father = bố."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"bố\"",
      "answers": [
        "father"
      ],
      "explanation": "father = bố."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is my ______.",
      "answers": [
        "father"
      ],
      "explanation": "Câu đầy đủ: This is my father."
    },
    {
      "type": "choice",
      "prompt": "\"sister\" có nghĩa là gì?",
      "options": [
        "bố",
        "mẹ",
        "gia đình",
        "chị/em gái"
      ],
      "answer": "chị/em gái",
      "explanation": "sister = chị/em gái."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"chị/em gái\"?",
      "options": [
        "sister",
        "grandmother",
        "grandfather",
        "father"
      ],
      "answer": "sister",
      "explanation": "sister = chị/em gái."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"chị/em gái\"",
      "answers": [
        "sister"
      ],
      "explanation": "sister = chị/em gái."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My ______ is five.",
      "answers": [
        "sister"
      ],
      "explanation": "Câu đầy đủ: My sister is five."
    },
    {
      "type": "choice",
      "prompt": "\"brother\" có nghĩa là gì?",
      "options": [
        "anh/em trai",
        "bà",
        "mẹ",
        "bố"
      ],
      "answer": "anh/em trai",
      "explanation": "brother = anh/em trai."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"anh/em trai\"?",
      "options": [
        "grandmother",
        "family",
        "brother",
        "mother"
      ],
      "answer": "brother",
      "explanation": "brother = anh/em trai."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"anh/em trai\"",
      "answers": [
        "brother"
      ],
      "explanation": "brother = anh/em trai."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My ______ is ten.",
      "answers": [
        "brother"
      ],
      "explanation": "Câu đầy đủ: My brother is ten."
    },
    {
      "type": "choice",
      "prompt": "\"grandmother\" có nghĩa là gì?",
      "options": [
        "em bé",
        "anh/em trai",
        "bà",
        "ông"
      ],
      "answer": "bà",
      "explanation": "grandmother = bà."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"bà\"?",
      "options": [
        "mother",
        "family",
        "grandmother",
        "sister"
      ],
      "answer": "grandmother",
      "explanation": "grandmother = bà."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"bà\"",
      "answers": [
        "grandmother"
      ],
      "explanation": "grandmother = bà."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My ______ is kind.",
      "answers": [
        "grandmother"
      ],
      "explanation": "Câu đầy đủ: My grandmother is kind."
    },
    {
      "type": "choice",
      "prompt": "\"grandfather\" có nghĩa là gì?",
      "options": [
        "bà",
        "gia đình",
        "bố",
        "ông"
      ],
      "answer": "ông",
      "explanation": "grandfather = ông."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"ông\"?",
      "options": [
        "mother",
        "brother",
        "grandfather",
        "baby"
      ],
      "answer": "grandfather",
      "explanation": "grandfather = ông."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"ông\"",
      "answers": [
        "grandfather"
      ],
      "explanation": "grandfather = ông."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My ______ is old.",
      "answers": [
        "grandfather"
      ],
      "explanation": "Câu đầy đủ: My grandfather is old."
    },
    {
      "type": "choice",
      "prompt": "\"family\" có nghĩa là gì?",
      "options": [
        "gia đình",
        "em bé",
        "anh/em trai",
        "bố"
      ],
      "answer": "gia đình",
      "explanation": "family = gia đình."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"gia đình\"?",
      "options": [
        "baby",
        "sister",
        "father",
        "family"
      ],
      "answer": "family",
      "explanation": "family = gia đình."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"gia đình\"",
      "answers": [
        "family"
      ],
      "explanation": "family = gia đình."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I love my ______.",
      "answers": [
        "family"
      ],
      "explanation": "Câu đầy đủ: I love my family."
    },
    {
      "type": "choice",
      "prompt": "\"baby\" có nghĩa là gì?",
      "options": [
        "bố",
        "ông",
        "gia đình",
        "em bé"
      ],
      "answer": "em bé",
      "explanation": "baby = em bé."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"em bé\"?",
      "options": [
        "mother",
        "baby",
        "sister",
        "family"
      ],
      "answer": "baby",
      "explanation": "baby = em bé."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"em bé\"",
      "answers": [
        "baby"
      ],
      "explanation": "baby = em bé."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The ______ is sleeping.",
      "answers": [
        "baby"
      ],
      "explanation": "Câu đầy đủ: The baby is sleeping."
    },
    {
      "type": "choice",
      "prompt": "\"Her brother\" có nghĩa là gì?",
      "options": [
        "Anh trai của anh ấy",
        "Em gái của cô ấy",
        "Anh/em trai của cô ấy",
        "Bố của cô ấy"
      ],
      "answer": "Anh/em trai của cô ấy",
      "explanation": "Her = của cô ấy, brother = anh/em trai."
    },
    {
      "type": "choice",
      "prompt": "Câu nào đúng để giới thiệu mẹ?",
      "options": [
        "This is my mother.",
        "This is my father.",
        "This am my mother.",
        "This is me mother."
      ],
      "answer": "This is my mother.",
      "explanation": "This is my + người thân = Đây là… của tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is my ______ (chị gái).",
      "answers": [
        "sister"
      ],
      "explanation": "Sister = chị/em gái."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I love my ______ (gia đình).",
      "answers": [
        "family"
      ],
      "explanation": "Family = gia đình."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ is my father. (Đây là bố tôi.)",
      "answers": [
        "this"
      ],
      "explanation": "This is my father. = Đây là bố tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là em trai tôi.\"",
      "answers": [
        "this is my brother"
      ],
      "explanation": "This is my brother. = Đây là em trai tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi yêu gia đình tôi.\"",
      "answers": [
        "i love my family"
      ],
      "explanation": "I love my family. = Tôi yêu gia đình tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Mẹ tôi rất tốt bụng.\"",
      "answers": [
        "my mother is very kind",
        "my mother is kind"
      ],
      "explanation": "Kind = tốt bụng. Có thể nói \"My mother is kind.\" hoặc thêm very (rất)."
    },
    {
      "type": "choice",
      "prompt": "\"my mother\" có nghĩa là gì?",
      "options": [
        "bố của cô ấy",
        "mẹ tôi",
        "mẹ của cô ấy",
        "ông của anh ấy"
      ],
      "answer": "mẹ tôi",
      "explanation": "my mother = mẹ tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ mother. (Đây là mẹ tôi.)",
      "answers": [
        "my"
      ],
      "explanation": "This is my mother. = Đây là mẹ tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là mẹ tôi.\"",
      "answers": [
        "this is my mother"
      ],
      "explanation": "This is my mother. = Đây là mẹ tôi."
    },
    {
      "type": "choice",
      "prompt": "\"my father\" có nghĩa là gì?",
      "options": [
        "bố tôi",
        "bố của anh ấy",
        "mẹ của cô ấy",
        "ông tôi"
      ],
      "answer": "bố tôi",
      "explanation": "my father = bố tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ father. (Đây là bố tôi.)",
      "answers": [
        "my"
      ],
      "explanation": "This is my father. = Đây là bố tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là bố tôi.\"",
      "answers": [
        "this is my father"
      ],
      "explanation": "This is my father. = Đây là bố tôi."
    },
    {
      "type": "choice",
      "prompt": "\"my sister\" có nghĩa là gì?",
      "options": [
        "bố của anh ấy",
        "chị/em gái tôi",
        "bà của anh ấy",
        "mẹ tôi"
      ],
      "answer": "chị/em gái tôi",
      "explanation": "my sister = chị/em gái tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ sister. (Đây là chị/em gái tôi.)",
      "answers": [
        "my"
      ],
      "explanation": "This is my sister. = Đây là chị/em gái tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là chị/em gái tôi.\"",
      "answers": [
        "this is my sister"
      ],
      "explanation": "This is my sister. = Đây là chị/em gái tôi."
    },
    {
      "type": "choice",
      "prompt": "\"my brother\" có nghĩa là gì?",
      "options": [
        "ông tôi",
        "chị/em gái của cô ấy",
        "bà của cô ấy",
        "anh/em trai tôi"
      ],
      "answer": "anh/em trai tôi",
      "explanation": "my brother = anh/em trai tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ brother. (Đây là anh/em trai tôi.)",
      "answers": [
        "my"
      ],
      "explanation": "This is my brother. = Đây là anh/em trai tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là anh/em trai tôi.\"",
      "answers": [
        "this is my brother"
      ],
      "explanation": "This is my brother. = Đây là anh/em trai tôi."
    },
    {
      "type": "choice",
      "prompt": "\"my grandmother\" có nghĩa là gì?",
      "options": [
        "chị/em gái tôi",
        "anh/em trai tôi",
        "bố của anh ấy",
        "bà tôi"
      ],
      "answer": "bà tôi",
      "explanation": "my grandmother = bà tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ grandmother. (Đây là bà tôi.)",
      "answers": [
        "my"
      ],
      "explanation": "This is my grandmother. = Đây là bà tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là bà tôi.\"",
      "answers": [
        "this is my grandmother"
      ],
      "explanation": "This is my grandmother. = Đây là bà tôi."
    },
    {
      "type": "choice",
      "prompt": "\"my grandfather\" có nghĩa là gì?",
      "options": [
        "ông tôi",
        "bà của anh ấy",
        "anh/em trai của anh ấy",
        "mẹ của cô ấy"
      ],
      "answer": "ông tôi",
      "explanation": "my grandfather = ông tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ grandfather. (Đây là ông tôi.)",
      "answers": [
        "my"
      ],
      "explanation": "This is my grandfather. = Đây là ông tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là ông tôi.\"",
      "answers": [
        "this is my grandfather"
      ],
      "explanation": "This is my grandfather. = Đây là ông tôi."
    },
    {
      "type": "choice",
      "prompt": "\"his mother\" có nghĩa là gì?",
      "options": [
        "chị/em gái tôi",
        "anh/em trai của cô ấy",
        "bố tôi",
        "mẹ của anh ấy"
      ],
      "answer": "mẹ của anh ấy",
      "explanation": "his mother = mẹ của anh ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ mother. (Đây là mẹ của anh ấy.)",
      "answers": [
        "his"
      ],
      "explanation": "This is his mother. = Đây là mẹ của anh ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là mẹ của anh ấy.\"",
      "answers": [
        "this is his mother"
      ],
      "explanation": "This is his mother. = Đây là mẹ của anh ấy."
    },
    {
      "type": "choice",
      "prompt": "\"his father\" có nghĩa là gì?",
      "options": [
        "mẹ của cô ấy",
        "ông của cô ấy",
        "bố của anh ấy",
        "mẹ tôi"
      ],
      "answer": "bố của anh ấy",
      "explanation": "his father = bố của anh ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ father. (Đây là bố của anh ấy.)",
      "answers": [
        "his"
      ],
      "explanation": "This is his father. = Đây là bố của anh ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là bố của anh ấy.\"",
      "answers": [
        "this is his father"
      ],
      "explanation": "This is his father. = Đây là bố của anh ấy."
    },
    {
      "type": "choice",
      "prompt": "\"his sister\" có nghĩa là gì?",
      "options": [
        "ông của cô ấy",
        "chị/em gái của anh ấy",
        "bà tôi",
        "bà của anh ấy"
      ],
      "answer": "chị/em gái của anh ấy",
      "explanation": "his sister = chị/em gái của anh ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ sister. (Đây là chị/em gái của anh ấy.)",
      "answers": [
        "his"
      ],
      "explanation": "This is his sister. = Đây là chị/em gái của anh ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là chị/em gái của anh ấy.\"",
      "answers": [
        "this is his sister"
      ],
      "explanation": "This is his sister. = Đây là chị/em gái của anh ấy."
    },
    {
      "type": "choice",
      "prompt": "\"his brother\" có nghĩa là gì?",
      "options": [
        "anh/em trai của anh ấy",
        "chị/em gái của anh ấy",
        "mẹ tôi",
        "anh/em trai của cô ấy"
      ],
      "answer": "anh/em trai của anh ấy",
      "explanation": "his brother = anh/em trai của anh ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ brother. (Đây là anh/em trai của anh ấy.)",
      "answers": [
        "his"
      ],
      "explanation": "This is his brother. = Đây là anh/em trai của anh ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là anh/em trai của anh ấy.\"",
      "answers": [
        "this is his brother"
      ],
      "explanation": "This is his brother. = Đây là anh/em trai của anh ấy."
    },
    {
      "type": "choice",
      "prompt": "\"his grandmother\" có nghĩa là gì?",
      "options": [
        "bà của cô ấy",
        "anh/em trai của anh ấy",
        "chị/em gái tôi",
        "bà của anh ấy"
      ],
      "answer": "bà của anh ấy",
      "explanation": "his grandmother = bà của anh ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ grandmother. (Đây là bà của anh ấy.)",
      "answers": [
        "his"
      ],
      "explanation": "This is his grandmother. = Đây là bà của anh ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là bà của anh ấy.\"",
      "answers": [
        "this is his grandmother"
      ],
      "explanation": "This is his grandmother. = Đây là bà của anh ấy."
    },
    {
      "type": "choice",
      "prompt": "\"his grandfather\" có nghĩa là gì?",
      "options": [
        "ông tôi",
        "chị/em gái của anh ấy",
        "ông của anh ấy",
        "ông của cô ấy"
      ],
      "answer": "ông của anh ấy",
      "explanation": "his grandfather = ông của anh ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ grandfather. (Đây là ông của anh ấy.)",
      "answers": [
        "his"
      ],
      "explanation": "This is his grandfather. = Đây là ông của anh ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là ông của anh ấy.\"",
      "answers": [
        "this is his grandfather"
      ],
      "explanation": "This is his grandfather. = Đây là ông của anh ấy."
    },
    {
      "type": "choice",
      "prompt": "\"her mother\" có nghĩa là gì?",
      "options": [
        "bà của anh ấy",
        "mẹ của cô ấy",
        "bố tôi",
        "mẹ của anh ấy"
      ],
      "answer": "mẹ của cô ấy",
      "explanation": "her mother = mẹ của cô ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ mother. (Đây là mẹ của cô ấy.)",
      "answers": [
        "her"
      ],
      "explanation": "This is her mother. = Đây là mẹ của cô ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là mẹ của cô ấy.\"",
      "answers": [
        "this is her mother"
      ],
      "explanation": "This is her mother. = Đây là mẹ của cô ấy."
    },
    {
      "type": "choice",
      "prompt": "\"her father\" có nghĩa là gì?",
      "options": [
        "ông tôi",
        "bố của cô ấy",
        "anh/em trai của anh ấy",
        "bà của anh ấy"
      ],
      "answer": "bố của cô ấy",
      "explanation": "her father = bố của cô ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ father. (Đây là bố của cô ấy.)",
      "answers": [
        "her"
      ],
      "explanation": "This is her father. = Đây là bố của cô ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là bố của cô ấy.\"",
      "answers": [
        "this is her father"
      ],
      "explanation": "This is her father. = Đây là bố của cô ấy."
    },
    {
      "type": "choice",
      "prompt": "\"her sister\" có nghĩa là gì?",
      "options": [
        "bà của cô ấy",
        "bà của anh ấy",
        "chị/em gái của anh ấy",
        "chị/em gái của cô ấy"
      ],
      "answer": "chị/em gái của cô ấy",
      "explanation": "her sister = chị/em gái của cô ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ sister. (Đây là chị/em gái của cô ấy.)",
      "answers": [
        "her"
      ],
      "explanation": "This is her sister. = Đây là chị/em gái của cô ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là chị/em gái của cô ấy.\"",
      "answers": [
        "this is her sister"
      ],
      "explanation": "This is her sister. = Đây là chị/em gái của cô ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ brother. (Đây là anh/em trai của cô ấy.)",
      "answers": [
        "her"
      ],
      "explanation": "This is her brother. = Đây là anh/em trai của cô ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là anh/em trai của cô ấy.\"",
      "answers": [
        "this is her brother"
      ],
      "explanation": "This is her brother. = Đây là anh/em trai của cô ấy."
    },
    {
      "type": "choice",
      "prompt": "\"her grandmother\" có nghĩa là gì?",
      "options": [
        "ông của cô ấy",
        "anh/em trai tôi",
        "bà của cô ấy",
        "mẹ của cô ấy"
      ],
      "answer": "bà của cô ấy",
      "explanation": "her grandmother = bà của cô ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ grandmother. (Đây là bà của cô ấy.)",
      "answers": [
        "her"
      ],
      "explanation": "This is her grandmother. = Đây là bà của cô ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là bà của cô ấy.\"",
      "answers": [
        "this is her grandmother"
      ],
      "explanation": "This is her grandmother. = Đây là bà của cô ấy."
    },
    {
      "type": "choice",
      "prompt": "\"her grandfather\" có nghĩa là gì?",
      "options": [
        "chị/em gái của anh ấy",
        "chị/em gái tôi",
        "ông của cô ấy",
        "bà của anh ấy"
      ],
      "answer": "ông của cô ấy",
      "explanation": "her grandfather = ông của cô ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ grandfather. (Đây là ông của cô ấy.)",
      "answers": [
        "her"
      ],
      "explanation": "This is her grandfather. = Đây là ông của cô ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là ông của cô ấy.\"",
      "answers": [
        "this is her grandfather"
      ],
      "explanation": "This is her grandfather. = Đây là ông của cô ấy."
    }
  ],
  "daily-routine": [
    {
      "type": "choice",
      "prompt": "\"wake up / get up\" có nghĩa là gì?",
      "options": [
        "ăn sáng",
        "đi ngủ",
        "thức dậy",
        "làm bài tập"
      ],
      "answer": "thức dậy",
      "explanation": "wake up / get up = thức dậy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at six.",
      "answers": [
        "get up"
      ],
      "explanation": "Câu đầy đủ: I get up at six."
    },
    {
      "type": "choice",
      "prompt": "\"brush my teeth\" có nghĩa là gì?",
      "options": [
        "ăn sáng",
        "đánh răng",
        "ăn trưa",
        "đi học"
      ],
      "answer": "đánh răng",
      "explanation": "brush my teeth = đánh răng."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"đánh răng\"?",
      "options": [
        "go to school",
        "brush my teeth",
        "have breakfast",
        "go to bed"
      ],
      "answer": "brush my teeth",
      "explanation": "brush my teeth = đánh răng."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"đánh răng\"",
      "answers": [
        "brush my teeth"
      ],
      "explanation": "brush my teeth = đánh răng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ every morning.",
      "answers": [
        "brush my teeth"
      ],
      "explanation": "Câu đầy đủ: I brush my teeth every morning."
    },
    {
      "type": "choice",
      "prompt": "\"have breakfast\" có nghĩa là gì?",
      "options": [
        "đánh răng",
        "về nhà",
        "ăn sáng",
        "thức dậy"
      ],
      "answer": "ăn sáng",
      "explanation": "have breakfast = ăn sáng."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"ăn sáng\"?",
      "options": [
        "go to school",
        "have breakfast",
        "go to bed",
        "have lunch"
      ],
      "answer": "have breakfast",
      "explanation": "have breakfast = ăn sáng."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"ăn sáng\"",
      "answers": [
        "have breakfast"
      ],
      "explanation": "have breakfast = ăn sáng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at seven.",
      "answers": [
        "have breakfast"
      ],
      "explanation": "Câu đầy đủ: I have breakfast at seven."
    },
    {
      "type": "choice",
      "prompt": "\"go to school\" có nghĩa là gì?",
      "options": [
        "đi học",
        "ăn sáng",
        "thức dậy",
        "về nhà"
      ],
      "answer": "đi học",
      "explanation": "go to school = đi học."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"đi học\"?",
      "options": [
        "go to bed",
        "go to school",
        "do homework",
        "go home"
      ],
      "answer": "go to school",
      "explanation": "go to school = đi học."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"đi học\"",
      "answers": [
        "go to school"
      ],
      "explanation": "go to school = đi học."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at seven thirty.",
      "answers": [
        "go to school"
      ],
      "explanation": "Câu đầy đủ: I go to school at seven thirty."
    },
    {
      "type": "choice",
      "prompt": "\"have lunch\" có nghĩa là gì?",
      "options": [
        "ăn trưa",
        "làm bài tập",
        "thức dậy",
        "đi học"
      ],
      "answer": "ăn trưa",
      "explanation": "have lunch = ăn trưa."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"ăn trưa\"?",
      "options": [
        "have lunch",
        "brush my teeth",
        "go home",
        "do homework"
      ],
      "answer": "have lunch",
      "explanation": "have lunch = ăn trưa."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"ăn trưa\"",
      "answers": [
        "have lunch"
      ],
      "explanation": "have lunch = ăn trưa."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: We ______ at twelve.",
      "answers": [
        "have lunch"
      ],
      "explanation": "Câu đầy đủ: We have lunch at twelve."
    },
    {
      "type": "choice",
      "prompt": "\"go home\" có nghĩa là gì?",
      "options": [
        "đánh răng",
        "về nhà",
        "ăn sáng",
        "đi học"
      ],
      "answer": "về nhà",
      "explanation": "go home = về nhà."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"về nhà\"?",
      "options": [
        "brush my teeth",
        "go to bed",
        "go home",
        "have lunch"
      ],
      "answer": "go home",
      "explanation": "go home = về nhà."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"về nhà\"",
      "answers": [
        "go home"
      ],
      "explanation": "go home = về nhà."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at five.",
      "answers": [
        "go home"
      ],
      "explanation": "Câu đầy đủ: I go home at five."
    },
    {
      "type": "choice",
      "prompt": "\"do homework\" có nghĩa là gì?",
      "options": [
        "làm bài tập",
        "thức dậy",
        "ăn sáng",
        "đi ngủ"
      ],
      "answer": "làm bài tập",
      "explanation": "do homework = làm bài tập."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"làm bài tập\"?",
      "options": [
        "do homework",
        "brush my teeth",
        "have lunch",
        "go to bed"
      ],
      "answer": "do homework",
      "explanation": "do homework = làm bài tập."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"làm bài tập\"",
      "answers": [
        "do homework"
      ],
      "explanation": "do homework = làm bài tập."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ in the evening.",
      "answers": [
        "do homework"
      ],
      "explanation": "Câu đầy đủ: I do homework in the evening."
    },
    {
      "type": "choice",
      "prompt": "\"go to bed\" có nghĩa là gì?",
      "options": [
        "thức dậy",
        "đi ngủ",
        "ăn trưa",
        "về nhà"
      ],
      "answer": "đi ngủ",
      "explanation": "go to bed = đi ngủ."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"đi ngủ\"?",
      "options": [
        "do homework",
        "go to bed",
        "go to school",
        "have breakfast"
      ],
      "answer": "go to bed",
      "explanation": "go to bed = đi ngủ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"đi ngủ\"",
      "answers": [
        "go to bed"
      ],
      "explanation": "go to bed = đi ngủ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at ten.",
      "answers": [
        "go to bed"
      ],
      "explanation": "Câu đầy đủ: I go to bed at ten."
    },
    {
      "type": "choice",
      "prompt": "\"I get up at six.\" nghĩa là gì?",
      "options": [
        "Tôi đi ngủ lúc 6 giờ.",
        "Tôi dậy lúc 6 giờ.",
        "Tôi đi học lúc 6 giờ.",
        "Tôi ăn sáng lúc 6 giờ."
      ],
      "answer": "Tôi dậy lúc 6 giờ.",
      "explanation": "Get up = thức dậy, dậy khỏi giường."
    },
    {
      "type": "choice",
      "prompt": "Với \"she\", câu nào đúng?",
      "options": [
        "She get up at six.",
        "She gets up at six.",
        "She getting up at six.",
        "She got up at six."
      ],
      "answer": "She gets up at six.",
      "explanation": "He/she/it + động từ thêm -s: gets."
    },
    {
      "type": "choice",
      "prompt": "\"Have breakfast\" là hoạt động nào?",
      "options": [
        "Ăn trưa",
        "Ăn tối",
        "Ăn sáng",
        "Uống nước"
      ],
      "answer": "Ăn sáng",
      "explanation": "Breakfast = bữa sáng, lunch = bữa trưa, dinner = bữa tối."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ my teeth every morning.",
      "answers": [
        "brush"
      ],
      "explanation": "Brush my teeth = đánh răng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I go to ______ at seven thirty.",
      "answers": [
        "school"
      ],
      "explanation": "Go to school = đi học."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ up at six. (dậy lúc 6 giờ)",
      "answers": [
        "gets"
      ],
      "explanation": "He + gets (get thêm -s)."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi đi ngủ lúc 10 giờ.\"",
      "answers": [
        "i go to bed at ten"
      ],
      "explanation": "Go to bed = đi ngủ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi ăn trưa lúc 12 giờ.\"",
      "answers": [
        "i have lunch at twelve"
      ],
      "explanation": "Have lunch = ăn trưa."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Anh ấy làm bài tập vào buổi tối.\"",
      "answers": [
        "he does homework in the evening"
      ],
      "explanation": "He + does (do thêm -es), in the evening = vào buổi tối."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at eight.",
      "answers": [
        "get up"
      ],
      "explanation": "I get up at eight."
    },
    {
      "type": "choice",
      "prompt": "I get up at six. Câu này nói tôi làm gì?",
      "options": [
        "đi ngủ",
        "làm bài tập",
        "đi học",
        "thức dậy"
      ],
      "answer": "thức dậy",
      "explanation": "I get up at six. = Tôi thức dậy lúc 6 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at seven.",
      "answers": [
        "brush my teeth"
      ],
      "explanation": "I brush my teeth at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at nine.",
      "answers": [
        "brush my teeth"
      ],
      "explanation": "I brush my teeth at nine."
    },
    {
      "type": "choice",
      "prompt": "I brush my teeth at six. Câu này nói tôi làm gì?",
      "options": [
        "đi học",
        "thức dậy",
        "về nhà",
        "đánh răng"
      ],
      "answer": "đánh răng",
      "explanation": "I brush my teeth at six. = Tôi đánh răng lúc 6 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at eight.",
      "answers": [
        "have breakfast"
      ],
      "explanation": "I have breakfast at eight."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at six.",
      "answers": [
        "have breakfast"
      ],
      "explanation": "I have breakfast at six."
    },
    {
      "type": "choice",
      "prompt": "I have breakfast at six. Câu này nói tôi làm gì?",
      "options": [
        "đánh răng",
        "đi học",
        "ăn sáng",
        "ăn trưa"
      ],
      "answer": "ăn sáng",
      "explanation": "I have breakfast at six. = Tôi ăn sáng lúc 6 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at nine.",
      "answers": [
        "go to school"
      ],
      "explanation": "I go to school at nine."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at seven.",
      "answers": [
        "go to school"
      ],
      "explanation": "I go to school at seven."
    },
    {
      "type": "choice",
      "prompt": "I go to school at six. Câu này nói tôi làm gì?",
      "options": [
        "về nhà",
        "đi học",
        "đi ngủ",
        "ăn sáng"
      ],
      "answer": "đi học",
      "explanation": "I go to school at six. = Tôi đi học lúc 6 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at six.",
      "answers": [
        "have lunch"
      ],
      "explanation": "I have lunch at six."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at eight.",
      "answers": [
        "have lunch"
      ],
      "explanation": "I have lunch at eight."
    },
    {
      "type": "choice",
      "prompt": "I have lunch at six. Câu này nói tôi làm gì?",
      "options": [
        "ăn trưa",
        "đi học",
        "đi ngủ",
        "đánh răng"
      ],
      "answer": "ăn trưa",
      "explanation": "I have lunch at six. = Tôi ăn trưa lúc 6 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at seven.",
      "answers": [
        "go home"
      ],
      "explanation": "I go home at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at nine.",
      "answers": [
        "go home"
      ],
      "explanation": "I go home at nine."
    },
    {
      "type": "choice",
      "prompt": "I go home at six. Câu này nói tôi làm gì?",
      "options": [
        "làm bài tập",
        "ăn trưa",
        "đi ngủ",
        "về nhà"
      ],
      "answer": "về nhà",
      "explanation": "I go home at six. = Tôi về nhà lúc 6 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at eight.",
      "answers": [
        "do homework"
      ],
      "explanation": "I do homework at eight."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at six.",
      "answers": [
        "do homework"
      ],
      "explanation": "I do homework at six."
    },
    {
      "type": "choice",
      "prompt": "I do homework at six. Câu này nói tôi làm gì?",
      "options": [
        "ăn trưa",
        "làm bài tập",
        "thức dậy",
        "đi học"
      ],
      "answer": "làm bài tập",
      "explanation": "I do homework at six. = Tôi làm bài tập lúc 6 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at nine.",
      "answers": [
        "go to bed"
      ],
      "explanation": "I go to bed at nine."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at seven.",
      "answers": [
        "go to bed"
      ],
      "explanation": "I go to bed at seven."
    },
    {
      "type": "choice",
      "prompt": "I go to bed at six. Câu này nói tôi làm gì?",
      "options": [
        "làm bài tập",
        "ăn trưa",
        "đi ngủ",
        "ăn sáng"
      ],
      "answer": "đi ngủ",
      "explanation": "I go to bed at six. = Tôi đi ngủ lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "He ______ at seven.",
      "options": [
        "getting up",
        "get up",
        "got up",
        "gets up"
      ],
      "answer": "gets up",
      "explanation": "He/she + động từ thêm -s: He gets up at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (get up) at seven.",
      "answers": [
        "gets up"
      ],
      "explanation": "He gets up at seven."
    },
    {
      "type": "choice",
      "prompt": "He ______ at seven.",
      "options": [
        "has breakfast",
        "have breakfast",
        "having breakfast",
        "had breakfast"
      ],
      "answer": "has breakfast",
      "explanation": "He/she + động từ thêm -s: He has breakfast at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (have breakfast) at seven.",
      "answers": [
        "has breakfast"
      ],
      "explanation": "He has breakfast at seven."
    },
    {
      "type": "choice",
      "prompt": "He ______ at seven.",
      "options": [
        "goes to school",
        "go to school",
        "went to school",
        "going to school"
      ],
      "answer": "goes to school",
      "explanation": "He/she + động từ thêm -s: He goes to school at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (go to school) at seven.",
      "answers": [
        "goes to school"
      ],
      "explanation": "He goes to school at seven."
    },
    {
      "type": "choice",
      "prompt": "He ______ at seven.",
      "options": [
        "do homework",
        "does homework",
        "did homework",
        "doing homework"
      ],
      "answer": "does homework",
      "explanation": "He/she + động từ thêm -s: He does homework at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (do homework) at seven.",
      "answers": [
        "does homework"
      ],
      "explanation": "He does homework at seven."
    }
  ],
  "colors-objects": [
    {
      "type": "choice",
      "prompt": "\"red\" có nghĩa là gì?",
      "options": [
        "màu đỏ",
        "màu vàng",
        "quyển sách",
        "cây bút mực/bi"
      ],
      "answer": "màu đỏ",
      "explanation": "red = màu đỏ."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"màu đỏ\"?",
      "options": [
        "book",
        "red",
        "pen",
        "chair"
      ],
      "answer": "red",
      "explanation": "red = màu đỏ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"màu đỏ\"",
      "answers": [
        "red"
      ],
      "explanation": "red = màu đỏ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The apple is ______.",
      "answers": [
        "red"
      ],
      "explanation": "Câu đầy đủ: The apple is red."
    },
    {
      "type": "choice",
      "prompt": "\"blue\" có nghĩa là gì?",
      "options": [
        "màu xanh lá",
        "quyển sách",
        "màu xanh dương",
        "cái ghế"
      ],
      "answer": "màu xanh dương",
      "explanation": "blue = màu xanh dương."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"màu xanh dương\"?",
      "options": [
        "yellow",
        "green",
        "blue",
        "book"
      ],
      "answer": "blue",
      "explanation": "blue = màu xanh dương."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"màu xanh dương\"",
      "answers": [
        "blue"
      ],
      "explanation": "blue = màu xanh dương."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The sky is ______.",
      "answers": [
        "blue"
      ],
      "explanation": "Câu đầy đủ: The sky is blue."
    },
    {
      "type": "choice",
      "prompt": "\"green\" có nghĩa là gì?",
      "options": [
        "màu đỏ",
        "cái ghế",
        "quyển sách",
        "màu xanh lá"
      ],
      "answer": "màu xanh lá",
      "explanation": "green = màu xanh lá."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"màu xanh lá\"?",
      "options": [
        "blue",
        "yellow",
        "chair",
        "green"
      ],
      "answer": "green",
      "explanation": "green = màu xanh lá."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"màu xanh lá\"",
      "answers": [
        "green"
      ],
      "explanation": "green = màu xanh lá."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The leaf is ______.",
      "answers": [
        "green"
      ],
      "explanation": "Câu đầy đủ: The leaf is green."
    },
    {
      "type": "choice",
      "prompt": "\"yellow\" có nghĩa là gì?",
      "options": [
        "màu vàng",
        "màu xanh dương",
        "cái ghế",
        "màu xanh lá"
      ],
      "answer": "màu vàng",
      "explanation": "yellow = màu vàng."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"màu vàng\"?",
      "options": [
        "red",
        "yellow",
        "chair",
        "green"
      ],
      "answer": "yellow",
      "explanation": "yellow = màu vàng."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"màu vàng\"",
      "answers": [
        "yellow"
      ],
      "explanation": "yellow = màu vàng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The sun is ______.",
      "answers": [
        "yellow"
      ],
      "explanation": "Câu đầy đủ: The sun is yellow."
    },
    {
      "type": "choice",
      "prompt": "\"book\" có nghĩa là gì?",
      "options": [
        "cái cặp/túi",
        "quyển sách",
        "màu vàng",
        "cái ghế"
      ],
      "answer": "quyển sách",
      "explanation": "book = quyển sách."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"quyển sách\"?",
      "options": [
        "chair",
        "blue",
        "yellow",
        "book"
      ],
      "answer": "book",
      "explanation": "book = quyển sách."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quyển sách\"",
      "answers": [
        "book"
      ],
      "explanation": "book = quyển sách."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is a ______.",
      "answers": [
        "book"
      ],
      "explanation": "Câu đầy đủ: This is a book."
    },
    {
      "type": "choice",
      "prompt": "\"pen\" có nghĩa là gì?",
      "options": [
        "cây bút mực/bi",
        "cái cặp/túi",
        "màu vàng",
        "cái ghế"
      ],
      "answer": "cây bút mực/bi",
      "explanation": "pen = cây bút mực/bi."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"cây bút mực/bi\"?",
      "options": [
        "green",
        "pen",
        "bag",
        "red"
      ],
      "answer": "pen",
      "explanation": "pen = cây bút mực/bi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cây bút mực/bi\"",
      "answers": [
        "pen"
      ],
      "explanation": "pen = cây bút mực/bi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is my ______.",
      "answers": [
        "pen"
      ],
      "explanation": "Câu đầy đủ: This is my pen."
    },
    {
      "type": "choice",
      "prompt": "\"bag\" có nghĩa là gì?",
      "options": [
        "cái ghế",
        "màu xanh lá",
        "màu vàng",
        "cái cặp/túi"
      ],
      "answer": "cái cặp/túi",
      "explanation": "bag = cái cặp/túi."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"cái cặp/túi\"?",
      "options": [
        "blue",
        "red",
        "bag",
        "chair"
      ],
      "answer": "bag",
      "explanation": "bag = cái cặp/túi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái cặp/túi\"",
      "answers": [
        "bag"
      ],
      "explanation": "bag = cái cặp/túi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My ______ is blue.",
      "answers": [
        "bag"
      ],
      "explanation": "Câu đầy đủ: My bag is blue."
    },
    {
      "type": "choice",
      "prompt": "\"chair\" có nghĩa là gì?",
      "options": [
        "cái ghế",
        "cái cặp/túi",
        "màu vàng",
        "màu xanh dương"
      ],
      "answer": "cái ghế",
      "explanation": "chair = cái ghế."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"cái ghế\"?",
      "options": [
        "book",
        "red",
        "blue",
        "chair"
      ],
      "answer": "chair",
      "explanation": "chair = cái ghế."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái ghế\"",
      "answers": [
        "chair"
      ],
      "explanation": "chair = cái ghế."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The ______ is red.",
      "answers": [
        "chair"
      ],
      "explanation": "Câu đầy đủ: The chair is red."
    },
    {
      "type": "choice",
      "prompt": "\"Blue\" là màu gì?",
      "options": [
        "Màu đỏ",
        "Màu vàng",
        "Màu xanh dương",
        "Màu xanh lá"
      ],
      "answer": "Màu xanh dương",
      "explanation": "Blue = xanh dương, green = xanh lá."
    },
    {
      "type": "choice",
      "prompt": "Câu nào đúng để giới thiệu một cây bút?",
      "options": [
        "This is pen.",
        "This is a pen.",
        "This are a pen.",
        "This is an pen."
      ],
      "answer": "This is a pen.",
      "explanation": "Danh từ số ít cần a/an: a pen (pen bắt đầu bằng phụ âm)."
    },
    {
      "type": "choice",
      "prompt": "\"What color is it?\" dùng để hỏi gì?",
      "options": [
        "Nó là cái gì?",
        "Nó ở đâu?",
        "Nó màu gì?",
        "Nó của ai?"
      ],
      "answer": "Nó màu gì?",
      "explanation": "What color = màu gì."
    },
    {
      "type": "choice",
      "prompt": "\"An apple\" đúng vì sao?",
      "options": [
        "Apple là số nhiều",
        "Apple bắt đầu bằng nguyên âm a",
        "Apple là màu đỏ",
        "Apple là danh từ riêng"
      ],
      "answer": "Apple bắt đầu bằng nguyên âm a",
      "explanation": "Dùng \"an\" trước từ bắt đầu bằng nguyên âm: an apple, an egg."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The sun is ______ (màu vàng).",
      "answers": [
        "yellow"
      ],
      "explanation": "Yellow = màu vàng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ book. (một quyển sách)",
      "answers": [
        "a"
      ],
      "explanation": "A book, vì book bắt đầu bằng phụ âm b."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My bag is ______ (màu xanh dương).",
      "answers": [
        "blue"
      ],
      "explanation": "Blue = xanh dương."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là một cái ghế.\"",
      "answers": [
        "this is a chair"
      ],
      "explanation": "This is a chair. = Đây là một cái ghế."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Quả táo màu đỏ.\"",
      "answers": [
        "the apple is red"
      ],
      "explanation": "The apple is red. = Quả táo màu đỏ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Nó màu gì? — Nó màu xanh lá.\"",
      "answers": [
        "what color is it it is green"
      ],
      "explanation": "What color is it? It is green. = Nó màu gì? — Nó màu xanh lá."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The pen is ______ (màu đỏ).",
      "answers": [
        "red"
      ],
      "explanation": "The pen is red."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cây bút màu đỏ.\"",
      "answers": [
        "the pen is red"
      ],
      "explanation": "The pen is red. = cây bút màu đỏ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The bag is ______ (màu đỏ).",
      "answers": [
        "red"
      ],
      "explanation": "The bag is red."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái cặp màu đỏ.\"",
      "answers": [
        "the bag is red"
      ],
      "explanation": "The bag is red. = cái cặp màu đỏ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The apple is ______ (màu đỏ).",
      "answers": [
        "red"
      ],
      "explanation": "The apple is red."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The book is ______ (màu xanh dương).",
      "answers": [
        "blue"
      ],
      "explanation": "The book is blue."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quyển sách màu xanh dương.\"",
      "answers": [
        "the book is blue"
      ],
      "explanation": "The book is blue. = quyển sách màu xanh dương."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The chair is ______ (màu xanh dương).",
      "answers": [
        "blue"
      ],
      "explanation": "The chair is blue."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái ghế màu xanh dương.\"",
      "answers": [
        "the chair is blue"
      ],
      "explanation": "The chair is blue. = cái ghế màu xanh dương."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The egg is ______ (màu xanh dương).",
      "answers": [
        "blue"
      ],
      "explanation": "The egg is blue."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quả trứng màu xanh dương.\"",
      "answers": [
        "the egg is blue"
      ],
      "explanation": "The egg is blue. = quả trứng màu xanh dương."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The bag is ______ (màu xanh lá).",
      "answers": [
        "green"
      ],
      "explanation": "The bag is green."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái cặp màu xanh lá.\"",
      "answers": [
        "the bag is green"
      ],
      "explanation": "The bag is green. = cái cặp màu xanh lá."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The apple is ______ (màu xanh lá).",
      "answers": [
        "green"
      ],
      "explanation": "The apple is green."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quả táo màu xanh lá.\"",
      "answers": [
        "the apple is green"
      ],
      "explanation": "The apple is green. = quả táo màu xanh lá."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The pen is ______ (màu xanh lá).",
      "answers": [
        "green"
      ],
      "explanation": "The pen is green."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cây bút màu xanh lá.\"",
      "answers": [
        "the pen is green"
      ],
      "explanation": "The pen is green. = cây bút màu xanh lá."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The chair is ______ (màu vàng).",
      "answers": [
        "yellow"
      ],
      "explanation": "The chair is yellow."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái ghế màu vàng.\"",
      "answers": [
        "the chair is yellow"
      ],
      "explanation": "The chair is yellow. = cái ghế màu vàng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The egg is ______ (màu vàng).",
      "answers": [
        "yellow"
      ],
      "explanation": "The egg is yellow."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quả trứng màu vàng.\"",
      "answers": [
        "the egg is yellow"
      ],
      "explanation": "The egg is yellow. = quả trứng màu vàng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The book is ______ (màu vàng).",
      "answers": [
        "yellow"
      ],
      "explanation": "The book is yellow."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quyển sách màu vàng.\"",
      "answers": [
        "the book is yellow"
      ],
      "explanation": "The book is yellow. = quyển sách màu vàng."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: This is ______ pen.",
      "options": [
        "không cần từ nào",
        "the",
        "a",
        "an"
      ],
      "answer": "a",
      "explanation": "This is a pen."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: This is ______ book.",
      "options": [
        "a",
        "an",
        "the",
        "không cần từ nào"
      ],
      "answer": "a",
      "explanation": "This is a book."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: This is ______ bag.",
      "options": [
        "không cần từ nào",
        "an",
        "a",
        "the"
      ],
      "answer": "a",
      "explanation": "This is a bag."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: This is ______ chair.",
      "options": [
        "không cần từ nào",
        "the",
        "an",
        "a"
      ],
      "answer": "a",
      "explanation": "This is a chair."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: This is ______ apple.",
      "options": [
        "the",
        "không cần từ nào",
        "a",
        "an"
      ],
      "answer": "an",
      "explanation": "This is an apple."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: This is ______ egg.",
      "options": [
        "không cần từ nào",
        "the",
        "an",
        "a"
      ],
      "answer": "an",
      "explanation": "This is an egg."
    }
  ],
  "food-drink": [
    {
      "type": "choice",
      "prompt": "\"rice\" có nghĩa là gì?",
      "options": [
        "nước",
        "cơm",
        "sữa",
        "quả chuối"
      ],
      "answer": "cơm",
      "explanation": "rice = cơm."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"cơm\"?",
      "options": [
        "milk",
        "rice",
        "egg",
        "bread"
      ],
      "answer": "rice",
      "explanation": "rice = cơm."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cơm\"",
      "answers": [
        "rice"
      ],
      "explanation": "rice = cơm."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I like ______.",
      "answers": [
        "rice"
      ],
      "explanation": "Câu đầy đủ: I like rice."
    },
    {
      "type": "choice",
      "prompt": "\"bread\" có nghĩa là gì?",
      "options": [
        "nước",
        "bánh mì",
        "cà phê",
        "sữa"
      ],
      "answer": "bánh mì",
      "explanation": "bread = bánh mì."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"bánh mì\"?",
      "options": [
        "milk",
        "bread",
        "apple",
        "banana"
      ],
      "answer": "bread",
      "explanation": "bread = bánh mì."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"bánh mì\"",
      "answers": [
        "bread"
      ],
      "explanation": "bread = bánh mì."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______ for breakfast.",
      "answers": [
        "bread"
      ],
      "explanation": "Câu đầy đủ: I eat bread for breakfast."
    },
    {
      "type": "choice",
      "prompt": "\"egg\" có nghĩa là gì?",
      "options": [
        "quả chuối",
        "quả trứng",
        "bánh mì",
        "cà phê"
      ],
      "answer": "quả trứng",
      "explanation": "egg = quả trứng."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"quả trứng\"?",
      "options": [
        "bread",
        "egg",
        "milk",
        "water"
      ],
      "answer": "egg",
      "explanation": "egg = quả trứng."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quả trứng\"",
      "answers": [
        "egg"
      ],
      "explanation": "egg = quả trứng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat an ______.",
      "answers": [
        "egg"
      ],
      "explanation": "Câu đầy đủ: I eat an egg."
    },
    {
      "type": "choice",
      "prompt": "\"milk\" có nghĩa là gì?",
      "options": [
        "quả trứng",
        "quả táo",
        "cà phê",
        "sữa"
      ],
      "answer": "sữa",
      "explanation": "milk = sữa."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"sữa\"?",
      "options": [
        "egg",
        "rice",
        "milk",
        "water"
      ],
      "answer": "milk",
      "explanation": "milk = sữa."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"sữa\"",
      "answers": [
        "milk"
      ],
      "explanation": "milk = sữa."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I drink ______.",
      "answers": [
        "milk"
      ],
      "explanation": "Câu đầy đủ: I drink milk."
    },
    {
      "type": "choice",
      "prompt": "\"water\" có nghĩa là gì?",
      "options": [
        "quả chuối",
        "quả táo",
        "cơm",
        "nước"
      ],
      "answer": "nước",
      "explanation": "water = nước."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"nước\"?",
      "options": [
        "water",
        "coffee",
        "apple",
        "rice"
      ],
      "answer": "water",
      "explanation": "water = nước."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"nước\"",
      "answers": [
        "water"
      ],
      "explanation": "water = nước."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I drink ______ every day.",
      "answers": [
        "water"
      ],
      "explanation": "Câu đầy đủ: I drink water every day."
    },
    {
      "type": "choice",
      "prompt": "\"coffee\" có nghĩa là gì?",
      "options": [
        "cà phê",
        "quả trứng",
        "quả táo",
        "quả chuối"
      ],
      "answer": "cà phê",
      "explanation": "coffee = cà phê."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"cà phê\"?",
      "options": [
        "coffee",
        "rice",
        "apple",
        "water"
      ],
      "answer": "coffee",
      "explanation": "coffee = cà phê."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cà phê\"",
      "answers": [
        "coffee"
      ],
      "explanation": "coffee = cà phê."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My father likes ______.",
      "answers": [
        "coffee"
      ],
      "explanation": "Câu đầy đủ: My father likes coffee."
    },
    {
      "type": "choice",
      "prompt": "\"apple\" có nghĩa là gì?",
      "options": [
        "nước",
        "bánh mì",
        "quả táo",
        "cơm"
      ],
      "answer": "quả táo",
      "explanation": "apple = quả táo."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"quả táo\"?",
      "options": [
        "apple",
        "banana",
        "egg",
        "water"
      ],
      "answer": "apple",
      "explanation": "apple = quả táo."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quả táo\"",
      "answers": [
        "apple"
      ],
      "explanation": "apple = quả táo."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: An ______ a day.",
      "answers": [
        "apple"
      ],
      "explanation": "Câu đầy đủ: An apple a day."
    },
    {
      "type": "choice",
      "prompt": "\"banana\" có nghĩa là gì?",
      "options": [
        "cà phê",
        "quả chuối",
        "quả trứng",
        "bánh mì"
      ],
      "answer": "quả chuối",
      "explanation": "banana = quả chuối."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"quả chuối\"?",
      "options": [
        "egg",
        "apple",
        "bread",
        "banana"
      ],
      "answer": "banana",
      "explanation": "banana = quả chuối."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quả chuối\"",
      "answers": [
        "banana"
      ],
      "explanation": "banana = quả chuối."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The ______ is yellow.",
      "answers": [
        "banana"
      ],
      "explanation": "Câu đầy đủ: The banana is yellow."
    },
    {
      "type": "choice",
      "prompt": "\"I like milk.\" nghĩa là gì?",
      "options": [
        "Tôi uống sữa.",
        "Tôi thích sữa.",
        "Tôi có sữa.",
        "Tôi mua sữa."
      ],
      "answer": "Tôi thích sữa.",
      "explanation": "Like = thích."
    },
    {
      "type": "choice",
      "prompt": "Câu phủ định đúng của \"I like coffee.\" là gì?",
      "options": [
        "I not like coffee.",
        "I do not like coffee.",
        "I does not like coffee.",
        "I am not like coffee."
      ],
      "answer": "I do not like coffee.",
      "explanation": "Với I/you/we/they, phủ định dùng do not (don't) + động từ nguyên thể."
    },
    {
      "type": "choice",
      "prompt": "\"Do you like bananas?\" trả lời \"không\" như thế nào?",
      "options": [
        "No, I do not.",
        "No, I am not.",
        "No, I does not.",
        "No, I like not."
      ],
      "answer": "No, I do not.",
      "explanation": "Câu hỏi Do you…? trả lời ngắn: Yes, I do. / No, I do not."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ water every day. (uống)",
      "answers": [
        "drink"
      ],
      "explanation": "Drink = uống."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I do not ______ coffee. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "Do not + like (động từ nguyên thể, không thêm -s)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______ egg. (một quả trứng)",
      "answers": [
        "an"
      ],
      "explanation": "An egg, vì egg bắt đầu bằng nguyên âm e."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi thích chuối.\"",
      "answers": [
        "i like bananas",
        "i like banana"
      ],
      "explanation": "I like bananas. = Tôi thích chuối."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Bạn có thích sữa không?\"",
      "answers": [
        "do you like milk"
      ],
      "explanation": "Do you like milk? = Bạn có thích sữa không?"
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi uống nước mỗi ngày.\"",
      "answers": [
        "i drink water every day"
      ],
      "explanation": "I drink water every day. = Tôi uống nước mỗi ngày."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích cơm không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "Are you like rice?",
        "Do you likes rice?",
        "You like rice?",
        "Do you like rice?"
      ],
      "answer": "Do you like rice?",
      "explanation": "Do you like rice? = Bạn có thích cơm không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ rice. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I like rice. = Tôi thích cơm."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ rice. (thích)",
      "answers": [
        "likes"
      ],
      "explanation": "She likes rice. = Cô ấy thích cơm."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I do not ______ rice. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I do not like rice. = Tôi không thích cơm."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích bánh mì không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "Are you like bread?",
        "Do you likes bread?",
        "You like bread?",
        "Do you like bread?"
      ],
      "answer": "Do you like bread?",
      "explanation": "Do you like bread? = Bạn có thích bánh mì không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ bread. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I like bread. = Tôi thích bánh mì."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ bread. (thích)",
      "answers": [
        "likes"
      ],
      "explanation": "She likes bread. = Cô ấy thích bánh mì."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I do not ______ bread. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I do not like bread. = Tôi không thích bánh mì."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích quả trứng không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "Are you like egg?",
        "Do you likes egg?",
        "You like egg?",
        "Do you like egg?"
      ],
      "answer": "Do you like egg?",
      "explanation": "Do you like egg? = Bạn có thích quả trứng không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ egg. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I like egg. = Tôi thích quả trứng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ egg. (thích)",
      "answers": [
        "likes"
      ],
      "explanation": "She likes egg. = Cô ấy thích quả trứng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I do not ______ egg. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I do not like egg. = Tôi không thích quả trứng."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích sữa không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "Are you like milk?",
        "You like milk?",
        "Do you likes milk?",
        "Do you like milk?"
      ],
      "answer": "Do you like milk?",
      "explanation": "Do you like milk? = Bạn có thích sữa không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ milk. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I like milk. = Tôi thích sữa."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ milk. (thích)",
      "answers": [
        "likes"
      ],
      "explanation": "She likes milk. = Cô ấy thích sữa."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I do not ______ milk. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I do not like milk. = Tôi không thích sữa."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích nước không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "Do you likes water?",
        "Are you like water?",
        "Do you like water?",
        "You like water?"
      ],
      "answer": "Do you like water?",
      "explanation": "Do you like water? = Bạn có thích nước không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ water. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I like water. = Tôi thích nước."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ water. (thích)",
      "answers": [
        "likes"
      ],
      "explanation": "She likes water. = Cô ấy thích nước."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I do not ______ water. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I do not like water. = Tôi không thích nước."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích cà phê không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "You like coffee?",
        "Do you like coffee?",
        "Do you likes coffee?",
        "Are you like coffee?"
      ],
      "answer": "Do you like coffee?",
      "explanation": "Do you like coffee? = Bạn có thích cà phê không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ coffee. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I like coffee. = Tôi thích cà phê."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ coffee. (thích)",
      "answers": [
        "likes"
      ],
      "explanation": "She likes coffee. = Cô ấy thích cà phê."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích quả táo không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "Are you like apple?",
        "Do you likes apple?",
        "Do you like apple?",
        "You like apple?"
      ],
      "answer": "Do you like apple?",
      "explanation": "Do you like apple? = Bạn có thích quả táo không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ apple. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I like apple. = Tôi thích quả táo."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ apple. (thích)",
      "answers": [
        "likes"
      ],
      "explanation": "She likes apple. = Cô ấy thích quả táo."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I do not ______ apple. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I do not like apple. = Tôi không thích quả táo."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích quả chuối không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "You like banana?",
        "Are you like banana?",
        "Do you likes banana?",
        "Do you like banana?"
      ],
      "answer": "Do you like banana?",
      "explanation": "Do you like banana? = Bạn có thích quả chuối không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ banana. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I like banana. = Tôi thích quả chuối."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ banana. (thích)",
      "answers": [
        "likes"
      ],
      "explanation": "She likes banana. = Cô ấy thích quả chuối."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I do not ______ banana. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I do not like banana. = Tôi không thích quả chuối."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I drink ______ (sữa).",
      "answers": [
        "milk"
      ],
      "explanation": "I drink milk. = Tôi uống sữa."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I drink ______ (nước).",
      "answers": [
        "water"
      ],
      "explanation": "I drink water. = Tôi uống nước."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I drink ______ (cà phê).",
      "answers": [
        "coffee"
      ],
      "explanation": "I drink coffee. = Tôi uống cà phê."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______ (cơm).",
      "answers": [
        "rice"
      ],
      "explanation": "I eat rice. = Tôi ăn cơm."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______ (bánh mì).",
      "answers": [
        "bread"
      ],
      "explanation": "I eat bread. = Tôi ăn bánh mì."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______ (quả trứng).",
      "answers": [
        "egg"
      ],
      "explanation": "I eat egg. = Tôi ăn quả trứng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______ (quả táo).",
      "answers": [
        "apple"
      ],
      "explanation": "I eat apple. = Tôi ăn quả táo."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______ (quả chuối).",
      "answers": [
        "banana"
      ],
      "explanation": "I eat banana. = Tôi ăn quả chuối."
    }
  ],
  "to-be": [
    {
      "type": "choice",
      "prompt": "\"I am / was\" có nghĩa là gì?",
      "options": [
        "đã không phải là",
        "bạn là / đã là",
        "tôi là / đã là",
        "họ là / đã là"
      ],
      "answer": "tôi là / đã là",
      "explanation": "I am / was = tôi là / đã là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ a student. / I was tired yesterday.",
      "answers": [
        "I am"
      ],
      "explanation": "Câu đầy đủ: I am a student. / I was tired yesterday."
    },
    {
      "type": "choice",
      "prompt": "\"he is / was\" có nghĩa là gì?",
      "options": [
        "bạn là / đã là",
        "chúng tôi là / đã là",
        "anh ấy là / đã là",
        "đã không phải là"
      ],
      "answer": "anh ấy là / đã là",
      "explanation": "he is / was = anh ấy là / đã là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ happy. / He was happy yesterday.",
      "answers": [
        "he is"
      ],
      "explanation": "Câu đầy đủ: He is happy. / He was happy yesterday."
    },
    {
      "type": "choice",
      "prompt": "\"she is / was\" có nghĩa là gì?",
      "options": [
        "anh ấy là / đã là",
        "bạn là / đã là",
        "cô ấy là / đã là",
        "nó là / đã là"
      ],
      "answer": "cô ấy là / đã là",
      "explanation": "she is / was = cô ấy là / đã là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ a teacher. / She was a teacher.",
      "answers": [
        "she is"
      ],
      "explanation": "Câu đầy đủ: She is a teacher. / She was a teacher."
    },
    {
      "type": "choice",
      "prompt": "\"it is / was\" có nghĩa là gì?",
      "options": [
        "đã không phải là",
        "nó là / đã là",
        "tôi là / đã là",
        "cô ấy là / đã là"
      ],
      "answer": "nó là / đã là",
      "explanation": "it is / was = nó là / đã là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ cold. / It was cold yesterday.",
      "answers": [
        "it is"
      ],
      "explanation": "Câu đầy đủ: It is cold. / It was cold yesterday."
    },
    {
      "type": "choice",
      "prompt": "\"we are / were\" có nghĩa là gì?",
      "options": [
        "đã không phải là",
        "chúng tôi là / đã là",
        "anh ấy là / đã là",
        "tôi là / đã là"
      ],
      "answer": "chúng tôi là / đã là",
      "explanation": "we are / were = chúng tôi là / đã là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ friends. / We were friends.",
      "answers": [
        "we are"
      ],
      "explanation": "Câu đầy đủ: We are friends. / We were friends."
    },
    {
      "type": "choice",
      "prompt": "\"they are / were\" có nghĩa là gì?",
      "options": [
        "chúng tôi là / đã là",
        "nó là / đã là",
        "họ là / đã là",
        "anh ấy là / đã là"
      ],
      "answer": "họ là / đã là",
      "explanation": "they are / were = họ là / đã là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ students. / They were students.",
      "answers": [
        "they are"
      ],
      "explanation": "Câu đầy đủ: They are students. / They were students."
    },
    {
      "type": "choice",
      "prompt": "\"you are / were\" có nghĩa là gì?",
      "options": [
        "đã không phải là",
        "tôi là / đã là",
        "họ là / đã là",
        "bạn là / đã là"
      ],
      "answer": "bạn là / đã là",
      "explanation": "you are / were = bạn là / đã là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ kind. / You were kind.",
      "answers": [
        "you are"
      ],
      "explanation": "Câu đầy đủ: You are kind. / You were kind."
    },
    {
      "type": "choice",
      "prompt": "\"wasn't / weren't\" có nghĩa là gì?",
      "options": [
        "bạn là / đã là",
        "đã không phải là",
        "tôi là / đã là",
        "anh ấy là / đã là"
      ],
      "answer": "đã không phải là",
      "explanation": "wasn't / weren't = đã không phải là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ here yesterday.",
      "answers": [
        "wasn't"
      ],
      "explanation": "Câu đầy đủ: He wasn't here yesterday."
    },
    {
      "type": "choice",
      "prompt": "She ______ happy yesterday.",
      "options": [
        "is",
        "was",
        "are",
        "were"
      ],
      "answer": "was",
      "explanation": "Yesterday → quá khứ, she + was."
    },
    {
      "type": "choice",
      "prompt": "They ______ at home last night.",
      "options": [
        "is",
        "was",
        "are",
        "were"
      ],
      "answer": "were",
      "explanation": "Last night → quá khứ, they + were."
    },
    {
      "type": "choice",
      "prompt": "He ______ not here yesterday.",
      "options": [
        "is",
        "was",
        "are",
        "were"
      ],
      "answer": "was",
      "explanation": "He + was not (wasn't) ở quá khứ."
    },
    {
      "type": "choice",
      "prompt": "______ you at school yesterday?",
      "options": [
        "Is",
        "Are",
        "Was",
        "Were"
      ],
      "answer": "Were",
      "explanation": "Câu hỏi quá khứ với you dùng Were."
    },
    {
      "type": "choice",
      "prompt": "We ______ tired now.",
      "options": [
        "is",
        "was",
        "are",
        "were"
      ],
      "answer": "are",
      "explanation": "Now → hiện tại, we + are."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: It ______ cold yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "Yesterday → quá khứ, it + was."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: You ______ my best friend now.",
      "answers": [
        "are"
      ],
      "explanation": "Now → hiện tại, you + are."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: They ______ not ready yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "They + were not (weren't) ở quá khứ."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ she happy today?",
      "answers": [
        "is"
      ],
      "explanation": "Today → hiện tại, câu hỏi với she dùng Is."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: I ______ not at home last night.",
      "answers": [
        "was"
      ],
      "explanation": "Last night → quá khứ, I + was."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan and Mai ______ friends now.",
      "answers": [
        "are"
      ],
      "explanation": "Lan and Mai là 2 người (như they), hiện tại dùng are."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My father ______ a teacher in 2020.",
      "answers": [
        "was"
      ],
      "explanation": "In 2020 → quá khứ, my father (như he) + was."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Anh ấy đã mệt hôm qua.\"",
      "answers": [
        "he was tired yesterday"
      ],
      "explanation": "He was tired yesterday. = Anh ấy đã mệt hôm qua."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Họ không ở trường hôm qua.\"",
      "answers": [
        "they were not at school yesterday",
        "they weren't at school yesterday"
      ],
      "explanation": "They were not at school yesterday. = Họ không ở trường hôm qua."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Bạn có ở nhà tối qua không?\"",
      "answers": [
        "were you at home last night"
      ],
      "explanation": "Were you at home last night? = Bạn có ở nhà tối qua không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ happy today.",
      "options": [
        "were",
        "is",
        "am",
        "are"
      ],
      "answer": "am",
      "explanation": "I + am (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ happy yesterday.",
      "options": [
        "am",
        "was",
        "is",
        "were"
      ],
      "answer": "was",
      "explanation": "I + was (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: I ______ happy today.",
      "answers": [
        "am"
      ],
      "explanation": "I am happy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: I ______ happy yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "I was happy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ happy today.",
      "options": [
        "were",
        "is",
        "was",
        "are"
      ],
      "answer": "is",
      "explanation": "He + is (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ happy yesterday.",
      "options": [
        "are",
        "were",
        "was",
        "is"
      ],
      "answer": "was",
      "explanation": "He + was (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ happy today.",
      "answers": [
        "is"
      ],
      "explanation": "He is happy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ happy yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "He was happy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ happy today.",
      "options": [
        "was",
        "am",
        "is",
        "were"
      ],
      "answer": "is",
      "explanation": "She + is (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ happy yesterday.",
      "options": [
        "was",
        "is",
        "were",
        "am"
      ],
      "answer": "was",
      "explanation": "She + was (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ happy today.",
      "answers": [
        "is"
      ],
      "explanation": "She is happy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ happy yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "She was happy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: It ______ happy today.",
      "options": [
        "is",
        "are",
        "am",
        "was"
      ],
      "answer": "is",
      "explanation": "It + is (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: It ______ happy yesterday.",
      "options": [
        "was",
        "is",
        "were",
        "are"
      ],
      "answer": "was",
      "explanation": "It + was (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: It ______ happy today.",
      "answers": [
        "is"
      ],
      "explanation": "It is happy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: It ______ happy yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "It was happy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ happy today.",
      "options": [
        "are",
        "were",
        "is",
        "am"
      ],
      "answer": "are",
      "explanation": "We + are (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ happy yesterday.",
      "options": [
        "am",
        "was",
        "are",
        "were"
      ],
      "answer": "were",
      "explanation": "We + were (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ happy today.",
      "answers": [
        "are"
      ],
      "explanation": "We are happy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ happy yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "We were happy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ happy today.",
      "options": [
        "were",
        "are",
        "is",
        "am"
      ],
      "answer": "are",
      "explanation": "They + are (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ happy yesterday.",
      "options": [
        "is",
        "were",
        "was",
        "am"
      ],
      "answer": "were",
      "explanation": "They + were (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: They ______ happy today.",
      "answers": [
        "are"
      ],
      "explanation": "They are happy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: They ______ happy yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "They were happy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ happy today.",
      "options": [
        "was",
        "is",
        "are",
        "am"
      ],
      "answer": "is",
      "explanation": "Lan + is (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ happy yesterday.",
      "options": [
        "is",
        "was",
        "are",
        "were"
      ],
      "answer": "was",
      "explanation": "Lan + was (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ happy today.",
      "answers": [
        "is"
      ],
      "explanation": "Lan is happy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ happy yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "Lan was happy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Nam ______ happy today.",
      "options": [
        "am",
        "was",
        "is",
        "were"
      ],
      "answer": "is",
      "explanation": "Nam + is (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Nam ______ happy yesterday.",
      "options": [
        "is",
        "were",
        "am",
        "was"
      ],
      "answer": "was",
      "explanation": "Nam + was (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Nam ______ happy today.",
      "answers": [
        "is"
      ],
      "explanation": "Nam is happy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Nam ______ happy yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "Nam was happy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My parents ______ happy today.",
      "options": [
        "are",
        "am",
        "is",
        "was"
      ],
      "answer": "are",
      "explanation": "My parents + are (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My parents ______ happy yesterday.",
      "options": [
        "are",
        "is",
        "am",
        "were"
      ],
      "answer": "were",
      "explanation": "My parents + were (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My parents ______ happy today.",
      "answers": [
        "are"
      ],
      "explanation": "My parents are happy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My parents ______ happy yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "My parents were happy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The cat ______ happy today.",
      "options": [
        "are",
        "is",
        "were",
        "was"
      ],
      "answer": "is",
      "explanation": "The cat + is (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The cat ______ happy yesterday.",
      "options": [
        "am",
        "were",
        "are",
        "was"
      ],
      "answer": "was",
      "explanation": "The cat + was (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The cat ______ happy today.",
      "answers": [
        "is"
      ],
      "explanation": "The cat is happy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The cat ______ happy yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "The cat was happy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Hoa ______ happy today.",
      "options": [
        "am",
        "were",
        "is",
        "was"
      ],
      "answer": "is",
      "explanation": "Hoa + is (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Hoa ______ happy yesterday.",
      "options": [
        "was",
        "are",
        "were",
        "is"
      ],
      "answer": "was",
      "explanation": "Hoa + was (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Hoa ______ happy today.",
      "answers": [
        "is"
      ],
      "explanation": "Hoa is happy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Hoa ______ happy yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "Hoa was happy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The dogs ______ happy today.",
      "options": [
        "am",
        "is",
        "was",
        "are"
      ],
      "answer": "are",
      "explanation": "The dogs + are (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The dogs ______ happy yesterday.",
      "options": [
        "am",
        "are",
        "were",
        "was"
      ],
      "answer": "were",
      "explanation": "The dogs + were (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The dogs ______ happy today.",
      "answers": [
        "are"
      ],
      "explanation": "The dogs are happy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The dogs ______ happy yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "The dogs were happy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn câu đúng: He ______ happy.",
      "options": [
        "wasn't",
        "isn't",
        "aren’t",
        "am not"
      ],
      "answer": "isn't",
      "explanation": "He isn't happy. = Anh ấy không vui."
    },
    {
      "type": "choice",
      "prompt": "Chọn câu đúng: They ______ students.",
      "options": [
        "isn’t",
        "am not",
        "wasn't",
        "aren't"
      ],
      "answer": "aren't",
      "explanation": "They aren't students. = Họ không phải là học sinh."
    }
  ],
  "present-simple": [
    {
      "type": "choice",
      "prompt": "\"go → goes\" có nghĩa là gì?",
      "options": [
        "bay",
        "đi",
        "chơi",
        "bắt (xe)"
      ],
      "answer": "đi",
      "explanation": "go → goes = đi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ to school every day.",
      "answers": [
        "goes"
      ],
      "explanation": "Câu đầy đủ: He goes to school every day."
    },
    {
      "type": "choice",
      "prompt": "\"watch → watches\" có nghĩa là gì?",
      "options": [
        "xem",
        "đánh (răng)",
        "đi",
        "bắt (xe)"
      ],
      "answer": "xem",
      "explanation": "watch → watches = xem."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ TV every evening.",
      "answers": [
        "watches"
      ],
      "explanation": "Câu đầy đủ: She watches TV every evening."
    },
    {
      "type": "choice",
      "prompt": "\"study → studies\" có nghĩa là gì?",
      "options": [
        "chơi",
        "đi",
        "học",
        "bắt (xe)"
      ],
      "answer": "học",
      "explanation": "study → studies = học."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ English every day.",
      "answers": [
        "studies"
      ],
      "explanation": "Câu đầy đủ: She studies English every day."
    },
    {
      "type": "choice",
      "prompt": "\"brush → brushes\" có nghĩa là gì?",
      "options": [
        "bắt (xe)",
        "đánh (răng)",
        "sửa",
        "học"
      ],
      "answer": "đánh (răng)",
      "explanation": "brush → brushes = đánh (răng)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ her teeth twice a day.",
      "answers": [
        "brushes"
      ],
      "explanation": "Câu đầy đủ: She brushes her teeth twice a day."
    },
    {
      "type": "choice",
      "prompt": "\"catch → catches\" có nghĩa là gì?",
      "options": [
        "bắt (xe)",
        "bay",
        "đánh (răng)",
        "sửa"
      ],
      "answer": "bắt (xe)",
      "explanation": "catch → catches = bắt (xe)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ the bus every morning.",
      "answers": [
        "catches"
      ],
      "explanation": "Câu đầy đủ: He catches the bus every morning."
    },
    {
      "type": "choice",
      "prompt": "\"fix → fixes\" có nghĩa là gì?",
      "options": [
        "bay",
        "chơi",
        "xem",
        "sửa"
      ],
      "answer": "sửa",
      "explanation": "fix → fixes = sửa."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My brother ______ his bike on Sunday.",
      "answers": [
        "fixes"
      ],
      "explanation": "Câu đầy đủ: My brother fixes his bike on Sunday."
    },
    {
      "type": "choice",
      "prompt": "\"play → plays\" có nghĩa là gì?",
      "options": [
        "chơi",
        "đi",
        "bắt (xe)",
        "đánh (răng)"
      ],
      "answer": "chơi",
      "explanation": "play → plays = chơi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ tennis on Sunday.",
      "answers": [
        "plays"
      ],
      "explanation": "Câu đầy đủ: She plays tennis on Sunday."
    },
    {
      "type": "choice",
      "prompt": "\"fly → flies\" có nghĩa là gì?",
      "options": [
        "xem",
        "đi",
        "bắt (xe)",
        "bay"
      ],
      "answer": "bay",
      "explanation": "fly → flies = bay."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: A bird ______ in the sky.",
      "answers": [
        "flies"
      ],
      "explanation": "Câu đầy đủ: A bird flies in the sky."
    },
    {
      "type": "choice",
      "prompt": "She ______ her teeth twice a day.",
      "options": [
        "brush",
        "brushes",
        "brushing",
        "brushed"
      ],
      "answer": "brushes",
      "explanation": "She + brush thêm -es vì brush tận cùng bằng sh."
    },
    {
      "type": "choice",
      "prompt": "He ______ the bus every morning.",
      "options": [
        "catch",
        "catches",
        "catching",
        "catched"
      ],
      "answer": "catches",
      "explanation": "He + catch thêm -es vì catch tận cùng bằng ch."
    },
    {
      "type": "choice",
      "prompt": "My brother ______ his bike on Sunday.",
      "options": [
        "fix",
        "fixes",
        "fixing",
        "fixed"
      ],
      "answer": "fixes",
      "explanation": "My brother (như he) + fix thêm -es vì fix tận cùng bằng x."
    },
    {
      "type": "choice",
      "prompt": "They ______ to school on foot.",
      "options": [
        "go",
        "goes",
        "going",
        "went"
      ],
      "answer": "go",
      "explanation": "They + động từ nguyên thể, không thêm -s."
    },
    {
      "type": "choice",
      "prompt": "Dạng đúng của \"fly\" với she là gì?",
      "options": [
        "fly",
        "flys",
        "flies",
        "flying"
      ],
      "answer": "flies",
      "explanation": "Trước y là phụ âm l nên đổi y → ies: flies."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: A bird ______ (fly) in the sky.",
      "answers": [
        "flies"
      ],
      "explanation": "A bird (như it) + fly → flies."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: She ______ (study) maths every day.",
      "answers": [
        "studies"
      ],
      "explanation": "She + study → studies (y → ies)."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: My mother ______ (cook) dinner every evening.",
      "answers": [
        "cooks"
      ],
      "explanation": "My mother (như she) + cook thêm -s."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ your father work at school?",
      "answers": [
        "does"
      ],
      "explanation": "Câu hỏi với your father (như he) dùng Does, sau Does động từ giữ nguyên thể."
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: They ______ watch TV in the morning. (không xem)",
      "answers": [
        "do not",
        "don't",
        "dont"
      ],
      "explanation": "They + do not (don't) + watch nguyên thể."
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: He ______ speak French. (không nói)",
      "answers": [
        "does not",
        "doesn't",
        "doesnt"
      ],
      "explanation": "He + does not (doesn't) + speak nguyên thể."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: Anna ______ (listen) to music every day.",
      "answers": [
        "listens"
      ],
      "explanation": "Anna (như she) + listen thêm -s (không phải -es, vì listen không tận cùng bằng o/s/x/ch/sh)."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Cô ấy đánh răng hai lần mỗi ngày.\"",
      "answers": [
        "she brushes her teeth twice a day"
      ],
      "explanation": "She brushes her teeth twice a day. = Cô ấy đánh răng hai lần mỗi ngày."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Anh ấy không bắt xe buýt mỗi sáng.\"",
      "answers": [
        "he does not catch the bus every morning",
        "he doesn't catch the bus every morning"
      ],
      "explanation": "He does not catch the bus every morning. = Anh ấy không bắt xe buýt mỗi sáng."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Bố bạn có làm việc ở trường không?\"",
      "answers": [
        "does your father work at school"
      ],
      "explanation": "Does your father work at school? = Bố bạn có làm việc ở trường không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (play)",
      "options": [
        "played",
        "plays",
        "play",
        "playing"
      ],
      "answer": "plays",
      "explanation": "He + plays (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (play) every day.",
      "answers": [
        "plays"
      ],
      "explanation": "He plays every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (watch)",
      "options": [
        "watched",
        "watching",
        "watch",
        "watches"
      ],
      "answer": "watches",
      "explanation": "She + watches (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (watch) every day.",
      "answers": [
        "watches"
      ],
      "explanation": "She watches every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (study)",
      "options": [
        "studies",
        "study",
        "studying",
        "studied"
      ],
      "answer": "studies",
      "explanation": "Lan + studies (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (study) every day.",
      "answers": [
        "studies"
      ],
      "explanation": "Lan studies every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (brush)",
      "options": [
        "brushing",
        "brush",
        "brushed",
        "brushes"
      ],
      "answer": "brushes",
      "explanation": "He + brushes (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (brush) every day.",
      "answers": [
        "brushes"
      ],
      "explanation": "He brushes every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (catch)",
      "options": [
        "catched",
        "catches",
        "catching",
        "catch"
      ],
      "answer": "catches",
      "explanation": "She + catches (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (catch) every day.",
      "answers": [
        "catches"
      ],
      "explanation": "She catches every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (fix)",
      "options": [
        "fixes",
        "fix",
        "fixed",
        "fixing"
      ],
      "answer": "fixes",
      "explanation": "Lan + fixes (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (fix) every day.",
      "answers": [
        "fixes"
      ],
      "explanation": "Lan fixes every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (go)",
      "options": [
        "going",
        "go",
        "goes",
        "went"
      ],
      "answer": "goes",
      "explanation": "He + goes (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (go) every day.",
      "answers": [
        "goes"
      ],
      "explanation": "He goes every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (do)",
      "options": [
        "did",
        "do",
        "doing",
        "does"
      ],
      "answer": "does",
      "explanation": "She + does (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (do) every day.",
      "answers": [
        "does"
      ],
      "explanation": "She does every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (read)",
      "options": [
        "reading",
        "read",
        "reads",
        "readed"
      ],
      "answer": "reads",
      "explanation": "Lan + reads (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (read) every day.",
      "answers": [
        "reads"
      ],
      "explanation": "Lan reads every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (sing)",
      "options": [
        "singing",
        "singed",
        "sings",
        "sing"
      ],
      "answer": "sings",
      "explanation": "He + sings (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (sing) every day.",
      "answers": [
        "sings"
      ],
      "explanation": "He sings every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (dance)",
      "options": [
        "dance",
        "dancing",
        "dances",
        "danced"
      ],
      "answer": "dances",
      "explanation": "She + dances (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (dance) every day.",
      "answers": [
        "dances"
      ],
      "explanation": "She dances every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (cook)",
      "options": [
        "cooking",
        "cook",
        "cooked",
        "cooks"
      ],
      "answer": "cooks",
      "explanation": "Lan + cooks (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (cook) every day.",
      "answers": [
        "cooks"
      ],
      "explanation": "Lan cooks every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (run)",
      "options": [
        "running",
        "runned",
        "runs",
        "run"
      ],
      "answer": "runs",
      "explanation": "He + runs (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (run) every day.",
      "answers": [
        "runs"
      ],
      "explanation": "He runs every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (swim)",
      "options": [
        "swimmed",
        "swims",
        "swim",
        "swimming"
      ],
      "answer": "swims",
      "explanation": "She + swims (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (swim) every day.",
      "answers": [
        "swims"
      ],
      "explanation": "She swims every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (jump)",
      "options": [
        "jumps",
        "jump",
        "jumping",
        "jumped"
      ],
      "answer": "jumps",
      "explanation": "Lan + jumps (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (jump) every day.",
      "answers": [
        "jumps"
      ],
      "explanation": "Lan jumps every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (look)",
      "options": [
        "looks",
        "looking",
        "look",
        "looked"
      ],
      "answer": "looks",
      "explanation": "He + looks (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (look) every day.",
      "answers": [
        "looks"
      ],
      "explanation": "He looks every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (like)",
      "options": [
        "liking",
        "likes",
        "liked",
        "like"
      ],
      "answer": "likes",
      "explanation": "She + likes (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (like) every day.",
      "answers": [
        "likes"
      ],
      "explanation": "She likes every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (love)",
      "options": [
        "love",
        "loving",
        "loves",
        "loved"
      ],
      "answer": "loves",
      "explanation": "Lan + loves (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (love) every day.",
      "answers": [
        "loves"
      ],
      "explanation": "Lan loves every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (help)",
      "options": [
        "help",
        "helping",
        "helped",
        "helps"
      ],
      "answer": "helps",
      "explanation": "He + helps (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (help) every day.",
      "answers": [
        "helps"
      ],
      "explanation": "He helps every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (wash)",
      "options": [
        "washing",
        "washes",
        "wash",
        "washed"
      ],
      "answer": "washes",
      "explanation": "She + washes (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (wash) every day.",
      "answers": [
        "washes"
      ],
      "explanation": "She washes every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (try)",
      "options": [
        "trying",
        "try",
        "tried",
        "tries"
      ],
      "answer": "tries",
      "explanation": "Lan + tries (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (try) every day.",
      "answers": [
        "tries"
      ],
      "explanation": "Lan tries every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (carry)",
      "options": [
        "carries",
        "carry",
        "carried",
        "carrying"
      ],
      "answer": "carries",
      "explanation": "He + carries (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (carry) every day.",
      "answers": [
        "carries"
      ],
      "explanation": "He carries every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (fly)",
      "options": [
        "flies",
        "flying",
        "flied",
        "fly"
      ],
      "answer": "flies",
      "explanation": "She + flies (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (fly) every day.",
      "answers": [
        "flies"
      ],
      "explanation": "She flies every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (work)",
      "options": [
        "work",
        "works",
        "working",
        "worked"
      ],
      "answer": "works",
      "explanation": "Lan + works (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (work) every day.",
      "answers": [
        "works"
      ],
      "explanation": "Lan works every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ every day. (play)",
      "options": [
        "plays",
        "playing",
        "played",
        "play"
      ],
      "answer": "play",
      "explanation": "I + play (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: You ______ every day. (watch)",
      "options": [
        "watching",
        "watches",
        "watched",
        "watch"
      ],
      "answer": "watch",
      "explanation": "You + watch (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ every day. (study)",
      "options": [
        "study",
        "studied",
        "studying",
        "studies"
      ],
      "answer": "study",
      "explanation": "We + study (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ every day. (brush)",
      "options": [
        "brushed",
        "brush",
        "brushing",
        "brushes"
      ],
      "answer": "brush",
      "explanation": "They + brush (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ every day. (catch)",
      "options": [
        "catch",
        "catches",
        "catching",
        "catched"
      ],
      "answer": "catch",
      "explanation": "I + catch (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: You ______ every day. (fix)",
      "options": [
        "fixing",
        "fix",
        "fixed",
        "fixes"
      ],
      "answer": "fix",
      "explanation": "You + fix (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ every day. (go)",
      "options": [
        "going",
        "goes",
        "went",
        "go"
      ],
      "answer": "go",
      "explanation": "We + go (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ every day. (do)",
      "options": [
        "does",
        "did",
        "do",
        "doing"
      ],
      "answer": "do",
      "explanation": "They + do (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ every day. (read)",
      "options": [
        "reading",
        "readed",
        "read",
        "reads"
      ],
      "answer": "read",
      "explanation": "I + read (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: You ______ every day. (sing)",
      "options": [
        "singed",
        "sing",
        "singing",
        "sings"
      ],
      "answer": "sing",
      "explanation": "You + sing (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ every day. (dance)",
      "options": [
        "dances",
        "dance",
        "danced",
        "dancing"
      ],
      "answer": "dance",
      "explanation": "We + dance (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ every day. (cook)",
      "options": [
        "cook",
        "cooked",
        "cooking",
        "cooks"
      ],
      "answer": "cook",
      "explanation": "They + cook (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: She ______ like milk.",
      "options": [
        "don’t",
        "isn't",
        "doesn't",
        "won't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't like milk. = Cô ấy không thích sữa."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: They ______ like milk.",
      "options": [
        "don't",
        "doesn’t",
        "won't",
        "isn't"
      ],
      "answer": "don't",
      "explanation": "They don't like milk. = Họ không thích sữa."
    }
  ],
  "present-continuous": [
    {
      "type": "choice",
      "prompt": "\"read → reading\" có nghĩa là gì?",
      "options": [
        "đang đọc",
        "đang xem",
        "đang chơi",
        "đang làm"
      ],
      "answer": "đang đọc",
      "explanation": "read → reading = đang đọc."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She is ______ a book now.",
      "answers": [
        "reading"
      ],
      "explanation": "Câu đầy đủ: She is reading a book now."
    },
    {
      "type": "choice",
      "prompt": "\"run → running\" có nghĩa là gì?",
      "options": [
        "đang viết",
        "đang chạy",
        "đang chơi",
        "đang bơi"
      ],
      "answer": "đang chạy",
      "explanation": "run → running = đang chạy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: Look! Lan is ______.",
      "answers": [
        "running"
      ],
      "explanation": "Câu đầy đủ: Look! Lan is running."
    },
    {
      "type": "choice",
      "prompt": "\"make → making\" có nghĩa là gì?",
      "options": [
        "đang xem",
        "đang ngủ",
        "đang chơi",
        "đang làm"
      ],
      "answer": "đang làm",
      "explanation": "make → making = đang làm."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He is ______ a cake now.",
      "answers": [
        "making"
      ],
      "explanation": "Câu đầy đủ: He is making a cake now."
    },
    {
      "type": "choice",
      "prompt": "\"swim → swimming\" có nghĩa là gì?",
      "options": [
        "đang bơi",
        "đang làm",
        "đang chơi",
        "đang xem"
      ],
      "answer": "đang bơi",
      "explanation": "swim → swimming = đang bơi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: We are ______ in the pool now.",
      "answers": [
        "swimming"
      ],
      "explanation": "Câu đầy đủ: We are swimming in the pool now."
    },
    {
      "type": "choice",
      "prompt": "\"write → writing\" có nghĩa là gì?",
      "options": [
        "đang viết",
        "đang chạy",
        "đang đọc",
        "đang bơi"
      ],
      "answer": "đang viết",
      "explanation": "write → writing = đang viết."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My father is ______ a letter.",
      "answers": [
        "writing"
      ],
      "explanation": "Câu đầy đủ: My father is writing a letter."
    },
    {
      "type": "choice",
      "prompt": "\"play → playing\" có nghĩa là gì?",
      "options": [
        "đang chơi",
        "đang viết",
        "đang bơi",
        "đang xem"
      ],
      "answer": "đang chơi",
      "explanation": "play → playing = đang chơi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: They are ______ football now.",
      "answers": [
        "playing"
      ],
      "explanation": "Câu đầy đủ: They are playing football now."
    },
    {
      "type": "choice",
      "prompt": "\"watch → watching\" có nghĩa là gì?",
      "options": [
        "đang ngủ",
        "đang xem",
        "đang làm",
        "đang bơi"
      ],
      "answer": "đang xem",
      "explanation": "watch → watching = đang xem."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She is ______ TV now.",
      "answers": [
        "watching"
      ],
      "explanation": "Câu đầy đủ: She is watching TV now."
    },
    {
      "type": "choice",
      "prompt": "\"sleep → sleeping\" có nghĩa là gì?",
      "options": [
        "đang ngủ",
        "đang xem",
        "đang chơi",
        "đang chạy"
      ],
      "answer": "đang ngủ",
      "explanation": "sleep → sleeping = đang ngủ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The baby is ______ now.",
      "answers": [
        "sleeping"
      ],
      "explanation": "Câu đầy đủ: The baby is sleeping now."
    },
    {
      "type": "choice",
      "prompt": "Look! Lan ______ very fast.",
      "options": [
        "is run",
        "is running",
        "are running",
        "runs"
      ],
      "answer": "is running",
      "explanation": "Look! → đang diễn ra, Lan (như she) + is running."
    },
    {
      "type": "choice",
      "prompt": "They ______ football now.",
      "options": [
        "are play",
        "is playing",
        "are playing",
        "play"
      ],
      "answer": "are playing",
      "explanation": "Now → tiếp diễn, they + are playing."
    },
    {
      "type": "choice",
      "prompt": "I ______ my homework at the moment.",
      "options": [
        "am do",
        "am doing",
        "is doing",
        "do"
      ],
      "answer": "am doing",
      "explanation": "At the moment → tiếp diễn, I + am doing."
    },
    {
      "type": "choice",
      "prompt": "Dạng V-ing đúng của \"run\" là gì?",
      "options": [
        "runing",
        "running",
        "runed",
        "runs"
      ],
      "answer": "running",
      "explanation": "Run gấp đôi n rồi thêm -ing: running."
    },
    {
      "type": "choice",
      "prompt": "Dạng V-ing đúng của \"make\" là gì?",
      "options": [
        "makeing",
        "making",
        "maked",
        "makes"
      ],
      "answer": "making",
      "explanation": "Make bỏ e cuối rồi thêm -ing: making."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: He ______ (make) a cake now.",
      "answers": [
        "is making"
      ],
      "explanation": "He + is making (make → making)."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: We ______ (swim) in the pool now.",
      "answers": [
        "are swimming"
      ],
      "explanation": "We + are swimming (swim → swimming)."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: My father ______ (write) a letter now.",
      "answers": [
        "is writing"
      ],
      "explanation": "My father + is writing (write → writing)."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you listening to me?",
      "answers": [
        "are"
      ],
      "explanation": "Câu hỏi tiếp diễn với you dùng Are you…?"
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: They ______ playing chess now. (không chơi)",
      "answers": [
        "are not",
        "aren't",
        "arent"
      ],
      "explanation": "They + are not (aren't) + playing."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: It ______ (rain) now.",
      "answers": [
        "is raining"
      ],
      "explanation": "It + is raining."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: Listen! Someone ______ (cry).",
      "answers": [
        "is crying"
      ],
      "explanation": "Listen! → đang diễn ra, someone (như he/she) + is crying."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Họ đang chơi bóng đá bây giờ.\"",
      "answers": [
        "they are playing football now"
      ],
      "explanation": "They are playing football now. = Họ đang chơi bóng đá bây giờ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Cô ấy không đang ngủ.\"",
      "answers": [
        "she is not sleeping",
        "she isn't sleeping"
      ],
      "explanation": "She is not sleeping. = Cô ấy không đang ngủ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Bạn đang làm gì vậy?\"",
      "answers": [
        "what are you doing"
      ],
      "explanation": "What are you doing? = Bạn đang làm gì vậy?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ a book now. (read)",
      "options": [
        "is read",
        "is reading",
        "am reading",
        "read"
      ],
      "answer": "is reading",
      "explanation": "She is reading a book now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (read) a book now.",
      "answers": [
        "is reading"
      ],
      "explanation": "She is reading a book now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ in the park now. (run)",
      "options": [
        "is run",
        "run",
        "am running",
        "is running"
      ],
      "answer": "is running",
      "explanation": "He is running in the park now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (run) in the park now.",
      "answers": [
        "is running"
      ],
      "explanation": "He is running in the park now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ in the pool now. (swim)",
      "options": [
        "swim",
        "is swimming",
        "is swim",
        "am swimming"
      ],
      "answer": "is swimming",
      "explanation": "Lan is swimming in the pool now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (swim) in the pool now.",
      "answers": [
        "is swimming"
      ],
      "explanation": "Lan is swimming in the pool now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ football now. (play)",
      "options": [
        "am playing",
        "play",
        "is playing",
        "am play"
      ],
      "answer": "am playing",
      "explanation": "I am playing football now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: I ______ (play) football now.",
      "answers": [
        "am playing"
      ],
      "explanation": "I am playing football now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ a song now. (sing)",
      "options": [
        "am singing",
        "sing",
        "are singing",
        "are sing"
      ],
      "answer": "are singing",
      "explanation": "We are singing a song now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ (sing) a song now.",
      "answers": [
        "are singing"
      ],
      "explanation": "We are singing a song now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ at the party now. (dance)",
      "options": [
        "are dancing",
        "are dance",
        "dance",
        "am dancing"
      ],
      "answer": "are dancing",
      "explanation": "They are dancing at the party now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: They ______ (dance) at the party now.",
      "answers": [
        "are dancing"
      ],
      "explanation": "They are dancing at the party now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ dinner now. (cook)",
      "options": [
        "am cooking",
        "is cooking",
        "cook",
        "is cook"
      ],
      "answer": "is cooking",
      "explanation": "She is cooking dinner now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (cook) dinner now.",
      "answers": [
        "is cooking"
      ],
      "explanation": "She is cooking dinner now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ TV now. (watch)",
      "options": [
        "watch",
        "is watch",
        "is watching",
        "am watching"
      ],
      "answer": "is watching",
      "explanation": "He is watching TV now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (watch) TV now.",
      "answers": [
        "is watching"
      ],
      "explanation": "He is watching TV now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ English now. (study)",
      "options": [
        "is study",
        "am studying",
        "is studying",
        "study"
      ],
      "answer": "is studying",
      "explanation": "Lan is studying English now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (study) English now.",
      "answers": [
        "is studying"
      ],
      "explanation": "Lan is studying English now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ a letter now. (write)",
      "options": [
        "write",
        "am write",
        "am writing",
        "is writing"
      ],
      "answer": "am writing",
      "explanation": "I am writing a letter now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: I ______ (write) a letter now.",
      "answers": [
        "am writing"
      ],
      "explanation": "I am writing a letter now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ a cake now. (make)",
      "options": [
        "are making",
        "are make",
        "am making",
        "make"
      ],
      "answer": "are making",
      "explanation": "We are making a cake now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ (make) a cake now.",
      "answers": [
        "are making"
      ],
      "explanation": "We are making a cake now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ a bike now. (ride)",
      "options": [
        "are ride",
        "are riding",
        "am riding",
        "ride"
      ],
      "answer": "are riding",
      "explanation": "They are riding a bike now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: They ______ (ride) a bike now.",
      "answers": [
        "are riding"
      ],
      "explanation": "They are riding a bike now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ very high now. (jump)",
      "options": [
        "am jumping",
        "is jump",
        "is jumping",
        "jump"
      ],
      "answer": "is jumping",
      "explanation": "She is jumping very high now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (jump) very high now.",
      "answers": [
        "is jumping"
      ],
      "explanation": "She is jumping very high now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ at the picture now. (look)",
      "options": [
        "is looking",
        "am looking",
        "is look",
        "look"
      ],
      "answer": "is looking",
      "explanation": "He is looking at the picture now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (look) at the picture now.",
      "answers": [
        "is looking"
      ],
      "explanation": "He is looking at the picture now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ to music now. (listen)",
      "options": [
        "listen",
        "is listening",
        "is listen",
        "am listening"
      ],
      "answer": "is listening",
      "explanation": "Lan is listening to music now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (listen) to music now.",
      "answers": [
        "is listening"
      ],
      "explanation": "Lan is listening to music now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ in bed now. (sleep)",
      "options": [
        "is sleeping",
        "am sleeping",
        "sleep",
        "am sleep"
      ],
      "answer": "am sleeping",
      "explanation": "I am sleeping in bed now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: I ______ (sleep) in bed now.",
      "answers": [
        "am sleeping"
      ],
      "explanation": "I am sleeping in bed now."
    }
  ],
  "past-regular": [
    {
      "type": "choice",
      "prompt": "\"work → worked\" có nghĩa là gì?",
      "options": [
        "đã chơi",
        "đã làm việc",
        "đã thăm",
        "đã dừng"
      ],
      "answer": "đã làm việc",
      "explanation": "work → worked = đã làm việc."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ yesterday.",
      "answers": [
        "worked"
      ],
      "explanation": "Câu đầy đủ: He worked yesterday."
    },
    {
      "type": "choice",
      "prompt": "\"live → lived\" có nghĩa là gì?",
      "options": [
        "đã xem",
        "đã thăm",
        "đã sống",
        "đã dừng"
      ],
      "answer": "đã sống",
      "explanation": "live → lived = đã sống."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ in Hanoi in 2020.",
      "answers": [
        "lived"
      ],
      "explanation": "Câu đầy đủ: He lived in Hanoi in 2020."
    },
    {
      "type": "choice",
      "prompt": "\"study → studied\" có nghĩa là gì?",
      "options": [
        "đã học",
        "đã chơi",
        "đã dừng",
        "đã sống"
      ],
      "answer": "đã học",
      "explanation": "study → studied = đã học."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ English last night.",
      "answers": [
        "studied"
      ],
      "explanation": "Câu đầy đủ: She studied English last night."
    },
    {
      "type": "choice",
      "prompt": "\"stop → stopped\" có nghĩa là gì?",
      "options": [
        "đã dừng",
        "đã sống",
        "đã thăm",
        "đã học"
      ],
      "answer": "đã dừng",
      "explanation": "stop → stopped = đã dừng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The bus ______ at the station.",
      "answers": [
        "stopped"
      ],
      "explanation": "Câu đầy đủ: The bus stopped at the station."
    },
    {
      "type": "choice",
      "prompt": "\"plan → planned\" có nghĩa là gì?",
      "options": [
        "đã làm việc",
        "đã lên kế hoạch",
        "đã dừng",
        "đã thăm"
      ],
      "answer": "đã lên kế hoạch",
      "explanation": "plan → planned = đã lên kế hoạch."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: They ______ a trip last month.",
      "answers": [
        "planned"
      ],
      "explanation": "Câu đầy đủ: They planned a trip last month."
    },
    {
      "type": "choice",
      "prompt": "\"play → played\" có nghĩa là gì?",
      "options": [
        "đã xem",
        "đã thăm",
        "đã chơi",
        "đã học"
      ],
      "answer": "đã chơi",
      "explanation": "play → played = đã chơi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: We ______ football yesterday.",
      "answers": [
        "played"
      ],
      "explanation": "Câu đầy đủ: We played football yesterday."
    },
    {
      "type": "choice",
      "prompt": "\"watch → watched\" có nghĩa là gì?",
      "options": [
        "đã sống",
        "đã chơi",
        "đã xem",
        "đã thăm"
      ],
      "answer": "đã xem",
      "explanation": "watch → watched = đã xem."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ a film last night.",
      "answers": [
        "watched"
      ],
      "explanation": "Câu đầy đủ: I watched a film last night."
    },
    {
      "type": "choice",
      "prompt": "\"visit → visited\" có nghĩa là gì?",
      "options": [
        "đã thăm",
        "đã dừng",
        "đã sống",
        "đã xem"
      ],
      "answer": "đã thăm",
      "explanation": "visit → visited = đã thăm."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: They ______ their grandparents last Sunday.",
      "answers": [
        "visited"
      ],
      "explanation": "Câu đầy đủ: They visited their grandparents last Sunday."
    },
    {
      "type": "choice",
      "prompt": "She ______ English last night.",
      "options": [
        "study",
        "studied",
        "studying",
        "studies"
      ],
      "answer": "studied",
      "explanation": "Last night → quá khứ, study → studied (y → ied)."
    },
    {
      "type": "choice",
      "prompt": "They ______ their grandparents last Sunday.",
      "options": [
        "visit",
        "visited",
        "visiting",
        "visits"
      ],
      "answer": "visited",
      "explanation": "Last Sunday → quá khứ, visit → visited."
    },
    {
      "type": "choice",
      "prompt": "The bus ______ at the station yesterday.",
      "options": [
        "stop",
        "stopped",
        "stopping",
        "stops"
      ],
      "answer": "stopped",
      "explanation": "Yesterday → quá khứ, stop gấp đôi p rồi thêm -ed: stopped."
    },
    {
      "type": "choice",
      "prompt": "We ______ football yesterday afternoon.",
      "options": [
        "play",
        "played",
        "playing",
        "plays"
      ],
      "answer": "played",
      "explanation": "Yesterday → quá khứ, play → played (trước y là nguyên âm a nên giữ y)."
    },
    {
      "type": "choice",
      "prompt": "Dạng quá khứ của \"live\" là gì?",
      "options": [
        "lived",
        "liveed",
        "livied",
        "lives"
      ],
      "answer": "lived",
      "explanation": "Live tận cùng bằng e nên chỉ thêm -d: lived."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: I ______ (watch) a film last night.",
      "answers": [
        "watched"
      ],
      "explanation": "Last night → quá khứ, watch → watched."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: My mother ______ (cook) rice yesterday.",
      "answers": [
        "cooked"
      ],
      "explanation": "Yesterday → quá khứ, cook → cooked."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: He ______ (live) in Hanoi in 2020.",
      "answers": [
        "lived"
      ],
      "explanation": "In 2020 → quá khứ, live → lived."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: They ______ (plan) a trip last month.",
      "answers": [
        "planned"
      ],
      "explanation": "Last month → quá khứ, plan → planned (gấp đôi n)."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you visit Hue last year?",
      "answers": [
        "did"
      ],
      "explanation": "Câu hỏi quá khứ dùng Did, sau Did động từ giữ nguyên thể: visit."
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: She ______ go to school yesterday. (không đi — chú ý: sau did thì động từ giữ nguyên thể)",
      "answers": [
        "did not",
        "didn't",
        "didnt"
      ],
      "explanation": "She didn't go (không phải didn't went) — sau didn't, go giữ nguyên thể."
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: He ______ play tennis last week. (không chơi)",
      "answers": [
        "did not",
        "didn't",
        "didnt"
      ],
      "explanation": "He didn't play — sau didn't, play giữ nguyên thể."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi đã xem phim tối qua.\"",
      "answers": [
        "i watched a film last night"
      ],
      "explanation": "I watched a film last night. = Tôi đã xem phim tối qua."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Họ đã thăm ông bà chủ nhật tuần trước.\"",
      "answers": [
        "they visited their grandparents last sunday"
      ],
      "explanation": "They visited their grandparents last Sunday. = Họ đã thăm ông bà chủ nhật tuần trước."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Bạn có học tiếng Anh hôm qua không?\"",
      "answers": [
        "did you study english yesterday"
      ],
      "explanation": "Did you study English yesterday? = Bạn có học tiếng Anh hôm qua không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"work\":",
      "options": [
        "works",
        "worked",
        "work",
        "working"
      ],
      "answer": "worked",
      "explanation": "work → worked (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ at home. (work)",
      "options": [
        "works",
        "work",
        "worked",
        "working"
      ],
      "answer": "worked",
      "explanation": "Yesterday, she worked at home."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ at home. (work)",
      "answers": [
        "worked"
      ],
      "explanation": "Yesterday, I worked at home."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"watch\":",
      "options": [
        "watched",
        "watch",
        "watching",
        "watches"
      ],
      "answer": "watched",
      "explanation": "watch → watched (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ TV. (watch)",
      "options": [
        "watched",
        "watch",
        "watching",
        "watches"
      ],
      "answer": "watched",
      "explanation": "Yesterday, she watched TV."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ TV. (watch)",
      "answers": [
        "watched"
      ],
      "explanation": "Yesterday, I watched TV."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"visit\":",
      "options": [
        "visited",
        "visits",
        "visiting",
        "visit"
      ],
      "answer": "visited",
      "explanation": "visit → visited (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ her grandmother. (visit)",
      "options": [
        "visited",
        "visiting",
        "visit",
        "visits"
      ],
      "answer": "visited",
      "explanation": "Yesterday, she visited her grandmother."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ her grandmother. (visit)",
      "answers": [
        "visited"
      ],
      "explanation": "Yesterday, I visited her grandmother."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"live\":",
      "options": [
        "lived",
        "lives",
        "live",
        "living"
      ],
      "answer": "lived",
      "explanation": "live → lived (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"study\":",
      "options": [
        "studied",
        "study",
        "studying",
        "studies"
      ],
      "answer": "studied",
      "explanation": "study → studied (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ English. (study)",
      "options": [
        "study",
        "studying",
        "studied",
        "studies"
      ],
      "answer": "studied",
      "explanation": "Yesterday, she studied English."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ English. (study)",
      "answers": [
        "studied"
      ],
      "explanation": "Yesterday, I studied English."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"play\":",
      "options": [
        "play",
        "playing",
        "plays",
        "played"
      ],
      "answer": "played",
      "explanation": "play → played (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ football. (play)",
      "options": [
        "playing",
        "play",
        "played",
        "plays"
      ],
      "answer": "played",
      "explanation": "Yesterday, she played football."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ football. (play)",
      "answers": [
        "played"
      ],
      "explanation": "Yesterday, I played football."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"stop\":",
      "options": [
        "stops",
        "stopping",
        "stopped",
        "stop"
      ],
      "answer": "stopped",
      "explanation": "stop → stopped (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ at the shop. (stop)",
      "options": [
        "stop",
        "stopped",
        "stopping",
        "stops"
      ],
      "answer": "stopped",
      "explanation": "Yesterday, she stopped at the shop."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ at the shop. (stop)",
      "answers": [
        "stopped"
      ],
      "explanation": "Yesterday, I stopped at the shop."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"plan\":",
      "options": [
        "plan",
        "planning",
        "planned",
        "plans"
      ],
      "answer": "planned",
      "explanation": "plan → planned (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ a trip. (plan)",
      "options": [
        "planning",
        "plan",
        "plans",
        "planned"
      ],
      "answer": "planned",
      "explanation": "Yesterday, she planned a trip."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ a trip. (plan)",
      "answers": [
        "planned"
      ],
      "explanation": "Yesterday, I planned a trip."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"look\":",
      "options": [
        "looked",
        "looking",
        "look",
        "looks"
      ],
      "answer": "looked",
      "explanation": "look → looked (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ at the picture. (look)",
      "options": [
        "looked",
        "looking",
        "looks",
        "look"
      ],
      "answer": "looked",
      "explanation": "Yesterday, she looked at the picture."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ at the picture. (look)",
      "answers": [
        "looked"
      ],
      "explanation": "Yesterday, I looked at the picture."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"cook\":",
      "options": [
        "cook",
        "cooks",
        "cooking",
        "cooked"
      ],
      "answer": "cooked",
      "explanation": "cook → cooked (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ dinner. (cook)",
      "options": [
        "cooking",
        "cooks",
        "cook",
        "cooked"
      ],
      "answer": "cooked",
      "explanation": "Yesterday, she cooked dinner."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ dinner. (cook)",
      "answers": [
        "cooked"
      ],
      "explanation": "Yesterday, I cooked dinner."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"clean\":",
      "options": [
        "cleaned",
        "cleans",
        "clean",
        "cleaning"
      ],
      "answer": "cleaned",
      "explanation": "clean → cleaned (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ the room. (clean)",
      "options": [
        "cleaning",
        "cleans",
        "clean",
        "cleaned"
      ],
      "answer": "cleaned",
      "explanation": "Yesterday, she cleaned the room."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ the room. (clean)",
      "answers": [
        "cleaned"
      ],
      "explanation": "Yesterday, I cleaned the room."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"wash\":",
      "options": [
        "washed",
        "wash",
        "washes",
        "washing"
      ],
      "answer": "washed",
      "explanation": "wash → washed (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ her hands. (wash)",
      "options": [
        "washed",
        "washing",
        "washes",
        "wash"
      ],
      "answer": "washed",
      "explanation": "Yesterday, she washed her hands."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ her hands. (wash)",
      "answers": [
        "washed"
      ],
      "explanation": "Yesterday, I washed her hands."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"help\":",
      "options": [
        "help",
        "helps",
        "helping",
        "helped"
      ],
      "answer": "helped",
      "explanation": "help → helped (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ her mother. (help)",
      "options": [
        "helped",
        "helps",
        "helping",
        "help"
      ],
      "answer": "helped",
      "explanation": "Yesterday, she helped her mother."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ her mother. (help)",
      "answers": [
        "helped"
      ],
      "explanation": "Yesterday, I helped her mother."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"dance\":",
      "options": [
        "dances",
        "dance",
        "dancing",
        "danced"
      ],
      "answer": "danced",
      "explanation": "dance → danced (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ at the party. (dance)",
      "options": [
        "dances",
        "dance",
        "danced",
        "dancing"
      ],
      "answer": "danced",
      "explanation": "Yesterday, she danced at the party."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ at the party. (dance)",
      "answers": [
        "danced"
      ],
      "explanation": "Yesterday, I danced at the party."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"move\":",
      "options": [
        "moving",
        "moves",
        "move",
        "moved"
      ],
      "answer": "moved",
      "explanation": "move → moved (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ the chair. (move)",
      "options": [
        "move",
        "moves",
        "moving",
        "moved"
      ],
      "answer": "moved",
      "explanation": "Yesterday, she moved the chair."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ the chair. (move)",
      "answers": [
        "moved"
      ],
      "explanation": "Yesterday, I moved the chair."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"like\":",
      "options": [
        "liked",
        "liking",
        "likes",
        "like"
      ],
      "answer": "liked",
      "explanation": "like → liked (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ ice cream. (like)",
      "options": [
        "liking",
        "like",
        "liked",
        "likes"
      ],
      "answer": "liked",
      "explanation": "Yesterday, she liked ice cream."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ ice cream. (like)",
      "answers": [
        "liked"
      ],
      "explanation": "Yesterday, I liked ice cream."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"love\":",
      "options": [
        "loving",
        "love",
        "loved",
        "loves"
      ],
      "answer": "loved",
      "explanation": "love → loved (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ music. (love)",
      "options": [
        "loved",
        "loving",
        "loves",
        "love"
      ],
      "answer": "loved",
      "explanation": "Yesterday, she loved music."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ music. (love)",
      "answers": [
        "loved"
      ],
      "explanation": "Yesterday, I loved music."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"jump\":",
      "options": [
        "jumps",
        "jumping",
        "jumped",
        "jump"
      ],
      "answer": "jumped",
      "explanation": "jump → jumped (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ very high. (jump)",
      "options": [
        "jumps",
        "jumped",
        "jumping",
        "jump"
      ],
      "answer": "jumped",
      "explanation": "Yesterday, she jumped very high."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ very high. (jump)",
      "answers": [
        "jumped"
      ],
      "explanation": "Yesterday, I jumped very high."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: She ______ visit her grandmother yesterday.",
      "options": [
        "wasn't",
        "didn't",
        "doesn’t",
        "don't"
      ],
      "answer": "didn't",
      "explanation": "She didn't visit her grandmother yesterday. = Hôm qua cô ấy đã không thăm bà."
    }
  ],
  "past-irregular": [
    {
      "type": "choice",
      "prompt": "\"go → went\" có nghĩa là gì?",
      "options": [
        "đã đi",
        "đã uống",
        "đã lấy/chụp",
        "đã thấy"
      ],
      "answer": "đã đi",
      "explanation": "go → went = đã đi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: They ______ to Da Nang last summer.",
      "answers": [
        "went"
      ],
      "explanation": "Câu đầy đủ: They went to Da Nang last summer."
    },
    {
      "type": "choice",
      "prompt": "\"see → saw\" có nghĩa là gì?",
      "options": [
        "đã đi",
        "đã lấy/chụp",
        "đã thấy",
        "đã tìm thấy"
      ],
      "answer": "đã thấy",
      "explanation": "see → saw = đã thấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ a good film yesterday.",
      "answers": [
        "saw"
      ],
      "explanation": "Câu đầy đủ: I saw a good film yesterday."
    },
    {
      "type": "choice",
      "prompt": "\"buy → bought\" có nghĩa là gì?",
      "options": [
        "đã lấy/chụp",
        "đã đi",
        "đã mua",
        "đã ăn"
      ],
      "answer": "đã mua",
      "explanation": "buy → bought = đã mua."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ a new book last week.",
      "answers": [
        "bought"
      ],
      "explanation": "Câu đầy đủ: She bought a new book last week."
    },
    {
      "type": "choice",
      "prompt": "\"eat → ate\" có nghĩa là gì?",
      "options": [
        "đã thấy",
        "đã mua",
        "đã ăn",
        "đã đi"
      ],
      "answer": "đã ăn",
      "explanation": "eat → ate = đã ăn."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ an apple for lunch.",
      "answers": [
        "ate"
      ],
      "explanation": "Câu đầy đủ: He ate an apple for lunch."
    },
    {
      "type": "choice",
      "prompt": "\"drink → drank\" có nghĩa là gì?",
      "options": [
        "đã tìm thấy",
        "đã mua",
        "đã uống",
        "đã ăn"
      ],
      "answer": "đã uống",
      "explanation": "drink → drank = đã uống."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ milk yesterday.",
      "answers": [
        "drank"
      ],
      "explanation": "Câu đầy đủ: He drank milk yesterday."
    },
    {
      "type": "choice",
      "prompt": "\"take → took\" có nghĩa là gì?",
      "options": [
        "đã lấy/chụp",
        "đã cho/tặng",
        "đã tìm thấy",
        "đã thấy"
      ],
      "answer": "đã lấy/chụp",
      "explanation": "take → took = đã lấy/chụp."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: We ______ photos yesterday.",
      "answers": [
        "took"
      ],
      "explanation": "Câu đầy đủ: We took photos yesterday."
    },
    {
      "type": "choice",
      "prompt": "\"give → gave\" có nghĩa là gì?",
      "options": [
        "đã đi",
        "đã tìm thấy",
        "đã cho/tặng",
        "đã ăn"
      ],
      "answer": "đã cho/tặng",
      "explanation": "give → gave = đã cho/tặng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My father ______ me a pen.",
      "answers": [
        "gave"
      ],
      "explanation": "Câu đầy đủ: My father gave me a pen."
    },
    {
      "type": "choice",
      "prompt": "\"find → found\" có nghĩa là gì?",
      "options": [
        "đã tìm thấy",
        "đã mua",
        "đã thấy",
        "đã uống"
      ],
      "answer": "đã tìm thấy",
      "explanation": "find → found = đã tìm thấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ her key.",
      "answers": [
        "found"
      ],
      "explanation": "Câu đầy đủ: She found her key."
    },
    {
      "type": "choice",
      "prompt": "I ______ a good film yesterday.",
      "options": [
        "see",
        "saw",
        "seen",
        "sees"
      ],
      "answer": "saw",
      "explanation": "Yesterday → quá khứ, see → saw."
    },
    {
      "type": "choice",
      "prompt": "She ______ a new book last week.",
      "options": [
        "buy",
        "buys",
        "bought",
        "buyed"
      ],
      "answer": "bought",
      "explanation": "Last week → quá khứ, buy → bought (không có buyed)."
    },
    {
      "type": "choice",
      "prompt": "They ______ to Da Nang last summer.",
      "options": [
        "go",
        "goes",
        "went",
        "gone"
      ],
      "answer": "went",
      "explanation": "Last summer → quá khứ đơn, go → went (gone là V3, không dùng ở đây)."
    },
    {
      "type": "choice",
      "prompt": "He ______ an apple for lunch.",
      "options": [
        "eat",
        "eats",
        "ate",
        "eaten"
      ],
      "answer": "ate",
      "explanation": "Quá khứ đơn, eat → ate."
    },
    {
      "type": "choice",
      "prompt": "Dạng quá khứ của \"take\" là gì?",
      "options": [
        "taked",
        "took",
        "taken",
        "takes"
      ],
      "answer": "took",
      "explanation": "Take → took (V2), taken là V3."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: We ______ (take) photos yesterday.",
      "answers": [
        "took"
      ],
      "explanation": "Yesterday → quá khứ, take → took."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: My father ______ (give) me a pen last week.",
      "answers": [
        "gave"
      ],
      "explanation": "Last week → quá khứ, give → gave."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: She ______ (find) her key yesterday.",
      "answers": [
        "found"
      ],
      "explanation": "Yesterday → quá khứ, find → found."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: He ______ (drink) milk yesterday morning.",
      "answers": [
        "drank"
      ],
      "explanation": "Yesterday → quá khứ, drink → drank."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm phủ định: I ______ to school yesterday. (không đi — dùng dạng gốc sau did)",
      "answers": [
        "didn't go",
        "did not go"
      ],
      "explanation": "I didn't go — sau didn't phải dùng go (V1), không dùng went."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm phủ định: They ______ the film. (không xem)",
      "answers": [
        "didn't see",
        "did not see"
      ],
      "explanation": "They didn't see — sau didn't phải dùng see (V1), không dùng saw."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she buy a book last week?",
      "answers": [
        "did"
      ],
      "explanation": "Câu hỏi quá khứ dùng Did, sau Did động từ giữ nguyên thể: buy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi đã thấy Lan hôm qua.\"",
      "answers": [
        "i saw lan yesterday"
      ],
      "explanation": "I saw Lan yesterday. = Tôi đã thấy Lan hôm qua."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Anh ấy đã không đi học hôm qua.\"",
      "answers": [
        "he did not go to school yesterday",
        "he didn't go to school yesterday"
      ],
      "explanation": "He did not go to school yesterday. = Anh ấy đã không đi học hôm qua."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Bạn đã ăn gì tối qua?\"",
      "answers": [
        "what did you eat last night"
      ],
      "explanation": "What did you eat last night? = Bạn đã ăn gì tối qua?"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"be\" là gì?",
      "options": [
        "was / were",
        "heard",
        "chose",
        "read"
      ],
      "answer": "was / were",
      "explanation": "be → was / were (là, thì, ở)."
    },
    {
      "type": "choice",
      "prompt": "\"was / were\" là quá khứ của động từ nào?",
      "options": [
        "sing",
        "win",
        "see",
        "be"
      ],
      "answer": "be",
      "explanation": "be → was / were (là, thì, ở)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (be).",
      "answers": [
        "was",
        "were"
      ],
      "explanation": "Yesterday, she was (be)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"become\" là gì?",
      "options": [
        "fell",
        "swam",
        "won",
        "became"
      ],
      "answer": "became",
      "explanation": "become → became (trở nên)."
    },
    {
      "type": "choice",
      "prompt": "\"became\" là quá khứ của động từ nào?",
      "options": [
        "run",
        "write",
        "begin",
        "become"
      ],
      "answer": "become",
      "explanation": "become → became (trở nên)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (become).",
      "answers": [
        "became"
      ],
      "explanation": "Yesterday, she became (become)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"begin\" là gì?",
      "options": [
        "understood",
        "became",
        "broke",
        "began"
      ],
      "answer": "began",
      "explanation": "begin → began (bắt đầu)."
    },
    {
      "type": "choice",
      "prompt": "\"began\" là quá khứ của động từ nào?",
      "options": [
        "ride",
        "sell",
        "begin",
        "know"
      ],
      "answer": "begin",
      "explanation": "begin → began (bắt đầu)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (begin).",
      "answers": [
        "began"
      ],
      "explanation": "Yesterday, she began (begin)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"break\" là gì?",
      "options": [
        "drank",
        "ran",
        "broke",
        "thought"
      ],
      "answer": "broke",
      "explanation": "break → broke (làm vỡ)."
    },
    {
      "type": "choice",
      "prompt": "\"broke\" là quá khứ của động từ nào?",
      "options": [
        "sing",
        "go",
        "break",
        "leave"
      ],
      "answer": "break",
      "explanation": "break → broke (làm vỡ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (break).",
      "answers": [
        "broke"
      ],
      "explanation": "Yesterday, she broke (break)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"bring\" là gì?",
      "options": [
        "rode",
        "sold",
        "drove",
        "brought"
      ],
      "answer": "brought",
      "explanation": "bring → brought (mang đến)."
    },
    {
      "type": "choice",
      "prompt": "\"brought\" là quá khứ của động từ nào?",
      "options": [
        "bring",
        "hear",
        "pay",
        "be"
      ],
      "answer": "bring",
      "explanation": "bring → brought (mang đến)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (bring).",
      "answers": [
        "brought"
      ],
      "explanation": "Yesterday, she brought (bring)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"buy\" là gì?",
      "options": [
        "brought",
        "knew",
        "said",
        "bought"
      ],
      "answer": "bought",
      "explanation": "buy → bought (mua)."
    },
    {
      "type": "choice",
      "prompt": "\"bought\" là quá khứ của động từ nào?",
      "options": [
        "buy",
        "know",
        "give",
        "win"
      ],
      "answer": "buy",
      "explanation": "buy → bought (mua)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (buy).",
      "answers": [
        "bought"
      ],
      "explanation": "Yesterday, she bought (buy)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"catch\" là gì?",
      "options": [
        "saw",
        "caught",
        "told",
        "chose"
      ],
      "answer": "caught",
      "explanation": "catch → caught (bắt, đón)."
    },
    {
      "type": "choice",
      "prompt": "\"caught\" là quá khứ của động từ nào?",
      "options": [
        "speak",
        "catch",
        "do",
        "teach"
      ],
      "answer": "catch",
      "explanation": "catch → caught (bắt, đón)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (catch).",
      "answers": [
        "caught"
      ],
      "explanation": "Yesterday, she caught (catch)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"choose\" là gì?",
      "options": [
        "chose",
        "told",
        "went",
        "won"
      ],
      "answer": "chose",
      "explanation": "choose → chose (chọn)."
    },
    {
      "type": "choice",
      "prompt": "\"chose\" là quá khứ của động từ nào?",
      "options": [
        "hear",
        "sit",
        "choose",
        "buy"
      ],
      "answer": "choose",
      "explanation": "choose → chose (chọn)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (choose).",
      "answers": [
        "chose"
      ],
      "explanation": "Yesterday, she chose (choose)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"come\" là gì?",
      "options": [
        "gave",
        "came",
        "began",
        "heard"
      ],
      "answer": "came",
      "explanation": "come → came (đến)."
    },
    {
      "type": "choice",
      "prompt": "\"came\" là quá khứ của động từ nào?",
      "options": [
        "eat",
        "come",
        "fall",
        "run"
      ],
      "answer": "come",
      "explanation": "come → came (đến)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (come).",
      "answers": [
        "came"
      ],
      "explanation": "Yesterday, she came (come)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"do\" là gì?",
      "options": [
        "did",
        "went",
        "spoke",
        "brought"
      ],
      "answer": "did",
      "explanation": "do → did (làm)."
    },
    {
      "type": "choice",
      "prompt": "\"did\" là quá khứ của động từ nào?",
      "options": [
        "tell",
        "choose",
        "fall",
        "do"
      ],
      "answer": "do",
      "explanation": "do → did (làm)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (do).",
      "answers": [
        "did"
      ],
      "explanation": "Yesterday, she did (do)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"drink\" là gì?",
      "options": [
        "sold",
        "said",
        "drank",
        "forgot"
      ],
      "answer": "drank",
      "explanation": "drink → drank (uống)."
    },
    {
      "type": "choice",
      "prompt": "\"drank\" là quá khứ của động từ nào?",
      "options": [
        "hear",
        "drink",
        "forget",
        "give"
      ],
      "answer": "drink",
      "explanation": "drink → drank (uống)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (drink).",
      "answers": [
        "drank"
      ],
      "explanation": "Yesterday, she drank (drink)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"drive\" là gì?",
      "options": [
        "told",
        "slept",
        "began",
        "drove"
      ],
      "answer": "drove",
      "explanation": "drive → drove (lái xe)."
    },
    {
      "type": "choice",
      "prompt": "\"drove\" là quá khứ của động từ nào?",
      "options": [
        "catch",
        "drink",
        "drive",
        "wear"
      ],
      "answer": "drive",
      "explanation": "drive → drove (lái xe)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (drive).",
      "answers": [
        "drove"
      ],
      "explanation": "Yesterday, she drove (drive)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"eat\" là gì?",
      "options": [
        "wore",
        "ate",
        "found",
        "sold"
      ],
      "answer": "ate",
      "explanation": "eat → ate (ăn)."
    },
    {
      "type": "choice",
      "prompt": "\"ate\" là quá khứ của động từ nào?",
      "options": [
        "tell",
        "ride",
        "say",
        "eat"
      ],
      "answer": "eat",
      "explanation": "eat → ate (ăn)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (eat).",
      "answers": [
        "ate"
      ],
      "explanation": "Yesterday, she ate (eat)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"fall\" là gì?",
      "options": [
        "brought",
        "taught",
        "gave",
        "fell"
      ],
      "answer": "fell",
      "explanation": "fall → fell (ngã)."
    },
    {
      "type": "choice",
      "prompt": "\"fell\" là quá khứ của động từ nào?",
      "options": [
        "do",
        "hear",
        "write",
        "fall"
      ],
      "answer": "fall",
      "explanation": "fall → fell (ngã)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (fall).",
      "answers": [
        "fell"
      ],
      "explanation": "Yesterday, she fell (fall)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"find\" là gì?",
      "options": [
        "found",
        "taught",
        "sat",
        "came"
      ],
      "answer": "found",
      "explanation": "find → found (tìm thấy)."
    },
    {
      "type": "choice",
      "prompt": "\"found\" là quá khứ của động từ nào?",
      "options": [
        "give",
        "find",
        "drive",
        "see"
      ],
      "answer": "find",
      "explanation": "find → found (tìm thấy)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (find).",
      "answers": [
        "found"
      ],
      "explanation": "Yesterday, she found (find)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"fly\" là gì?",
      "options": [
        "bought",
        "caught",
        "flew",
        "grew"
      ],
      "answer": "flew",
      "explanation": "fly → flew (bay)."
    },
    {
      "type": "choice",
      "prompt": "\"flew\" là quá khứ của động từ nào?",
      "options": [
        "fly",
        "know",
        "swim",
        "leave"
      ],
      "answer": "fly",
      "explanation": "fly → flew (bay)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (fly).",
      "answers": [
        "flew"
      ],
      "explanation": "Yesterday, she flew (fly)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"forget\" là gì?",
      "options": [
        "saw",
        "got",
        "forgot",
        "gave"
      ],
      "answer": "forgot",
      "explanation": "forget → forgot (quên)."
    },
    {
      "type": "choice",
      "prompt": "\"forgot\" là quá khứ của động từ nào?",
      "options": [
        "come",
        "sell",
        "sleep",
        "forget"
      ],
      "answer": "forget",
      "explanation": "forget → forgot (quên)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (forget).",
      "answers": [
        "forgot"
      ],
      "explanation": "Yesterday, she forgot (forget)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"get\" là gì?",
      "options": [
        "got",
        "drank",
        "fell",
        "broke"
      ],
      "answer": "got",
      "explanation": "get → got (lấy, nhận)."
    },
    {
      "type": "choice",
      "prompt": "\"got\" là quá khứ của động từ nào?",
      "options": [
        "leave",
        "fly",
        "see",
        "get"
      ],
      "answer": "get",
      "explanation": "get → got (lấy, nhận)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (get).",
      "answers": [
        "got"
      ],
      "explanation": "Yesterday, she got (get)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"give\" là gì?",
      "options": [
        "gave",
        "wore",
        "sent",
        "drove"
      ],
      "answer": "gave",
      "explanation": "give → gave (cho, tặng)."
    },
    {
      "type": "choice",
      "prompt": "\"gave\" là quá khứ của động từ nào?",
      "options": [
        "give",
        "make",
        "teach",
        "run"
      ],
      "answer": "give",
      "explanation": "give → gave (cho, tặng)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (give).",
      "answers": [
        "gave"
      ],
      "explanation": "Yesterday, she gave (give)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"go\" là gì?",
      "options": [
        "left",
        "went",
        "found",
        "gave"
      ],
      "answer": "went",
      "explanation": "go → went (đi)."
    },
    {
      "type": "choice",
      "prompt": "\"went\" là quá khứ của động từ nào?",
      "options": [
        "eat",
        "drive",
        "go",
        "forget"
      ],
      "answer": "go",
      "explanation": "go → went (đi)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (go).",
      "answers": [
        "went"
      ],
      "explanation": "Yesterday, she went (go)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"grow\" là gì?",
      "options": [
        "found",
        "broke",
        "grew",
        "met"
      ],
      "answer": "grew",
      "explanation": "grow → grew (lớn lên, trồng)."
    },
    {
      "type": "choice",
      "prompt": "\"grew\" là quá khứ của động từ nào?",
      "options": [
        "grow",
        "take",
        "win",
        "ride"
      ],
      "answer": "grow",
      "explanation": "grow → grew (lớn lên, trồng)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (grow).",
      "answers": [
        "grew"
      ],
      "explanation": "Yesterday, she grew (grow)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"hear\" là gì?",
      "options": [
        "spoke",
        "slept",
        "heard",
        "chose"
      ],
      "answer": "heard",
      "explanation": "hear → heard (nghe)."
    },
    {
      "type": "choice",
      "prompt": "\"heard\" là quá khứ của động từ nào?",
      "options": [
        "say",
        "hear",
        "break",
        "find"
      ],
      "answer": "hear",
      "explanation": "hear → heard (nghe)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (hear).",
      "answers": [
        "heard"
      ],
      "explanation": "Yesterday, she heard (hear)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"know\" là gì?",
      "options": [
        "got",
        "swam",
        "wrote",
        "knew"
      ],
      "answer": "knew",
      "explanation": "know → knew (biết)."
    },
    {
      "type": "choice",
      "prompt": "\"knew\" là quá khứ của động từ nào?",
      "options": [
        "know",
        "catch",
        "give",
        "see"
      ],
      "answer": "know",
      "explanation": "know → knew (biết)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (know).",
      "answers": [
        "knew"
      ],
      "explanation": "Yesterday, she knew (know)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"leave\" là gì?",
      "options": [
        "ate",
        "left",
        "met",
        "began"
      ],
      "answer": "left",
      "explanation": "leave → left (rời đi, để lại)."
    },
    {
      "type": "choice",
      "prompt": "\"left\" là quá khứ của động từ nào?",
      "options": [
        "ride",
        "eat",
        "grow",
        "leave"
      ],
      "answer": "leave",
      "explanation": "leave → left (rời đi, để lại)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (leave).",
      "answers": [
        "left"
      ],
      "explanation": "Yesterday, she left (leave)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"make\" là gì?",
      "options": [
        "brought",
        "rode",
        "made",
        "understood"
      ],
      "answer": "made",
      "explanation": "make → made (làm, chế tạo)."
    },
    {
      "type": "choice",
      "prompt": "\"made\" là quá khứ của động từ nào?",
      "options": [
        "make",
        "come",
        "give",
        "choose"
      ],
      "answer": "make",
      "explanation": "make → made (làm, chế tạo)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (make).",
      "answers": [
        "made"
      ],
      "explanation": "Yesterday, she made (make)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"meet\" là gì?",
      "options": [
        "taught",
        "sold",
        "met",
        "left"
      ],
      "answer": "met",
      "explanation": "meet → met (gặp)."
    },
    {
      "type": "choice",
      "prompt": "\"met\" là quá khứ của động từ nào?",
      "options": [
        "meet",
        "do",
        "find",
        "teach"
      ],
      "answer": "meet",
      "explanation": "meet → met (gặp)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (meet).",
      "answers": [
        "met"
      ],
      "explanation": "Yesterday, she met (meet)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"pay\" là gì?",
      "options": [
        "paid",
        "knew",
        "wrote",
        "sold"
      ],
      "answer": "paid",
      "explanation": "pay → paid (trả tiền)."
    },
    {
      "type": "choice",
      "prompt": "\"paid\" là quá khứ của động từ nào?",
      "options": [
        "pay",
        "know",
        "ride",
        "go"
      ],
      "answer": "pay",
      "explanation": "pay → paid (trả tiền)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (pay).",
      "answers": [
        "paid"
      ],
      "explanation": "Yesterday, she paid (pay)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"read\" là gì?",
      "options": [
        "fell",
        "spoke",
        "read",
        "drank"
      ],
      "answer": "read",
      "explanation": "read → read (đọc)."
    },
    {
      "type": "choice",
      "prompt": "\"read\" là quá khứ của động từ nào?",
      "options": [
        "read",
        "sell",
        "pay",
        "know"
      ],
      "answer": "read",
      "explanation": "read → read (đọc)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (read).",
      "answers": [
        "read"
      ],
      "explanation": "Yesterday, she read (read)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"ride\" là gì?",
      "options": [
        "rode",
        "became",
        "broke",
        "drove"
      ],
      "answer": "rode",
      "explanation": "ride → rode (cưỡi, đạp xe)."
    },
    {
      "type": "choice",
      "prompt": "\"rode\" là quá khứ của động từ nào?",
      "options": [
        "see",
        "ride",
        "drink",
        "meet"
      ],
      "answer": "ride",
      "explanation": "ride → rode (cưỡi, đạp xe)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (ride).",
      "answers": [
        "rode"
      ],
      "explanation": "Yesterday, she rode (ride)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"run\" là gì?",
      "options": [
        "sold",
        "ran",
        "began",
        "sent"
      ],
      "answer": "ran",
      "explanation": "run → ran (chạy)."
    },
    {
      "type": "choice",
      "prompt": "\"ran\" là quá khứ của động từ nào?",
      "options": [
        "run",
        "catch",
        "sleep",
        "make"
      ],
      "answer": "run",
      "explanation": "run → ran (chạy)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (run).",
      "answers": [
        "ran"
      ],
      "explanation": "Yesterday, she ran (run)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"say\" là gì?",
      "options": [
        "said",
        "sent",
        "brought",
        "ate"
      ],
      "answer": "said",
      "explanation": "say → said (nói)."
    },
    {
      "type": "choice",
      "prompt": "\"said\" là quá khứ của động từ nào?",
      "options": [
        "fall",
        "find",
        "eat",
        "say"
      ],
      "answer": "say",
      "explanation": "say → said (nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (say).",
      "answers": [
        "said"
      ],
      "explanation": "Yesterday, she said (say)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"see\" là gì?",
      "options": [
        "left",
        "bought",
        "saw",
        "gave"
      ],
      "answer": "saw",
      "explanation": "see → saw (nhìn thấy)."
    },
    {
      "type": "choice",
      "prompt": "\"saw\" là quá khứ của động từ nào?",
      "options": [
        "write",
        "sell",
        "break",
        "see"
      ],
      "answer": "see",
      "explanation": "see → saw (nhìn thấy)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (see).",
      "answers": [
        "saw"
      ],
      "explanation": "Yesterday, she saw (see)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"sell\" là gì?",
      "options": [
        "sent",
        "paid",
        "sold",
        "made"
      ],
      "answer": "sold",
      "explanation": "sell → sold (bán)."
    },
    {
      "type": "choice",
      "prompt": "\"sold\" là quá khứ của động từ nào?",
      "options": [
        "choose",
        "sell",
        "pay",
        "buy"
      ],
      "answer": "sell",
      "explanation": "sell → sold (bán)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (sell).",
      "answers": [
        "sold"
      ],
      "explanation": "Yesterday, she sold (sell)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"send\" là gì?",
      "options": [
        "sat",
        "sent",
        "spoke",
        "saw"
      ],
      "answer": "sent",
      "explanation": "send → sent (gửi)."
    },
    {
      "type": "choice",
      "prompt": "\"sent\" là quá khứ của động từ nào?",
      "options": [
        "get",
        "send",
        "break",
        "drink"
      ],
      "answer": "send",
      "explanation": "send → sent (gửi)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (send).",
      "answers": [
        "sent"
      ],
      "explanation": "Yesterday, she sent (send)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"sing\" là gì?",
      "options": [
        "sang",
        "bought",
        "left",
        "made"
      ],
      "answer": "sang",
      "explanation": "sing → sang (hát)."
    },
    {
      "type": "choice",
      "prompt": "\"sang\" là quá khứ của động từ nào?",
      "options": [
        "find",
        "buy",
        "sing",
        "go"
      ],
      "answer": "sing",
      "explanation": "sing → sang (hát)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (sing).",
      "answers": [
        "sang"
      ],
      "explanation": "Yesterday, she sang (sing)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"sit\" là gì?",
      "options": [
        "took",
        "broke",
        "sat",
        "drank"
      ],
      "answer": "sat",
      "explanation": "sit → sat (ngồi)."
    },
    {
      "type": "choice",
      "prompt": "\"sat\" là quá khứ của động từ nào?",
      "options": [
        "sit",
        "hear",
        "send",
        "drink"
      ],
      "answer": "sit",
      "explanation": "sit → sat (ngồi)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (sit).",
      "answers": [
        "sat"
      ],
      "explanation": "Yesterday, she sat (sit)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"sleep\" là gì?",
      "options": [
        "chose",
        "got",
        "paid",
        "slept"
      ],
      "answer": "slept",
      "explanation": "sleep → slept (ngủ)."
    },
    {
      "type": "choice",
      "prompt": "\"slept\" là quá khứ của động từ nào?",
      "options": [
        "sell",
        "ride",
        "sleep",
        "meet"
      ],
      "answer": "sleep",
      "explanation": "sleep → slept (ngủ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (sleep).",
      "answers": [
        "slept"
      ],
      "explanation": "Yesterday, she slept (sleep)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"speak\" là gì?",
      "options": [
        "slept",
        "left",
        "met",
        "spoke"
      ],
      "answer": "spoke",
      "explanation": "speak → spoke (nói)."
    },
    {
      "type": "choice",
      "prompt": "\"spoke\" là quá khứ của động từ nào?",
      "options": [
        "speak",
        "write",
        "begin",
        "take"
      ],
      "answer": "speak",
      "explanation": "speak → spoke (nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (speak).",
      "answers": [
        "spoke"
      ],
      "explanation": "Yesterday, she spoke (speak)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"swim\" là gì?",
      "options": [
        "sent",
        "swam",
        "said",
        "grew"
      ],
      "answer": "swam",
      "explanation": "swim → swam (bơi)."
    },
    {
      "type": "choice",
      "prompt": "\"swam\" là quá khứ của động từ nào?",
      "options": [
        "say",
        "see",
        "swim",
        "speak"
      ],
      "answer": "swim",
      "explanation": "swim → swam (bơi)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (swim).",
      "answers": [
        "swam"
      ],
      "explanation": "Yesterday, she swam (swim)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"take\" là gì?",
      "options": [
        "slept",
        "took",
        "caught",
        "began"
      ],
      "answer": "took",
      "explanation": "take → took (lấy, chụp)."
    },
    {
      "type": "choice",
      "prompt": "\"took\" là quá khứ của động từ nào?",
      "options": [
        "take",
        "leave",
        "hear",
        "write"
      ],
      "answer": "take",
      "explanation": "take → took (lấy, chụp)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (take).",
      "answers": [
        "took"
      ],
      "explanation": "Yesterday, she took (take)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"teach\" là gì?",
      "options": [
        "sat",
        "saw",
        "taught",
        "slept"
      ],
      "answer": "taught",
      "explanation": "teach → taught (dạy)."
    },
    {
      "type": "choice",
      "prompt": "\"taught\" là quá khứ của động từ nào?",
      "options": [
        "teach",
        "think",
        "choose",
        "swim"
      ],
      "answer": "teach",
      "explanation": "teach → taught (dạy)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (teach).",
      "answers": [
        "taught"
      ],
      "explanation": "Yesterday, she taught (teach)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"tell\" là gì?",
      "options": [
        "bought",
        "rode",
        "told",
        "sent"
      ],
      "answer": "told",
      "explanation": "tell → told (kể, bảo)."
    },
    {
      "type": "choice",
      "prompt": "\"told\" là quá khứ của động từ nào?",
      "options": [
        "drive",
        "run",
        "leave",
        "tell"
      ],
      "answer": "tell",
      "explanation": "tell → told (kể, bảo)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (tell).",
      "answers": [
        "told"
      ],
      "explanation": "Yesterday, she told (tell)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"think\" là gì?",
      "options": [
        "bought",
        "thought",
        "went",
        "became"
      ],
      "answer": "thought",
      "explanation": "think → thought (nghĩ)."
    },
    {
      "type": "choice",
      "prompt": "\"thought\" là quá khứ của động từ nào?",
      "options": [
        "think",
        "write",
        "run",
        "swim"
      ],
      "answer": "think",
      "explanation": "think → thought (nghĩ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (think).",
      "answers": [
        "thought"
      ],
      "explanation": "Yesterday, she thought (think)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"understand\" là gì?",
      "options": [
        "understood",
        "chose",
        "ate",
        "spoke"
      ],
      "answer": "understood",
      "explanation": "understand → understood (hiểu)."
    },
    {
      "type": "choice",
      "prompt": "\"understood\" là quá khứ của động từ nào?",
      "options": [
        "wear",
        "sing",
        "understand",
        "leave"
      ],
      "answer": "understand",
      "explanation": "understand → understood (hiểu)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (understand).",
      "answers": [
        "understood"
      ],
      "explanation": "Yesterday, she understood (understand)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"wear\" là gì?",
      "options": [
        "wore",
        "went",
        "got",
        "drank"
      ],
      "answer": "wore",
      "explanation": "wear → wore (mặc, đeo)."
    },
    {
      "type": "choice",
      "prompt": "\"wore\" là quá khứ của động từ nào?",
      "options": [
        "wear",
        "forget",
        "drink",
        "grow"
      ],
      "answer": "wear",
      "explanation": "wear → wore (mặc, đeo)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (wear).",
      "answers": [
        "wore"
      ],
      "explanation": "Yesterday, she wore (wear)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"win\" là gì?",
      "options": [
        "told",
        "won",
        "sat",
        "made"
      ],
      "answer": "won",
      "explanation": "win → won (thắng)."
    },
    {
      "type": "choice",
      "prompt": "\"won\" là quá khứ của động từ nào?",
      "options": [
        "fall",
        "win",
        "send",
        "sing"
      ],
      "answer": "win",
      "explanation": "win → won (thắng)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (win).",
      "answers": [
        "won"
      ],
      "explanation": "Yesterday, she won (win)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"write\" là gì?",
      "options": [
        "flew",
        "wrote",
        "sent",
        "did"
      ],
      "answer": "wrote",
      "explanation": "write → wrote (viết)."
    },
    {
      "type": "choice",
      "prompt": "\"wrote\" là quá khứ của động từ nào?",
      "options": [
        "do",
        "write",
        "meet",
        "catch"
      ],
      "answer": "write",
      "explanation": "write → wrote (viết)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (write).",
      "answers": [
        "wrote"
      ],
      "explanation": "Yesterday, she wrote (write)."
    },
    {
      "type": "choice",
      "prompt": "Câu nào đúng ở quá khứ?",
      "options": [
        "He didn't go.",
        "He didn't went.",
        "He doesn’t go.",
        "He didn't goes."
      ],
      "answer": "He didn't go.",
      "explanation": "Phủ định quá khứ: didn’t + động từ nguyên thể."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: She didn’t ______ yesterday.",
      "options": [
        "bought",
        "buy",
        "buying",
        "buys"
      ],
      "answer": "buy",
      "explanation": "She didn’t buy yesterday. = Hôm qua cô ấy đã không mua."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: Did you ______ TV yesterday?",
      "options": [
        "watch",
        "watched",
        "watching",
        "watches"
      ],
      "answer": "watch",
      "explanation": "Did + chủ ngữ + động từ nguyên thể."
    }
  ],
  "future": [
    {
      "type": "choice",
      "prompt": "\"will go\" có nghĩa là gì?",
      "options": [
        "sẽ thăm",
        "sẽ giúp",
        "sẽ không",
        "sẽ đi"
      ],
      "answer": "sẽ đi",
      "explanation": "will go = sẽ đi."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"sẽ đi\"?",
      "options": [
        "will be",
        "will go",
        "won't",
        "going to watch"
      ],
      "answer": "will go",
      "explanation": "will go = sẽ đi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"sẽ đi\"",
      "answers": [
        "will go"
      ],
      "explanation": "will go = sẽ đi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ to school tomorrow.",
      "answers": [
        "will go"
      ],
      "explanation": "Câu đầy đủ: I will go to school tomorrow."
    },
    {
      "type": "choice",
      "prompt": "\"will visit\" có nghĩa là gì?",
      "options": [
        "sẽ đi",
        "sẽ học (đã định)",
        "sẽ giúp",
        "sẽ thăm"
      ],
      "answer": "sẽ thăm",
      "explanation": "will visit = sẽ thăm."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"sẽ thăm\"?",
      "options": [
        "will be",
        "will visit",
        "going to watch",
        "will help"
      ],
      "answer": "will visit",
      "explanation": "will visit = sẽ thăm."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"sẽ thăm\"",
      "answers": [
        "will visit"
      ],
      "explanation": "will visit = sẽ thăm."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ my grandmother tomorrow.",
      "answers": [
        "will visit"
      ],
      "explanation": "Câu đầy đủ: I will visit my grandmother tomorrow."
    },
    {
      "type": "choice",
      "prompt": "\"are going to travel\" có nghĩa là gì?",
      "options": [
        "sẽ là",
        "sẽ đi du lịch (đã định)",
        "sẽ thăm",
        "sẽ đi"
      ],
      "answer": "sẽ đi du lịch (đã định)",
      "explanation": "are going to travel = sẽ đi du lịch (đã định)."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"sẽ đi du lịch (đã định)\"?",
      "options": [
        "will go",
        "is going to study",
        "are going to travel",
        "won't"
      ],
      "answer": "are going to travel",
      "explanation": "are going to travel = sẽ đi du lịch (đã định)."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"sẽ đi du lịch (đã định)\"",
      "answers": [
        "are going to travel"
      ],
      "explanation": "are going to travel = sẽ đi du lịch (đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: We ______ next month.",
      "answers": [
        "are going to travel"
      ],
      "explanation": "Câu đầy đủ: We are going to travel next month."
    },
    {
      "type": "choice",
      "prompt": "\"is going to study\" có nghĩa là gì?",
      "options": [
        "sẽ là",
        "sẽ đi du lịch (đã định)",
        "sẽ không",
        "sẽ học (đã định)"
      ],
      "answer": "sẽ học (đã định)",
      "explanation": "is going to study = sẽ học (đã định)."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"sẽ học (đã định)\"?",
      "options": [
        "going to watch",
        "is going to study",
        "will visit",
        "will be"
      ],
      "answer": "is going to study",
      "explanation": "is going to study = sẽ học (đã định)."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"sẽ học (đã định)\"",
      "answers": [
        "is going to study"
      ],
      "explanation": "is going to study = sẽ học (đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ tonight.",
      "answers": [
        "is going to study"
      ],
      "explanation": "Câu đầy đủ: He is going to study tonight."
    },
    {
      "type": "choice",
      "prompt": "\"won't\" có nghĩa là gì?",
      "options": [
        "sẽ đi",
        "sẽ không",
        "sẽ xem (đã định)",
        "sẽ đi du lịch (đã định)"
      ],
      "answer": "sẽ không",
      "explanation": "won't = sẽ không."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"sẽ không\"?",
      "options": [
        "will go",
        "will visit",
        "won't",
        "will be"
      ],
      "answer": "won't",
      "explanation": "won't = sẽ không."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"sẽ không\"",
      "answers": [
        "won't"
      ],
      "explanation": "won't = sẽ không."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ go to school tomorrow.",
      "answers": [
        "won't"
      ],
      "explanation": "Câu đầy đủ: I won't go to school tomorrow."
    },
    {
      "type": "choice",
      "prompt": "\"will be\" có nghĩa là gì?",
      "options": [
        "sẽ đi du lịch (đã định)",
        "sẽ là",
        "sẽ giúp",
        "sẽ không"
      ],
      "answer": "sẽ là",
      "explanation": "will be = sẽ là."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"sẽ là\"?",
      "options": [
        "will be",
        "will visit",
        "is going to study",
        "will go"
      ],
      "answer": "will be",
      "explanation": "will be = sẽ là."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"sẽ là\"",
      "answers": [
        "will be"
      ],
      "explanation": "will be = sẽ là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: It ______ sunny tomorrow.",
      "answers": [
        "will be"
      ],
      "explanation": "Câu đầy đủ: It will be sunny tomorrow."
    },
    {
      "type": "choice",
      "prompt": "\"going to watch\" có nghĩa là gì?",
      "options": [
        "sẽ thăm",
        "sẽ xem (đã định)",
        "sẽ học (đã định)",
        "sẽ đi"
      ],
      "answer": "sẽ xem (đã định)",
      "explanation": "going to watch = sẽ xem (đã định)."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"sẽ xem (đã định)\"?",
      "options": [
        "will go",
        "going to watch",
        "won't",
        "will be"
      ],
      "answer": "going to watch",
      "explanation": "going to watch = sẽ xem (đã định)."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"sẽ xem (đã định)\"",
      "answers": [
        "going to watch"
      ],
      "explanation": "going to watch = sẽ xem (đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My mother is ______ a film tonight.",
      "answers": [
        "going to watch"
      ],
      "explanation": "Câu đầy đủ: My mother is going to watch a film tonight."
    },
    {
      "type": "choice",
      "prompt": "\"will help\" có nghĩa là gì?",
      "options": [
        "sẽ là",
        "sẽ xem (đã định)",
        "sẽ thăm",
        "sẽ giúp"
      ],
      "answer": "sẽ giúp",
      "explanation": "will help = sẽ giúp."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"sẽ giúp\"?",
      "options": [
        "will help",
        "will go",
        "will visit",
        "will be"
      ],
      "answer": "will help",
      "explanation": "will help = sẽ giúp."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"sẽ giúp\"",
      "answers": [
        "will help"
      ],
      "explanation": "will help = sẽ giúp."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ you with homework.",
      "answers": [
        "will help"
      ],
      "explanation": "Câu đầy đủ: She will help you with homework."
    },
    {
      "type": "choice",
      "prompt": "I ______ visit my grandmother tomorrow.",
      "options": [
        "visit",
        "will visit",
        "visited",
        "visiting"
      ],
      "answer": "will visit",
      "explanation": "Tomorrow → tương lai, will + visit nguyên thể."
    },
    {
      "type": "choice",
      "prompt": "We ______ travel to Sa Pa next month. (kế hoạch đã định)",
      "options": [
        "travel",
        "will travel",
        "are going to travel",
        "travelled"
      ],
      "answer": "are going to travel",
      "explanation": "Kế hoạch đã định dùng be going to."
    },
    {
      "type": "choice",
      "prompt": "She ______ help you with homework.",
      "options": [
        "help",
        "will help",
        "helped",
        "helps"
      ],
      "answer": "will help",
      "explanation": "Will + help nguyên thể (lời hứa/quyết định)."
    },
    {
      "type": "choice",
      "prompt": "It ______ rain tomorrow, take an umbrella.",
      "options": [
        "rain",
        "will rain",
        "rained",
        "rains"
      ],
      "answer": "will rain",
      "explanation": "Dự đoán tương lai dùng will rain."
    },
    {
      "type": "choice",
      "prompt": "Dạng phủ định của \"will\" là gì?",
      "options": [
        "will not go",
        "won't",
        "willn't",
        "don't will"
      ],
      "answer": "won't",
      "explanation": "Will not viết tắt là won't."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: He ______ study tonight. (đã định học tối nay)",
      "answers": [
        "is going to study"
      ],
      "explanation": "Kế hoạch đã định: he + is going to study."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: They ______ play football tomorrow.",
      "answers": [
        "will play"
      ],
      "explanation": "Tomorrow → tương lai, they + will play."
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: I ______ go to school tomorrow. (sẽ không đi)",
      "answers": [
        "will not",
        "won't"
      ],
      "explanation": "I will not (won't) go — sau will/won't, go giữ nguyên thể."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you come to my party tonight?",
      "answers": [
        "will"
      ],
      "explanation": "Câu hỏi tương lai với will: Will you…?"
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: My mother ______ cook dinner tonight. (đã định nấu)",
      "answers": [
        "is going to cook"
      ],
      "explanation": "Kế hoạch đã định: my mother + is going to cook."
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: We ______ watch TV tonight. (sẽ không xem)",
      "answers": [
        "will not",
        "won't"
      ],
      "explanation": "We will not (won't) watch — sau will, watch giữ nguyên thể."
    },
    {
      "type": "fill",
      "prompt": "Chia động từ: It ______ be sunny tomorrow.",
      "answers": [
        "will be"
      ],
      "explanation": "Dự đoán: it + will be."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi sẽ giúp bạn ngày mai.\"",
      "answers": [
        "i will help you tomorrow"
      ],
      "explanation": "I will help you tomorrow. = Tôi sẽ giúp bạn ngày mai."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Chúng tôi sẽ đi du lịch vào tháng tới.\"",
      "answers": [
        "we are going to travel next month",
        "we will travel next month"
      ],
      "explanation": "We are going to travel next month. = Chúng tôi sẽ đi du lịch vào tháng tới."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Bạn sẽ đến bữa tiệc tối nay chứ?\"",
      "answers": [
        "will you come to the party tonight"
      ],
      "explanation": "Will you come to the party tonight? = Bạn sẽ đến bữa tiệc tối nay chứ?"
    },
    {
      "type": "choice",
      "prompt": "Câu nào là quyết định ngay lúc nói?",
      "options": [
        "We are going to travel next month.",
        "I am going to read a book.",
        "I will help you!",
        "They are going to play football."
      ],
      "answer": "I will help you!",
      "explanation": "I will help you! = Tôi sẽ giúp bạn! (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ help you!",
      "answers": [
        "will"
      ],
      "explanation": "I will help you! = Tôi sẽ giúp bạn!"
    },
    {
      "type": "choice",
      "prompt": "Câu nào là quyết định ngay lúc nói?",
      "options": [
        "They are going to play football.",
        "I am going to read a book.",
        "We are going to travel next month.",
        "It will rain tomorrow."
      ],
      "answer": "It will rain tomorrow.",
      "explanation": "It will rain tomorrow. = Trời sẽ mưa ngày mai. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: It ______ rain tomorrow.",
      "answers": [
        "will"
      ],
      "explanation": "It will rain tomorrow. = Trời sẽ mưa ngày mai."
    },
    {
      "type": "choice",
      "prompt": "Câu nào là quyết định ngay lúc nói?",
      "options": [
        "She will call you tonight.",
        "She is going to cook dinner.",
        "I am going to read a book.",
        "We are going to travel next month."
      ],
      "answer": "She will call you tonight.",
      "explanation": "She will call you tonight. = Cô ấy sẽ gọi cho bạn tối nay. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ call you tonight.",
      "answers": [
        "will"
      ],
      "explanation": "She will call you tonight. = Cô ấy sẽ gọi cho bạn tối nay."
    },
    {
      "type": "choice",
      "prompt": "Câu nào là quyết định ngay lúc nói?",
      "options": [
        "They are going to play football.",
        "I am going to read a book.",
        "We will travel next week.",
        "We are going to travel next month."
      ],
      "answer": "We will travel next week.",
      "explanation": "We will travel next week. = Chúng tôi sẽ đi du lịch tuần tới. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: We ______ travel next week.",
      "answers": [
        "will"
      ],
      "explanation": "We will travel next week. = Chúng tôi sẽ đi du lịch tuần tới."
    },
    {
      "type": "choice",
      "prompt": "Câu nào là kế hoạch đã định?",
      "options": [
        "It will rain tomorrow.",
        "We are going to travel next month.",
        "I will help you!",
        "She will call you tonight."
      ],
      "answer": "We are going to travel next month.",
      "explanation": "We are going to travel next month. = Chúng tôi định đi du lịch tháng tới. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "choice",
      "prompt": "Câu nào là kế hoạch đã định?",
      "options": [
        "I will help you!",
        "She is going to cook dinner.",
        "She will call you tonight.",
        "It will rain tomorrow."
      ],
      "answer": "She is going to cook dinner.",
      "explanation": "She is going to cook dinner. = Cô ấy định nấu bữa tối. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "choice",
      "prompt": "Câu nào là kế hoạch đã định?",
      "options": [
        "She will call you tonight.",
        "We will travel next week.",
        "It will rain tomorrow.",
        "They are going to play football."
      ],
      "answer": "They are going to play football.",
      "explanation": "They are going to play football. = Họ định chơi bóng đá. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "choice",
      "prompt": "Câu nào là kế hoạch đã định?",
      "options": [
        "She will call you tonight.",
        "I am going to read a book.",
        "It will rain tomorrow.",
        "I will help you!"
      ],
      "answer": "I am going to read a book.",
      "explanation": "I am going to read a book. = Tôi định đọc một quyển sách. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ help you! (quyết định ngay lúc nói)",
      "options": [
        "will",
        "am going to",
        "going to",
        "will to"
      ],
      "answer": "will",
      "explanation": "I will help you! = Tôi sẽ giúp bạn!"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ travel next month. (kế hoạch đã định)",
      "options": [
        "are going to",
        "will to",
        "are going",
        "will"
      ],
      "answer": "are going to",
      "explanation": "We are going to travel next month. = Chúng tôi định đi du lịch tháng tới."
    }
  ]
}
