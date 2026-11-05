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
      "prompt": "Điền từ còn thiếu: ______, Lan! (xin chào)",
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
      "prompt": "Điền từ còn thiếu: ______, teacher! (chào buổi sáng)",
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
      "prompt": "Điền từ còn thiếu: ______, see you tomorrow! (tạm biệt)",
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
      "prompt": "Điền từ còn thiếu: ______ sit down. (làm ơn)",
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
      "prompt": "Điền từ còn thiếu: ______ very much! (cảm ơn)",
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
      "prompt": "Điền từ còn thiếu: ______, I am late. (xin lỗi)",
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
      "prompt": "Điền từ còn thiếu: ______ Minh. (tên tôi là)",
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
      "prompt": "Điền từ còn thiếu: ______! (rất vui được gặp bạn)",
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
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My ______ is Mai.",
      "answers": [
        "name"
      ],
      "explanation": "My name is Mai. = Tôi tên là Mai."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My ______ is Tom.",
      "answers": [
        "name"
      ],
      "explanation": "My name is Tom. = Tôi tên là Tom."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My ______ is Anna.",
      "answers": [
        "name"
      ],
      "explanation": "My name is Anna. = Tôi tên là Anna."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My ______ is Linh.",
      "answers": [
        "name"
      ],
      "explanation": "My name is Linh. = Tôi tên là Linh."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My ______ is Tuan.",
      "answers": [
        "name"
      ],
      "explanation": "My name is Tuan. = Tôi tên là Tuan."
    },
    {
      "type": "choice",
      "prompt": "Khi gặp bạn, bạn hỏi \"Bạn khỏe không?\" bằng câu nào?",
      "options": [
        "Good night!",
        "How are you?",
        "How old are you?",
        "What is your name?"
      ],
      "answer": "How are you?",
      "explanation": "How are you? = Bạn khỏe không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ are you? (Bạn khỏe không?)",
      "answers": [
        "how"
      ],
      "explanation": "How are you? = Bạn khỏe không?"
    },
    {
      "type": "choice",
      "prompt": "Bạn trả lời \"Tôi khỏe, cảm ơn\" thế nào?",
      "options": [
        "My name is Lan.",
        "I'm five.",
        "I'm fine, thank you.",
        "Goodbye!"
      ],
      "answer": "I'm fine, thank you.",
      "explanation": "I'm fine, thank you. = Tôi khỏe, cảm ơn."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: ______ fine, thank you. (Tôi khỏe, cảm ơn)",
      "answers": [
        "i'm"
      ],
      "explanation": "I'm fine, thank you. = Tôi khỏe, cảm ơn."
    },
    {
      "type": "choice",
      "prompt": "Hỏi tên bạn mới thế nào?",
      "options": [
        "Good night!",
        "How old are you?",
        "What is your name?",
        "How are you?"
      ],
      "answer": "What is your name?",
      "explanation": "What is your name? = Tên bạn là gì?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ is your name? (Tên bạn là gì?)",
      "answers": [
        "what"
      ],
      "explanation": "What is your name? = Tên bạn là gì?"
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tên bạn là gì?\"",
      "answers": [
        "what is your name"
      ],
      "explanation": "What is your name? = Tên bạn là gì?"
    },
    {
      "type": "choice",
      "prompt": "Lan is six years old. Lan mấy tuổi?",
      "options": [
        "10",
        "12",
        "6",
        "7"
      ],
      "answer": "6",
      "explanation": "Lan is six years old. = Lan 6 tuổi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I am ______ years old. (Tôi 6 tuổi.)",
      "answers": [
        "six"
      ],
      "explanation": "I am six years old. = Tôi 6 tuổi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi 6 tuổi.\"",
      "answers": [
        "i am six years old"
      ],
      "explanation": "I am six years old. = Tôi 6 tuổi."
    },
    {
      "type": "choice",
      "prompt": "Lan is seven years old. Lan mấy tuổi?",
      "options": [
        "6",
        "10",
        "9",
        "7"
      ],
      "answer": "7",
      "explanation": "Lan is seven years old. = Lan 7 tuổi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I am ______ years old. (Tôi 7 tuổi.)",
      "answers": [
        "seven"
      ],
      "explanation": "I am seven years old. = Tôi 7 tuổi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi 7 tuổi.\"",
      "answers": [
        "i am seven years old"
      ],
      "explanation": "I am seven years old. = Tôi 7 tuổi."
    },
    {
      "type": "choice",
      "prompt": "Lan is eight years old. Lan mấy tuổi?",
      "options": [
        "11",
        "10",
        "8",
        "6"
      ],
      "answer": "8",
      "explanation": "Lan is eight years old. = Lan 8 tuổi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I am ______ years old. (Tôi 8 tuổi.)",
      "answers": [
        "eight"
      ],
      "explanation": "I am eight years old. = Tôi 8 tuổi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi 8 tuổi.\"",
      "answers": [
        "i am eight years old"
      ],
      "explanation": "I am eight years old. = Tôi 8 tuổi."
    },
    {
      "type": "choice",
      "prompt": "Lan is nine years old. Lan mấy tuổi?",
      "options": [
        "6",
        "10",
        "9",
        "12"
      ],
      "answer": "9",
      "explanation": "Lan is nine years old. = Lan 9 tuổi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I am ______ years old. (Tôi 9 tuổi.)",
      "answers": [
        "nine"
      ],
      "explanation": "I am nine years old. = Tôi 9 tuổi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi 9 tuổi.\"",
      "answers": [
        "i am nine years old"
      ],
      "explanation": "I am nine years old. = Tôi 9 tuổi."
    },
    {
      "type": "choice",
      "prompt": "Lan is ten years old. Lan mấy tuổi?",
      "options": [
        "9",
        "10",
        "8",
        "7"
      ],
      "answer": "10",
      "explanation": "Lan is ten years old. = Lan 10 tuổi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I am ______ years old. (Tôi 10 tuổi.)",
      "answers": [
        "ten"
      ],
      "explanation": "I am ten years old. = Tôi 10 tuổi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi 10 tuổi.\"",
      "answers": [
        "i am ten years old"
      ],
      "explanation": "I am ten years old. = Tôi 10 tuổi."
    },
    {
      "type": "choice",
      "prompt": "Lan is eleven years old. Lan mấy tuổi?",
      "options": [
        "8",
        "11",
        "9",
        "10"
      ],
      "answer": "11",
      "explanation": "Lan is eleven years old. = Lan 11 tuổi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I am ______ years old. (Tôi 11 tuổi.)",
      "answers": [
        "eleven"
      ],
      "explanation": "I am eleven years old. = Tôi 11 tuổi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi 11 tuổi.\"",
      "answers": [
        "i am eleven years old"
      ],
      "explanation": "I am eleven years old. = Tôi 11 tuổi."
    },
    {
      "type": "choice",
      "prompt": "Lan is twelve years old. Lan mấy tuổi?",
      "options": [
        "9",
        "8",
        "12",
        "11"
      ],
      "answer": "12",
      "explanation": "Lan is twelve years old. = Lan 12 tuổi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I am ______ years old. (Tôi 12 tuổi.)",
      "answers": [
        "twelve"
      ],
      "explanation": "I am twelve years old. = Tôi 12 tuổi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi 12 tuổi.\"",
      "answers": [
        "i am twelve years old"
      ],
      "explanation": "I am twelve years old. = Tôi 12 tuổi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ morning! (buổi sáng)",
      "answers": [
        "good"
      ],
      "explanation": "Good morning! dùng vào buổi sáng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ afternoon! (buổi chiều)",
      "answers": [
        "good"
      ],
      "explanation": "Good afternoon! dùng vào buổi chiều."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ evening! (buổi tối)",
      "answers": [
        "good"
      ],
      "explanation": "Good evening! dùng vào buổi tối."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ night! (trước khi đi ngủ)",
      "answers": [
        "good"
      ],
      "explanation": "Good night! dùng vào trước khi đi ngủ."
    },
    {
      "type": "choice",
      "prompt": "Câu nào dùng để tạm biệt và hẹn gặp lại sau?",
      "options": [
        "Sorry!",
        "See you later!",
        "Thank you!",
        "Good morning!"
      ],
      "answer": "See you later!",
      "explanation": "See you later! = Hẹn gặp lại sau!"
    },
    {
      "type": "choice",
      "prompt": "\"See you tomorrow!\" có nghĩa là gì?",
      "options": [
        "Chào buổi sáng!",
        "Cảm ơn bạn!",
        "Xin lỗi nhé!",
        "Hẹn gặp lại ngày mai!"
      ],
      "answer": "Hẹn gặp lại ngày mai!",
      "explanation": "See you tomorrow! = Hẹn gặp lại ngày mai!"
    },
    {
      "type": "choice",
      "prompt": "Câu nào dùng khi gặp thầy cô buổi sáng?",
      "options": [
        "Thank you, teacher!",
        "Goodbye, teacher!",
        "Good night, teacher!",
        "Good morning, teacher!"
      ],
      "answer": "Good morning, teacher!",
      "explanation": "Good morning, teacher! = Chào thầy/cô buổi sáng!"
    },
    {
      "type": "choice",
      "prompt": "Câu nào dùng khi gặp thầy cô buổi chiều?",
      "options": [
        "Good night, teacher!",
        "Good afternoon, teacher!",
        "Thank you, teacher!",
        "Goodbye, teacher!"
      ],
      "answer": "Good afternoon, teacher!",
      "explanation": "Good afternoon, teacher! = Chào thầy/cô buổi chiều!"
    },
    {
      "type": "choice",
      "prompt": "Câu nào dùng khi gặp thầy cô buổi tối?",
      "options": [
        "Thank you, teacher!",
        "Good evening, teacher!",
        "Goodbye, teacher!",
        "Good night, teacher!"
      ],
      "answer": "Good evening, teacher!",
      "explanation": "Good evening, teacher! = Chào thầy/cô buổi tối!"
    },
    {
      "type": "choice",
      "prompt": "A: Hello! B: ______",
      "options": [
        "Goodbye!",
        "Thank you!",
        "Sorry!",
        "Hi!"
      ],
      "answer": "Hi!",
      "explanation": "A: Hello! B: Hi! = Chào! — Chào!"
    },
    {
      "type": "choice",
      "prompt": "A: Thank you! B: ______",
      "options": [
        "Sorry!",
        "You're welcome!",
        "Goodbye!",
        "Good morning!"
      ],
      "answer": "You're welcome!",
      "explanation": "You're welcome! = Không có gì! (đáp lại lời cảm ơn)"
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Xin chào, tôi tên là Lan.\"",
      "answers": [
        "hello, my name is lan"
      ],
      "explanation": "Hello, my name is Lan. = Xin chào, tôi tên là Lan."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Xin chào, tôi tên là Minh.\"",
      "answers": [
        "hello, my name is minh"
      ],
      "explanation": "Hello, my name is Minh. = Xin chào, tôi tên là Minh."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Xin chào, tôi tên là Hoa.\"",
      "answers": [
        "hello, my name is hoa"
      ],
      "explanation": "Hello, my name is Hoa. = Xin chào, tôi tên là Hoa."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Xin chào, tôi tên là An.\"",
      "answers": [
        "hello, my name is an"
      ],
      "explanation": "Hello, my name is An. = Xin chào, tôi tên là An."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Xin chào, tôi tên là Mai.\"",
      "answers": [
        "hello, my name is mai"
      ],
      "explanation": "Hello, my name is Mai. = Xin chào, tôi tên là Mai."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Xin chào, tôi tên là Tom.\"",
      "answers": [
        "hello, my name is tom"
      ],
      "explanation": "Hello, my name is Tom. = Xin chào, tôi tên là Tom."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Xin chào, tôi tên là Anna.\"",
      "answers": [
        "hello, my name is anna"
      ],
      "explanation": "Hello, my name is Anna. = Xin chào, tôi tên là Anna."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Xin chào, tôi tên là Linh.\"",
      "answers": [
        "hello, my name is linh"
      ],
      "explanation": "Hello, my name is Linh. = Xin chào, tôi tên là Linh."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Xin chào, tôi tên là Tuan.\"",
      "answers": [
        "hello, my name is tuan"
      ],
      "explanation": "Hello, my name is Tuan. = Xin chào, tôi tên là Tuan."
    }
  ],
  "numbers": [
    {
      "type": "choice",
      "prompt": "\"one\" có nghĩa là gì?",
      "options": [
        "số 5",
        "số 1",
        "số 20",
        "số 2"
      ],
      "answer": "số 1",
      "explanation": "one = số 1."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"số 1\"?",
      "options": [
        "years old",
        "one",
        "ten",
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
      "prompt": "Điền từ còn thiếu: I have ______ pen. (số 1)",
      "answers": [
        "one"
      ],
      "explanation": "Câu đầy đủ: I have one pen."
    },
    {
      "type": "choice",
      "prompt": "\"two\" có nghĩa là gì?",
      "options": [
        "số 5",
        "số 2",
        "số 3",
        "số 12"
      ],
      "answer": "số 2",
      "explanation": "two = số 2."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"số 2\"?",
      "options": [
        "three",
        "five",
        "twelve",
        "two"
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
      "prompt": "Điền từ còn thiếu: I have ______ books. (số 2)",
      "answers": [
        "two"
      ],
      "explanation": "Câu đầy đủ: I have two books."
    },
    {
      "type": "choice",
      "prompt": "\"three\" có nghĩa là gì?",
      "options": [
        "số 1",
        "số 2",
        "số 20",
        "số 3"
      ],
      "answer": "số 3",
      "explanation": "three = số 3."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"số 3\"?",
      "options": [
        "twenty",
        "two",
        "three",
        "twelve"
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
      "prompt": "Điền từ còn thiếu: ______ cats. (số 3)",
      "answers": [
        "three"
      ],
      "explanation": "Câu đầy đủ: Three cats."
    },
    {
      "type": "choice",
      "prompt": "\"five\" có nghĩa là gì?",
      "options": [
        "số 12",
        "số 3",
        "tuổi",
        "số 5"
      ],
      "answer": "số 5",
      "explanation": "five = số 5."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"số 5\"?",
      "options": [
        "ten",
        "five",
        "years old",
        "three"
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
      "prompt": "Điền từ còn thiếu: I am ______ years old. (số 5)",
      "answers": [
        "five"
      ],
      "explanation": "Câu đầy đủ: I am five years old."
    },
    {
      "type": "choice",
      "prompt": "\"ten\" có nghĩa là gì?",
      "options": [
        "số 10",
        "số 20",
        "số 12",
        "số 1"
      ],
      "answer": "số 10",
      "explanation": "ten = số 10."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"số 10\"?",
      "options": [
        "two",
        "ten",
        "one",
        "five"
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
      "prompt": "Điền từ còn thiếu: I am ______ years old. (số 10)",
      "answers": [
        "ten"
      ],
      "explanation": "Câu đầy đủ: I am ten years old."
    },
    {
      "type": "choice",
      "prompt": "\"twelve\" có nghĩa là gì?",
      "options": [
        "số 1",
        "số 3",
        "số 12",
        "tuổi"
      ],
      "answer": "số 12",
      "explanation": "twelve = số 12."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"số 12\"?",
      "options": [
        "years old",
        "twelve",
        "three",
        "one"
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
      "prompt": "Điền từ còn thiếu: ______ students. (số 12)",
      "answers": [
        "twelve"
      ],
      "explanation": "Câu đầy đủ: Twelve students."
    },
    {
      "type": "choice",
      "prompt": "\"twenty\" có nghĩa là gì?",
      "options": [
        "số 2",
        "số 20",
        "số 12",
        "tuổi"
      ],
      "answer": "số 20",
      "explanation": "twenty = số 20."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"số 20\"?",
      "options": [
        "twenty",
        "years old",
        "ten",
        "twelve"
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
      "prompt": "Điền từ còn thiếu: ______ chairs. (số 20)",
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
        "số 10",
        "tuổi",
        "số 1"
      ],
      "answer": "tuổi",
      "explanation": "years old = tuổi."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"tuổi\"?",
      "options": [
        "five",
        "years old",
        "one",
        "twelve"
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
      "prompt": "Điền từ còn thiếu: I am nine ______. (tuổi)",
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
        "sixteen",
        "one",
        "seventeen",
        "ten"
      ],
      "answer": "one",
      "explanation": "one = số 1."
    },
    {
      "type": "choice",
      "prompt": "\"one\" là số mấy?",
      "options": [
        "3",
        "8",
        "1",
        "13"
      ],
      "answer": "1",
      "explanation": "one = số 1."
    },
    {
      "type": "choice",
      "prompt": "I have one pens. Tôi có mấy cây bút?",
      "options": [
        "1",
        "16",
        "12",
        "19"
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
        "eighteen",
        "one",
        "seventeen",
        "two"
      ],
      "answer": "two",
      "explanation": "two = số 2."
    },
    {
      "type": "choice",
      "prompt": "\"two\" là số mấy?",
      "options": [
        "2",
        "13",
        "12",
        "20"
      ],
      "answer": "2",
      "explanation": "two = số 2."
    },
    {
      "type": "choice",
      "prompt": "I have two books. Tôi có mấy quyển sách?",
      "options": [
        "20",
        "7",
        "11",
        "2"
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
        "eleven",
        "six",
        "ten",
        "three"
      ],
      "answer": "three",
      "explanation": "three = số 3."
    },
    {
      "type": "choice",
      "prompt": "\"three\" là số mấy?",
      "options": [
        "7",
        "3",
        "12",
        "1"
      ],
      "answer": "3",
      "explanation": "three = số 3."
    },
    {
      "type": "choice",
      "prompt": "I have three cats. Tôi có mấy con mèo?",
      "options": [
        "20",
        "3",
        "8",
        "10"
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
        "fourteen",
        "nineteen",
        "sixteen"
      ],
      "answer": "four",
      "explanation": "four = số 4."
    },
    {
      "type": "choice",
      "prompt": "\"four\" là số mấy?",
      "options": [
        "4",
        "15",
        "5",
        "8"
      ],
      "answer": "4",
      "explanation": "four = số 4."
    },
    {
      "type": "choice",
      "prompt": "I have four dogs. Tôi có mấy con chó?",
      "options": [
        "4",
        "10",
        "14",
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
        "five",
        "twelve",
        "two",
        "eleven"
      ],
      "answer": "five",
      "explanation": "five = số 5."
    },
    {
      "type": "choice",
      "prompt": "\"five\" là số mấy?",
      "options": [
        "5",
        "4",
        "3",
        "15"
      ],
      "answer": "5",
      "explanation": "five = số 5."
    },
    {
      "type": "choice",
      "prompt": "I have five apples. Tôi có mấy quả táo?",
      "options": [
        "8",
        "11",
        "18",
        "5"
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
        "nineteen",
        "fourteen",
        "eighteen",
        "six"
      ],
      "answer": "six",
      "explanation": "six = số 6."
    },
    {
      "type": "choice",
      "prompt": "\"six\" là số mấy?",
      "options": [
        "10",
        "19",
        "9",
        "6"
      ],
      "answer": "6",
      "explanation": "six = số 6."
    },
    {
      "type": "choice",
      "prompt": "I have six balls. Tôi có mấy quả bóng?",
      "options": [
        "4",
        "17",
        "6",
        "8"
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
        "six",
        "one",
        "nineteen",
        "seven"
      ],
      "answer": "seven",
      "explanation": "seven = số 7."
    },
    {
      "type": "choice",
      "prompt": "I have seven chairs. Tôi có mấy cái ghế?",
      "options": [
        "7",
        "1",
        "3",
        "19"
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
        "three",
        "seven",
        "fourteen"
      ],
      "answer": "eight",
      "explanation": "eight = số 8."
    },
    {
      "type": "choice",
      "prompt": "\"eight\" là số mấy?",
      "options": [
        "8",
        "9",
        "14",
        "4"
      ],
      "answer": "8",
      "explanation": "eight = số 8."
    },
    {
      "type": "choice",
      "prompt": "I have eight birds. Tôi có mấy con chim?",
      "options": [
        "8",
        "16",
        "11",
        "12"
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
        "six",
        "one",
        "nine",
        "eleven"
      ],
      "answer": "nine",
      "explanation": "nine = số 9."
    },
    {
      "type": "choice",
      "prompt": "\"nine\" là số mấy?",
      "options": [
        "5",
        "9",
        "15",
        "14"
      ],
      "answer": "9",
      "explanation": "nine = số 9."
    },
    {
      "type": "choice",
      "prompt": "I have nine rulers. Tôi có mấy cái thước?",
      "options": [
        "9",
        "17",
        "12",
        "13"
      ],
      "answer": "9",
      "explanation": "I have nine rulers. = Tôi có 9 cái thước."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ rulers. (9)",
      "answers": [
        "nine"
      ],
      "explanation": "I have nine rulers. = Tôi có 9 cái thước."
    },
    {
      "type": "choice",
      "prompt": "Số 10 trong tiếng Anh là gì?",
      "options": [
        "two",
        "thirteen",
        "ten",
        "eight"
      ],
      "answer": "ten",
      "explanation": "ten = số 10."
    },
    {
      "type": "choice",
      "prompt": "\"ten\" là số mấy?",
      "options": [
        "10",
        "2",
        "18",
        "1"
      ],
      "answer": "10",
      "explanation": "ten = số 10."
    },
    {
      "type": "choice",
      "prompt": "I have ten pencils. Tôi có mấy cây bút chì?",
      "options": [
        "15",
        "10",
        "2",
        "20"
      ],
      "answer": "10",
      "explanation": "I have ten pencils. = Tôi có 10 cây bút chì."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ pencils. (10)",
      "answers": [
        "ten"
      ],
      "explanation": "I have ten pencils. = Tôi có 10 cây bút chì."
    },
    {
      "type": "choice",
      "prompt": "Số 11 trong tiếng Anh là gì?",
      "options": [
        "eight",
        "eighteen",
        "eleven",
        "five"
      ],
      "answer": "eleven",
      "explanation": "eleven = số 11."
    },
    {
      "type": "choice",
      "prompt": "\"eleven\" là số mấy?",
      "options": [
        "9",
        "4",
        "16",
        "11"
      ],
      "answer": "11",
      "explanation": "eleven = số 11."
    },
    {
      "type": "choice",
      "prompt": "I have eleven oranges. Tôi có mấy quả cam?",
      "options": [
        "15",
        "11",
        "1",
        "9"
      ],
      "answer": "11",
      "explanation": "I have eleven oranges. = Tôi có 11 quả cam."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ oranges. (11)",
      "answers": [
        "eleven"
      ],
      "explanation": "I have eleven oranges. = Tôi có 11 quả cam."
    },
    {
      "type": "choice",
      "prompt": "Số 12 trong tiếng Anh là gì?",
      "options": [
        "eight",
        "twelve",
        "twenty",
        "two"
      ],
      "answer": "twelve",
      "explanation": "twelve = số 12."
    },
    {
      "type": "choice",
      "prompt": "\"twelve\" là số mấy?",
      "options": [
        "12",
        "11",
        "16",
        "9"
      ],
      "answer": "12",
      "explanation": "twelve = số 12."
    },
    {
      "type": "choice",
      "prompt": "I have twelve cakes. Tôi có mấy cái bánh?",
      "options": [
        "13",
        "17",
        "16",
        "12"
      ],
      "answer": "12",
      "explanation": "I have twelve cakes. = Tôi có 12 cái bánh."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ cakes. (12)",
      "answers": [
        "twelve"
      ],
      "explanation": "I have twelve cakes. = Tôi có 12 cái bánh."
    },
    {
      "type": "choice",
      "prompt": "Số 13 trong tiếng Anh là gì?",
      "options": [
        "two",
        "seven",
        "one",
        "thirteen"
      ],
      "answer": "thirteen",
      "explanation": "thirteen = số 13."
    },
    {
      "type": "choice",
      "prompt": "\"thirteen\" là số mấy?",
      "options": [
        "1",
        "13",
        "15",
        "19"
      ],
      "answer": "13",
      "explanation": "thirteen = số 13."
    },
    {
      "type": "choice",
      "prompt": "I have thirteen pens. Tôi có mấy cây bút?",
      "options": [
        "6",
        "12",
        "13",
        "15"
      ],
      "answer": "13",
      "explanation": "I have thirteen pens. = Tôi có 13 cây bút."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ pens. (13)",
      "answers": [
        "thirteen"
      ],
      "explanation": "I have thirteen pens. = Tôi có 13 cây bút."
    },
    {
      "type": "choice",
      "prompt": "Số 14 trong tiếng Anh là gì?",
      "options": [
        "one",
        "seventeen",
        "fourteen",
        "eighteen"
      ],
      "answer": "fourteen",
      "explanation": "fourteen = số 14."
    },
    {
      "type": "choice",
      "prompt": "\"fourteen\" là số mấy?",
      "options": [
        "14",
        "19",
        "2",
        "4"
      ],
      "answer": "14",
      "explanation": "fourteen = số 14."
    },
    {
      "type": "choice",
      "prompt": "I have fourteen books. Tôi có mấy quyển sách?",
      "options": [
        "16",
        "8",
        "18",
        "14"
      ],
      "answer": "14",
      "explanation": "I have fourteen books. = Tôi có 14 quyển sách."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ books. (14)",
      "answers": [
        "fourteen"
      ],
      "explanation": "I have fourteen books. = Tôi có 14 quyển sách."
    },
    {
      "type": "choice",
      "prompt": "Số 15 trong tiếng Anh là gì?",
      "options": [
        "nineteen",
        "five",
        "sixteen",
        "fifteen"
      ],
      "answer": "fifteen",
      "explanation": "fifteen = số 15."
    },
    {
      "type": "choice",
      "prompt": "\"fifteen\" là số mấy?",
      "options": [
        "15",
        "4",
        "8",
        "11"
      ],
      "answer": "15",
      "explanation": "fifteen = số 15."
    },
    {
      "type": "choice",
      "prompt": "I have fifteen cats. Tôi có mấy con mèo?",
      "options": [
        "11",
        "17",
        "12",
        "15"
      ],
      "answer": "15",
      "explanation": "I have fifteen cats. = Tôi có 15 con mèo."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ cats. (15)",
      "answers": [
        "fifteen"
      ],
      "explanation": "I have fifteen cats. = Tôi có 15 con mèo."
    },
    {
      "type": "choice",
      "prompt": "Số 16 trong tiếng Anh là gì?",
      "options": [
        "seven",
        "four",
        "sixteen",
        "seventeen"
      ],
      "answer": "sixteen",
      "explanation": "sixteen = số 16."
    },
    {
      "type": "choice",
      "prompt": "\"sixteen\" là số mấy?",
      "options": [
        "7",
        "19",
        "16",
        "4"
      ],
      "answer": "16",
      "explanation": "sixteen = số 16."
    },
    {
      "type": "choice",
      "prompt": "I have sixteen dogs. Tôi có mấy con chó?",
      "options": [
        "15",
        "4",
        "8",
        "16"
      ],
      "answer": "16",
      "explanation": "I have sixteen dogs. = Tôi có 16 con chó."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ dogs. (16)",
      "answers": [
        "sixteen"
      ],
      "explanation": "I have sixteen dogs. = Tôi có 16 con chó."
    },
    {
      "type": "choice",
      "prompt": "Số 17 trong tiếng Anh là gì?",
      "options": [
        "fifteen",
        "seventeen",
        "eight",
        "six"
      ],
      "answer": "seventeen",
      "explanation": "seventeen = số 17."
    },
    {
      "type": "choice",
      "prompt": "\"seventeen\" là số mấy?",
      "options": [
        "20",
        "17",
        "9",
        "2"
      ],
      "answer": "17",
      "explanation": "seventeen = số 17."
    },
    {
      "type": "choice",
      "prompt": "I have seventeen apples. Tôi có mấy quả táo?",
      "options": [
        "3",
        "18",
        "17",
        "1"
      ],
      "answer": "17",
      "explanation": "I have seventeen apples. = Tôi có 17 quả táo."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ apples. (17)",
      "answers": [
        "seventeen"
      ],
      "explanation": "I have seventeen apples. = Tôi có 17 quả táo."
    },
    {
      "type": "choice",
      "prompt": "Số 18 trong tiếng Anh là gì?",
      "options": [
        "six",
        "nineteen",
        "eighteen",
        "five"
      ],
      "answer": "eighteen",
      "explanation": "eighteen = số 18."
    },
    {
      "type": "choice",
      "prompt": "\"eighteen\" là số mấy?",
      "options": [
        "5",
        "3",
        "14",
        "18"
      ],
      "answer": "18",
      "explanation": "eighteen = số 18."
    },
    {
      "type": "choice",
      "prompt": "I have eighteen balls. Tôi có mấy quả bóng?",
      "options": [
        "18",
        "13",
        "12",
        "5"
      ],
      "answer": "18",
      "explanation": "I have eighteen balls. = Tôi có 18 quả bóng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ balls. (18)",
      "answers": [
        "eighteen"
      ],
      "explanation": "I have eighteen balls. = Tôi có 18 quả bóng."
    },
    {
      "type": "choice",
      "prompt": "Số 19 trong tiếng Anh là gì?",
      "options": [
        "nineteen",
        "ten",
        "four",
        "six"
      ],
      "answer": "nineteen",
      "explanation": "nineteen = số 19."
    },
    {
      "type": "choice",
      "prompt": "\"nineteen\" là số mấy?",
      "options": [
        "11",
        "17",
        "19",
        "3"
      ],
      "answer": "19",
      "explanation": "nineteen = số 19."
    },
    {
      "type": "choice",
      "prompt": "I have nineteen chairs. Tôi có mấy cái ghế?",
      "options": [
        "20",
        "9",
        "19",
        "13"
      ],
      "answer": "19",
      "explanation": "I have nineteen chairs. = Tôi có 19 cái ghế."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ chairs. (19)",
      "answers": [
        "nineteen"
      ],
      "explanation": "I have nineteen chairs. = Tôi có 19 cái ghế."
    },
    {
      "type": "choice",
      "prompt": "\"twenty\" là số mấy?",
      "options": [
        "12",
        "16",
        "4",
        "20"
      ],
      "answer": "20",
      "explanation": "twenty = số 20."
    },
    {
      "type": "choice",
      "prompt": "I have twenty birds. Tôi có mấy con chim?",
      "options": [
        "2",
        "9",
        "20",
        "17"
      ],
      "answer": "20",
      "explanation": "I have twenty birds. = Tôi có 20 con chim."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have ______ birds. (20)",
      "answers": [
        "twenty"
      ],
      "explanation": "I have twenty birds. = Tôi có 20 con chim."
    },
    {
      "type": "fill",
      "prompt": "one + one = ______",
      "answers": [
        "two"
      ],
      "explanation": "one + one = two."
    },
    {
      "type": "choice",
      "prompt": "What is one plus one?",
      "options": [
        "two",
        "twenty",
        "eleven",
        "six"
      ],
      "answer": "two",
      "explanation": "one plus one = two."
    },
    {
      "type": "fill",
      "prompt": "one + two = ______",
      "answers": [
        "three"
      ],
      "explanation": "one + two = three."
    },
    {
      "type": "choice",
      "prompt": "What is one plus two?",
      "options": [
        "eighteen",
        "six",
        "seven",
        "three"
      ],
      "answer": "three",
      "explanation": "one plus two = three."
    },
    {
      "type": "fill",
      "prompt": "one + three = ______",
      "answers": [
        "four"
      ],
      "explanation": "one + three = four."
    },
    {
      "type": "choice",
      "prompt": "What is one plus three?",
      "options": [
        "six",
        "nineteen",
        "eighteen",
        "four"
      ],
      "answer": "four",
      "explanation": "one plus three = four."
    },
    {
      "type": "fill",
      "prompt": "one + four = ______",
      "answers": [
        "five"
      ],
      "explanation": "one + four = five."
    },
    {
      "type": "choice",
      "prompt": "What is one plus four?",
      "options": [
        "two",
        "five",
        "six",
        "nineteen"
      ],
      "answer": "five",
      "explanation": "one plus four = five."
    },
    {
      "type": "fill",
      "prompt": "one + five = ______",
      "answers": [
        "six"
      ],
      "explanation": "one + five = six."
    },
    {
      "type": "choice",
      "prompt": "What is one plus five?",
      "options": [
        "sixteen",
        "six",
        "thirteen",
        "fourteen"
      ],
      "answer": "six",
      "explanation": "one plus five = six."
    },
    {
      "type": "fill",
      "prompt": "one + six = ______",
      "answers": [
        "seven"
      ],
      "explanation": "one + six = seven."
    },
    {
      "type": "choice",
      "prompt": "What is one plus six?",
      "options": [
        "seven",
        "nine",
        "fourteen",
        "five"
      ],
      "answer": "seven",
      "explanation": "one plus six = seven."
    },
    {
      "type": "fill",
      "prompt": "one + seven = ______",
      "answers": [
        "eight"
      ],
      "explanation": "one + seven = eight."
    },
    {
      "type": "choice",
      "prompt": "What is one plus seven?",
      "options": [
        "nine",
        "eight",
        "twelve",
        "one"
      ],
      "answer": "eight",
      "explanation": "one plus seven = eight."
    },
    {
      "type": "fill",
      "prompt": "one + eight = ______",
      "answers": [
        "nine"
      ],
      "explanation": "one + eight = nine."
    },
    {
      "type": "choice",
      "prompt": "What is one plus eight?",
      "options": [
        "six",
        "seventeen",
        "nineteen",
        "nine"
      ],
      "answer": "nine",
      "explanation": "one plus eight = nine."
    },
    {
      "type": "fill",
      "prompt": "one + nine = ______",
      "answers": [
        "ten"
      ],
      "explanation": "one + nine = ten."
    },
    {
      "type": "choice",
      "prompt": "What is one plus nine?",
      "options": [
        "three",
        "four",
        "eight",
        "ten"
      ],
      "answer": "ten",
      "explanation": "one plus nine = ten."
    },
    {
      "type": "fill",
      "prompt": "two + one = ______",
      "answers": [
        "three"
      ],
      "explanation": "two + one = three."
    },
    {
      "type": "choice",
      "prompt": "What is two plus one?",
      "options": [
        "three",
        "twelve",
        "eleven",
        "fourteen"
      ],
      "answer": "three",
      "explanation": "two plus one = three."
    },
    {
      "type": "fill",
      "prompt": "two + two = ______",
      "answers": [
        "four"
      ],
      "explanation": "two + two = four."
    },
    {
      "type": "choice",
      "prompt": "What is two plus two?",
      "options": [
        "two",
        "eighteen",
        "three",
        "four"
      ],
      "answer": "four",
      "explanation": "two plus two = four."
    },
    {
      "type": "fill",
      "prompt": "two + three = ______",
      "answers": [
        "five"
      ],
      "explanation": "two + three = five."
    },
    {
      "type": "choice",
      "prompt": "What is two plus three?",
      "options": [
        "fourteen",
        "twenty",
        "five",
        "one"
      ],
      "answer": "five",
      "explanation": "two plus three = five."
    },
    {
      "type": "fill",
      "prompt": "two + four = ______",
      "answers": [
        "six"
      ],
      "explanation": "two + four = six."
    },
    {
      "type": "choice",
      "prompt": "What is two plus four?",
      "options": [
        "nineteen",
        "six",
        "seven",
        "twelve"
      ],
      "answer": "six",
      "explanation": "two plus four = six."
    },
    {
      "type": "fill",
      "prompt": "two + five = ______",
      "answers": [
        "seven"
      ],
      "explanation": "two + five = seven."
    },
    {
      "type": "choice",
      "prompt": "What is two plus five?",
      "options": [
        "seven",
        "eleven",
        "one",
        "eighteen"
      ],
      "answer": "seven",
      "explanation": "two plus five = seven."
    },
    {
      "type": "fill",
      "prompt": "two + six = ______",
      "answers": [
        "eight"
      ],
      "explanation": "two + six = eight."
    },
    {
      "type": "choice",
      "prompt": "What is two plus six?",
      "options": [
        "eighteen",
        "twelve",
        "three",
        "eight"
      ],
      "answer": "eight",
      "explanation": "two plus six = eight."
    },
    {
      "type": "fill",
      "prompt": "two + seven = ______",
      "answers": [
        "nine"
      ],
      "explanation": "two + seven = nine."
    },
    {
      "type": "choice",
      "prompt": "What is two plus seven?",
      "options": [
        "seven",
        "eleven",
        "nine",
        "twenty"
      ],
      "answer": "nine",
      "explanation": "two plus seven = nine."
    },
    {
      "type": "fill",
      "prompt": "two + eight = ______",
      "answers": [
        "ten"
      ],
      "explanation": "two + eight = ten."
    },
    {
      "type": "choice",
      "prompt": "What is two plus eight?",
      "options": [
        "thirteen",
        "ten",
        "three",
        "eight"
      ],
      "answer": "ten",
      "explanation": "two plus eight = ten."
    },
    {
      "type": "fill",
      "prompt": "two + nine = ______",
      "answers": [
        "eleven"
      ],
      "explanation": "two + nine = eleven."
    },
    {
      "type": "choice",
      "prompt": "What is two plus nine?",
      "options": [
        "seven",
        "eleven",
        "fourteen",
        "thirteen"
      ],
      "answer": "eleven",
      "explanation": "two plus nine = eleven."
    },
    {
      "type": "fill",
      "prompt": "three + one = ______",
      "answers": [
        "four"
      ],
      "explanation": "three + one = four."
    },
    {
      "type": "choice",
      "prompt": "What is three plus one?",
      "options": [
        "eighteen",
        "thirteen",
        "eleven",
        "four"
      ],
      "answer": "four",
      "explanation": "three plus one = four."
    },
    {
      "type": "fill",
      "prompt": "three + two = ______",
      "answers": [
        "five"
      ],
      "explanation": "three + two = five."
    },
    {
      "type": "choice",
      "prompt": "What is three plus two?",
      "options": [
        "thirteen",
        "fourteen",
        "five",
        "three"
      ],
      "answer": "five",
      "explanation": "three plus two = five."
    },
    {
      "type": "fill",
      "prompt": "three + three = ______",
      "answers": [
        "six"
      ],
      "explanation": "three + three = six."
    },
    {
      "type": "choice",
      "prompt": "What is three plus three?",
      "options": [
        "twenty",
        "four",
        "six",
        "fifteen"
      ],
      "answer": "six",
      "explanation": "three plus three = six."
    },
    {
      "type": "fill",
      "prompt": "three + four = ______",
      "answers": [
        "seven"
      ],
      "explanation": "three + four = seven."
    },
    {
      "type": "choice",
      "prompt": "What is three plus four?",
      "options": [
        "eleven",
        "three",
        "seven",
        "thirteen"
      ],
      "answer": "seven",
      "explanation": "three plus four = seven."
    },
    {
      "type": "fill",
      "prompt": "three + five = ______",
      "answers": [
        "eight"
      ],
      "explanation": "three + five = eight."
    },
    {
      "type": "choice",
      "prompt": "What is three plus five?",
      "options": [
        "five",
        "twenty",
        "eight",
        "seventeen"
      ],
      "answer": "eight",
      "explanation": "three plus five = eight."
    },
    {
      "type": "fill",
      "prompt": "three + six = ______",
      "answers": [
        "nine"
      ],
      "explanation": "three + six = nine."
    },
    {
      "type": "choice",
      "prompt": "What is three plus six?",
      "options": [
        "five",
        "nine",
        "eleven",
        "eight"
      ],
      "answer": "nine",
      "explanation": "three plus six = nine."
    },
    {
      "type": "fill",
      "prompt": "three + seven = ______",
      "answers": [
        "ten"
      ],
      "explanation": "three + seven = ten."
    },
    {
      "type": "choice",
      "prompt": "What is three plus seven?",
      "options": [
        "three",
        "ten",
        "two",
        "twenty"
      ],
      "answer": "ten",
      "explanation": "three plus seven = ten."
    },
    {
      "type": "fill",
      "prompt": "three + eight = ______",
      "answers": [
        "eleven"
      ],
      "explanation": "three + eight = eleven."
    },
    {
      "type": "choice",
      "prompt": "What is three plus eight?",
      "options": [
        "five",
        "fourteen",
        "eleven",
        "one"
      ],
      "answer": "eleven",
      "explanation": "three plus eight = eleven."
    },
    {
      "type": "fill",
      "prompt": "three + nine = ______",
      "answers": [
        "twelve"
      ],
      "explanation": "three + nine = twelve."
    },
    {
      "type": "choice",
      "prompt": "What is three plus nine?",
      "options": [
        "five",
        "twelve",
        "twenty",
        "seven"
      ],
      "answer": "twelve",
      "explanation": "three plus nine = twelve."
    },
    {
      "type": "fill",
      "prompt": "four + one = ______",
      "answers": [
        "five"
      ],
      "explanation": "four + one = five."
    },
    {
      "type": "choice",
      "prompt": "What is four plus one?",
      "options": [
        "five",
        "eight",
        "three",
        "fourteen"
      ],
      "answer": "five",
      "explanation": "four plus one = five."
    },
    {
      "type": "fill",
      "prompt": "four + two = ______",
      "answers": [
        "six"
      ],
      "explanation": "four + two = six."
    },
    {
      "type": "choice",
      "prompt": "What is four plus two?",
      "options": [
        "seventeen",
        "six",
        "fourteen",
        "sixteen"
      ],
      "answer": "six",
      "explanation": "four plus two = six."
    },
    {
      "type": "fill",
      "prompt": "four + three = ______",
      "answers": [
        "seven"
      ],
      "explanation": "four + three = seven."
    },
    {
      "type": "choice",
      "prompt": "What is four plus three?",
      "options": [
        "seven",
        "sixteen",
        "two",
        "ten"
      ],
      "answer": "seven",
      "explanation": "four plus three = seven."
    },
    {
      "type": "fill",
      "prompt": "four + four = ______",
      "answers": [
        "eight"
      ],
      "explanation": "four + four = eight."
    },
    {
      "type": "choice",
      "prompt": "What is four plus four?",
      "options": [
        "eight",
        "one",
        "eleven",
        "fourteen"
      ],
      "answer": "eight",
      "explanation": "four plus four = eight."
    },
    {
      "type": "fill",
      "prompt": "four + five = ______",
      "answers": [
        "nine"
      ],
      "explanation": "four + five = nine."
    },
    {
      "type": "choice",
      "prompt": "What is four plus five?",
      "options": [
        "seven",
        "nine",
        "eight",
        "eleven"
      ],
      "answer": "nine",
      "explanation": "four plus five = nine."
    },
    {
      "type": "fill",
      "prompt": "four + six = ______",
      "answers": [
        "ten"
      ],
      "explanation": "four + six = ten."
    },
    {
      "type": "choice",
      "prompt": "What is four plus six?",
      "options": [
        "three",
        "twenty",
        "ten",
        "fifteen"
      ],
      "answer": "ten",
      "explanation": "four plus six = ten."
    },
    {
      "type": "fill",
      "prompt": "four + seven = ______",
      "answers": [
        "eleven"
      ],
      "explanation": "four + seven = eleven."
    },
    {
      "type": "choice",
      "prompt": "What is four plus seven?",
      "options": [
        "eleven",
        "one",
        "six",
        "twenty"
      ],
      "answer": "eleven",
      "explanation": "four plus seven = eleven."
    },
    {
      "type": "fill",
      "prompt": "four + eight = ______",
      "answers": [
        "twelve"
      ],
      "explanation": "four + eight = twelve."
    },
    {
      "type": "choice",
      "prompt": "What is four plus eight?",
      "options": [
        "twelve",
        "three",
        "eleven",
        "nineteen"
      ],
      "answer": "twelve",
      "explanation": "four plus eight = twelve."
    },
    {
      "type": "fill",
      "prompt": "four + nine = ______",
      "answers": [
        "thirteen"
      ],
      "explanation": "four + nine = thirteen."
    },
    {
      "type": "choice",
      "prompt": "What is four plus nine?",
      "options": [
        "two",
        "thirteen",
        "fourteen",
        "sixteen"
      ],
      "answer": "thirteen",
      "explanation": "four plus nine = thirteen."
    },
    {
      "type": "fill",
      "prompt": "five + one = ______",
      "answers": [
        "six"
      ],
      "explanation": "five + one = six."
    },
    {
      "type": "choice",
      "prompt": "What is five plus one?",
      "options": [
        "seventeen",
        "six",
        "nine",
        "ten"
      ],
      "answer": "six",
      "explanation": "five plus one = six."
    },
    {
      "type": "fill",
      "prompt": "five + two = ______",
      "answers": [
        "seven"
      ],
      "explanation": "five + two = seven."
    },
    {
      "type": "choice",
      "prompt": "What is five plus two?",
      "options": [
        "nineteen",
        "seventeen",
        "ten",
        "seven"
      ],
      "answer": "seven",
      "explanation": "five plus two = seven."
    },
    {
      "type": "fill",
      "prompt": "five + three = ______",
      "answers": [
        "eight"
      ],
      "explanation": "five + three = eight."
    },
    {
      "type": "choice",
      "prompt": "What is five plus three?",
      "options": [
        "six",
        "two",
        "twelve",
        "eight"
      ],
      "answer": "eight",
      "explanation": "five plus three = eight."
    },
    {
      "type": "fill",
      "prompt": "five + four = ______",
      "answers": [
        "nine"
      ],
      "explanation": "five + four = nine."
    },
    {
      "type": "choice",
      "prompt": "What is five plus four?",
      "options": [
        "five",
        "four",
        "nine",
        "seven"
      ],
      "answer": "nine",
      "explanation": "five plus four = nine."
    },
    {
      "type": "fill",
      "prompt": "five + five = ______",
      "answers": [
        "ten"
      ],
      "explanation": "five + five = ten."
    },
    {
      "type": "choice",
      "prompt": "What is five plus five?",
      "options": [
        "thirteen",
        "ten",
        "twenty",
        "eight"
      ],
      "answer": "ten",
      "explanation": "five plus five = ten."
    },
    {
      "type": "fill",
      "prompt": "five + six = ______",
      "answers": [
        "eleven"
      ],
      "explanation": "five + six = eleven."
    },
    {
      "type": "choice",
      "prompt": "What is five plus six?",
      "options": [
        "eleven",
        "ten",
        "nineteen",
        "seven"
      ],
      "answer": "eleven",
      "explanation": "five plus six = eleven."
    },
    {
      "type": "fill",
      "prompt": "five + seven = ______",
      "answers": [
        "twelve"
      ],
      "explanation": "five + seven = twelve."
    },
    {
      "type": "choice",
      "prompt": "What is five plus seven?",
      "options": [
        "seventeen",
        "sixteen",
        "eighteen",
        "twelve"
      ],
      "answer": "twelve",
      "explanation": "five plus seven = twelve."
    },
    {
      "type": "fill",
      "prompt": "five + eight = ______",
      "answers": [
        "thirteen"
      ],
      "explanation": "five + eight = thirteen."
    },
    {
      "type": "choice",
      "prompt": "What is five plus eight?",
      "options": [
        "fourteen",
        "thirteen",
        "three",
        "ten"
      ],
      "answer": "thirteen",
      "explanation": "five plus eight = thirteen."
    },
    {
      "type": "fill",
      "prompt": "five + nine = ______",
      "answers": [
        "fourteen"
      ],
      "explanation": "five + nine = fourteen."
    },
    {
      "type": "choice",
      "prompt": "What is five plus nine?",
      "options": [
        "twenty",
        "twelve",
        "fourteen",
        "ten"
      ],
      "answer": "fourteen",
      "explanation": "five plus nine = fourteen."
    },
    {
      "type": "fill",
      "prompt": "six + one = ______",
      "answers": [
        "seven"
      ],
      "explanation": "six + one = seven."
    },
    {
      "type": "choice",
      "prompt": "What is six plus one?",
      "options": [
        "seven",
        "one",
        "six",
        "eighteen"
      ],
      "answer": "seven",
      "explanation": "six plus one = seven."
    },
    {
      "type": "fill",
      "prompt": "six + two = ______",
      "answers": [
        "eight"
      ],
      "explanation": "six + two = eight."
    },
    {
      "type": "choice",
      "prompt": "What is six plus two?",
      "options": [
        "fourteen",
        "eight",
        "eighteen",
        "twenty"
      ],
      "answer": "eight",
      "explanation": "six plus two = eight."
    },
    {
      "type": "fill",
      "prompt": "six + three = ______",
      "answers": [
        "nine"
      ],
      "explanation": "six + three = nine."
    },
    {
      "type": "choice",
      "prompt": "What is six plus three?",
      "options": [
        "nine",
        "seven",
        "eleven",
        "ten"
      ],
      "answer": "nine",
      "explanation": "six plus three = nine."
    },
    {
      "type": "fill",
      "prompt": "six + four = ______",
      "answers": [
        "ten"
      ],
      "explanation": "six + four = ten."
    },
    {
      "type": "choice",
      "prompt": "What is six plus four?",
      "options": [
        "twelve",
        "ten",
        "fourteen",
        "twenty"
      ],
      "answer": "ten",
      "explanation": "six plus four = ten."
    },
    {
      "type": "fill",
      "prompt": "six + five = ______",
      "answers": [
        "eleven"
      ],
      "explanation": "six + five = eleven."
    },
    {
      "type": "choice",
      "prompt": "What is six plus five?",
      "options": [
        "four",
        "ten",
        "eleven",
        "twenty"
      ],
      "answer": "eleven",
      "explanation": "six plus five = eleven."
    },
    {
      "type": "fill",
      "prompt": "six + six = ______",
      "answers": [
        "twelve"
      ],
      "explanation": "six + six = twelve."
    },
    {
      "type": "choice",
      "prompt": "What is six plus six?",
      "options": [
        "four",
        "six",
        "twelve",
        "nine"
      ],
      "answer": "twelve",
      "explanation": "six plus six = twelve."
    },
    {
      "type": "fill",
      "prompt": "six + seven = ______",
      "answers": [
        "thirteen"
      ],
      "explanation": "six + seven = thirteen."
    },
    {
      "type": "choice",
      "prompt": "What is six plus seven?",
      "options": [
        "three",
        "nineteen",
        "eleven",
        "thirteen"
      ],
      "answer": "thirteen",
      "explanation": "six plus seven = thirteen."
    },
    {
      "type": "fill",
      "prompt": "six + eight = ______",
      "answers": [
        "fourteen"
      ],
      "explanation": "six + eight = fourteen."
    },
    {
      "type": "choice",
      "prompt": "What is six plus eight?",
      "options": [
        "five",
        "six",
        "eighteen",
        "fourteen"
      ],
      "answer": "fourteen",
      "explanation": "six plus eight = fourteen."
    },
    {
      "type": "fill",
      "prompt": "six + nine = ______",
      "answers": [
        "fifteen"
      ],
      "explanation": "six + nine = fifteen."
    },
    {
      "type": "choice",
      "prompt": "What is six plus nine?",
      "options": [
        "fifteen",
        "five",
        "nineteen",
        "seven"
      ],
      "answer": "fifteen",
      "explanation": "six plus nine = fifteen."
    },
    {
      "type": "fill",
      "prompt": "seven + one = ______",
      "answers": [
        "eight"
      ],
      "explanation": "seven + one = eight."
    },
    {
      "type": "choice",
      "prompt": "What is seven plus one?",
      "options": [
        "two",
        "eight",
        "nineteen",
        "seven"
      ],
      "answer": "eight",
      "explanation": "seven plus one = eight."
    },
    {
      "type": "fill",
      "prompt": "seven + two = ______",
      "answers": [
        "nine"
      ],
      "explanation": "seven + two = nine."
    },
    {
      "type": "choice",
      "prompt": "What is seven plus two?",
      "options": [
        "sixteen",
        "nine",
        "twelve",
        "nineteen"
      ],
      "answer": "nine",
      "explanation": "seven plus two = nine."
    },
    {
      "type": "fill",
      "prompt": "seven + three = ______",
      "answers": [
        "ten"
      ],
      "explanation": "seven + three = ten."
    },
    {
      "type": "choice",
      "prompt": "What is seven plus three?",
      "options": [
        "twenty",
        "five",
        "eleven",
        "ten"
      ],
      "answer": "ten",
      "explanation": "seven plus three = ten."
    },
    {
      "type": "fill",
      "prompt": "seven + four = ______",
      "answers": [
        "eleven"
      ],
      "explanation": "seven + four = eleven."
    },
    {
      "type": "choice",
      "prompt": "What is seven plus four?",
      "options": [
        "eleven",
        "fifteen",
        "thirteen",
        "twenty"
      ],
      "answer": "eleven",
      "explanation": "seven plus four = eleven."
    },
    {
      "type": "fill",
      "prompt": "seven + five = ______",
      "answers": [
        "twelve"
      ],
      "explanation": "seven + five = twelve."
    },
    {
      "type": "choice",
      "prompt": "What is seven plus five?",
      "options": [
        "six",
        "twelve",
        "fifteen",
        "two"
      ],
      "answer": "twelve",
      "explanation": "seven plus five = twelve."
    },
    {
      "type": "fill",
      "prompt": "seven + six = ______",
      "answers": [
        "thirteen"
      ],
      "explanation": "seven + six = thirteen."
    },
    {
      "type": "choice",
      "prompt": "What is seven plus six?",
      "options": [
        "eighteen",
        "eight",
        "eleven",
        "thirteen"
      ],
      "answer": "thirteen",
      "explanation": "seven plus six = thirteen."
    },
    {
      "type": "fill",
      "prompt": "seven + seven = ______",
      "answers": [
        "fourteen"
      ],
      "explanation": "seven + seven = fourteen."
    },
    {
      "type": "choice",
      "prompt": "What is seven plus seven?",
      "options": [
        "one",
        "two",
        "fourteen",
        "eighteen"
      ],
      "answer": "fourteen",
      "explanation": "seven plus seven = fourteen."
    },
    {
      "type": "fill",
      "prompt": "seven + eight = ______",
      "answers": [
        "fifteen"
      ],
      "explanation": "seven + eight = fifteen."
    },
    {
      "type": "choice",
      "prompt": "What is seven plus eight?",
      "options": [
        "fifteen",
        "nineteen",
        "eleven",
        "six"
      ],
      "answer": "fifteen",
      "explanation": "seven plus eight = fifteen."
    },
    {
      "type": "fill",
      "prompt": "eight + one = ______",
      "answers": [
        "nine"
      ],
      "explanation": "eight + one = nine."
    },
    {
      "type": "choice",
      "prompt": "What is eight plus one?",
      "options": [
        "twelve",
        "three",
        "six",
        "nine"
      ],
      "answer": "nine",
      "explanation": "eight plus one = nine."
    },
    {
      "type": "fill",
      "prompt": "eight + two = ______",
      "answers": [
        "ten"
      ],
      "explanation": "eight + two = ten."
    },
    {
      "type": "choice",
      "prompt": "What is eight plus two?",
      "options": [
        "nineteen",
        "nine",
        "ten",
        "one"
      ],
      "answer": "ten",
      "explanation": "eight plus two = ten."
    },
    {
      "type": "fill",
      "prompt": "eight + three = ______",
      "answers": [
        "eleven"
      ],
      "explanation": "eight + three = eleven."
    },
    {
      "type": "choice",
      "prompt": "What is eight plus three?",
      "options": [
        "eleven",
        "three",
        "eight",
        "sixteen"
      ],
      "answer": "eleven",
      "explanation": "eight plus three = eleven."
    },
    {
      "type": "fill",
      "prompt": "eight + four = ______",
      "answers": [
        "twelve"
      ],
      "explanation": "eight + four = twelve."
    },
    {
      "type": "choice",
      "prompt": "What is eight plus four?",
      "options": [
        "fourteen",
        "one",
        "twelve",
        "ten"
      ],
      "answer": "twelve",
      "explanation": "eight plus four = twelve."
    },
    {
      "type": "fill",
      "prompt": "eight + five = ______",
      "answers": [
        "thirteen"
      ],
      "explanation": "eight + five = thirteen."
    },
    {
      "type": "choice",
      "prompt": "What is eight plus five?",
      "options": [
        "five",
        "seven",
        "one",
        "thirteen"
      ],
      "answer": "thirteen",
      "explanation": "eight plus five = thirteen."
    },
    {
      "type": "fill",
      "prompt": "eight + six = ______",
      "answers": [
        "fourteen"
      ],
      "explanation": "eight + six = fourteen."
    },
    {
      "type": "choice",
      "prompt": "What is eight plus six?",
      "options": [
        "ten",
        "nineteen",
        "two",
        "fourteen"
      ],
      "answer": "fourteen",
      "explanation": "eight plus six = fourteen."
    },
    {
      "type": "fill",
      "prompt": "eight + seven = ______",
      "answers": [
        "fifteen"
      ],
      "explanation": "eight + seven = fifteen."
    },
    {
      "type": "choice",
      "prompt": "What is eight plus seven?",
      "options": [
        "four",
        "five",
        "fifteen",
        "three"
      ],
      "answer": "fifteen",
      "explanation": "eight plus seven = fifteen."
    },
    {
      "type": "fill",
      "prompt": "nine + one = ______",
      "answers": [
        "ten"
      ],
      "explanation": "nine + one = ten."
    },
    {
      "type": "choice",
      "prompt": "What is nine plus one?",
      "options": [
        "eleven",
        "ten",
        "nine",
        "twenty"
      ],
      "answer": "ten",
      "explanation": "nine plus one = ten."
    },
    {
      "type": "fill",
      "prompt": "nine + two = ______",
      "answers": [
        "eleven"
      ],
      "explanation": "nine + two = eleven."
    },
    {
      "type": "choice",
      "prompt": "What is nine plus two?",
      "options": [
        "eight",
        "eleven",
        "two",
        "one"
      ],
      "answer": "eleven",
      "explanation": "nine plus two = eleven."
    },
    {
      "type": "fill",
      "prompt": "nine + three = ______",
      "answers": [
        "twelve"
      ],
      "explanation": "nine + three = twelve."
    },
    {
      "type": "choice",
      "prompt": "What is nine plus three?",
      "options": [
        "thirteen",
        "twelve",
        "eleven",
        "eight"
      ],
      "answer": "twelve",
      "explanation": "nine plus three = twelve."
    },
    {
      "type": "fill",
      "prompt": "nine + four = ______",
      "answers": [
        "thirteen"
      ],
      "explanation": "nine + four = thirteen."
    },
    {
      "type": "choice",
      "prompt": "What is nine plus four?",
      "options": [
        "nine",
        "thirteen",
        "sixteen",
        "nineteen"
      ],
      "answer": "thirteen",
      "explanation": "nine plus four = thirteen."
    },
    {
      "type": "fill",
      "prompt": "nine + five = ______",
      "answers": [
        "fourteen"
      ],
      "explanation": "nine + five = fourteen."
    },
    {
      "type": "choice",
      "prompt": "What is nine plus five?",
      "options": [
        "nineteen",
        "fourteen",
        "four",
        "thirteen"
      ],
      "answer": "fourteen",
      "explanation": "nine plus five = fourteen."
    },
    {
      "type": "fill",
      "prompt": "nine + six = ______",
      "answers": [
        "fifteen"
      ],
      "explanation": "nine + six = fifteen."
    },
    {
      "type": "choice",
      "prompt": "What is nine plus six?",
      "options": [
        "three",
        "fifteen",
        "six",
        "seven"
      ],
      "answer": "fifteen",
      "explanation": "nine plus six = fifteen."
    },
    {
      "type": "fill",
      "prompt": "two - one = ______",
      "answers": [
        "one"
      ],
      "explanation": "two - one = one."
    },
    {
      "type": "choice",
      "prompt": "What is two minus one?",
      "options": [
        "eight",
        "fourteen",
        "thirteen",
        "one"
      ],
      "answer": "one",
      "explanation": "two minus one = one."
    },
    {
      "type": "fill",
      "prompt": "three - one = ______",
      "answers": [
        "two"
      ],
      "explanation": "three - one = two."
    },
    {
      "type": "choice",
      "prompt": "What is three minus one?",
      "options": [
        "six",
        "one",
        "two",
        "ten"
      ],
      "answer": "two",
      "explanation": "three minus one = two."
    },
    {
      "type": "fill",
      "prompt": "three - two = ______",
      "answers": [
        "one"
      ],
      "explanation": "three - two = one."
    },
    {
      "type": "choice",
      "prompt": "What is three minus two?",
      "options": [
        "eighteen",
        "seventeen",
        "three",
        "one"
      ],
      "answer": "one",
      "explanation": "three minus two = one."
    },
    {
      "type": "fill",
      "prompt": "four - one = ______",
      "answers": [
        "three"
      ],
      "explanation": "four - one = three."
    },
    {
      "type": "choice",
      "prompt": "What is four minus one?",
      "options": [
        "three",
        "twelve",
        "fifteen",
        "one"
      ],
      "answer": "three",
      "explanation": "four minus one = three."
    },
    {
      "type": "fill",
      "prompt": "four - two = ______",
      "answers": [
        "two"
      ],
      "explanation": "four - two = two."
    },
    {
      "type": "choice",
      "prompt": "What is four minus two?",
      "options": [
        "two",
        "seven",
        "seventeen",
        "twenty"
      ],
      "answer": "two",
      "explanation": "four minus two = two."
    },
    {
      "type": "fill",
      "prompt": "four - three = ______",
      "answers": [
        "one"
      ],
      "explanation": "four - three = one."
    },
    {
      "type": "choice",
      "prompt": "What is four minus three?",
      "options": [
        "one",
        "three",
        "fifteen",
        "sixteen"
      ],
      "answer": "one",
      "explanation": "four minus three = one."
    },
    {
      "type": "fill",
      "prompt": "five - one = ______",
      "answers": [
        "four"
      ],
      "explanation": "five - one = four."
    },
    {
      "type": "choice",
      "prompt": "What is five minus one?",
      "options": [
        "fifteen",
        "five",
        "four",
        "two"
      ],
      "answer": "four",
      "explanation": "five minus one = four."
    },
    {
      "type": "fill",
      "prompt": "five - two = ______",
      "answers": [
        "three"
      ],
      "explanation": "five - two = three."
    },
    {
      "type": "choice",
      "prompt": "What is five minus two?",
      "options": [
        "three",
        "twenty",
        "twelve",
        "fifteen"
      ],
      "answer": "three",
      "explanation": "five minus two = three."
    },
    {
      "type": "fill",
      "prompt": "five - three = ______",
      "answers": [
        "two"
      ],
      "explanation": "five - three = two."
    },
    {
      "type": "choice",
      "prompt": "What is five minus three?",
      "options": [
        "seventeen",
        "two",
        "seven",
        "six"
      ],
      "answer": "two",
      "explanation": "five minus three = two."
    },
    {
      "type": "fill",
      "prompt": "five - four = ______",
      "answers": [
        "one"
      ],
      "explanation": "five - four = one."
    },
    {
      "type": "choice",
      "prompt": "What is five minus four?",
      "options": [
        "nine",
        "twenty",
        "seven",
        "one"
      ],
      "answer": "one",
      "explanation": "five minus four = one."
    },
    {
      "type": "fill",
      "prompt": "six - one = ______",
      "answers": [
        "five"
      ],
      "explanation": "six - one = five."
    },
    {
      "type": "choice",
      "prompt": "What is six minus one?",
      "options": [
        "seven",
        "one",
        "fifteen",
        "five"
      ],
      "answer": "five",
      "explanation": "six minus one = five."
    },
    {
      "type": "fill",
      "prompt": "six - two = ______",
      "answers": [
        "four"
      ],
      "explanation": "six - two = four."
    },
    {
      "type": "choice",
      "prompt": "What is six minus two?",
      "options": [
        "three",
        "eighteen",
        "five",
        "four"
      ],
      "answer": "four",
      "explanation": "six minus two = four."
    },
    {
      "type": "fill",
      "prompt": "six - three = ______",
      "answers": [
        "three"
      ],
      "explanation": "six - three = three."
    },
    {
      "type": "choice",
      "prompt": "What is six minus three?",
      "options": [
        "nine",
        "three",
        "sixteen",
        "six"
      ],
      "answer": "three",
      "explanation": "six minus three = three."
    },
    {
      "type": "fill",
      "prompt": "six - four = ______",
      "answers": [
        "two"
      ],
      "explanation": "six - four = two."
    },
    {
      "type": "choice",
      "prompt": "What is six minus four?",
      "options": [
        "twelve",
        "three",
        "seventeen",
        "two"
      ],
      "answer": "two",
      "explanation": "six minus four = two."
    },
    {
      "type": "fill",
      "prompt": "six - five = ______",
      "answers": [
        "one"
      ],
      "explanation": "six - five = one."
    },
    {
      "type": "choice",
      "prompt": "What is six minus five?",
      "options": [
        "eighteen",
        "seventeen",
        "one",
        "sixteen"
      ],
      "answer": "one",
      "explanation": "six minus five = one."
    },
    {
      "type": "fill",
      "prompt": "seven - one = ______",
      "answers": [
        "six"
      ],
      "explanation": "seven - one = six."
    },
    {
      "type": "choice",
      "prompt": "What is seven minus one?",
      "options": [
        "seventeen",
        "ten",
        "six",
        "eighteen"
      ],
      "answer": "six",
      "explanation": "seven minus one = six."
    },
    {
      "type": "fill",
      "prompt": "seven - two = ______",
      "answers": [
        "five"
      ],
      "explanation": "seven - two = five."
    },
    {
      "type": "choice",
      "prompt": "What is seven minus two?",
      "options": [
        "four",
        "fifteen",
        "five",
        "eight"
      ],
      "answer": "five",
      "explanation": "seven minus two = five."
    },
    {
      "type": "fill",
      "prompt": "seven - three = ______",
      "answers": [
        "four"
      ],
      "explanation": "seven - three = four."
    },
    {
      "type": "choice",
      "prompt": "What is seven minus three?",
      "options": [
        "twenty",
        "four",
        "one",
        "six"
      ],
      "answer": "four",
      "explanation": "seven minus three = four."
    },
    {
      "type": "fill",
      "prompt": "seven - four = ______",
      "answers": [
        "three"
      ],
      "explanation": "seven - four = three."
    },
    {
      "type": "choice",
      "prompt": "What is seven minus four?",
      "options": [
        "nineteen",
        "three",
        "six",
        "one"
      ],
      "answer": "three",
      "explanation": "seven minus four = three."
    },
    {
      "type": "fill",
      "prompt": "seven - five = ______",
      "answers": [
        "two"
      ],
      "explanation": "seven - five = two."
    },
    {
      "type": "choice",
      "prompt": "What is seven minus five?",
      "options": [
        "thirteen",
        "eleven",
        "two",
        "seven"
      ],
      "answer": "two",
      "explanation": "seven minus five = two."
    },
    {
      "type": "fill",
      "prompt": "seven - six = ______",
      "answers": [
        "one"
      ],
      "explanation": "seven - six = one."
    },
    {
      "type": "choice",
      "prompt": "What is seven minus six?",
      "options": [
        "twenty",
        "five",
        "eighteen",
        "one"
      ],
      "answer": "one",
      "explanation": "seven minus six = one."
    },
    {
      "type": "fill",
      "prompt": "eight - one = ______",
      "answers": [
        "seven"
      ],
      "explanation": "eight - one = seven."
    },
    {
      "type": "choice",
      "prompt": "What is eight minus one?",
      "options": [
        "nineteen",
        "seven",
        "three",
        "six"
      ],
      "answer": "seven",
      "explanation": "eight minus one = seven."
    },
    {
      "type": "fill",
      "prompt": "eight - two = ______",
      "answers": [
        "six"
      ],
      "explanation": "eight - two = six."
    },
    {
      "type": "choice",
      "prompt": "What is eight minus two?",
      "options": [
        "thirteen",
        "five",
        "six",
        "seven"
      ],
      "answer": "six",
      "explanation": "eight minus two = six."
    },
    {
      "type": "fill",
      "prompt": "eight - three = ______",
      "answers": [
        "five"
      ],
      "explanation": "eight - three = five."
    },
    {
      "type": "choice",
      "prompt": "What is eight minus three?",
      "options": [
        "nine",
        "five",
        "seven",
        "fifteen"
      ],
      "answer": "five",
      "explanation": "eight minus three = five."
    },
    {
      "type": "fill",
      "prompt": "eight - four = ______",
      "answers": [
        "four"
      ],
      "explanation": "eight - four = four."
    },
    {
      "type": "choice",
      "prompt": "What is eight minus four?",
      "options": [
        "twenty",
        "four",
        "fourteen",
        "nine"
      ],
      "answer": "four",
      "explanation": "eight minus four = four."
    },
    {
      "type": "fill",
      "prompt": "eight - five = ______",
      "answers": [
        "three"
      ],
      "explanation": "eight - five = three."
    },
    {
      "type": "choice",
      "prompt": "What is eight minus five?",
      "options": [
        "twelve",
        "seventeen",
        "three",
        "seven"
      ],
      "answer": "three",
      "explanation": "eight minus five = three."
    },
    {
      "type": "fill",
      "prompt": "eight - six = ______",
      "answers": [
        "two"
      ],
      "explanation": "eight - six = two."
    },
    {
      "type": "choice",
      "prompt": "What is eight minus six?",
      "options": [
        "eleven",
        "five",
        "two",
        "seventeen"
      ],
      "answer": "two",
      "explanation": "eight minus six = two."
    },
    {
      "type": "fill",
      "prompt": "eight - seven = ______",
      "answers": [
        "one"
      ],
      "explanation": "eight - seven = one."
    },
    {
      "type": "choice",
      "prompt": "What is eight minus seven?",
      "options": [
        "one",
        "nine",
        "sixteen",
        "two"
      ],
      "answer": "one",
      "explanation": "eight minus seven = one."
    },
    {
      "type": "fill",
      "prompt": "nine - one = ______",
      "answers": [
        "eight"
      ],
      "explanation": "nine - one = eight."
    },
    {
      "type": "choice",
      "prompt": "What is nine minus one?",
      "options": [
        "eight",
        "six",
        "four",
        "five"
      ],
      "answer": "eight",
      "explanation": "nine minus one = eight."
    },
    {
      "type": "fill",
      "prompt": "nine - two = ______",
      "answers": [
        "seven"
      ],
      "explanation": "nine - two = seven."
    },
    {
      "type": "choice",
      "prompt": "What is nine minus two?",
      "options": [
        "seven",
        "ten",
        "fifteen",
        "thirteen"
      ],
      "answer": "seven",
      "explanation": "nine minus two = seven."
    },
    {
      "type": "fill",
      "prompt": "nine - three = ______",
      "answers": [
        "six"
      ],
      "explanation": "nine - three = six."
    },
    {
      "type": "choice",
      "prompt": "What is nine minus three?",
      "options": [
        "six",
        "seventeen",
        "nine",
        "ten"
      ],
      "answer": "six",
      "explanation": "nine minus three = six."
    },
    {
      "type": "fill",
      "prompt": "nine - four = ______",
      "answers": [
        "five"
      ],
      "explanation": "nine - four = five."
    },
    {
      "type": "choice",
      "prompt": "What is nine minus four?",
      "options": [
        "four",
        "seventeen",
        "twelve",
        "five"
      ],
      "answer": "five",
      "explanation": "nine minus four = five."
    },
    {
      "type": "fill",
      "prompt": "nine - five = ______",
      "answers": [
        "four"
      ],
      "explanation": "nine - five = four."
    },
    {
      "type": "choice",
      "prompt": "What is nine minus five?",
      "options": [
        "twenty",
        "four",
        "nine",
        "seven"
      ],
      "answer": "four",
      "explanation": "nine minus five = four."
    },
    {
      "type": "fill",
      "prompt": "nine - six = ______",
      "answers": [
        "three"
      ],
      "explanation": "nine - six = three."
    },
    {
      "type": "choice",
      "prompt": "What is nine minus six?",
      "options": [
        "ten",
        "three",
        "fifteen",
        "one"
      ],
      "answer": "three",
      "explanation": "nine minus six = three."
    },
    {
      "type": "fill",
      "prompt": "nine - seven = ______",
      "answers": [
        "two"
      ],
      "explanation": "nine - seven = two."
    },
    {
      "type": "choice",
      "prompt": "What is nine minus seven?",
      "options": [
        "eleven",
        "two",
        "seven",
        "three"
      ],
      "answer": "two",
      "explanation": "nine minus seven = two."
    },
    {
      "type": "fill",
      "prompt": "nine - eight = ______",
      "answers": [
        "one"
      ],
      "explanation": "nine - eight = one."
    },
    {
      "type": "choice",
      "prompt": "What is nine minus eight?",
      "options": [
        "ten",
        "one",
        "eleven",
        "seventeen"
      ],
      "answer": "one",
      "explanation": "nine minus eight = one."
    },
    {
      "type": "fill",
      "prompt": "ten - one = ______",
      "answers": [
        "nine"
      ],
      "explanation": "ten - one = nine."
    },
    {
      "type": "choice",
      "prompt": "What is ten minus one?",
      "options": [
        "three",
        "fourteen",
        "nine",
        "seventeen"
      ],
      "answer": "nine",
      "explanation": "ten minus one = nine."
    },
    {
      "type": "fill",
      "prompt": "ten - two = ______",
      "answers": [
        "eight"
      ],
      "explanation": "ten - two = eight."
    },
    {
      "type": "choice",
      "prompt": "What is ten minus two?",
      "options": [
        "eleven",
        "sixteen",
        "two",
        "eight"
      ],
      "answer": "eight",
      "explanation": "ten minus two = eight."
    },
    {
      "type": "fill",
      "prompt": "ten - three = ______",
      "answers": [
        "seven"
      ],
      "explanation": "ten - three = seven."
    },
    {
      "type": "choice",
      "prompt": "What is ten minus three?",
      "options": [
        "seven",
        "five",
        "ten",
        "three"
      ],
      "answer": "seven",
      "explanation": "ten minus three = seven."
    },
    {
      "type": "fill",
      "prompt": "ten - four = ______",
      "answers": [
        "six"
      ],
      "explanation": "ten - four = six."
    },
    {
      "type": "choice",
      "prompt": "What is ten minus four?",
      "options": [
        "four",
        "eight",
        "three",
        "six"
      ],
      "answer": "six",
      "explanation": "ten minus four = six."
    },
    {
      "type": "fill",
      "prompt": "ten - five = ______",
      "answers": [
        "five"
      ],
      "explanation": "ten - five = five."
    },
    {
      "type": "choice",
      "prompt": "What is ten minus five?",
      "options": [
        "nine",
        "five",
        "eighteen",
        "fourteen"
      ],
      "answer": "five",
      "explanation": "ten minus five = five."
    },
    {
      "type": "fill",
      "prompt": "ten - six = ______",
      "answers": [
        "four"
      ],
      "explanation": "ten - six = four."
    },
    {
      "type": "choice",
      "prompt": "What is ten minus six?",
      "options": [
        "eight",
        "twenty",
        "eighteen",
        "four"
      ],
      "answer": "four",
      "explanation": "ten minus six = four."
    },
    {
      "type": "fill",
      "prompt": "ten - seven = ______",
      "answers": [
        "three"
      ],
      "explanation": "ten - seven = three."
    },
    {
      "type": "choice",
      "prompt": "What is ten minus seven?",
      "options": [
        "nine",
        "twenty",
        "three",
        "nineteen"
      ],
      "answer": "three",
      "explanation": "ten minus seven = three."
    },
    {
      "type": "fill",
      "prompt": "ten - eight = ______",
      "answers": [
        "two"
      ],
      "explanation": "ten - eight = two."
    },
    {
      "type": "choice",
      "prompt": "What is ten minus eight?",
      "options": [
        "two",
        "twenty",
        "eighteen",
        "seventeen"
      ],
      "answer": "two",
      "explanation": "ten minus eight = two."
    },
    {
      "type": "fill",
      "prompt": "ten - nine = ______",
      "answers": [
        "one"
      ],
      "explanation": "ten - nine = one."
    },
    {
      "type": "choice",
      "prompt": "What is ten minus nine?",
      "options": [
        "three",
        "eight",
        "thirteen",
        "one"
      ],
      "answer": "one",
      "explanation": "ten minus nine = one."
    },
    {
      "type": "choice",
      "prompt": "What number comes after one?",
      "options": [
        "seven",
        "sixteen",
        "two",
        "nineteen"
      ],
      "answer": "two",
      "explanation": "After one comes two."
    },
    {
      "type": "choice",
      "prompt": "What number comes after two?",
      "options": [
        "twelve",
        "fourteen",
        "ten",
        "three"
      ],
      "answer": "three",
      "explanation": "After two comes three."
    },
    {
      "type": "choice",
      "prompt": "What number comes after three?",
      "options": [
        "eighteen",
        "four",
        "seventeen",
        "fourteen"
      ],
      "answer": "four",
      "explanation": "After three comes four."
    },
    {
      "type": "choice",
      "prompt": "What number comes after four?",
      "options": [
        "five",
        "six",
        "two",
        "ten"
      ],
      "answer": "five",
      "explanation": "After four comes five."
    },
    {
      "type": "choice",
      "prompt": "What number comes after five?",
      "options": [
        "seventeen",
        "two",
        "six",
        "twelve"
      ],
      "answer": "six",
      "explanation": "After five comes six."
    },
    {
      "type": "choice",
      "prompt": "What number comes after six?",
      "options": [
        "ten",
        "seven",
        "thirteen",
        "eleven"
      ],
      "answer": "seven",
      "explanation": "After six comes seven."
    },
    {
      "type": "choice",
      "prompt": "What number comes after seven?",
      "options": [
        "eight",
        "eighteen",
        "eleven",
        "fifteen"
      ],
      "answer": "eight",
      "explanation": "After seven comes eight."
    },
    {
      "type": "choice",
      "prompt": "What number comes after eight?",
      "options": [
        "twenty",
        "eighteen",
        "six",
        "nine"
      ],
      "answer": "nine",
      "explanation": "After eight comes nine."
    },
    {
      "type": "choice",
      "prompt": "What number comes after nine?",
      "options": [
        "ten",
        "two",
        "fourteen",
        "eleven"
      ],
      "answer": "ten",
      "explanation": "After nine comes ten."
    },
    {
      "type": "choice",
      "prompt": "What number comes after ten?",
      "options": [
        "five",
        "four",
        "fourteen",
        "eleven"
      ],
      "answer": "eleven",
      "explanation": "After ten comes eleven."
    },
    {
      "type": "choice",
      "prompt": "What number comes after eleven?",
      "options": [
        "fifteen",
        "twelve",
        "four",
        "twenty"
      ],
      "answer": "twelve",
      "explanation": "After eleven comes twelve."
    },
    {
      "type": "choice",
      "prompt": "What number comes after twelve?",
      "options": [
        "four",
        "seven",
        "five",
        "thirteen"
      ],
      "answer": "thirteen",
      "explanation": "After twelve comes thirteen."
    },
    {
      "type": "choice",
      "prompt": "What number comes after thirteen?",
      "options": [
        "fourteen",
        "six",
        "twelve",
        "seventeen"
      ],
      "answer": "fourteen",
      "explanation": "After thirteen comes fourteen."
    },
    {
      "type": "choice",
      "prompt": "What number comes after fourteen?",
      "options": [
        "twelve",
        "seven",
        "twenty",
        "fifteen"
      ],
      "answer": "fifteen",
      "explanation": "After fourteen comes fifteen."
    },
    {
      "type": "choice",
      "prompt": "What number comes after fifteen?",
      "options": [
        "eighteen",
        "sixteen",
        "two",
        "one"
      ],
      "answer": "sixteen",
      "explanation": "After fifteen comes sixteen."
    },
    {
      "type": "choice",
      "prompt": "What number comes after sixteen?",
      "options": [
        "seventeen",
        "ten",
        "eleven",
        "nine"
      ],
      "answer": "seventeen",
      "explanation": "After sixteen comes seventeen."
    },
    {
      "type": "choice",
      "prompt": "What number comes after seventeen?",
      "options": [
        "two",
        "seven",
        "eighteen",
        "thirteen"
      ],
      "answer": "eighteen",
      "explanation": "After seventeen comes eighteen."
    },
    {
      "type": "choice",
      "prompt": "What number comes after eighteen?",
      "options": [
        "seventeen",
        "seven",
        "eleven",
        "nineteen"
      ],
      "answer": "nineteen",
      "explanation": "After eighteen comes nineteen."
    },
    {
      "type": "choice",
      "prompt": "What number comes after nineteen?",
      "options": [
        "thirteen",
        "seventeen",
        "twenty",
        "fourteen"
      ],
      "answer": "twenty",
      "explanation": "After nineteen comes twenty."
    },
    {
      "type": "choice",
      "prompt": "What number comes before two?",
      "options": [
        "eighteen",
        "twenty",
        "one",
        "nine"
      ],
      "answer": "one",
      "explanation": "Before two comes one."
    },
    {
      "type": "choice",
      "prompt": "What number comes before three?",
      "options": [
        "eight",
        "thirteen",
        "two",
        "nineteen"
      ],
      "answer": "two",
      "explanation": "Before three comes two."
    },
    {
      "type": "choice",
      "prompt": "What number comes before four?",
      "options": [
        "five",
        "one",
        "ten",
        "three"
      ],
      "answer": "three",
      "explanation": "Before four comes three."
    },
    {
      "type": "choice",
      "prompt": "What number comes before five?",
      "options": [
        "five",
        "sixteen",
        "four",
        "six"
      ],
      "answer": "four",
      "explanation": "Before five comes four."
    },
    {
      "type": "choice",
      "prompt": "What number comes before six?",
      "options": [
        "fifteen",
        "five",
        "six",
        "eight"
      ],
      "answer": "five",
      "explanation": "Before six comes five."
    },
    {
      "type": "choice",
      "prompt": "What number comes before seven?",
      "options": [
        "six",
        "eight",
        "seven",
        "sixteen"
      ],
      "answer": "six",
      "explanation": "Before seven comes six."
    },
    {
      "type": "choice",
      "prompt": "What number comes before eight?",
      "options": [
        "seven",
        "thirteen",
        "fourteen",
        "eleven"
      ],
      "answer": "seven",
      "explanation": "Before eight comes seven."
    },
    {
      "type": "choice",
      "prompt": "What number comes before nine?",
      "options": [
        "fourteen",
        "eight",
        "six",
        "five"
      ],
      "answer": "eight",
      "explanation": "Before nine comes eight."
    },
    {
      "type": "choice",
      "prompt": "What number comes before ten?",
      "options": [
        "four",
        "three",
        "nine",
        "eighteen"
      ],
      "answer": "nine",
      "explanation": "Before ten comes nine."
    },
    {
      "type": "choice",
      "prompt": "What number comes before eleven?",
      "options": [
        "one",
        "nine",
        "sixteen",
        "ten"
      ],
      "answer": "ten",
      "explanation": "Before eleven comes ten."
    },
    {
      "type": "choice",
      "prompt": "What number comes before twelve?",
      "options": [
        "nine",
        "eleven",
        "four",
        "thirteen"
      ],
      "answer": "eleven",
      "explanation": "Before twelve comes eleven."
    },
    {
      "type": "choice",
      "prompt": "What number comes before thirteen?",
      "options": [
        "nine",
        "twenty",
        "seventeen",
        "twelve"
      ],
      "answer": "twelve",
      "explanation": "Before thirteen comes twelve."
    },
    {
      "type": "choice",
      "prompt": "What number comes before fourteen?",
      "options": [
        "thirteen",
        "five",
        "nineteen",
        "twelve"
      ],
      "answer": "thirteen",
      "explanation": "Before fourteen comes thirteen."
    },
    {
      "type": "choice",
      "prompt": "What number comes before fifteen?",
      "options": [
        "fourteen",
        "nineteen",
        "fifteen",
        "four"
      ],
      "answer": "fourteen",
      "explanation": "Before fifteen comes fourteen."
    },
    {
      "type": "choice",
      "prompt": "What number comes before sixteen?",
      "options": [
        "two",
        "fifteen",
        "thirteen",
        "twenty"
      ],
      "answer": "fifteen",
      "explanation": "Before sixteen comes fifteen."
    },
    {
      "type": "choice",
      "prompt": "What number comes before seventeen?",
      "options": [
        "seventeen",
        "twelve",
        "eighteen",
        "sixteen"
      ],
      "answer": "sixteen",
      "explanation": "Before seventeen comes sixteen."
    },
    {
      "type": "choice",
      "prompt": "What number comes before eighteen?",
      "options": [
        "thirteen",
        "eight",
        "eighteen",
        "seventeen"
      ],
      "answer": "seventeen",
      "explanation": "Before eighteen comes seventeen."
    },
    {
      "type": "choice",
      "prompt": "What number comes before nineteen?",
      "options": [
        "eighteen",
        "nineteen",
        "eight",
        "five"
      ],
      "answer": "eighteen",
      "explanation": "Before nineteen comes eighteen."
    },
    {
      "type": "choice",
      "prompt": "What number comes before twenty?",
      "options": [
        "eighteen",
        "nineteen",
        "fifteen",
        "six"
      ],
      "answer": "nineteen",
      "explanation": "Before twenty comes nineteen."
    }
  ],
  "family": [
    {
      "type": "choice",
      "prompt": "\"mother\" có nghĩa là gì?",
      "options": [
        "mẹ",
        "ông",
        "bà",
        "gia đình"
      ],
      "answer": "mẹ",
      "explanation": "mother = mẹ."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"mẹ\"?",
      "options": [
        "brother",
        "mother",
        "family",
        "grandmother"
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
      "prompt": "Điền từ còn thiếu: This is my ______. (mẹ)",
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
        "mẹ",
        "gia đình",
        "bố"
      ],
      "answer": "bố",
      "explanation": "father = bố."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"bố\"?",
      "options": [
        "brother",
        "grandfather",
        "father",
        "grandmother"
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
      "prompt": "Điền từ còn thiếu: This is my ______. (bố)",
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
        "em bé",
        "chị/em gái",
        "mẹ"
      ],
      "answer": "chị/em gái",
      "explanation": "sister = chị/em gái."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"chị/em gái\"?",
      "options": [
        "baby",
        "sister",
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
      "prompt": "Điền từ còn thiếu: My ______ is five. (chị/em gái)",
      "answers": [
        "sister"
      ],
      "explanation": "Câu đầy đủ: My sister is five."
    },
    {
      "type": "choice",
      "prompt": "\"brother\" có nghĩa là gì?",
      "options": [
        "mẹ",
        "anh/em trai",
        "bà",
        "chị/em gái"
      ],
      "answer": "anh/em trai",
      "explanation": "brother = anh/em trai."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"anh/em trai\"?",
      "options": [
        "brother",
        "baby",
        "grandfather",
        "sister"
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
      "prompt": "Điền từ còn thiếu: My ______ is ten. (anh/em trai)",
      "answers": [
        "brother"
      ],
      "explanation": "Câu đầy đủ: My brother is ten."
    },
    {
      "type": "choice",
      "prompt": "\"grandmother\" có nghĩa là gì?",
      "options": [
        "bà",
        "gia đình",
        "chị/em gái",
        "mẹ"
      ],
      "answer": "bà",
      "explanation": "grandmother = bà."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"bà\"?",
      "options": [
        "grandmother",
        "family",
        "grandfather",
        "father"
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
      "prompt": "Điền từ còn thiếu: My ______ is kind. (bà)",
      "answers": [
        "grandmother"
      ],
      "explanation": "Câu đầy đủ: My grandmother is kind."
    },
    {
      "type": "choice",
      "prompt": "\"grandfather\" có nghĩa là gì?",
      "options": [
        "anh/em trai",
        "ông",
        "bà",
        "chị/em gái"
      ],
      "answer": "ông",
      "explanation": "grandfather = ông."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"ông\"?",
      "options": [
        "family",
        "baby",
        "grandmother",
        "grandfather"
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
      "prompt": "Điền từ còn thiếu: My ______ is old. (ông)",
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
        "chị/em gái",
        "bà",
        "ông"
      ],
      "answer": "gia đình",
      "explanation": "family = gia đình."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"gia đình\"?",
      "options": [
        "family",
        "father",
        "mother",
        "brother"
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
      "prompt": "Điền từ còn thiếu: I love my ______. (gia đình)",
      "answers": [
        "family"
      ],
      "explanation": "Câu đầy đủ: I love my family."
    },
    {
      "type": "choice",
      "prompt": "\"baby\" có nghĩa là gì?",
      "options": [
        "em bé",
        "bà",
        "anh/em trai",
        "ông"
      ],
      "answer": "em bé",
      "explanation": "baby = em bé."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"em bé\"?",
      "options": [
        "family",
        "baby",
        "sister",
        "brother"
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
      "prompt": "Điền từ còn thiếu: The ______ is sleeping. (em bé)",
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
        "mẹ tôi",
        "ông của họ",
        "con trai của họ",
        "bà của anh ấy"
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
        "em bé của họ",
        "ông của cô ấy",
        "chú/bác của họ",
        "bố tôi"
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
        "chị/em gái tôi",
        "em bé của anh ấy",
        "em bé của cô ấy",
        "con trai của bạn"
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
        "anh/em trai tôi",
        "chú/bác của cô ấy",
        "cô/dì của họ",
        "chú/bác tôi"
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
        "con trai của anh ấy",
        "con gái của anh ấy",
        "bà tôi",
        "mẹ của chúng tôi"
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
        "chú/bác tôi",
        "cô/dì của chúng tôi",
        "ông tôi",
        "em bé của anh ấy"
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
      "prompt": "\"my uncle\" có nghĩa là gì?",
      "options": [
        "con gái của chúng tôi",
        "chú/bác tôi",
        "ông của họ",
        "anh/em trai của họ"
      ],
      "answer": "chú/bác tôi",
      "explanation": "my uncle = chú/bác tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ uncle. (Đây là chú/bác tôi.)",
      "answers": [
        "my"
      ],
      "explanation": "This is my uncle. = Đây là chú/bác tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là chú/bác tôi.\"",
      "answers": [
        "this is my uncle"
      ],
      "explanation": "This is my uncle. = Đây là chú/bác tôi."
    },
    {
      "type": "choice",
      "prompt": "\"my aunt\" có nghĩa là gì?",
      "options": [
        "cô/dì tôi",
        "chị/em gái của anh ấy",
        "cô/dì của chúng tôi",
        "bà của bạn"
      ],
      "answer": "cô/dì tôi",
      "explanation": "my aunt = cô/dì tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ aunt. (Đây là cô/dì tôi.)",
      "answers": [
        "my"
      ],
      "explanation": "This is my aunt. = Đây là cô/dì tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là cô/dì tôi.\"",
      "answers": [
        "this is my aunt"
      ],
      "explanation": "This is my aunt. = Đây là cô/dì tôi."
    },
    {
      "type": "choice",
      "prompt": "\"my son\" có nghĩa là gì?",
      "options": [
        "chú/bác của cô ấy",
        "con trai tôi",
        "bố của cô ấy",
        "cô/dì của bạn"
      ],
      "answer": "con trai tôi",
      "explanation": "my son = con trai tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ son. (Đây là con trai tôi.)",
      "answers": [
        "my"
      ],
      "explanation": "This is my son. = Đây là con trai tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là con trai tôi.\"",
      "answers": [
        "this is my son"
      ],
      "explanation": "This is my son. = Đây là con trai tôi."
    },
    {
      "type": "choice",
      "prompt": "\"my daughter\" có nghĩa là gì?",
      "options": [
        "bố của bạn",
        "con gái tôi",
        "con gái của chúng tôi",
        "anh/em trai của cô ấy"
      ],
      "answer": "con gái tôi",
      "explanation": "my daughter = con gái tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ daughter. (Đây là con gái tôi.)",
      "answers": [
        "my"
      ],
      "explanation": "This is my daughter. = Đây là con gái tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là con gái tôi.\"",
      "answers": [
        "this is my daughter"
      ],
      "explanation": "This is my daughter. = Đây là con gái tôi."
    },
    {
      "type": "choice",
      "prompt": "\"my baby\" có nghĩa là gì?",
      "options": [
        "ông của họ",
        "chú/bác của họ",
        "em bé tôi",
        "ông của cô ấy"
      ],
      "answer": "em bé tôi",
      "explanation": "my baby = em bé tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ baby. (Đây là em bé tôi.)",
      "answers": [
        "my"
      ],
      "explanation": "This is my baby. = Đây là em bé tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là em bé tôi.\"",
      "answers": [
        "this is my baby"
      ],
      "explanation": "This is my baby. = Đây là em bé tôi."
    },
    {
      "type": "choice",
      "prompt": "\"his mother\" có nghĩa là gì?",
      "options": [
        "mẹ của anh ấy",
        "em bé của cô ấy",
        "chị/em gái của cô ấy",
        "ông của anh ấy"
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
        "bố của anh ấy",
        "chú/bác của anh ấy",
        "bố của họ",
        "bà của cô ấy"
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
        "con gái tôi",
        "chị/em gái của anh ấy",
        "em bé của cô ấy",
        "ông của họ"
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
        "cô/dì của họ",
        "mẹ của họ",
        "anh/em trai của anh ấy",
        "con gái của anh ấy"
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
        "con gái của anh ấy",
        "bà của chúng tôi",
        "bà của anh ấy",
        "con trai của họ"
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
        "ông của anh ấy",
        "cô/dì của cô ấy",
        "bố của cô ấy",
        "ông của họ"
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
      "prompt": "\"his uncle\" có nghĩa là gì?",
      "options": [
        "cô/dì của bạn",
        "chú/bác của anh ấy",
        "bố của anh ấy",
        "con trai của cô ấy"
      ],
      "answer": "chú/bác của anh ấy",
      "explanation": "his uncle = chú/bác của anh ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ uncle. (Đây là chú/bác của anh ấy.)",
      "answers": [
        "his"
      ],
      "explanation": "This is his uncle. = Đây là chú/bác của anh ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là chú/bác của anh ấy.\"",
      "answers": [
        "this is his uncle"
      ],
      "explanation": "This is his uncle. = Đây là chú/bác của anh ấy."
    },
    {
      "type": "choice",
      "prompt": "\"his aunt\" có nghĩa là gì?",
      "options": [
        "chị/em gái của chúng tôi",
        "chị/em gái của anh ấy",
        "cô/dì của anh ấy",
        "ông của bạn"
      ],
      "answer": "cô/dì của anh ấy",
      "explanation": "his aunt = cô/dì của anh ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ aunt. (Đây là cô/dì của anh ấy.)",
      "answers": [
        "his"
      ],
      "explanation": "This is his aunt. = Đây là cô/dì của anh ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là cô/dì của anh ấy.\"",
      "answers": [
        "this is his aunt"
      ],
      "explanation": "This is his aunt. = Đây là cô/dì của anh ấy."
    },
    {
      "type": "choice",
      "prompt": "\"his son\" có nghĩa là gì?",
      "options": [
        "con trai của anh ấy",
        "cô/dì của anh ấy",
        "chú/bác của cô ấy",
        "chị/em gái của bạn"
      ],
      "answer": "con trai của anh ấy",
      "explanation": "his son = con trai của anh ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ son. (Đây là con trai của anh ấy.)",
      "answers": [
        "his"
      ],
      "explanation": "This is his son. = Đây là con trai của anh ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là con trai của anh ấy.\"",
      "answers": [
        "this is his son"
      ],
      "explanation": "This is his son. = Đây là con trai của anh ấy."
    },
    {
      "type": "choice",
      "prompt": "\"his daughter\" có nghĩa là gì?",
      "options": [
        "con gái của anh ấy",
        "anh/em trai của anh ấy",
        "bà tôi",
        "bố tôi"
      ],
      "answer": "con gái của anh ấy",
      "explanation": "his daughter = con gái của anh ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ daughter. (Đây là con gái của anh ấy.)",
      "answers": [
        "his"
      ],
      "explanation": "This is his daughter. = Đây là con gái của anh ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là con gái của anh ấy.\"",
      "answers": [
        "this is his daughter"
      ],
      "explanation": "This is his daughter. = Đây là con gái của anh ấy."
    },
    {
      "type": "choice",
      "prompt": "\"his baby\" có nghĩa là gì?",
      "options": [
        "em bé của anh ấy",
        "ông của chúng tôi",
        "em bé của chúng tôi",
        "chú/bác của anh ấy"
      ],
      "answer": "em bé của anh ấy",
      "explanation": "his baby = em bé của anh ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ baby. (Đây là em bé của anh ấy.)",
      "answers": [
        "his"
      ],
      "explanation": "This is his baby. = Đây là em bé của anh ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là em bé của anh ấy.\"",
      "answers": [
        "this is his baby"
      ],
      "explanation": "This is his baby. = Đây là em bé của anh ấy."
    },
    {
      "type": "choice",
      "prompt": "\"her mother\" có nghĩa là gì?",
      "options": [
        "mẹ của cô ấy",
        "ông của họ",
        "ông của bạn",
        "cô/dì của họ"
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
        "bố của cô ấy",
        "chị/em gái của họ",
        "con gái của họ",
        "chú/bác của họ"
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
        "chị/em gái của cô ấy",
        "con trai tôi",
        "bà của cô ấy",
        "ông của bạn"
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
        "em bé tôi",
        "em bé của họ",
        "con trai của họ",
        "bà của cô ấy"
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
        "bố của anh ấy",
        "chú/bác tôi",
        "ông của cô ấy",
        "con gái của chúng tôi"
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
    },
    {
      "type": "choice",
      "prompt": "\"her uncle\" có nghĩa là gì?",
      "options": [
        "bố của họ",
        "mẹ của chúng tôi",
        "chú/bác của cô ấy",
        "chị/em gái của anh ấy"
      ],
      "answer": "chú/bác của cô ấy",
      "explanation": "her uncle = chú/bác của cô ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ uncle. (Đây là chú/bác của cô ấy.)",
      "answers": [
        "her"
      ],
      "explanation": "This is her uncle. = Đây là chú/bác của cô ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là chú/bác của cô ấy.\"",
      "answers": [
        "this is her uncle"
      ],
      "explanation": "This is her uncle. = Đây là chú/bác của cô ấy."
    },
    {
      "type": "choice",
      "prompt": "\"her aunt\" có nghĩa là gì?",
      "options": [
        "bà tôi",
        "cô/dì của cô ấy",
        "bà của cô ấy",
        "mẹ của họ"
      ],
      "answer": "cô/dì của cô ấy",
      "explanation": "her aunt = cô/dì của cô ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ aunt. (Đây là cô/dì của cô ấy.)",
      "answers": [
        "her"
      ],
      "explanation": "This is her aunt. = Đây là cô/dì của cô ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là cô/dì của cô ấy.\"",
      "answers": [
        "this is her aunt"
      ],
      "explanation": "This is her aunt. = Đây là cô/dì của cô ấy."
    },
    {
      "type": "choice",
      "prompt": "\"her son\" có nghĩa là gì?",
      "options": [
        "con trai tôi",
        "cô/dì của anh ấy",
        "con trai của cô ấy",
        "bố tôi"
      ],
      "answer": "con trai của cô ấy",
      "explanation": "her son = con trai của cô ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ son. (Đây là con trai của cô ấy.)",
      "answers": [
        "her"
      ],
      "explanation": "This is her son. = Đây là con trai của cô ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là con trai của cô ấy.\"",
      "answers": [
        "this is her son"
      ],
      "explanation": "This is her son. = Đây là con trai của cô ấy."
    },
    {
      "type": "choice",
      "prompt": "\"her daughter\" có nghĩa là gì?",
      "options": [
        "ông của họ",
        "chú/bác tôi",
        "ông của bạn",
        "con gái của cô ấy"
      ],
      "answer": "con gái của cô ấy",
      "explanation": "her daughter = con gái của cô ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ daughter. (Đây là con gái của cô ấy.)",
      "answers": [
        "her"
      ],
      "explanation": "This is her daughter. = Đây là con gái của cô ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là con gái của cô ấy.\"",
      "answers": [
        "this is her daughter"
      ],
      "explanation": "This is her daughter. = Đây là con gái của cô ấy."
    },
    {
      "type": "choice",
      "prompt": "\"her baby\" có nghĩa là gì?",
      "options": [
        "em bé của cô ấy",
        "chị/em gái của bạn",
        "anh/em trai của anh ấy",
        "em bé tôi"
      ],
      "answer": "em bé của cô ấy",
      "explanation": "her baby = em bé của cô ấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ baby. (Đây là em bé của cô ấy.)",
      "answers": [
        "her"
      ],
      "explanation": "This is her baby. = Đây là em bé của cô ấy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là em bé của cô ấy.\"",
      "answers": [
        "this is her baby"
      ],
      "explanation": "This is her baby. = Đây là em bé của cô ấy."
    },
    {
      "type": "choice",
      "prompt": "\"your mother\" có nghĩa là gì?",
      "options": [
        "mẹ của bạn",
        "chị/em gái của bạn",
        "em bé tôi",
        "chị/em gái của anh ấy"
      ],
      "answer": "mẹ của bạn",
      "explanation": "your mother = mẹ của bạn."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ mother. (Đây là mẹ của bạn.)",
      "answers": [
        "your"
      ],
      "explanation": "This is your mother. = Đây là mẹ của bạn."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là mẹ của bạn.\"",
      "answers": [
        "this is your mother"
      ],
      "explanation": "This is your mother. = Đây là mẹ của bạn."
    },
    {
      "type": "choice",
      "prompt": "\"your father\" có nghĩa là gì?",
      "options": [
        "em bé tôi",
        "con trai của bạn",
        "ông của cô ấy",
        "bố của bạn"
      ],
      "answer": "bố của bạn",
      "explanation": "your father = bố của bạn."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ father. (Đây là bố của bạn.)",
      "answers": [
        "your"
      ],
      "explanation": "This is your father. = Đây là bố của bạn."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là bố của bạn.\"",
      "answers": [
        "this is your father"
      ],
      "explanation": "This is your father. = Đây là bố của bạn."
    },
    {
      "type": "choice",
      "prompt": "\"your sister\" có nghĩa là gì?",
      "options": [
        "mẹ của chúng tôi",
        "bố của chúng tôi",
        "con trai của anh ấy",
        "chị/em gái của bạn"
      ],
      "answer": "chị/em gái của bạn",
      "explanation": "your sister = chị/em gái của bạn."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ sister. (Đây là chị/em gái của bạn.)",
      "answers": [
        "your"
      ],
      "explanation": "This is your sister. = Đây là chị/em gái của bạn."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là chị/em gái của bạn.\"",
      "answers": [
        "this is your sister"
      ],
      "explanation": "This is your sister. = Đây là chị/em gái của bạn."
    },
    {
      "type": "choice",
      "prompt": "\"your brother\" có nghĩa là gì?",
      "options": [
        "anh/em trai của bạn",
        "em bé của bạn",
        "chị/em gái của anh ấy",
        "cô/dì tôi"
      ],
      "answer": "anh/em trai của bạn",
      "explanation": "your brother = anh/em trai của bạn."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ brother. (Đây là anh/em trai của bạn.)",
      "answers": [
        "your"
      ],
      "explanation": "This is your brother. = Đây là anh/em trai của bạn."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là anh/em trai của bạn.\"",
      "answers": [
        "this is your brother"
      ],
      "explanation": "This is your brother. = Đây là anh/em trai của bạn."
    },
    {
      "type": "choice",
      "prompt": "\"your grandmother\" có nghĩa là gì?",
      "options": [
        "chị/em gái của bạn",
        "chị/em gái của họ",
        "bố tôi",
        "bà của bạn"
      ],
      "answer": "bà của bạn",
      "explanation": "your grandmother = bà của bạn."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ grandmother. (Đây là bà của bạn.)",
      "answers": [
        "your"
      ],
      "explanation": "This is your grandmother. = Đây là bà của bạn."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là bà của bạn.\"",
      "answers": [
        "this is your grandmother"
      ],
      "explanation": "This is your grandmother. = Đây là bà của bạn."
    },
    {
      "type": "choice",
      "prompt": "\"your grandfather\" có nghĩa là gì?",
      "options": [
        "ông của bạn",
        "em bé của anh ấy",
        "bà của bạn",
        "con trai của chúng tôi"
      ],
      "answer": "ông của bạn",
      "explanation": "your grandfather = ông của bạn."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ grandfather. (Đây là ông của bạn.)",
      "answers": [
        "your"
      ],
      "explanation": "This is your grandfather. = Đây là ông của bạn."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là ông của bạn.\"",
      "answers": [
        "this is your grandfather"
      ],
      "explanation": "This is your grandfather. = Đây là ông của bạn."
    },
    {
      "type": "choice",
      "prompt": "\"your uncle\" có nghĩa là gì?",
      "options": [
        "chú/bác của bạn",
        "anh/em trai của chúng tôi",
        "con trai của chúng tôi",
        "bố tôi"
      ],
      "answer": "chú/bác của bạn",
      "explanation": "your uncle = chú/bác của bạn."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ uncle. (Đây là chú/bác của bạn.)",
      "answers": [
        "your"
      ],
      "explanation": "This is your uncle. = Đây là chú/bác của bạn."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là chú/bác của bạn.\"",
      "answers": [
        "this is your uncle"
      ],
      "explanation": "This is your uncle. = Đây là chú/bác của bạn."
    },
    {
      "type": "choice",
      "prompt": "\"your aunt\" có nghĩa là gì?",
      "options": [
        "bố của anh ấy",
        "con trai của anh ấy",
        "bà của bạn",
        "cô/dì của bạn"
      ],
      "answer": "cô/dì của bạn",
      "explanation": "your aunt = cô/dì của bạn."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ aunt. (Đây là cô/dì của bạn.)",
      "answers": [
        "your"
      ],
      "explanation": "This is your aunt. = Đây là cô/dì của bạn."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là cô/dì của bạn.\"",
      "answers": [
        "this is your aunt"
      ],
      "explanation": "This is your aunt. = Đây là cô/dì của bạn."
    },
    {
      "type": "choice",
      "prompt": "\"your son\" có nghĩa là gì?",
      "options": [
        "con trai của bạn",
        "mẹ của họ",
        "em bé của chúng tôi",
        "bố của cô ấy"
      ],
      "answer": "con trai của bạn",
      "explanation": "your son = con trai của bạn."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ son. (Đây là con trai của bạn.)",
      "answers": [
        "your"
      ],
      "explanation": "This is your son. = Đây là con trai của bạn."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là con trai của bạn.\"",
      "answers": [
        "this is your son"
      ],
      "explanation": "This is your son. = Đây là con trai của bạn."
    },
    {
      "type": "choice",
      "prompt": "\"your daughter\" có nghĩa là gì?",
      "options": [
        "bà của họ",
        "anh/em trai tôi",
        "con trai tôi",
        "con gái của bạn"
      ],
      "answer": "con gái của bạn",
      "explanation": "your daughter = con gái của bạn."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ daughter. (Đây là con gái của bạn.)",
      "answers": [
        "your"
      ],
      "explanation": "This is your daughter. = Đây là con gái của bạn."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là con gái của bạn.\"",
      "answers": [
        "this is your daughter"
      ],
      "explanation": "This is your daughter. = Đây là con gái của bạn."
    },
    {
      "type": "choice",
      "prompt": "\"your baby\" có nghĩa là gì?",
      "options": [
        "con gái của anh ấy",
        "bà tôi",
        "em bé của bạn",
        "bố của anh ấy"
      ],
      "answer": "em bé của bạn",
      "explanation": "your baby = em bé của bạn."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ baby. (Đây là em bé của bạn.)",
      "answers": [
        "your"
      ],
      "explanation": "This is your baby. = Đây là em bé của bạn."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là em bé của bạn.\"",
      "answers": [
        "this is your baby"
      ],
      "explanation": "This is your baby. = Đây là em bé của bạn."
    },
    {
      "type": "choice",
      "prompt": "\"our mother\" có nghĩa là gì?",
      "options": [
        "ông của bạn",
        "con trai của bạn",
        "chú/bác của anh ấy",
        "mẹ của chúng tôi"
      ],
      "answer": "mẹ của chúng tôi",
      "explanation": "our mother = mẹ của chúng tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ mother. (Đây là mẹ của chúng tôi.)",
      "answers": [
        "our"
      ],
      "explanation": "This is our mother. = Đây là mẹ của chúng tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là mẹ của chúng tôi.\"",
      "answers": [
        "this is our mother"
      ],
      "explanation": "This is our mother. = Đây là mẹ của chúng tôi."
    },
    {
      "type": "choice",
      "prompt": "\"our father\" có nghĩa là gì?",
      "options": [
        "cô/dì của anh ấy",
        "bố của họ",
        "con gái của cô ấy",
        "bố của chúng tôi"
      ],
      "answer": "bố của chúng tôi",
      "explanation": "our father = bố của chúng tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ father. (Đây là bố của chúng tôi.)",
      "answers": [
        "our"
      ],
      "explanation": "This is our father. = Đây là bố của chúng tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là bố của chúng tôi.\"",
      "answers": [
        "this is our father"
      ],
      "explanation": "This is our father. = Đây là bố của chúng tôi."
    },
    {
      "type": "choice",
      "prompt": "\"our sister\" có nghĩa là gì?",
      "options": [
        "chị/em gái của chúng tôi",
        "cô/dì tôi",
        "ông của chúng tôi",
        "bà của anh ấy"
      ],
      "answer": "chị/em gái của chúng tôi",
      "explanation": "our sister = chị/em gái của chúng tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ sister. (Đây là chị/em gái của chúng tôi.)",
      "answers": [
        "our"
      ],
      "explanation": "This is our sister. = Đây là chị/em gái của chúng tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là chị/em gái của chúng tôi.\"",
      "answers": [
        "this is our sister"
      ],
      "explanation": "This is our sister. = Đây là chị/em gái của chúng tôi."
    },
    {
      "type": "choice",
      "prompt": "\"our brother\" có nghĩa là gì?",
      "options": [
        "anh/em trai của cô ấy",
        "em bé của anh ấy",
        "anh/em trai của chúng tôi",
        "ông tôi"
      ],
      "answer": "anh/em trai của chúng tôi",
      "explanation": "our brother = anh/em trai của chúng tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ brother. (Đây là anh/em trai của chúng tôi.)",
      "answers": [
        "our"
      ],
      "explanation": "This is our brother. = Đây là anh/em trai của chúng tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là anh/em trai của chúng tôi.\"",
      "answers": [
        "this is our brother"
      ],
      "explanation": "This is our brother. = Đây là anh/em trai của chúng tôi."
    },
    {
      "type": "choice",
      "prompt": "\"our grandmother\" có nghĩa là gì?",
      "options": [
        "chị/em gái tôi",
        "con gái của anh ấy",
        "bà của chúng tôi",
        "mẹ của chúng tôi"
      ],
      "answer": "bà của chúng tôi",
      "explanation": "our grandmother = bà của chúng tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ grandmother. (Đây là bà của chúng tôi.)",
      "answers": [
        "our"
      ],
      "explanation": "This is our grandmother. = Đây là bà của chúng tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là bà của chúng tôi.\"",
      "answers": [
        "this is our grandmother"
      ],
      "explanation": "This is our grandmother. = Đây là bà của chúng tôi."
    },
    {
      "type": "choice",
      "prompt": "\"our grandfather\" có nghĩa là gì?",
      "options": [
        "ông của chúng tôi",
        "mẹ của anh ấy",
        "chú/bác của họ",
        "chú/bác của anh ấy"
      ],
      "answer": "ông của chúng tôi",
      "explanation": "our grandfather = ông của chúng tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ grandfather. (Đây là ông của chúng tôi.)",
      "answers": [
        "our"
      ],
      "explanation": "This is our grandfather. = Đây là ông của chúng tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là ông của chúng tôi.\"",
      "answers": [
        "this is our grandfather"
      ],
      "explanation": "This is our grandfather. = Đây là ông của chúng tôi."
    },
    {
      "type": "choice",
      "prompt": "\"our uncle\" có nghĩa là gì?",
      "options": [
        "chị/em gái của họ",
        "con trai của bạn",
        "chú/bác của chúng tôi",
        "ông tôi"
      ],
      "answer": "chú/bác của chúng tôi",
      "explanation": "our uncle = chú/bác của chúng tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ uncle. (Đây là chú/bác của chúng tôi.)",
      "answers": [
        "our"
      ],
      "explanation": "This is our uncle. = Đây là chú/bác của chúng tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là chú/bác của chúng tôi.\"",
      "answers": [
        "this is our uncle"
      ],
      "explanation": "This is our uncle. = Đây là chú/bác của chúng tôi."
    },
    {
      "type": "choice",
      "prompt": "\"our aunt\" có nghĩa là gì?",
      "options": [
        "em bé tôi",
        "cô/dì của chúng tôi",
        "bố của cô ấy",
        "con gái của anh ấy"
      ],
      "answer": "cô/dì của chúng tôi",
      "explanation": "our aunt = cô/dì của chúng tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ aunt. (Đây là cô/dì của chúng tôi.)",
      "answers": [
        "our"
      ],
      "explanation": "This is our aunt. = Đây là cô/dì của chúng tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là cô/dì của chúng tôi.\"",
      "answers": [
        "this is our aunt"
      ],
      "explanation": "This is our aunt. = Đây là cô/dì của chúng tôi."
    },
    {
      "type": "choice",
      "prompt": "\"our son\" có nghĩa là gì?",
      "options": [
        "ông của cô ấy",
        "bố của bạn",
        "con trai của chúng tôi",
        "anh/em trai của chúng tôi"
      ],
      "answer": "con trai của chúng tôi",
      "explanation": "our son = con trai của chúng tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ son. (Đây là con trai của chúng tôi.)",
      "answers": [
        "our"
      ],
      "explanation": "This is our son. = Đây là con trai của chúng tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là con trai của chúng tôi.\"",
      "answers": [
        "this is our son"
      ],
      "explanation": "This is our son. = Đây là con trai của chúng tôi."
    },
    {
      "type": "choice",
      "prompt": "\"our daughter\" có nghĩa là gì?",
      "options": [
        "con gái của họ",
        "anh/em trai của chúng tôi",
        "con gái của chúng tôi",
        "bố của bạn"
      ],
      "answer": "con gái của chúng tôi",
      "explanation": "our daughter = con gái của chúng tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ daughter. (Đây là con gái của chúng tôi.)",
      "answers": [
        "our"
      ],
      "explanation": "This is our daughter. = Đây là con gái của chúng tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là con gái của chúng tôi.\"",
      "answers": [
        "this is our daughter"
      ],
      "explanation": "This is our daughter. = Đây là con gái của chúng tôi."
    },
    {
      "type": "choice",
      "prompt": "\"our baby\" có nghĩa là gì?",
      "options": [
        "con gái của anh ấy",
        "chú/bác của họ",
        "em bé của chúng tôi",
        "cô/dì tôi"
      ],
      "answer": "em bé của chúng tôi",
      "explanation": "our baby = em bé của chúng tôi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ baby. (Đây là em bé của chúng tôi.)",
      "answers": [
        "our"
      ],
      "explanation": "This is our baby. = Đây là em bé của chúng tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là em bé của chúng tôi.\"",
      "answers": [
        "this is our baby"
      ],
      "explanation": "This is our baby. = Đây là em bé của chúng tôi."
    },
    {
      "type": "choice",
      "prompt": "\"their mother\" có nghĩa là gì?",
      "options": [
        "bố của cô ấy",
        "bố của anh ấy",
        "mẹ của họ",
        "em bé của họ"
      ],
      "answer": "mẹ của họ",
      "explanation": "their mother = mẹ của họ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ mother. (Đây là mẹ của họ.)",
      "answers": [
        "their"
      ],
      "explanation": "This is their mother. = Đây là mẹ của họ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là mẹ của họ.\"",
      "answers": [
        "this is their mother"
      ],
      "explanation": "This is their mother. = Đây là mẹ của họ."
    },
    {
      "type": "choice",
      "prompt": "\"their father\" có nghĩa là gì?",
      "options": [
        "bố của họ",
        "anh/em trai của cô ấy",
        "anh/em trai của bạn",
        "mẹ của anh ấy"
      ],
      "answer": "bố của họ",
      "explanation": "their father = bố của họ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ father. (Đây là bố của họ.)",
      "answers": [
        "their"
      ],
      "explanation": "This is their father. = Đây là bố của họ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là bố của họ.\"",
      "answers": [
        "this is their father"
      ],
      "explanation": "This is their father. = Đây là bố của họ."
    },
    {
      "type": "choice",
      "prompt": "\"their sister\" có nghĩa là gì?",
      "options": [
        "ông của anh ấy",
        "chị/em gái của họ",
        "em bé của anh ấy",
        "bà tôi"
      ],
      "answer": "chị/em gái của họ",
      "explanation": "their sister = chị/em gái của họ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ sister. (Đây là chị/em gái của họ.)",
      "answers": [
        "their"
      ],
      "explanation": "This is their sister. = Đây là chị/em gái của họ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là chị/em gái của họ.\"",
      "answers": [
        "this is their sister"
      ],
      "explanation": "This is their sister. = Đây là chị/em gái của họ."
    },
    {
      "type": "choice",
      "prompt": "\"their brother\" có nghĩa là gì?",
      "options": [
        "con gái của họ",
        "con gái của chúng tôi",
        "em bé của chúng tôi",
        "anh/em trai của họ"
      ],
      "answer": "anh/em trai của họ",
      "explanation": "their brother = anh/em trai của họ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ brother. (Đây là anh/em trai của họ.)",
      "answers": [
        "their"
      ],
      "explanation": "This is their brother. = Đây là anh/em trai của họ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là anh/em trai của họ.\"",
      "answers": [
        "this is their brother"
      ],
      "explanation": "This is their brother. = Đây là anh/em trai của họ."
    },
    {
      "type": "choice",
      "prompt": "\"their grandmother\" có nghĩa là gì?",
      "options": [
        "cô/dì tôi",
        "bà của họ",
        "cô/dì của anh ấy",
        "chú/bác của họ"
      ],
      "answer": "bà của họ",
      "explanation": "their grandmother = bà của họ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ grandmother. (Đây là bà của họ.)",
      "answers": [
        "their"
      ],
      "explanation": "This is their grandmother. = Đây là bà của họ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là bà của họ.\"",
      "answers": [
        "this is their grandmother"
      ],
      "explanation": "This is their grandmother. = Đây là bà của họ."
    },
    {
      "type": "choice",
      "prompt": "\"their grandfather\" có nghĩa là gì?",
      "options": [
        "bà của chúng tôi",
        "con gái của chúng tôi",
        "bố của chúng tôi",
        "ông của họ"
      ],
      "answer": "ông của họ",
      "explanation": "their grandfather = ông của họ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ grandfather. (Đây là ông của họ.)",
      "answers": [
        "their"
      ],
      "explanation": "This is their grandfather. = Đây là ông của họ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là ông của họ.\"",
      "answers": [
        "this is their grandfather"
      ],
      "explanation": "This is their grandfather. = Đây là ông của họ."
    },
    {
      "type": "choice",
      "prompt": "\"their uncle\" có nghĩa là gì?",
      "options": [
        "chú/bác của họ",
        "mẹ của bạn",
        "anh/em trai của chúng tôi",
        "mẹ của cô ấy"
      ],
      "answer": "chú/bác của họ",
      "explanation": "their uncle = chú/bác của họ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ uncle. (Đây là chú/bác của họ.)",
      "answers": [
        "their"
      ],
      "explanation": "This is their uncle. = Đây là chú/bác của họ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là chú/bác của họ.\"",
      "answers": [
        "this is their uncle"
      ],
      "explanation": "This is their uncle. = Đây là chú/bác của họ."
    },
    {
      "type": "choice",
      "prompt": "\"their aunt\" có nghĩa là gì?",
      "options": [
        "chị/em gái của anh ấy",
        "cô/dì của họ",
        "con gái tôi",
        "bố của cô ấy"
      ],
      "answer": "cô/dì của họ",
      "explanation": "their aunt = cô/dì của họ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ aunt. (Đây là cô/dì của họ.)",
      "answers": [
        "their"
      ],
      "explanation": "This is their aunt. = Đây là cô/dì của họ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là cô/dì của họ.\"",
      "answers": [
        "this is their aunt"
      ],
      "explanation": "This is their aunt. = Đây là cô/dì của họ."
    },
    {
      "type": "choice",
      "prompt": "\"their son\" có nghĩa là gì?",
      "options": [
        "em bé của họ",
        "bố của họ",
        "mẹ tôi",
        "con trai của họ"
      ],
      "answer": "con trai của họ",
      "explanation": "their son = con trai của họ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ son. (Đây là con trai của họ.)",
      "answers": [
        "their"
      ],
      "explanation": "This is their son. = Đây là con trai của họ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là con trai của họ.\"",
      "answers": [
        "this is their son"
      ],
      "explanation": "This is their son. = Đây là con trai của họ."
    },
    {
      "type": "choice",
      "prompt": "\"their daughter\" có nghĩa là gì?",
      "options": [
        "em bé của bạn",
        "con trai tôi",
        "anh/em trai của cô ấy",
        "con gái của họ"
      ],
      "answer": "con gái của họ",
      "explanation": "their daughter = con gái của họ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ daughter. (Đây là con gái của họ.)",
      "answers": [
        "their"
      ],
      "explanation": "This is their daughter. = Đây là con gái của họ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là con gái của họ.\"",
      "answers": [
        "this is their daughter"
      ],
      "explanation": "This is their daughter. = Đây là con gái của họ."
    },
    {
      "type": "choice",
      "prompt": "\"their baby\" có nghĩa là gì?",
      "options": [
        "em bé của họ",
        "chị/em gái của chúng tôi",
        "con trai của chúng tôi",
        "bố tôi"
      ],
      "answer": "em bé của họ",
      "explanation": "their baby = em bé của họ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: This is ______ baby. (Đây là em bé của họ.)",
      "answers": [
        "their"
      ],
      "explanation": "This is their baby. = Đây là em bé của họ."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Đây là em bé của họ.\"",
      "answers": [
        "this is their baby"
      ],
      "explanation": "This is their baby. = Đây là em bé của họ."
    },
    {
      "type": "choice",
      "prompt": "\"Lan's mother\" có nghĩa là gì?",
      "options": [
        "anh/em trai của Lan",
        "mẹ của Lan",
        "ông của Lan",
        "bà của Lan"
      ],
      "answer": "mẹ của Lan",
      "explanation": "Lan's mother = mẹ của Lan."
    },
    {
      "type": "choice",
      "prompt": "\"Lan's father\" có nghĩa là gì?",
      "options": [
        "em bé của Lan",
        "bố của Lan",
        "anh/em trai của Lan",
        "con trai của Lan"
      ],
      "answer": "bố của Lan",
      "explanation": "Lan's father = bố của Lan."
    },
    {
      "type": "choice",
      "prompt": "\"Lan's sister\" có nghĩa là gì?",
      "options": [
        "em bé của Lan",
        "bà của Lan",
        "bố của Lan",
        "chị/em gái của Lan"
      ],
      "answer": "chị/em gái của Lan",
      "explanation": "Lan's sister = chị/em gái của Lan."
    },
    {
      "type": "choice",
      "prompt": "\"Lan's brother\" có nghĩa là gì?",
      "options": [
        "chú/bác của Lan",
        "con trai của Lan",
        "bố của Lan",
        "anh/em trai của Lan"
      ],
      "answer": "anh/em trai của Lan",
      "explanation": "Lan's brother = anh/em trai của Lan."
    },
    {
      "type": "choice",
      "prompt": "\"Lan's grandmother\" có nghĩa là gì?",
      "options": [
        "chị/em gái của Lan",
        "con gái của Lan",
        "bà của Lan",
        "con trai của Lan"
      ],
      "answer": "bà của Lan",
      "explanation": "Lan's grandmother = bà của Lan."
    },
    {
      "type": "choice",
      "prompt": "\"Lan's grandfather\" có nghĩa là gì?",
      "options": [
        "chú/bác của Lan",
        "ông của Lan",
        "bố của Lan",
        "chị/em gái của Lan"
      ],
      "answer": "ông của Lan",
      "explanation": "Lan's grandfather = ông của Lan."
    },
    {
      "type": "choice",
      "prompt": "Câu trả lời ngắn nào viết đúng ngữ pháp cho \"Is this your mother?\"?",
      "options": [
        "Yes, it is.",
        "No, it am.",
        "Yes, it do.",
        "Yes, it are."
      ],
      "answer": "Yes, it is.",
      "explanation": "Is this your mother? — Yes, it is. (it + is, không dùng are/am/do)"
    },
    {
      "type": "choice",
      "prompt": "Câu trả lời ngắn nào viết đúng ngữ pháp cho \"Is this your father?\"?",
      "options": [
        "Yes, it are.",
        "Yes, it is.",
        "No, it am.",
        "Yes, it do."
      ],
      "answer": "Yes, it is.",
      "explanation": "Is this your father? — Yes, it is. (it + is, không dùng are/am/do)"
    },
    {
      "type": "choice",
      "prompt": "Câu trả lời ngắn nào viết đúng ngữ pháp cho \"Is this your sister?\"?",
      "options": [
        "No, it am.",
        "Yes, it is.",
        "Yes, it are.",
        "Yes, it do."
      ],
      "answer": "Yes, it is.",
      "explanation": "Is this your sister? — Yes, it is. (it + is, không dùng are/am/do)"
    },
    {
      "type": "choice",
      "prompt": "Câu trả lời ngắn nào viết đúng ngữ pháp cho \"Is this your brother?\"?",
      "options": [
        "Yes, it do.",
        "Yes, it are.",
        "No, it am.",
        "Yes, it is."
      ],
      "answer": "Yes, it is.",
      "explanation": "Is this your brother? — Yes, it is. (it + is, không dùng are/am/do)"
    },
    {
      "type": "choice",
      "prompt": "Câu trả lời ngắn nào viết đúng ngữ pháp cho \"Is this your grandmother?\"?",
      "options": [
        "No, it am.",
        "Yes, it is.",
        "Yes, it are.",
        "Yes, it do."
      ],
      "answer": "Yes, it is.",
      "explanation": "Is this your grandmother? — Yes, it is. (it + is, không dùng are/am/do)"
    },
    {
      "type": "choice",
      "prompt": "Câu trả lời ngắn nào viết đúng ngữ pháp cho \"Is this your grandfather?\"?",
      "options": [
        "Yes, it are.",
        "Yes, it is.",
        "No, it am.",
        "Yes, it do."
      ],
      "answer": "Yes, it is.",
      "explanation": "Is this your grandfather? — Yes, it is. (it + is, không dùng are/am/do)"
    }
  ],
  "daily-routine": [
    {
      "type": "choice",
      "prompt": "\"wake up / get up\" có nghĩa là gì?",
      "options": [
        "làm bài tập",
        "đi học",
        "thức dậy",
        "về nhà"
      ],
      "answer": "thức dậy",
      "explanation": "wake up / get up = thức dậy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at six. (thức dậy)",
      "answers": [
        "get up"
      ],
      "explanation": "Câu đầy đủ: I get up at six."
    },
    {
      "type": "choice",
      "prompt": "\"brush my teeth\" có nghĩa là gì?",
      "options": [
        "đi học",
        "thức dậy",
        "đánh răng",
        "làm bài tập"
      ],
      "answer": "đánh răng",
      "explanation": "brush my teeth = đánh răng."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"đánh răng\"?",
      "options": [
        "have lunch",
        "have breakfast",
        "brush my teeth",
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
      "prompt": "Điền từ còn thiếu: I ______ every morning. (đánh răng)",
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
        "ăn sáng",
        "về nhà",
        "đi học"
      ],
      "answer": "ăn sáng",
      "explanation": "have breakfast = ăn sáng."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"ăn sáng\"?",
      "options": [
        "have lunch",
        "have breakfast",
        "go home",
        "do homework"
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
      "prompt": "Điền từ còn thiếu: I ______ at seven. (ăn sáng)",
      "answers": [
        "have breakfast"
      ],
      "explanation": "Câu đầy đủ: I have breakfast at seven."
    },
    {
      "type": "choice",
      "prompt": "\"go to school\" có nghĩa là gì?",
      "options": [
        "thức dậy",
        "đi học",
        "đánh răng",
        "về nhà"
      ],
      "answer": "đi học",
      "explanation": "go to school = đi học."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"đi học\"?",
      "options": [
        "have breakfast",
        "go to school",
        "go to bed",
        "do homework"
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
      "prompt": "Điền từ còn thiếu: I ______ at seven thirty. (đi học)",
      "answers": [
        "go to school"
      ],
      "explanation": "Câu đầy đủ: I go to school at seven thirty."
    },
    {
      "type": "choice",
      "prompt": "\"have lunch\" có nghĩa là gì?",
      "options": [
        "ăn sáng",
        "ăn trưa",
        "đi học",
        "thức dậy"
      ],
      "answer": "ăn trưa",
      "explanation": "have lunch = ăn trưa."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"ăn trưa\"?",
      "options": [
        "brush my teeth",
        "go to school",
        "have lunch",
        "go home"
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
      "prompt": "Điền từ còn thiếu: We ______ at twelve. (ăn trưa)",
      "answers": [
        "have lunch"
      ],
      "explanation": "Câu đầy đủ: We have lunch at twelve."
    },
    {
      "type": "choice",
      "prompt": "\"go home\" có nghĩa là gì?",
      "options": [
        "ăn sáng",
        "về nhà",
        "đi học",
        "đánh răng"
      ],
      "answer": "về nhà",
      "explanation": "go home = về nhà."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"về nhà\"?",
      "options": [
        "go home",
        "have breakfast",
        "go to school",
        "do homework"
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
      "prompt": "Điền từ còn thiếu: I ______ at five. (về nhà)",
      "answers": [
        "go home"
      ],
      "explanation": "Câu đầy đủ: I go home at five."
    },
    {
      "type": "choice",
      "prompt": "\"do homework\" có nghĩa là gì?",
      "options": [
        "đi học",
        "đi ngủ",
        "thức dậy",
        "làm bài tập"
      ],
      "answer": "làm bài tập",
      "explanation": "do homework = làm bài tập."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"làm bài tập\"?",
      "options": [
        "brush my teeth",
        "do homework",
        "go to bed",
        "have breakfast"
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
      "prompt": "Điền từ còn thiếu: I ______ in the evening. (làm bài tập)",
      "answers": [
        "do homework"
      ],
      "explanation": "Câu đầy đủ: I do homework in the evening."
    },
    {
      "type": "choice",
      "prompt": "\"go to bed\" có nghĩa là gì?",
      "options": [
        "đi học",
        "thức dậy",
        "về nhà",
        "đi ngủ"
      ],
      "answer": "đi ngủ",
      "explanation": "go to bed = đi ngủ."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"đi ngủ\"?",
      "options": [
        "have breakfast",
        "do homework",
        "go to bed",
        "go home"
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
      "prompt": "Điền từ còn thiếu: I ______ at ten. (đi ngủ)",
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
      "prompt": "Điền từ còn thiếu: I ______ at five. (thức dậy)",
      "answers": [
        "get up"
      ],
      "explanation": "I get up at five."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at eight. (thức dậy)",
      "answers": [
        "get up"
      ],
      "explanation": "I get up at eight."
    },
    {
      "type": "choice",
      "prompt": "I get up at six. Câu này nói tôi làm gì?",
      "options": [
        "đi học",
        "đi ngủ",
        "đánh răng",
        "thức dậy"
      ],
      "answer": "thức dậy",
      "explanation": "I get up at six. = Tôi thức dậy lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "He ______ at seven. (get up)",
      "options": [
        "get up",
        "getting up",
        "gets up",
        "got up"
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
      "prompt": "She ______ at seven. (get up)",
      "options": [
        "got up",
        "gets up",
        "getting up",
        "get up"
      ],
      "answer": "gets up",
      "explanation": "He/she + động từ thêm -s: She gets up at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (get up) at seven.",
      "answers": [
        "gets up"
      ],
      "explanation": "She gets up at seven."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ get up at six. (không làm)",
      "options": [
        "don't",
        "doesn't",
        "isn't",
        "won't"
      ],
      "answer": "don't",
      "explanation": "I don't get up at six. = Tôi không thức dậy lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ get up at seven. (không làm)",
      "options": [
        "isn't",
        "doesn't",
        "won't",
        "don't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't get up at seven. = Cô ấy không thức dậy lúc 7 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ you get up at six?",
      "answers": [
        "do"
      ],
      "explanation": "Do you get up at six? = Bạn có thức dậy lúc 6 giờ không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ she get up at seven?",
      "answers": [
        "does"
      ],
      "explanation": "Does she get up at seven? = Cô ấy có thức dậy lúc 7 giờ không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I get up in the ______.",
      "answers": [
        "morning"
      ],
      "explanation": "I get up in the morning."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi thức dậy lúc 6 giờ.\"",
      "answers": [
        "i get up at six"
      ],
      "explanation": "I get up at six. = Tôi thức dậy lúc 6 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at six. (đánh răng)",
      "answers": [
        "brush my teeth"
      ],
      "explanation": "I brush my teeth at six."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at nine. (đánh răng)",
      "answers": [
        "brush my teeth"
      ],
      "explanation": "I brush my teeth at nine."
    },
    {
      "type": "choice",
      "prompt": "I brush my teeth at six. Câu này nói tôi làm gì?",
      "options": [
        "làm bài tập",
        "đánh răng",
        "về nhà",
        "thức dậy"
      ],
      "answer": "đánh răng",
      "explanation": "I brush my teeth at six. = Tôi đánh răng lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "He ______ at seven. (brush my teeth)",
      "options": [
        "brushed my teeth",
        "brush my teeth",
        "brushing teeth",
        "brushes his teeth"
      ],
      "answer": "brushes his teeth",
      "explanation": "He/she + động từ thêm -s: He brushes his teeth at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (brush my teeth) at seven.",
      "answers": [
        "brushes his teeth"
      ],
      "explanation": "He brushes his teeth at seven."
    },
    {
      "type": "choice",
      "prompt": "She ______ at seven. (brush my teeth)",
      "options": [
        "brush my teeth",
        "brushing teeth",
        "brushed my teeth",
        "brushes her teeth"
      ],
      "answer": "brushes her teeth",
      "explanation": "He/she + động từ thêm -s: She brushes her teeth at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (brush my teeth) at seven.",
      "answers": [
        "brushes her teeth"
      ],
      "explanation": "She brushes her teeth at seven."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ brush my teeth at six. (không làm)",
      "options": [
        "don't",
        "doesn't",
        "isn't",
        "won't"
      ],
      "answer": "don't",
      "explanation": "I don't brush my teeth at six. = Tôi không đánh răng lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ brush my teeth at seven. (không làm)",
      "options": [
        "won't",
        "doesn't",
        "don't",
        "isn't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't brush my teeth at seven. = Cô ấy không đánh răng lúc 7 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ you brush my teeth at six?",
      "answers": [
        "do"
      ],
      "explanation": "Do you brush my teeth at six? = Bạn có đánh răng lúc 6 giờ không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ she brush my teeth at seven?",
      "answers": [
        "does"
      ],
      "explanation": "Does she brush my teeth at seven? = Cô ấy có đánh răng lúc 7 giờ không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I brush my teeth in the ______.",
      "answers": [
        "morning"
      ],
      "explanation": "I brush my teeth in the morning."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi đánh răng lúc 6 giờ.\"",
      "answers": [
        "i brush my teeth at six"
      ],
      "explanation": "I brush my teeth at six. = Tôi đánh răng lúc 6 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at ten. (ăn sáng)",
      "answers": [
        "have breakfast"
      ],
      "explanation": "I have breakfast at ten."
    },
    {
      "type": "choice",
      "prompt": "I have breakfast at six. Câu này nói tôi làm gì?",
      "options": [
        "ăn sáng",
        "ăn trưa",
        "về nhà",
        "đánh răng"
      ],
      "answer": "ăn sáng",
      "explanation": "I have breakfast at six. = Tôi ăn sáng lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "He ______ at seven. (have breakfast)",
      "options": [
        "has breakfast",
        "had breakfast",
        "having breakfast",
        "have breakfast"
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
      "prompt": "She ______ at seven. (have breakfast)",
      "options": [
        "has breakfast",
        "had breakfast",
        "have breakfast",
        "having breakfast"
      ],
      "answer": "has breakfast",
      "explanation": "He/she + động từ thêm -s: She has breakfast at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (have breakfast) at seven.",
      "answers": [
        "has breakfast"
      ],
      "explanation": "She has breakfast at seven."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ have breakfast at six. (không làm)",
      "options": [
        "don't",
        "doesn't",
        "won't",
        "isn't"
      ],
      "answer": "don't",
      "explanation": "I don't have breakfast at six. = Tôi không ăn sáng lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ have breakfast at seven. (không làm)",
      "options": [
        "isn't",
        "doesn't",
        "won't",
        "don't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't have breakfast at seven. = Cô ấy không ăn sáng lúc 7 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ you have breakfast at six?",
      "answers": [
        "do"
      ],
      "explanation": "Do you have breakfast at six? = Bạn có ăn sáng lúc 6 giờ không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ she have breakfast at seven?",
      "answers": [
        "does"
      ],
      "explanation": "Does she have breakfast at seven? = Cô ấy có ăn sáng lúc 7 giờ không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have breakfast in the ______.",
      "answers": [
        "morning"
      ],
      "explanation": "I have breakfast in the morning."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi ăn sáng lúc 6 giờ.\"",
      "answers": [
        "i have breakfast at six"
      ],
      "explanation": "I have breakfast at six. = Tôi ăn sáng lúc 6 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at eight. (đi học)",
      "answers": [
        "go to school"
      ],
      "explanation": "I go to school at eight."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at five. (đi học)",
      "answers": [
        "go to school"
      ],
      "explanation": "I go to school at five."
    },
    {
      "type": "choice",
      "prompt": "I go to school at six. Câu này nói tôi làm gì?",
      "options": [
        "ăn sáng",
        "đi học",
        "thức dậy",
        "ăn trưa"
      ],
      "answer": "đi học",
      "explanation": "I go to school at six. = Tôi đi học lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "He ______ at seven. (go to school)",
      "options": [
        "go to school",
        "went to school",
        "goes to school",
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
      "prompt": "She ______ at seven. (go to school)",
      "options": [
        "go to school",
        "went to school",
        "goes to school",
        "going to school"
      ],
      "answer": "goes to school",
      "explanation": "He/she + động từ thêm -s: She goes to school at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (go to school) at seven.",
      "answers": [
        "goes to school"
      ],
      "explanation": "She goes to school at seven."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ go to school at six. (không làm)",
      "options": [
        "isn't",
        "won't",
        "don't",
        "doesn't"
      ],
      "answer": "don't",
      "explanation": "I don't go to school at six. = Tôi không đi học lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ go to school at seven. (không làm)",
      "options": [
        "doesn't",
        "isn't",
        "don't",
        "won't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't go to school at seven. = Cô ấy không đi học lúc 7 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ you go to school at six?",
      "answers": [
        "do"
      ],
      "explanation": "Do you go to school at six? = Bạn có đi học lúc 6 giờ không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ she go to school at seven?",
      "answers": [
        "does"
      ],
      "explanation": "Does she go to school at seven? = Cô ấy có đi học lúc 7 giờ không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I go to school in the ______.",
      "answers": [
        "morning"
      ],
      "explanation": "I go to school in the morning."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi đi học lúc 6 giờ.\"",
      "answers": [
        "i go to school at six"
      ],
      "explanation": "I go to school at six. = Tôi đi học lúc 6 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at nine. (ăn trưa)",
      "answers": [
        "have lunch"
      ],
      "explanation": "I have lunch at nine."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at six. (ăn trưa)",
      "answers": [
        "have lunch"
      ],
      "explanation": "I have lunch at six."
    },
    {
      "type": "choice",
      "prompt": "I have lunch at six. Câu này nói tôi làm gì?",
      "options": [
        "ăn sáng",
        "về nhà",
        "làm bài tập",
        "ăn trưa"
      ],
      "answer": "ăn trưa",
      "explanation": "I have lunch at six. = Tôi ăn trưa lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "He ______ at seven. (have lunch)",
      "options": [
        "had lunch",
        "having lunch",
        "has lunch",
        "have lunch"
      ],
      "answer": "has lunch",
      "explanation": "He/she + động từ thêm -s: He has lunch at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (have lunch) at seven.",
      "answers": [
        "has lunch"
      ],
      "explanation": "He has lunch at seven."
    },
    {
      "type": "choice",
      "prompt": "She ______ at seven. (have lunch)",
      "options": [
        "having lunch",
        "had lunch",
        "have lunch",
        "has lunch"
      ],
      "answer": "has lunch",
      "explanation": "He/she + động từ thêm -s: She has lunch at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (have lunch) at seven.",
      "answers": [
        "has lunch"
      ],
      "explanation": "She has lunch at seven."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ have lunch at six. (không làm)",
      "options": [
        "isn't",
        "don't",
        "doesn't",
        "won't"
      ],
      "answer": "don't",
      "explanation": "I don't have lunch at six. = Tôi không ăn trưa lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ have lunch at seven. (không làm)",
      "options": [
        "doesn't",
        "isn't",
        "don't",
        "won't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't have lunch at seven. = Cô ấy không ăn trưa lúc 7 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ you have lunch at six?",
      "answers": [
        "do"
      ],
      "explanation": "Do you have lunch at six? = Bạn có ăn trưa lúc 6 giờ không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ she have lunch at seven?",
      "answers": [
        "does"
      ],
      "explanation": "Does she have lunch at seven? = Cô ấy có ăn trưa lúc 7 giờ không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I have lunch in the ______.",
      "answers": [
        "afternoon"
      ],
      "explanation": "I have lunch in the afternoon."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi ăn trưa lúc 6 giờ.\"",
      "answers": [
        "i have lunch at six"
      ],
      "explanation": "I have lunch at six. = Tôi ăn trưa lúc 6 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at ten. (về nhà)",
      "answers": [
        "go home"
      ],
      "explanation": "I go home at ten."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at seven. (về nhà)",
      "answers": [
        "go home"
      ],
      "explanation": "I go home at seven."
    },
    {
      "type": "choice",
      "prompt": "I go home at six. Câu này nói tôi làm gì?",
      "options": [
        "ăn trưa",
        "ăn sáng",
        "về nhà",
        "đánh răng"
      ],
      "answer": "về nhà",
      "explanation": "I go home at six. = Tôi về nhà lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "He ______ at seven. (go home)",
      "options": [
        "goes home",
        "going home",
        "go home",
        "went home"
      ],
      "answer": "goes home",
      "explanation": "He/she + động từ thêm -s: He goes home at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (go home) at seven.",
      "answers": [
        "goes home"
      ],
      "explanation": "He goes home at seven."
    },
    {
      "type": "choice",
      "prompt": "She ______ at seven. (go home)",
      "options": [
        "going home",
        "went home",
        "goes home",
        "go home"
      ],
      "answer": "goes home",
      "explanation": "He/she + động từ thêm -s: She goes home at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (go home) at seven.",
      "answers": [
        "goes home"
      ],
      "explanation": "She goes home at seven."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ go home at six. (không làm)",
      "options": [
        "doesn't",
        "don't",
        "won't",
        "isn't"
      ],
      "answer": "don't",
      "explanation": "I don't go home at six. = Tôi không về nhà lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ go home at seven. (không làm)",
      "options": [
        "isn't",
        "won't",
        "doesn't",
        "don't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't go home at seven. = Cô ấy không về nhà lúc 7 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ you go home at six?",
      "answers": [
        "do"
      ],
      "explanation": "Do you go home at six? = Bạn có về nhà lúc 6 giờ không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ she go home at seven?",
      "answers": [
        "does"
      ],
      "explanation": "Does she go home at seven? = Cô ấy có về nhà lúc 7 giờ không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I go home in the ______.",
      "answers": [
        "afternoon"
      ],
      "explanation": "I go home in the afternoon."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi về nhà lúc 6 giờ.\"",
      "answers": [
        "i go home at six"
      ],
      "explanation": "I go home at six. = Tôi về nhà lúc 6 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at five. (làm bài tập)",
      "answers": [
        "do homework"
      ],
      "explanation": "I do homework at five."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at eight. (làm bài tập)",
      "answers": [
        "do homework"
      ],
      "explanation": "I do homework at eight."
    },
    {
      "type": "choice",
      "prompt": "I do homework at six. Câu này nói tôi làm gì?",
      "options": [
        "ăn trưa",
        "đánh răng",
        "làm bài tập",
        "đi ngủ"
      ],
      "answer": "làm bài tập",
      "explanation": "I do homework at six. = Tôi làm bài tập lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "He ______ at seven. (do homework)",
      "options": [
        "doing homework",
        "did homework",
        "does homework",
        "do homework"
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
    },
    {
      "type": "choice",
      "prompt": "She ______ at seven. (do homework)",
      "options": [
        "doing homework",
        "did homework",
        "do homework",
        "does homework"
      ],
      "answer": "does homework",
      "explanation": "He/she + động từ thêm -s: She does homework at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (do homework) at seven.",
      "answers": [
        "does homework"
      ],
      "explanation": "She does homework at seven."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ do homework at six. (không làm)",
      "options": [
        "don't",
        "doesn't",
        "isn't",
        "won't"
      ],
      "answer": "don't",
      "explanation": "I don't do homework at six. = Tôi không làm bài tập lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ do homework at seven. (không làm)",
      "options": [
        "doesn't",
        "don't",
        "won't",
        "isn't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't do homework at seven. = Cô ấy không làm bài tập lúc 7 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ you do homework at six?",
      "answers": [
        "do"
      ],
      "explanation": "Do you do homework at six? = Bạn có làm bài tập lúc 6 giờ không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ she do homework at seven?",
      "answers": [
        "does"
      ],
      "explanation": "Does she do homework at seven? = Cô ấy có làm bài tập lúc 7 giờ không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I do homework in the ______.",
      "answers": [
        "evening"
      ],
      "explanation": "I do homework in the evening."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi làm bài tập lúc 6 giờ.\"",
      "answers": [
        "i do homework at six"
      ],
      "explanation": "I do homework at six. = Tôi làm bài tập lúc 6 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at six. (đi ngủ)",
      "answers": [
        "go to bed"
      ],
      "explanation": "I go to bed at six."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ at nine. (đi ngủ)",
      "answers": [
        "go to bed"
      ],
      "explanation": "I go to bed at nine."
    },
    {
      "type": "choice",
      "prompt": "I go to bed at six. Câu này nói tôi làm gì?",
      "options": [
        "thức dậy",
        "đánh răng",
        "ăn trưa",
        "đi ngủ"
      ],
      "answer": "đi ngủ",
      "explanation": "I go to bed at six. = Tôi đi ngủ lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "He ______ at seven. (go to bed)",
      "options": [
        "goes to bed",
        "go to bed",
        "going to bed",
        "went to bed"
      ],
      "answer": "goes to bed",
      "explanation": "He/she + động từ thêm -s: He goes to bed at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (go to bed) at seven.",
      "answers": [
        "goes to bed"
      ],
      "explanation": "He goes to bed at seven."
    },
    {
      "type": "choice",
      "prompt": "She ______ at seven. (go to bed)",
      "options": [
        "goes to bed",
        "going to bed",
        "go to bed",
        "went to bed"
      ],
      "answer": "goes to bed",
      "explanation": "He/she + động từ thêm -s: She goes to bed at seven."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (go to bed) at seven.",
      "answers": [
        "goes to bed"
      ],
      "explanation": "She goes to bed at seven."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ go to bed at six. (không làm)",
      "options": [
        "don't",
        "isn't",
        "doesn't",
        "won't"
      ],
      "answer": "don't",
      "explanation": "I don't go to bed at six. = Tôi không đi ngủ lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ go to bed at seven. (không làm)",
      "options": [
        "doesn't",
        "isn't",
        "won't",
        "don't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't go to bed at seven. = Cô ấy không đi ngủ lúc 7 giờ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ you go to bed at six?",
      "answers": [
        "do"
      ],
      "explanation": "Do you go to bed at six? = Bạn có đi ngủ lúc 6 giờ không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ she go to bed at seven?",
      "answers": [
        "does"
      ],
      "explanation": "Does she go to bed at seven? = Cô ấy có đi ngủ lúc 7 giờ không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I go to bed in the ______.",
      "answers": [
        "evening"
      ],
      "explanation": "I go to bed in the evening."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi đi ngủ lúc 6 giờ.\"",
      "answers": [
        "i go to bed at six"
      ],
      "explanation": "I go to bed at six. = Tôi đi ngủ lúc 6 giờ."
    },
    {
      "type": "choice",
      "prompt": "Bạn làm gì sau khi thức dậy?",
      "options": [
        "have lunch",
        "go home",
        "brush my teeth",
        "go to bed"
      ],
      "answer": "brush my teeth",
      "explanation": "Sau khi thức dậy thì đánh răng: after getting up, I brush my teeth."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: After getting up, I ______.",
      "answers": [
        "brush my teeth"
      ],
      "explanation": "After getting up, I brush my teeth."
    },
    {
      "type": "choice",
      "prompt": "Bạn làm gì sau khi đánh răng?",
      "options": [
        "have breakfast",
        "do homework",
        "go home",
        "get up"
      ],
      "answer": "have breakfast",
      "explanation": "Sau khi đánh răng thì ăn sáng: after brushing teeth, I have breakfast."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: After brushing teeth, I ______.",
      "answers": [
        "have breakfast"
      ],
      "explanation": "After brushing teeth, I have breakfast."
    },
    {
      "type": "choice",
      "prompt": "Bạn làm gì sau khi ăn sáng?",
      "options": [
        "have lunch",
        "go home",
        "do homework",
        "go to school"
      ],
      "answer": "go to school",
      "explanation": "Sau khi ăn sáng thì đi học: after having breakfast, I go to school."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: After having breakfast, I ______.",
      "answers": [
        "go to school"
      ],
      "explanation": "After having breakfast, I go to school."
    },
    {
      "type": "choice",
      "prompt": "Bạn làm gì sau khi đi học?",
      "options": [
        "have breakfast",
        "do homework",
        "go to school",
        "have lunch"
      ],
      "answer": "have lunch",
      "explanation": "Sau khi đi học thì ăn trưa: after going to school, I have lunch."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: After going to school, I ______.",
      "answers": [
        "have lunch"
      ],
      "explanation": "After going to school, I have lunch."
    },
    {
      "type": "choice",
      "prompt": "Bạn làm gì sau khi ăn trưa?",
      "options": [
        "brush my teeth",
        "have lunch",
        "go to school",
        "go home"
      ],
      "answer": "go home",
      "explanation": "Sau khi ăn trưa thì về nhà: after having lunch, I go home."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: After having lunch, I ______.",
      "answers": [
        "go home"
      ],
      "explanation": "After having lunch, I go home."
    },
    {
      "type": "choice",
      "prompt": "Bạn làm gì sau khi về nhà?",
      "options": [
        "go to school",
        "go home",
        "do homework",
        "have breakfast"
      ],
      "answer": "do homework",
      "explanation": "Sau khi về nhà thì làm bài tập: after going home, I do homework."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: After going home, I ______.",
      "answers": [
        "do homework"
      ],
      "explanation": "After going home, I do homework."
    },
    {
      "type": "choice",
      "prompt": "Bạn làm gì sau khi làm bài tập?",
      "options": [
        "have breakfast",
        "do homework",
        "go home",
        "go to bed"
      ],
      "answer": "go to bed",
      "explanation": "Sau khi làm bài tập thì đi ngủ: after doing homework, I go to bed."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: After doing homework, I ______.",
      "answers": [
        "go to bed"
      ],
      "explanation": "After doing homework, I go to bed."
    }
  ],
  "colors-objects": [
    {
      "type": "choice",
      "prompt": "\"red\" có nghĩa là gì?",
      "options": [
        "cây bút mực/bi",
        "màu vàng",
        "màu đỏ",
        "cái cặp/túi"
      ],
      "answer": "màu đỏ",
      "explanation": "red = màu đỏ."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"màu đỏ\"?",
      "options": [
        "chair",
        "green",
        "blue",
        "red"
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
      "prompt": "Điền từ còn thiếu: The apple is ______. (màu đỏ)",
      "answers": [
        "red"
      ],
      "explanation": "Câu đầy đủ: The apple is red."
    },
    {
      "type": "choice",
      "prompt": "\"blue\" có nghĩa là gì?",
      "options": [
        "cái cặp/túi",
        "cái ghế",
        "màu xanh dương",
        "màu đỏ"
      ],
      "answer": "màu xanh dương",
      "explanation": "blue = màu xanh dương."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"màu xanh dương\"?",
      "options": [
        "blue",
        "pen",
        "red",
        "chair"
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
      "prompt": "Điền từ còn thiếu: The sky is ______. (màu xanh dương)",
      "answers": [
        "blue"
      ],
      "explanation": "Câu đầy đủ: The sky is blue."
    },
    {
      "type": "choice",
      "prompt": "\"green\" có nghĩa là gì?",
      "options": [
        "màu xanh dương",
        "màu vàng",
        "màu xanh lá",
        "màu đỏ"
      ],
      "answer": "màu xanh lá",
      "explanation": "green = màu xanh lá."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"màu xanh lá\"?",
      "options": [
        "green",
        "pen",
        "yellow",
        "blue"
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
      "prompt": "Điền từ còn thiếu: The leaf is ______. (màu xanh lá)",
      "answers": [
        "green"
      ],
      "explanation": "Câu đầy đủ: The leaf is green."
    },
    {
      "type": "choice",
      "prompt": "\"yellow\" có nghĩa là gì?",
      "options": [
        "màu xanh lá",
        "quyển sách",
        "cây bút mực/bi",
        "màu vàng"
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
        "book"
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
      "prompt": "Điền từ còn thiếu: The sun is ______. (màu vàng)",
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
        "cái ghế",
        "quyển sách",
        "màu xanh dương"
      ],
      "answer": "quyển sách",
      "explanation": "book = quyển sách."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"quyển sách\"?",
      "options": [
        "green",
        "red",
        "book",
        "pen"
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
      "prompt": "Điền từ còn thiếu: This is a ______. (quyển sách)",
      "answers": [
        "book"
      ],
      "explanation": "Câu đầy đủ: This is a book."
    },
    {
      "type": "choice",
      "prompt": "\"pen\" có nghĩa là gì?",
      "options": [
        "cái cặp/túi",
        "màu vàng",
        "cây bút mực/bi",
        "màu đỏ"
      ],
      "answer": "cây bút mực/bi",
      "explanation": "pen = cây bút mực/bi."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"cây bút mực/bi\"?",
      "options": [
        "yellow",
        "chair",
        "book",
        "pen"
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
      "prompt": "Điền từ còn thiếu: This is my ______. (cây bút mực/bi)",
      "answers": [
        "pen"
      ],
      "explanation": "Câu đầy đủ: This is my pen."
    },
    {
      "type": "choice",
      "prompt": "\"bag\" có nghĩa là gì?",
      "options": [
        "cái cặp/túi",
        "màu vàng",
        "màu đỏ",
        "cây bút mực/bi"
      ],
      "answer": "cái cặp/túi",
      "explanation": "bag = cái cặp/túi."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"cái cặp/túi\"?",
      "options": [
        "bag",
        "blue",
        "chair",
        "yellow"
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
      "prompt": "Điền từ còn thiếu: My ______ is blue. (cái cặp/túi)",
      "answers": [
        "bag"
      ],
      "explanation": "Câu đầy đủ: My bag is blue."
    },
    {
      "type": "choice",
      "prompt": "\"chair\" có nghĩa là gì?",
      "options": [
        "màu xanh lá",
        "màu xanh dương",
        "màu đỏ",
        "cái ghế"
      ],
      "answer": "cái ghế",
      "explanation": "chair = cái ghế."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"cái ghế\"?",
      "options": [
        "chair",
        "pen",
        "yellow",
        "green"
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
      "prompt": "Điền từ còn thiếu: The ______ is red. (cái ghế)",
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
      "prompt": "Điền từ còn thiếu: The chair is ______ (màu đỏ).",
      "answers": [
        "red"
      ],
      "explanation": "The chair is red."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái ghế màu đỏ.\"",
      "answers": [
        "the chair is red"
      ],
      "explanation": "The chair is red. = cái ghế màu đỏ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The ruler is ______ (màu đỏ).",
      "answers": [
        "red"
      ],
      "explanation": "The ruler is red."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái thước màu đỏ.\"",
      "answers": [
        "the ruler is red"
      ],
      "explanation": "The ruler is red. = cái thước màu đỏ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The desk is ______ (màu đỏ).",
      "answers": [
        "red"
      ],
      "explanation": "The desk is red."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái bàn màu đỏ.\"",
      "answers": [
        "the desk is red"
      ],
      "explanation": "The desk is red. = cái bàn màu đỏ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The books are ______ (màu đỏ).",
      "answers": [
        "red"
      ],
      "explanation": "The books are red."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The eggs are ______ (màu đỏ).",
      "answers": [
        "red"
      ],
      "explanation": "The eggs are red."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích cái cặp màu đỏ. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like red bag.",
        "I like the red bag.",
        "I like the pink bag.",
        "I like the red apple."
      ],
      "answer": "I like the red bag.",
      "explanation": "I like the red bag. = Tôi thích cái cặp màu đỏ."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích cây bút chì màu đỏ. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like the red pencil.",
        "I like the pink pencil.",
        "I like red pencil.",
        "I like the red apple."
      ],
      "answer": "I like the red pencil.",
      "explanation": "I like the red pencil. = Tôi thích cây bút chì màu đỏ."
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
      "prompt": "Điền từ còn thiếu: The apple is ______ (màu xanh dương).",
      "answers": [
        "blue"
      ],
      "explanation": "The apple is blue."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quả táo màu xanh dương.\"",
      "answers": [
        "the apple is blue"
      ],
      "explanation": "The apple is blue. = quả táo màu xanh dương."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The pencil is ______ (màu xanh dương).",
      "answers": [
        "blue"
      ],
      "explanation": "The pencil is blue."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cây bút chì màu xanh dương.\"",
      "answers": [
        "the pencil is blue"
      ],
      "explanation": "The pencil is blue. = cây bút chì màu xanh dương."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The door is ______ (màu xanh dương).",
      "answers": [
        "blue"
      ],
      "explanation": "The door is blue."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cánh cửa màu xanh dương.\"",
      "answers": [
        "the door is blue"
      ],
      "explanation": "The door is blue. = cánh cửa màu xanh dương."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The bags are ______ (màu xanh dương).",
      "answers": [
        "blue"
      ],
      "explanation": "The bags are blue."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The rulers are ______ (màu xanh dương).",
      "answers": [
        "blue"
      ],
      "explanation": "The rulers are blue."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích cái ghế màu xanh dương. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like the purple chair.",
        "I like the blue egg.",
        "I like the blue chair.",
        "I like blue chair."
      ],
      "answer": "I like the blue chair.",
      "explanation": "I like the blue chair. = Tôi thích cái ghế màu xanh dương."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích cục tẩy màu xanh dương. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like the blue egg.",
        "I like the purple eraser.",
        "I like blue eraser.",
        "I like the blue eraser."
      ],
      "answer": "I like the blue eraser.",
      "explanation": "I like the blue eraser. = Tôi thích cục tẩy màu xanh dương."
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
      "prompt": "Điền từ còn thiếu: The egg is ______ (màu xanh lá).",
      "answers": [
        "green"
      ],
      "explanation": "The egg is green."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quả trứng màu xanh lá.\"",
      "answers": [
        "the egg is green"
      ],
      "explanation": "The egg is green. = quả trứng màu xanh lá."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The eraser is ______ (màu xanh lá).",
      "answers": [
        "green"
      ],
      "explanation": "The eraser is green."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cục tẩy màu xanh lá.\"",
      "answers": [
        "the eraser is green"
      ],
      "explanation": "The eraser is green. = cục tẩy màu xanh lá."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The ball is ______ (màu xanh lá).",
      "answers": [
        "green"
      ],
      "explanation": "The ball is green."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quả bóng màu xanh lá.\"",
      "answers": [
        "the ball is green"
      ],
      "explanation": "The ball is green. = quả bóng màu xanh lá."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The chairs are ______ (màu xanh lá).",
      "answers": [
        "green"
      ],
      "explanation": "The chairs are green."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The pencils are ______ (màu xanh lá).",
      "answers": [
        "green"
      ],
      "explanation": "The pencils are green."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích quả táo màu xanh lá. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like green apple.",
        "I like the green apple.",
        "I like the green ruler.",
        "I like the orange apple."
      ],
      "answer": "I like the green apple.",
      "explanation": "I like the green apple. = Tôi thích quả táo màu xanh lá."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích cái bàn màu xanh lá. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like the green ruler.",
        "I like the green desk.",
        "I like the orange desk.",
        "I like green desk."
      ],
      "answer": "I like the green desk.",
      "explanation": "I like the green desk. = Tôi thích cái bàn màu xanh lá."
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
      "prompt": "Điền từ còn thiếu: The ruler is ______ (màu vàng).",
      "answers": [
        "yellow"
      ],
      "explanation": "The ruler is yellow."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái thước màu vàng.\"",
      "answers": [
        "the ruler is yellow"
      ],
      "explanation": "The ruler is yellow. = cái thước màu vàng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The desk is ______ (màu vàng).",
      "answers": [
        "yellow"
      ],
      "explanation": "The desk is yellow."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái bàn màu vàng.\"",
      "answers": [
        "the desk is yellow"
      ],
      "explanation": "The desk is yellow. = cái bàn màu vàng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The pen is ______ (màu vàng).",
      "answers": [
        "yellow"
      ],
      "explanation": "The pen is yellow."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cây bút màu vàng.\"",
      "answers": [
        "the pen is yellow"
      ],
      "explanation": "The pen is yellow. = cây bút màu vàng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The apples are ______ (màu vàng).",
      "answers": [
        "yellow"
      ],
      "explanation": "The apples are yellow."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The erasers are ______ (màu vàng).",
      "answers": [
        "yellow"
      ],
      "explanation": "The erasers are yellow."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích quả trứng màu vàng. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like the yellow egg.",
        "I like the yellow pencil.",
        "I like yellow egg.",
        "I like the black egg."
      ],
      "answer": "I like the yellow egg.",
      "explanation": "I like the yellow egg. = Tôi thích quả trứng màu vàng."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích cánh cửa màu vàng. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like the yellow door.",
        "I like the black door.",
        "I like the yellow pencil.",
        "I like yellow door."
      ],
      "answer": "I like the yellow door.",
      "explanation": "I like the yellow door. = Tôi thích cánh cửa màu vàng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The apple is ______ (màu hồng).",
      "answers": [
        "pink"
      ],
      "explanation": "The apple is pink."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quả táo màu hồng.\"",
      "answers": [
        "the apple is pink"
      ],
      "explanation": "The apple is pink. = quả táo màu hồng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The pencil is ______ (màu hồng).",
      "answers": [
        "pink"
      ],
      "explanation": "The pencil is pink."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cây bút chì màu hồng.\"",
      "answers": [
        "the pencil is pink"
      ],
      "explanation": "The pencil is pink. = cây bút chì màu hồng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The door is ______ (màu hồng).",
      "answers": [
        "pink"
      ],
      "explanation": "The door is pink."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cánh cửa màu hồng.\"",
      "answers": [
        "the door is pink"
      ],
      "explanation": "The door is pink. = cánh cửa màu hồng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The book is ______ (màu hồng).",
      "answers": [
        "pink"
      ],
      "explanation": "The book is pink."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quyển sách màu hồng.\"",
      "answers": [
        "the book is pink"
      ],
      "explanation": "The book is pink. = quyển sách màu hồng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The eggs are ______ (màu hồng).",
      "answers": [
        "pink"
      ],
      "explanation": "The eggs are pink."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The desks are ______ (màu hồng).",
      "answers": [
        "pink"
      ],
      "explanation": "The desks are pink."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích cái thước màu hồng. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like the white ruler.",
        "I like pink ruler.",
        "I like the pink ruler.",
        "I like the pink eraser."
      ],
      "answer": "I like the pink ruler.",
      "explanation": "I like the pink ruler. = Tôi thích cái thước màu hồng."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích quả bóng màu hồng. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like the white ball.",
        "I like the pink ball.",
        "I like the pink eraser.",
        "I like pink ball."
      ],
      "answer": "I like the pink ball.",
      "explanation": "I like the pink ball. = Tôi thích quả bóng màu hồng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The egg is ______ (màu tím).",
      "answers": [
        "purple"
      ],
      "explanation": "The egg is purple."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quả trứng màu tím.\"",
      "answers": [
        "the egg is purple"
      ],
      "explanation": "The egg is purple. = quả trứng màu tím."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The eraser is ______ (màu tím).",
      "answers": [
        "purple"
      ],
      "explanation": "The eraser is purple."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cục tẩy màu tím.\"",
      "answers": [
        "the eraser is purple"
      ],
      "explanation": "The eraser is purple. = cục tẩy màu tím."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The ball is ______ (màu tím).",
      "answers": [
        "purple"
      ],
      "explanation": "The ball is purple."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quả bóng màu tím.\"",
      "answers": [
        "the ball is purple"
      ],
      "explanation": "The ball is purple. = quả bóng màu tím."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The bag is ______ (màu tím).",
      "answers": [
        "purple"
      ],
      "explanation": "The bag is purple."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái cặp màu tím.\"",
      "answers": [
        "the bag is purple"
      ],
      "explanation": "The bag is purple. = cái cặp màu tím."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The rulers are ______ (màu tím).",
      "answers": [
        "purple"
      ],
      "explanation": "The rulers are purple."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The doors are ______ (màu tím).",
      "answers": [
        "purple"
      ],
      "explanation": "The doors are purple."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích cây bút chì màu tím. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like the purple pencil.",
        "I like the purple desk.",
        "I like purple pencil.",
        "I like the brown pencil."
      ],
      "answer": "I like the purple pencil.",
      "explanation": "I like the purple pencil. = Tôi thích cây bút chì màu tím."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích cây bút màu tím. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like purple pen.",
        "I like the purple desk.",
        "I like the brown pen.",
        "I like the purple pen."
      ],
      "answer": "I like the purple pen.",
      "explanation": "I like the purple pen. = Tôi thích cây bút màu tím."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The ruler is ______ (màu cam).",
      "answers": [
        "orange"
      ],
      "explanation": "The ruler is orange."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái thước màu cam.\"",
      "answers": [
        "the ruler is orange"
      ],
      "explanation": "The ruler is orange. = cái thước màu cam."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The desk is ______ (màu cam).",
      "answers": [
        "orange"
      ],
      "explanation": "The desk is orange."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái bàn màu cam.\"",
      "answers": [
        "the desk is orange"
      ],
      "explanation": "The desk is orange. = cái bàn màu cam."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The pen is ______ (màu cam).",
      "answers": [
        "orange"
      ],
      "explanation": "The pen is orange."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cây bút màu cam.\"",
      "answers": [
        "the pen is orange"
      ],
      "explanation": "The pen is orange. = cây bút màu cam."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The chair is ______ (màu cam).",
      "answers": [
        "orange"
      ],
      "explanation": "The chair is orange."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái ghế màu cam.\"",
      "answers": [
        "the chair is orange"
      ],
      "explanation": "The chair is orange. = cái ghế màu cam."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The pencils are ______ (màu cam).",
      "answers": [
        "orange"
      ],
      "explanation": "The pencils are orange."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The balls are ______ (màu cam).",
      "answers": [
        "orange"
      ],
      "explanation": "The balls are orange."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích cục tẩy màu cam. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like the red eraser.",
        "I like the orange door.",
        "I like the orange eraser.",
        "I like orange eraser."
      ],
      "answer": "I like the orange eraser.",
      "explanation": "I like the orange eraser. = Tôi thích cục tẩy màu cam."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích quyển sách màu cam. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like orange book.",
        "I like the orange book.",
        "I like the red book.",
        "I like the orange door."
      ],
      "answer": "I like the orange book.",
      "explanation": "I like the orange book. = Tôi thích quyển sách màu cam."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The pencil is ______ (màu đen).",
      "answers": [
        "black"
      ],
      "explanation": "The pencil is black."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cây bút chì màu đen.\"",
      "answers": [
        "the pencil is black"
      ],
      "explanation": "The pencil is black. = cây bút chì màu đen."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The door is ______ (màu đen).",
      "answers": [
        "black"
      ],
      "explanation": "The door is black."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cánh cửa màu đen.\"",
      "answers": [
        "the door is black"
      ],
      "explanation": "The door is black. = cánh cửa màu đen."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The book is ______ (màu đen).",
      "answers": [
        "black"
      ],
      "explanation": "The book is black."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quyển sách màu đen.\"",
      "answers": [
        "the book is black"
      ],
      "explanation": "The book is black. = quyển sách màu đen."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The apple is ______ (màu đen).",
      "answers": [
        "black"
      ],
      "explanation": "The apple is black."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quả táo màu đen.\"",
      "answers": [
        "the apple is black"
      ],
      "explanation": "The apple is black. = quả táo màu đen."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The erasers are ______ (màu đen).",
      "answers": [
        "black"
      ],
      "explanation": "The erasers are black."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The pens are ______ (màu đen).",
      "answers": [
        "black"
      ],
      "explanation": "The pens are black."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích cái bàn màu đen. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like black desk.",
        "I like the black ball.",
        "I like the blue desk.",
        "I like the black desk."
      ],
      "answer": "I like the black desk.",
      "explanation": "I like the black desk. = Tôi thích cái bàn màu đen."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích cái cặp màu đen. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like the black ball.",
        "I like black bag.",
        "I like the blue bag.",
        "I like the black bag."
      ],
      "answer": "I like the black bag.",
      "explanation": "I like the black bag. = Tôi thích cái cặp màu đen."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The eraser is ______ (màu trắng).",
      "answers": [
        "white"
      ],
      "explanation": "The eraser is white."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cục tẩy màu trắng.\"",
      "answers": [
        "the eraser is white"
      ],
      "explanation": "The eraser is white. = cục tẩy màu trắng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The ball is ______ (màu trắng).",
      "answers": [
        "white"
      ],
      "explanation": "The ball is white."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quả bóng màu trắng.\"",
      "answers": [
        "the ball is white"
      ],
      "explanation": "The ball is white. = quả bóng màu trắng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The bag is ______ (màu trắng).",
      "answers": [
        "white"
      ],
      "explanation": "The bag is white."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái cặp màu trắng.\"",
      "answers": [
        "the bag is white"
      ],
      "explanation": "The bag is white. = cái cặp màu trắng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The egg is ______ (màu trắng).",
      "answers": [
        "white"
      ],
      "explanation": "The egg is white."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"quả trứng màu trắng.\"",
      "answers": [
        "the egg is white"
      ],
      "explanation": "The egg is white. = quả trứng màu trắng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The desks are ______ (màu trắng).",
      "answers": [
        "white"
      ],
      "explanation": "The desks are white."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The books are ______ (màu trắng).",
      "answers": [
        "white"
      ],
      "explanation": "The books are white."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích cánh cửa màu trắng. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like white door.",
        "I like the white door.",
        "I like the white pen.",
        "I like the green door."
      ],
      "answer": "I like the white door.",
      "explanation": "I like the white door. = Tôi thích cánh cửa màu trắng."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích cái ghế màu trắng. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like the white chair.",
        "I like the green chair.",
        "I like white chair.",
        "I like the white pen."
      ],
      "answer": "I like the white chair.",
      "explanation": "I like the white chair. = Tôi thích cái ghế màu trắng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The desk is ______ (màu nâu).",
      "answers": [
        "brown"
      ],
      "explanation": "The desk is brown."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái bàn màu nâu.\"",
      "answers": [
        "the desk is brown"
      ],
      "explanation": "The desk is brown. = cái bàn màu nâu."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The pen is ______ (màu nâu).",
      "answers": [
        "brown"
      ],
      "explanation": "The pen is brown."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cây bút màu nâu.\"",
      "answers": [
        "the pen is brown"
      ],
      "explanation": "The pen is brown. = cây bút màu nâu."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The chair is ______ (màu nâu).",
      "answers": [
        "brown"
      ],
      "explanation": "The chair is brown."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái ghế màu nâu.\"",
      "answers": [
        "the chair is brown"
      ],
      "explanation": "The chair is brown. = cái ghế màu nâu."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The ruler is ______ (màu nâu).",
      "answers": [
        "brown"
      ],
      "explanation": "The ruler is brown."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"cái thước màu nâu.\"",
      "answers": [
        "the ruler is brown"
      ],
      "explanation": "The ruler is brown. = cái thước màu nâu."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The doors are ______ (màu nâu).",
      "answers": [
        "brown"
      ],
      "explanation": "The doors are brown."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The bags are ______ (màu nâu).",
      "answers": [
        "brown"
      ],
      "explanation": "The bags are brown."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích quả bóng màu nâu. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like the brown ball.",
        "I like brown ball.",
        "I like the yellow ball.",
        "I like the brown book."
      ],
      "answer": "I like the brown ball.",
      "explanation": "I like the brown ball. = Tôi thích quả bóng màu nâu."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích quả táo màu nâu. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like the brown book.",
        "I like the yellow apple.",
        "I like brown apple.",
        "I like the brown apple."
      ],
      "answer": "I like the brown apple.",
      "explanation": "I like the brown apple. = Tôi thích quả táo màu nâu."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: This is ______ pen.",
      "options": [
        "a",
        "the",
        "không cần từ nào",
        "an"
      ],
      "answer": "a",
      "explanation": "This is a pen."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: This is ______ book.",
      "options": [
        "an",
        "a",
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
        "the",
        "a",
        "an",
        "không cần từ nào"
      ],
      "answer": "a",
      "explanation": "This is a bag."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: This is ______ chair.",
      "options": [
        "a",
        "không cần từ nào",
        "an",
        "the"
      ],
      "answer": "a",
      "explanation": "This is a chair."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: This is ______ apple.",
      "options": [
        "a",
        "the",
        "an",
        "không cần từ nào"
      ],
      "answer": "an",
      "explanation": "This is an apple."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: This is ______ egg.",
      "options": [
        "the",
        "a",
        "an",
        "không cần từ nào"
      ],
      "answer": "an",
      "explanation": "This is an egg."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: This is ______ ruler.",
      "options": [
        "không cần từ nào",
        "an",
        "the",
        "a"
      ],
      "answer": "a",
      "explanation": "This is a ruler."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: This is ______ pencil.",
      "options": [
        "a",
        "the",
        "không cần từ nào",
        "an"
      ],
      "answer": "a",
      "explanation": "This is a pencil."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: This is ______ eraser.",
      "options": [
        "an",
        "không cần từ nào",
        "a",
        "the"
      ],
      "answer": "an",
      "explanation": "This is an eraser."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: This is ______ desk.",
      "options": [
        "an",
        "không cần từ nào",
        "the",
        "a"
      ],
      "answer": "a",
      "explanation": "This is a desk."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: This is ______ door.",
      "options": [
        "the",
        "a",
        "an",
        "không cần từ nào"
      ],
      "answer": "a",
      "explanation": "This is a door."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: This is ______ ball.",
      "options": [
        "an",
        "the",
        "không cần từ nào",
        "a"
      ],
      "answer": "a",
      "explanation": "This is a ball."
    }
  ],
  "food-drink": [
    {
      "type": "choice",
      "prompt": "\"rice\" có nghĩa là gì?",
      "options": [
        "cà phê",
        "cơm",
        "quả táo",
        "quả chuối"
      ],
      "answer": "cơm",
      "explanation": "rice = cơm."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"cơm\"?",
      "options": [
        "coffee",
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
      "prompt": "Điền từ còn thiếu: I like ______. (cơm)",
      "answers": [
        "rice"
      ],
      "explanation": "Câu đầy đủ: I like rice."
    },
    {
      "type": "choice",
      "prompt": "\"bread\" có nghĩa là gì?",
      "options": [
        "cơm",
        "sữa",
        "bánh mì",
        "nước"
      ],
      "answer": "bánh mì",
      "explanation": "bread = bánh mì."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"bánh mì\"?",
      "options": [
        "coffee",
        "milk",
        "water",
        "bread"
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
      "prompt": "Điền từ còn thiếu: I eat ______ for breakfast. (bánh mì)",
      "answers": [
        "bread"
      ],
      "explanation": "Câu đầy đủ: I eat bread for breakfast."
    },
    {
      "type": "choice",
      "prompt": "\"egg\" có nghĩa là gì?",
      "options": [
        "quả táo",
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
        "rice",
        "egg",
        "apple",
        "milk"
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
      "prompt": "Điền từ còn thiếu: I eat an ______. (quả trứng)",
      "answers": [
        "egg"
      ],
      "explanation": "Câu đầy đủ: I eat an egg."
    },
    {
      "type": "choice",
      "prompt": "\"milk\" có nghĩa là gì?",
      "options": [
        "cơm",
        "bánh mì",
        "sữa",
        "cà phê"
      ],
      "answer": "sữa",
      "explanation": "milk = sữa."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"sữa\"?",
      "options": [
        "egg",
        "milk",
        "banana",
        "coffee"
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
      "prompt": "Điền từ còn thiếu: I drink ______. (sữa)",
      "answers": [
        "milk"
      ],
      "explanation": "Câu đầy đủ: I drink milk."
    },
    {
      "type": "choice",
      "prompt": "\"water\" có nghĩa là gì?",
      "options": [
        "nước",
        "bánh mì",
        "sữa",
        "cơm"
      ],
      "answer": "nước",
      "explanation": "water = nước."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"nước\"?",
      "options": [
        "bread",
        "water",
        "milk",
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
      "prompt": "Điền từ còn thiếu: I drink ______ every day. (nước)",
      "answers": [
        "water"
      ],
      "explanation": "Câu đầy đủ: I drink water every day."
    },
    {
      "type": "choice",
      "prompt": "\"coffee\" có nghĩa là gì?",
      "options": [
        "cơm",
        "cà phê",
        "nước",
        "quả táo"
      ],
      "answer": "cà phê",
      "explanation": "coffee = cà phê."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"cà phê\"?",
      "options": [
        "apple",
        "banana",
        "bread",
        "coffee"
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
      "prompt": "Điền từ còn thiếu: My father likes ______. (cà phê)",
      "answers": [
        "coffee"
      ],
      "explanation": "Câu đầy đủ: My father likes coffee."
    },
    {
      "type": "choice",
      "prompt": "\"apple\" có nghĩa là gì?",
      "options": [
        "quả táo",
        "cơm",
        "bánh mì",
        "cà phê"
      ],
      "answer": "quả táo",
      "explanation": "apple = quả táo."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"quả táo\"?",
      "options": [
        "rice",
        "banana",
        "apple",
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
      "prompt": "Điền từ còn thiếu: An ______ a day. (quả táo)",
      "answers": [
        "apple"
      ],
      "explanation": "Câu đầy đủ: An apple a day."
    },
    {
      "type": "choice",
      "prompt": "\"banana\" có nghĩa là gì?",
      "options": [
        "sữa",
        "quả táo",
        "bánh mì",
        "quả chuối"
      ],
      "answer": "quả chuối",
      "explanation": "banana = quả chuối."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"quả chuối\"?",
      "options": [
        "banana",
        "egg",
        "coffee",
        "bread"
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
      "prompt": "Điền từ còn thiếu: The ______ is yellow. (quả chuối)",
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
        "You like rice?",
        "Do you likes rice?",
        "Do you like rice?",
        "Are you like rice?"
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
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like rice? — Yes, ______.",
      "answers": [
        "i do"
      ],
      "explanation": "Do you like rice? — Yes, I do. = Bạn có thích cơm không? — Có."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like rice? — No, ______.",
      "answers": [
        "i do not",
        "i don't"
      ],
      "explanation": "Do you like rice? — No, I do not. = Bạn có thích cơm không? — Không."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích cơm. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like coffee.",
        "I like rice.",
        "I like noodles.",
        "I like milk."
      ],
      "answer": "I like rice.",
      "explanation": "I like rice. = Tôi thích cơm."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She wants ______. (cơm)",
      "answers": [
        "rice"
      ],
      "explanation": "She wants rice. = Cô ấy muốn cơm."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I want some ______. (cơm)",
      "answers": [
        "rice"
      ],
      "explanation": "I want some rice. = Tôi muốn một ít cơm."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______. (cơm)",
      "answers": [
        "rice"
      ],
      "explanation": "I eat rice. = Tôi ăn cơm."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ rice. (ăn)",
      "answers": [
        "eats"
      ],
      "explanation": "She eats rice. = Cô ấy ăn cơm."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích bánh mì không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "Are you like bread?",
        "Do you like bread?",
        "You like bread?",
        "Do you likes bread?"
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
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like bread? — Yes, ______.",
      "answers": [
        "i do"
      ],
      "explanation": "Do you like bread? — Yes, I do. = Bạn có thích bánh mì không? — Có."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like bread? — No, ______.",
      "answers": [
        "i do not",
        "i don't"
      ],
      "explanation": "Do you like bread? — No, I do not. = Bạn có thích bánh mì không? — Không."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích bánh mì. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like milk.",
        "I like bread.",
        "I like chicken.",
        "I like coffee."
      ],
      "answer": "I like bread.",
      "explanation": "I like bread. = Tôi thích bánh mì."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She wants ______. (bánh mì)",
      "answers": [
        "bread"
      ],
      "explanation": "She wants bread. = Cô ấy muốn bánh mì."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I want some ______. (bánh mì)",
      "answers": [
        "bread"
      ],
      "explanation": "I want some bread. = Tôi muốn một ít bánh mì."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______. (bánh mì)",
      "answers": [
        "bread"
      ],
      "explanation": "I eat bread. = Tôi ăn bánh mì."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ bread. (ăn)",
      "answers": [
        "eats"
      ],
      "explanation": "She eats bread. = Cô ấy ăn bánh mì."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích quả trứng không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "Do you like egg?",
        "Do you likes egg?",
        "You like egg?",
        "Are you like egg?"
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
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like egg? — Yes, ______.",
      "answers": [
        "i do"
      ],
      "explanation": "Do you like egg? — Yes, I do. = Bạn có thích quả trứng không? — Có."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like egg? — No, ______.",
      "answers": [
        "i do not",
        "i don't"
      ],
      "explanation": "Do you like egg? — No, I do not. = Bạn có thích quả trứng không? — Không."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích quả trứng. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like milk.",
        "I like egg.",
        "I like cake.",
        "I like bread."
      ],
      "answer": "I like egg.",
      "explanation": "I like egg. = Tôi thích quả trứng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She wants ______. (quả trứng)",
      "answers": [
        "egg"
      ],
      "explanation": "She wants egg. = Cô ấy muốn quả trứng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I want some ______. (quả trứng)",
      "answers": [
        "egg"
      ],
      "explanation": "I want some egg. = Tôi muốn một ít quả trứng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______. (quả trứng)",
      "answers": [
        "egg"
      ],
      "explanation": "I eat egg. = Tôi ăn quả trứng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ egg. (ăn)",
      "answers": [
        "eats"
      ],
      "explanation": "She eats egg. = Cô ấy ăn quả trứng."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích sữa không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "Are you like milk?",
        "Do you like milk?",
        "Do you likes milk?",
        "You like milk?"
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
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like milk? — Yes, ______.",
      "answers": [
        "i do"
      ],
      "explanation": "Do you like milk? — Yes, I do. = Bạn có thích sữa không? — Có."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like milk? — No, ______.",
      "answers": [
        "i do not",
        "i don't"
      ],
      "explanation": "Do you like milk? — No, I do not. = Bạn có thích sữa không? — Không."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích sữa. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like milk.",
        "I like juice.",
        "I like sandwich.",
        "I like noodles."
      ],
      "answer": "I like milk.",
      "explanation": "I like milk. = Tôi thích sữa."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She wants ______. (sữa)",
      "answers": [
        "milk"
      ],
      "explanation": "She wants milk. = Cô ấy muốn sữa."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I want some ______. (sữa)",
      "answers": [
        "milk"
      ],
      "explanation": "I want some milk. = Tôi muốn một ít sữa."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ milk. (uống)",
      "answers": [
        "drinks"
      ],
      "explanation": "She drinks milk. = Cô ấy uống sữa."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích nước không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "Are you like water?",
        "You like water?",
        "Do you likes water?",
        "Do you like water?"
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
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like water? — Yes, ______.",
      "answers": [
        "i do"
      ],
      "explanation": "Do you like water? — Yes, I do. = Bạn có thích nước không? — Có."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like water? — No, ______.",
      "answers": [
        "i do not",
        "i don't"
      ],
      "explanation": "Do you like water? — No, I do not. = Bạn có thích nước không? — Không."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích nước. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like cake.",
        "I like water.",
        "I like chicken.",
        "I like pizza."
      ],
      "answer": "I like water.",
      "explanation": "I like water. = Tôi thích nước."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She wants ______. (nước)",
      "answers": [
        "water"
      ],
      "explanation": "She wants water. = Cô ấy muốn nước."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I want some ______. (nước)",
      "answers": [
        "water"
      ],
      "explanation": "I want some water. = Tôi muốn một ít nước."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I drink ______. (nước)",
      "answers": [
        "water"
      ],
      "explanation": "I drink water. = Tôi uống nước."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ water. (uống)",
      "answers": [
        "drinks"
      ],
      "explanation": "She drinks water. = Cô ấy uống nước."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích cà phê không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "Are you like coffee?",
        "Do you like coffee?",
        "Do you likes coffee?",
        "You like coffee?"
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
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like coffee? — Yes, ______.",
      "answers": [
        "i do"
      ],
      "explanation": "Do you like coffee? — Yes, I do. = Bạn có thích cà phê không? — Có."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like coffee? — No, ______.",
      "answers": [
        "i do not",
        "i don't"
      ],
      "explanation": "Do you like coffee? — No, I do not. = Bạn có thích cà phê không? — Không."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích cà phê. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like rice.",
        "I like coffee.",
        "I like cake.",
        "I like sandwich."
      ],
      "answer": "I like coffee.",
      "explanation": "I like coffee. = Tôi thích cà phê."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She wants ______. (cà phê)",
      "answers": [
        "coffee"
      ],
      "explanation": "She wants coffee. = Cô ấy muốn cà phê."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I want some ______. (cà phê)",
      "answers": [
        "coffee"
      ],
      "explanation": "I want some coffee. = Tôi muốn một ít cà phê."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I drink ______. (cà phê)",
      "answers": [
        "coffee"
      ],
      "explanation": "I drink coffee. = Tôi uống cà phê."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ coffee. (uống)",
      "answers": [
        "drinks"
      ],
      "explanation": "She drinks coffee. = Cô ấy uống cà phê."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích quả táo không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "You like apple?",
        "Do you likes apple?",
        "Are you like apple?",
        "Do you like apple?"
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
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like apple? — Yes, ______.",
      "answers": [
        "i do"
      ],
      "explanation": "Do you like apple? — Yes, I do. = Bạn có thích quả táo không? — Có."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like apple? — No, ______.",
      "answers": [
        "i do not",
        "i don't"
      ],
      "explanation": "Do you like apple? — No, I do not. = Bạn có thích quả táo không? — Không."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích quả táo. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like pizza.",
        "I like milk.",
        "I like apple.",
        "I like coffee."
      ],
      "answer": "I like apple.",
      "explanation": "I like apple. = Tôi thích quả táo."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She wants ______. (quả táo)",
      "answers": [
        "apple"
      ],
      "explanation": "She wants apple. = Cô ấy muốn quả táo."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I want some ______. (quả táo)",
      "answers": [
        "apple"
      ],
      "explanation": "I want some apple. = Tôi muốn một ít quả táo."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______. (quả táo)",
      "answers": [
        "apple"
      ],
      "explanation": "I eat apple. = Tôi ăn quả táo."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ apple. (ăn)",
      "answers": [
        "eats"
      ],
      "explanation": "She eats apple. = Cô ấy ăn quả táo."
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
      "prompt": "Trả lời ngắn: Do you like banana? — Yes, ______.",
      "answers": [
        "i do"
      ],
      "explanation": "Do you like banana? — Yes, I do. = Bạn có thích quả chuối không? — Có."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like banana? — No, ______.",
      "answers": [
        "i do not",
        "i don't"
      ],
      "explanation": "Do you like banana? — No, I do not. = Bạn có thích quả chuối không? — Không."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích quả chuối. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like fish.",
        "I like egg.",
        "I like banana.",
        "I like rice."
      ],
      "answer": "I like banana.",
      "explanation": "I like banana. = Tôi thích quả chuối."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She wants ______. (quả chuối)",
      "answers": [
        "banana"
      ],
      "explanation": "She wants banana. = Cô ấy muốn quả chuối."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I want some ______. (quả chuối)",
      "answers": [
        "banana"
      ],
      "explanation": "I want some banana. = Tôi muốn một ít quả chuối."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______. (quả chuối)",
      "answers": [
        "banana"
      ],
      "explanation": "I eat banana. = Tôi ăn quả chuối."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ banana. (ăn)",
      "answers": [
        "eats"
      ],
      "explanation": "She eats banana. = Cô ấy ăn quả chuối."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích bánh ngọt không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "Are you like cake?",
        "Do you like cake?",
        "You like cake?",
        "Do you likes cake?"
      ],
      "answer": "Do you like cake?",
      "explanation": "Do you like cake? = Bạn có thích bánh ngọt không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ cake. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I like cake. = Tôi thích bánh ngọt."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ cake. (thích)",
      "answers": [
        "likes"
      ],
      "explanation": "She likes cake. = Cô ấy thích bánh ngọt."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I do not ______ cake. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I do not like cake. = Tôi không thích bánh ngọt."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like cake? — Yes, ______.",
      "answers": [
        "i do"
      ],
      "explanation": "Do you like cake? — Yes, I do. = Bạn có thích bánh ngọt không? — Có."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like cake? — No, ______.",
      "answers": [
        "i do not",
        "i don't"
      ],
      "explanation": "Do you like cake? — No, I do not. = Bạn có thích bánh ngọt không? — Không."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích bánh ngọt. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like fish.",
        "I like cake.",
        "I like milk.",
        "I like juice."
      ],
      "answer": "I like cake.",
      "explanation": "I like cake. = Tôi thích bánh ngọt."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She wants ______. (bánh ngọt)",
      "answers": [
        "cake"
      ],
      "explanation": "She wants cake. = Cô ấy muốn bánh ngọt."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I want some ______. (bánh ngọt)",
      "answers": [
        "cake"
      ],
      "explanation": "I want some cake. = Tôi muốn một ít bánh ngọt."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______. (bánh ngọt)",
      "answers": [
        "cake"
      ],
      "explanation": "I eat cake. = Tôi ăn bánh ngọt."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ cake. (ăn)",
      "answers": [
        "eats"
      ],
      "explanation": "She eats cake. = Cô ấy ăn bánh ngọt."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích cá không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "Do you like fish?",
        "You like fish?",
        "Are you like fish?",
        "Do you likes fish?"
      ],
      "answer": "Do you like fish?",
      "explanation": "Do you like fish? = Bạn có thích cá không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ fish. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I like fish. = Tôi thích cá."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ fish. (thích)",
      "answers": [
        "likes"
      ],
      "explanation": "She likes fish. = Cô ấy thích cá."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I do not ______ fish. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I do not like fish. = Tôi không thích cá."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like fish? — Yes, ______.",
      "answers": [
        "i do"
      ],
      "explanation": "Do you like fish? — Yes, I do. = Bạn có thích cá không? — Có."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like fish? — No, ______.",
      "answers": [
        "i do not",
        "i don't"
      ],
      "explanation": "Do you like fish? — No, I do not. = Bạn có thích cá không? — Không."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích cá. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like cake.",
        "I like rice.",
        "I like egg.",
        "I like fish."
      ],
      "answer": "I like fish.",
      "explanation": "I like fish. = Tôi thích cá."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She wants ______. (cá)",
      "answers": [
        "fish"
      ],
      "explanation": "She wants fish. = Cô ấy muốn cá."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I want some ______. (cá)",
      "answers": [
        "fish"
      ],
      "explanation": "I want some fish. = Tôi muốn một ít cá."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______. (cá)",
      "answers": [
        "fish"
      ],
      "explanation": "I eat fish. = Tôi ăn cá."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ fish. (ăn)",
      "answers": [
        "eats"
      ],
      "explanation": "She eats fish. = Cô ấy ăn cá."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích thịt gà không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "Are you like chicken?",
        "Do you like chicken?",
        "Do you likes chicken?",
        "You like chicken?"
      ],
      "answer": "Do you like chicken?",
      "explanation": "Do you like chicken? = Bạn có thích thịt gà không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ chicken. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I like chicken. = Tôi thích thịt gà."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ chicken. (thích)",
      "answers": [
        "likes"
      ],
      "explanation": "She likes chicken. = Cô ấy thích thịt gà."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I do not ______ chicken. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I do not like chicken. = Tôi không thích thịt gà."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like chicken? — Yes, ______.",
      "answers": [
        "i do"
      ],
      "explanation": "Do you like chicken? — Yes, I do. = Bạn có thích thịt gà không? — Có."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like chicken? — No, ______.",
      "answers": [
        "i do not",
        "i don't"
      ],
      "explanation": "Do you like chicken? — No, I do not. = Bạn có thích thịt gà không? — Không."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích thịt gà. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like fish.",
        "I like chicken.",
        "I like water.",
        "I like juice."
      ],
      "answer": "I like chicken.",
      "explanation": "I like chicken. = Tôi thích thịt gà."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She wants ______. (thịt gà)",
      "answers": [
        "chicken"
      ],
      "explanation": "She wants chicken. = Cô ấy muốn thịt gà."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I want some ______. (thịt gà)",
      "answers": [
        "chicken"
      ],
      "explanation": "I want some chicken. = Tôi muốn một ít thịt gà."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______. (thịt gà)",
      "answers": [
        "chicken"
      ],
      "explanation": "I eat chicken. = Tôi ăn thịt gà."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ chicken. (ăn)",
      "answers": [
        "eats"
      ],
      "explanation": "She eats chicken. = Cô ấy ăn thịt gà."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích mì không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "Are you like noodles?",
        "Do you likes noodles?",
        "Do you like noodles?",
        "You like noodles?"
      ],
      "answer": "Do you like noodles?",
      "explanation": "Do you like noodles? = Bạn có thích mì không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ noodles. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I like noodles. = Tôi thích mì."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ noodles. (thích)",
      "answers": [
        "likes"
      ],
      "explanation": "She likes noodles. = Cô ấy thích mì."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I do not ______ noodles. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I do not like noodles. = Tôi không thích mì."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like noodles? — Yes, ______.",
      "answers": [
        "i do"
      ],
      "explanation": "Do you like noodles? — Yes, I do. = Bạn có thích mì không? — Có."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like noodles? — No, ______.",
      "answers": [
        "i do not",
        "i don't"
      ],
      "explanation": "Do you like noodles? — No, I do not. = Bạn có thích mì không? — Không."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích mì. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like milk.",
        "I like noodles.",
        "I like chicken.",
        "I like fish."
      ],
      "answer": "I like noodles.",
      "explanation": "I like noodles. = Tôi thích mì."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She wants ______. (mì)",
      "answers": [
        "noodles"
      ],
      "explanation": "She wants noodles. = Cô ấy muốn mì."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I want some ______. (mì)",
      "answers": [
        "noodles"
      ],
      "explanation": "I want some noodles. = Tôi muốn một ít mì."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______. (mì)",
      "answers": [
        "noodles"
      ],
      "explanation": "I eat noodles. = Tôi ăn mì."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ noodles. (ăn)",
      "answers": [
        "eats"
      ],
      "explanation": "She eats noodles. = Cô ấy ăn mì."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích nước ép không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "You like juice?",
        "Do you like juice?",
        "Are you like juice?",
        "Do you likes juice?"
      ],
      "answer": "Do you like juice?",
      "explanation": "Do you like juice? = Bạn có thích nước ép không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ juice. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I like juice. = Tôi thích nước ép."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ juice. (thích)",
      "answers": [
        "likes"
      ],
      "explanation": "She likes juice. = Cô ấy thích nước ép."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I do not ______ juice. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I do not like juice. = Tôi không thích nước ép."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like juice? — Yes, ______.",
      "answers": [
        "i do"
      ],
      "explanation": "Do you like juice? — Yes, I do. = Bạn có thích nước ép không? — Có."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like juice? — No, ______.",
      "answers": [
        "i do not",
        "i don't"
      ],
      "explanation": "Do you like juice? — No, I do not. = Bạn có thích nước ép không? — Không."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích nước ép. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like milk.",
        "I like chicken.",
        "I like juice.",
        "I like coffee."
      ],
      "answer": "I like juice.",
      "explanation": "I like juice. = Tôi thích nước ép."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She wants ______. (nước ép)",
      "answers": [
        "juice"
      ],
      "explanation": "She wants juice. = Cô ấy muốn nước ép."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I want some ______. (nước ép)",
      "answers": [
        "juice"
      ],
      "explanation": "I want some juice. = Tôi muốn một ít nước ép."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I drink ______. (nước ép)",
      "answers": [
        "juice"
      ],
      "explanation": "I drink juice. = Tôi uống nước ép."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ juice. (uống)",
      "answers": [
        "drinks"
      ],
      "explanation": "She drinks juice. = Cô ấy uống nước ép."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích trà không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "Are you like tea?",
        "Do you like tea?",
        "You like tea?",
        "Do you likes tea?"
      ],
      "answer": "Do you like tea?",
      "explanation": "Do you like tea? = Bạn có thích trà không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ tea. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I like tea. = Tôi thích trà."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ tea. (thích)",
      "answers": [
        "likes"
      ],
      "explanation": "She likes tea. = Cô ấy thích trà."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I do not ______ tea. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I do not like tea. = Tôi không thích trà."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like tea? — Yes, ______.",
      "answers": [
        "i do"
      ],
      "explanation": "Do you like tea? — Yes, I do. = Bạn có thích trà không? — Có."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like tea? — No, ______.",
      "answers": [
        "i do not",
        "i don't"
      ],
      "explanation": "Do you like tea? — No, I do not. = Bạn có thích trà không? — Không."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích trà. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like tea.",
        "I like juice.",
        "I like pizza.",
        "I like rice."
      ],
      "answer": "I like tea.",
      "explanation": "I like tea. = Tôi thích trà."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She wants ______. (trà)",
      "answers": [
        "tea"
      ],
      "explanation": "She wants tea. = Cô ấy muốn trà."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I want some ______. (trà)",
      "answers": [
        "tea"
      ],
      "explanation": "I want some tea. = Tôi muốn một ít trà."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I drink ______. (trà)",
      "answers": [
        "tea"
      ],
      "explanation": "I drink tea. = Tôi uống trà."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ tea. (uống)",
      "answers": [
        "drinks"
      ],
      "explanation": "She drinks tea. = Cô ấy uống trà."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích bánh mì kẹp không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "Are you like sandwich?",
        "Do you likes sandwich?",
        "Do you like sandwich?",
        "You like sandwich?"
      ],
      "answer": "Do you like sandwich?",
      "explanation": "Do you like sandwich? = Bạn có thích bánh mì kẹp không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ sandwich. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I like sandwich. = Tôi thích bánh mì kẹp."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ sandwich. (thích)",
      "answers": [
        "likes"
      ],
      "explanation": "She likes sandwich. = Cô ấy thích bánh mì kẹp."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I do not ______ sandwich. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I do not like sandwich. = Tôi không thích bánh mì kẹp."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like sandwich? — Yes, ______.",
      "answers": [
        "i do"
      ],
      "explanation": "Do you like sandwich? — Yes, I do. = Bạn có thích bánh mì kẹp không? — Có."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like sandwich? — No, ______.",
      "answers": [
        "i do not",
        "i don't"
      ],
      "explanation": "Do you like sandwich? — No, I do not. = Bạn có thích bánh mì kẹp không? — Không."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích bánh mì kẹp. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like tea.",
        "I like sandwich.",
        "I like water.",
        "I like apple."
      ],
      "answer": "I like sandwich.",
      "explanation": "I like sandwich. = Tôi thích bánh mì kẹp."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She wants ______. (bánh mì kẹp)",
      "answers": [
        "sandwich"
      ],
      "explanation": "She wants sandwich. = Cô ấy muốn bánh mì kẹp."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I want some ______. (bánh mì kẹp)",
      "answers": [
        "sandwich"
      ],
      "explanation": "I want some sandwich. = Tôi muốn một ít bánh mì kẹp."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______. (bánh mì kẹp)",
      "answers": [
        "sandwich"
      ],
      "explanation": "I eat sandwich. = Tôi ăn bánh mì kẹp."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ sandwich. (ăn)",
      "answers": [
        "eats"
      ],
      "explanation": "She eats sandwich. = Cô ấy ăn bánh mì kẹp."
    },
    {
      "type": "choice",
      "prompt": "Bạn có thích pizza không? Hỏi bằng tiếng Anh thế nào?",
      "options": [
        "You like pizza?",
        "Do you like pizza?",
        "Are you like pizza?",
        "Do you likes pizza?"
      ],
      "answer": "Do you like pizza?",
      "explanation": "Do you like pizza? = Bạn có thích pizza không?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ pizza. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I like pizza. = Tôi thích pizza."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ pizza. (thích)",
      "answers": [
        "likes"
      ],
      "explanation": "She likes pizza. = Cô ấy thích pizza."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I do not ______ pizza. (thích)",
      "answers": [
        "like"
      ],
      "explanation": "I do not like pizza. = Tôi không thích pizza."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like pizza? — Yes, ______.",
      "answers": [
        "i do"
      ],
      "explanation": "Do you like pizza? — Yes, I do. = Bạn có thích pizza không? — Có."
    },
    {
      "type": "fill",
      "prompt": "Trả lời ngắn: Do you like pizza? — No, ______.",
      "answers": [
        "i do not",
        "i don't"
      ],
      "explanation": "Do you like pizza? — No, I do not. = Bạn có thích pizza không? — Không."
    },
    {
      "type": "choice",
      "prompt": "Bạn thích pizza. Nói bằng tiếng Anh thế nào?",
      "options": [
        "I like chicken.",
        "I like coffee.",
        "I like tea.",
        "I like pizza."
      ],
      "answer": "I like pizza.",
      "explanation": "I like pizza. = Tôi thích pizza."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She wants ______. (pizza)",
      "answers": [
        "pizza"
      ],
      "explanation": "She wants pizza. = Cô ấy muốn pizza."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I want some ______. (pizza)",
      "answers": [
        "pizza"
      ],
      "explanation": "I want some pizza. = Tôi muốn một ít pizza."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I eat ______. (pizza)",
      "answers": [
        "pizza"
      ],
      "explanation": "I eat pizza. = Tôi ăn pizza."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ pizza. (ăn)",
      "answers": [
        "eats"
      ],
      "explanation": "She eats pizza. = Cô ấy ăn pizza."
    }
  ],
  "to-be": [
    {
      "type": "choice",
      "prompt": "\"I am / was\" có nghĩa là gì?",
      "options": [
        "đã không phải là",
        "họ là / đã là",
        "tôi là / đã là",
        "cô ấy là / đã là"
      ],
      "answer": "tôi là / đã là",
      "explanation": "I am / was = tôi là / đã là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ a student. / I was tired yesterday. (tôi là / đã là)",
      "answers": [
        "I am"
      ],
      "explanation": "Câu đầy đủ: I am a student. / I was tired yesterday."
    },
    {
      "type": "choice",
      "prompt": "\"he is / was\" có nghĩa là gì?",
      "options": [
        "nó là / đã là",
        "tôi là / đã là",
        "họ là / đã là",
        "anh ấy là / đã là"
      ],
      "answer": "anh ấy là / đã là",
      "explanation": "he is / was = anh ấy là / đã là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ happy. / He was happy yesterday. (anh ấy là / đã là)",
      "answers": [
        "he is"
      ],
      "explanation": "Câu đầy đủ: He is happy. / He was happy yesterday."
    },
    {
      "type": "choice",
      "prompt": "\"she is / was\" có nghĩa là gì?",
      "options": [
        "nó là / đã là",
        "họ là / đã là",
        "anh ấy là / đã là",
        "cô ấy là / đã là"
      ],
      "answer": "cô ấy là / đã là",
      "explanation": "she is / was = cô ấy là / đã là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ a teacher. / She was a teacher. (cô ấy là / đã là)",
      "answers": [
        "she is"
      ],
      "explanation": "Câu đầy đủ: She is a teacher. / She was a teacher."
    },
    {
      "type": "choice",
      "prompt": "\"it is / was\" có nghĩa là gì?",
      "options": [
        "anh ấy là / đã là",
        "nó là / đã là",
        "tôi là / đã là",
        "bạn là / đã là"
      ],
      "answer": "nó là / đã là",
      "explanation": "it is / was = nó là / đã là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ cold. / It was cold yesterday. (nó là / đã là)",
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
        "họ là / đã là",
        "tôi là / đã là"
      ],
      "answer": "chúng tôi là / đã là",
      "explanation": "we are / were = chúng tôi là / đã là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ friends. / We were friends. (chúng tôi là / đã là)",
      "answers": [
        "we are"
      ],
      "explanation": "Câu đầy đủ: We are friends. / We were friends."
    },
    {
      "type": "choice",
      "prompt": "\"they are / were\" có nghĩa là gì?",
      "options": [
        "anh ấy là / đã là",
        "họ là / đã là",
        "cô ấy là / đã là",
        "chúng tôi là / đã là"
      ],
      "answer": "họ là / đã là",
      "explanation": "they are / were = họ là / đã là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ students. / They were students. (họ là / đã là)",
      "answers": [
        "they are"
      ],
      "explanation": "Câu đầy đủ: They are students. / They were students."
    },
    {
      "type": "choice",
      "prompt": "\"you are / were\" có nghĩa là gì?",
      "options": [
        "anh ấy là / đã là",
        "bạn là / đã là",
        "đã không phải là",
        "chúng tôi là / đã là"
      ],
      "answer": "bạn là / đã là",
      "explanation": "you are / were = bạn là / đã là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ kind. / You were kind. (bạn là / đã là)",
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
        "họ là / đã là",
        "tôi là / đã là"
      ],
      "answer": "đã không phải là",
      "explanation": "wasn't / weren't = đã không phải là."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ here yesterday. (đã không phải là)",
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
        "are",
        "were",
        "am",
        "was"
      ],
      "answer": "am",
      "explanation": "I + am happy (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ happy yesterday.",
      "options": [
        "were",
        "are",
        "was",
        "am"
      ],
      "answer": "was",
      "explanation": "I + was happy (quá khứ)."
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
      "prompt": "Chọn dạng đúng: I ______ thirsty today.",
      "options": [
        "am",
        "is",
        "was",
        "were"
      ],
      "answer": "am",
      "explanation": "I + am thirsty (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ thirsty yesterday.",
      "options": [
        "is",
        "was",
        "were",
        "are"
      ],
      "answer": "was",
      "explanation": "I + was thirsty (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: I ______ thirsty today.",
      "answers": [
        "am"
      ],
      "explanation": "I am thirsty today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: I ______ thirsty yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "I was thirsty yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ happy today. (phủ định)",
      "options": [
        "weren't",
        "was not",
        "am not",
        "wasn't"
      ],
      "answer": "am not",
      "explanation": "I am not happy today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ happy yesterday. (phủ định)",
      "options": [
        "am not",
        "aren't",
        "isn't",
        "was not"
      ],
      "answer": "was not",
      "explanation": "I was not happy yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ I happy today?",
      "answers": [
        "Am"
      ],
      "explanation": "Am I happy today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ I happy yesterday?",
      "answers": [
        "Was"
      ],
      "explanation": "Was I happy yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ sad today.",
      "options": [
        "are",
        "was",
        "is",
        "am"
      ],
      "answer": "is",
      "explanation": "He + is sad (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ sad yesterday.",
      "options": [
        "is",
        "am",
        "are",
        "was"
      ],
      "answer": "was",
      "explanation": "He + was sad (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ sad today.",
      "answers": [
        "is"
      ],
      "explanation": "He is sad today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ sad yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "He was sad yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ sick today.",
      "options": [
        "were",
        "was",
        "is",
        "am"
      ],
      "answer": "is",
      "explanation": "He + is sick (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ sick yesterday.",
      "options": [
        "am",
        "is",
        "was",
        "are"
      ],
      "answer": "was",
      "explanation": "He + was sick (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ sick today.",
      "answers": [
        "is"
      ],
      "explanation": "He is sick today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ sick yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "He was sick yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ sad today. (phủ định)",
      "options": [
        "isn't",
        "was not",
        "am not",
        "aren't"
      ],
      "answer": "isn't",
      "explanation": "He isn't sad today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ sad yesterday. (phủ định)",
      "options": [
        "aren't",
        "wasn't",
        "weren't",
        "isn't"
      ],
      "answer": "wasn't",
      "explanation": "He wasn't sad yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ He sad today?",
      "answers": [
        "Is"
      ],
      "explanation": "Is He sad today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ He sad yesterday?",
      "answers": [
        "Was"
      ],
      "explanation": "Was He sad yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ tired today.",
      "options": [
        "are",
        "is",
        "was",
        "am"
      ],
      "answer": "is",
      "explanation": "She + is tired (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ tired yesterday.",
      "options": [
        "is",
        "was",
        "were",
        "am"
      ],
      "answer": "was",
      "explanation": "She + was tired (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ tired today.",
      "answers": [
        "is"
      ],
      "explanation": "She is tired today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ tired yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "She was tired yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ ready today.",
      "options": [
        "was",
        "is",
        "am",
        "were"
      ],
      "answer": "is",
      "explanation": "She + is ready (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ ready yesterday.",
      "options": [
        "were",
        "am",
        "was",
        "are"
      ],
      "answer": "was",
      "explanation": "She + was ready (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ ready today.",
      "answers": [
        "is"
      ],
      "explanation": "She is ready today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ ready yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "She was ready yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ tired today. (phủ định)",
      "options": [
        "aren't",
        "am not",
        "isn't",
        "wasn't"
      ],
      "answer": "isn't",
      "explanation": "She isn't tired today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ tired yesterday. (phủ định)",
      "options": [
        "weren't",
        "aren't",
        "wasn't",
        "isn't"
      ],
      "answer": "wasn't",
      "explanation": "She wasn't tired yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ She tired today?",
      "answers": [
        "Is"
      ],
      "explanation": "Is She tired today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ She tired yesterday?",
      "answers": [
        "Was"
      ],
      "explanation": "Was She tired yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: It ______ busy today.",
      "options": [
        "were",
        "are",
        "is",
        "am"
      ],
      "answer": "is",
      "explanation": "It + is busy (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: It ______ busy yesterday.",
      "options": [
        "am",
        "were",
        "was",
        "are"
      ],
      "answer": "was",
      "explanation": "It + was busy (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: It ______ busy today.",
      "answers": [
        "is"
      ],
      "explanation": "It is busy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: It ______ busy yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "It was busy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: It ______ late today.",
      "options": [
        "is",
        "am",
        "was",
        "were"
      ],
      "answer": "is",
      "explanation": "It + is late (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: It ______ late yesterday.",
      "options": [
        "am",
        "was",
        "are",
        "were"
      ],
      "answer": "was",
      "explanation": "It + was late (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: It ______ late today.",
      "answers": [
        "is"
      ],
      "explanation": "It is late today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: It ______ late yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "It was late yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: It ______ busy today. (phủ định)",
      "options": [
        "wasn't",
        "was not",
        "isn't",
        "aren't"
      ],
      "answer": "isn't",
      "explanation": "It isn't busy today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: It ______ busy yesterday. (phủ định)",
      "options": [
        "aren't",
        "wasn't",
        "isn't",
        "am not"
      ],
      "answer": "wasn't",
      "explanation": "It wasn't busy yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ It busy today?",
      "answers": [
        "Is"
      ],
      "explanation": "Is It busy today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ It busy yesterday?",
      "answers": [
        "Was"
      ],
      "explanation": "Was It busy yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ hungry today.",
      "options": [
        "were",
        "are",
        "is",
        "was"
      ],
      "answer": "are",
      "explanation": "We + are hungry (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ hungry yesterday.",
      "options": [
        "are",
        "was",
        "were",
        "am"
      ],
      "answer": "were",
      "explanation": "We + were hungry (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ hungry today.",
      "answers": [
        "are"
      ],
      "explanation": "We are hungry today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ hungry yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "We were hungry yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ early today.",
      "options": [
        "is",
        "are",
        "were",
        "was"
      ],
      "answer": "are",
      "explanation": "We + are early (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ early yesterday.",
      "options": [
        "are",
        "was",
        "were",
        "am"
      ],
      "answer": "were",
      "explanation": "We + were early (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ early today.",
      "answers": [
        "are"
      ],
      "explanation": "We are early today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ early yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "We were early yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ hungry today. (phủ định)",
      "options": [
        "isn't",
        "am not",
        "aren't",
        "was not"
      ],
      "answer": "aren't",
      "explanation": "We aren't hungry today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ hungry yesterday. (phủ định)",
      "options": [
        "wasn't",
        "weren't",
        "aren't",
        "am not"
      ],
      "answer": "weren't",
      "explanation": "We weren't hungry yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ We hungry today?",
      "answers": [
        "Are"
      ],
      "explanation": "Are We hungry today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ We hungry yesterday?",
      "answers": [
        "Were"
      ],
      "explanation": "Were We hungry yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ thirsty today.",
      "options": [
        "was",
        "are",
        "am",
        "is"
      ],
      "answer": "are",
      "explanation": "They + are thirsty (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ thirsty yesterday.",
      "options": [
        "is",
        "was",
        "am",
        "were"
      ],
      "answer": "were",
      "explanation": "They + were thirsty (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: They ______ thirsty today.",
      "answers": [
        "are"
      ],
      "explanation": "They are thirsty today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: They ______ thirsty yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "They were thirsty yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ free today.",
      "options": [
        "am",
        "were",
        "are",
        "was"
      ],
      "answer": "are",
      "explanation": "They + are free (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ free yesterday.",
      "options": [
        "were",
        "is",
        "are",
        "am"
      ],
      "answer": "were",
      "explanation": "They + were free (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: They ______ free today.",
      "answers": [
        "are"
      ],
      "explanation": "They are free today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: They ______ free yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "They were free yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ thirsty today. (phủ định)",
      "options": [
        "aren't",
        "isn't",
        "am not",
        "wasn't"
      ],
      "answer": "aren't",
      "explanation": "They aren't thirsty today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ thirsty yesterday. (phủ định)",
      "options": [
        "was not",
        "wasn't",
        "weren't",
        "isn't"
      ],
      "answer": "weren't",
      "explanation": "They weren't thirsty yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ They thirsty today?",
      "answers": [
        "Are"
      ],
      "explanation": "Are They thirsty today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ They thirsty yesterday?",
      "answers": [
        "Were"
      ],
      "explanation": "Were They thirsty yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ sick today.",
      "options": [
        "were",
        "is",
        "am",
        "are"
      ],
      "answer": "is",
      "explanation": "Lan + is sick (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ sick yesterday.",
      "options": [
        "am",
        "is",
        "were",
        "was"
      ],
      "answer": "was",
      "explanation": "Lan + was sick (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ sick today.",
      "answers": [
        "is"
      ],
      "explanation": "Lan is sick today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ sick yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "Lan was sick yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ kind today.",
      "options": [
        "is",
        "are",
        "were",
        "was"
      ],
      "answer": "is",
      "explanation": "Lan + is kind (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ kind yesterday.",
      "options": [
        "is",
        "were",
        "was",
        "am"
      ],
      "answer": "was",
      "explanation": "Lan + was kind (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ kind today.",
      "answers": [
        "is"
      ],
      "explanation": "Lan is kind today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ kind yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "Lan was kind yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ sick today. (phủ định)",
      "options": [
        "isn't",
        "weren't",
        "am not",
        "was not"
      ],
      "answer": "isn't",
      "explanation": "Lan isn't sick today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ sick yesterday. (phủ định)",
      "options": [
        "aren't",
        "wasn't",
        "isn't",
        "weren't"
      ],
      "answer": "wasn't",
      "explanation": "Lan wasn't sick yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ Lan sick today?",
      "answers": [
        "Is"
      ],
      "explanation": "Is Lan sick today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ Lan sick yesterday?",
      "answers": [
        "Was"
      ],
      "explanation": "Was Lan sick yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Nam ______ ready today.",
      "options": [
        "is",
        "were",
        "am",
        "was"
      ],
      "answer": "is",
      "explanation": "Nam + is ready (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Nam ______ ready yesterday.",
      "options": [
        "is",
        "am",
        "are",
        "was"
      ],
      "answer": "was",
      "explanation": "Nam + was ready (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Nam ______ ready today.",
      "answers": [
        "is"
      ],
      "explanation": "Nam is ready today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Nam ______ ready yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "Nam was ready yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Nam ______ happy today.",
      "options": [
        "was",
        "are",
        "were",
        "is"
      ],
      "answer": "is",
      "explanation": "Nam + is happy (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Nam ______ happy yesterday.",
      "options": [
        "is",
        "was",
        "am",
        "were"
      ],
      "answer": "was",
      "explanation": "Nam + was happy (quá khứ)."
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
      "prompt": "Chọn dạng đúng: Nam ______ ready today. (phủ định)",
      "options": [
        "isn't",
        "wasn't",
        "was not",
        "aren't"
      ],
      "answer": "isn't",
      "explanation": "Nam isn't ready today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Nam ______ ready yesterday. (phủ định)",
      "options": [
        "wasn't",
        "isn't",
        "weren't",
        "am not"
      ],
      "answer": "wasn't",
      "explanation": "Nam wasn't ready yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ Nam ready today?",
      "answers": [
        "Is"
      ],
      "explanation": "Is Nam ready today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ Nam ready yesterday?",
      "answers": [
        "Was"
      ],
      "explanation": "Was Nam ready yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My parents ______ late today.",
      "options": [
        "were",
        "are",
        "am",
        "is"
      ],
      "answer": "are",
      "explanation": "My parents + are late (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My parents ______ late yesterday.",
      "options": [
        "were",
        "am",
        "are",
        "was"
      ],
      "answer": "were",
      "explanation": "My parents + were late (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My parents ______ late today.",
      "answers": [
        "are"
      ],
      "explanation": "My parents are late today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My parents ______ late yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "My parents were late yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My parents ______ sad today.",
      "options": [
        "am",
        "were",
        "are",
        "was"
      ],
      "answer": "are",
      "explanation": "My parents + are sad (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My parents ______ sad yesterday.",
      "options": [
        "am",
        "is",
        "were",
        "are"
      ],
      "answer": "were",
      "explanation": "My parents + were sad (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My parents ______ sad today.",
      "answers": [
        "are"
      ],
      "explanation": "My parents are sad today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My parents ______ sad yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "My parents were sad yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My parents ______ late today. (phủ định)",
      "options": [
        "weren't",
        "wasn't",
        "isn't",
        "aren't"
      ],
      "answer": "aren't",
      "explanation": "My parents aren't late today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My parents ______ late yesterday. (phủ định)",
      "options": [
        "weren't",
        "was not",
        "am not",
        "wasn't"
      ],
      "answer": "weren't",
      "explanation": "My parents weren't late yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ My parents late today?",
      "answers": [
        "Are"
      ],
      "explanation": "Are My parents late today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ My parents late yesterday?",
      "answers": [
        "Were"
      ],
      "explanation": "Were My parents late yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The cat ______ early today.",
      "options": [
        "was",
        "were",
        "am",
        "is"
      ],
      "answer": "is",
      "explanation": "The cat + is early (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The cat ______ early yesterday.",
      "options": [
        "were",
        "am",
        "are",
        "was"
      ],
      "answer": "was",
      "explanation": "The cat + was early (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The cat ______ early today.",
      "answers": [
        "is"
      ],
      "explanation": "The cat is early today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The cat ______ early yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "The cat was early yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The cat ______ tired today.",
      "options": [
        "was",
        "is",
        "were",
        "am"
      ],
      "answer": "is",
      "explanation": "The cat + is tired (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The cat ______ tired yesterday.",
      "options": [
        "was",
        "am",
        "were",
        "are"
      ],
      "answer": "was",
      "explanation": "The cat + was tired (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The cat ______ tired today.",
      "answers": [
        "is"
      ],
      "explanation": "The cat is tired today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The cat ______ tired yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "The cat was tired yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The cat ______ early today. (phủ định)",
      "options": [
        "weren't",
        "isn't",
        "aren't",
        "was not"
      ],
      "answer": "isn't",
      "explanation": "The cat isn't early today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The cat ______ early yesterday. (phủ định)",
      "options": [
        "wasn't",
        "am not",
        "isn't",
        "aren't"
      ],
      "answer": "wasn't",
      "explanation": "The cat wasn't early yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ The cat early today?",
      "answers": [
        "Is"
      ],
      "explanation": "Is The cat early today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ The cat early yesterday?",
      "answers": [
        "Was"
      ],
      "explanation": "Was The cat early yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Hoa ______ free today.",
      "options": [
        "was",
        "is",
        "were",
        "are"
      ],
      "answer": "is",
      "explanation": "Hoa + is free (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Hoa ______ free yesterday.",
      "options": [
        "is",
        "am",
        "was",
        "are"
      ],
      "answer": "was",
      "explanation": "Hoa + was free (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Hoa ______ free today.",
      "answers": [
        "is"
      ],
      "explanation": "Hoa is free today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Hoa ______ free yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "Hoa was free yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Hoa ______ busy today.",
      "options": [
        "is",
        "was",
        "were",
        "are"
      ],
      "answer": "is",
      "explanation": "Hoa + is busy (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Hoa ______ busy yesterday.",
      "options": [
        "are",
        "is",
        "am",
        "was"
      ],
      "answer": "was",
      "explanation": "Hoa + was busy (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Hoa ______ busy today.",
      "answers": [
        "is"
      ],
      "explanation": "Hoa is busy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Hoa ______ busy yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "Hoa was busy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Hoa ______ free today. (phủ định)",
      "options": [
        "was not",
        "weren't",
        "wasn't",
        "isn't"
      ],
      "answer": "isn't",
      "explanation": "Hoa isn't free today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Hoa ______ free yesterday. (phủ định)",
      "options": [
        "wasn't",
        "weren't",
        "am not",
        "aren't"
      ],
      "answer": "wasn't",
      "explanation": "Hoa wasn't free yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ Hoa free today?",
      "answers": [
        "Is"
      ],
      "explanation": "Is Hoa free today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ Hoa free yesterday?",
      "answers": [
        "Was"
      ],
      "explanation": "Was Hoa free yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The dogs ______ kind today.",
      "options": [
        "are",
        "am",
        "was",
        "is"
      ],
      "answer": "are",
      "explanation": "The dogs + are kind (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The dogs ______ kind yesterday.",
      "options": [
        "were",
        "am",
        "was",
        "are"
      ],
      "answer": "were",
      "explanation": "The dogs + were kind (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The dogs ______ kind today.",
      "answers": [
        "are"
      ],
      "explanation": "The dogs are kind today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The dogs ______ kind yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "The dogs were kind yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The dogs ______ hungry today.",
      "options": [
        "are",
        "were",
        "is",
        "am"
      ],
      "answer": "are",
      "explanation": "The dogs + are hungry (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The dogs ______ hungry yesterday.",
      "options": [
        "are",
        "were",
        "am",
        "is"
      ],
      "answer": "were",
      "explanation": "The dogs + were hungry (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The dogs ______ hungry today.",
      "answers": [
        "are"
      ],
      "explanation": "The dogs are hungry today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The dogs ______ hungry yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "The dogs were hungry yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The dogs ______ kind today. (phủ định)",
      "options": [
        "isn't",
        "aren't",
        "weren't",
        "wasn't"
      ],
      "answer": "aren't",
      "explanation": "The dogs aren't kind today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The dogs ______ kind yesterday. (phủ định)",
      "options": [
        "wasn't",
        "aren't",
        "am not",
        "weren't"
      ],
      "answer": "weren't",
      "explanation": "The dogs weren't kind yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ The dogs kind today?",
      "answers": [
        "Are"
      ],
      "explanation": "Are The dogs kind today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ The dogs kind yesterday?",
      "answers": [
        "Were"
      ],
      "explanation": "Were The dogs kind yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My brother ______ happy today.",
      "options": [
        "am",
        "was",
        "are",
        "is"
      ],
      "answer": "is",
      "explanation": "My brother + is happy (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My brother ______ happy yesterday.",
      "options": [
        "was",
        "were",
        "am",
        "are"
      ],
      "answer": "was",
      "explanation": "My brother + was happy (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My brother ______ happy today.",
      "answers": [
        "is"
      ],
      "explanation": "My brother is happy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My brother ______ happy yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "My brother was happy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My brother ______ thirsty today.",
      "options": [
        "are",
        "is",
        "am",
        "were"
      ],
      "answer": "is",
      "explanation": "My brother + is thirsty (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My brother ______ thirsty yesterday.",
      "options": [
        "am",
        "was",
        "were",
        "is"
      ],
      "answer": "was",
      "explanation": "My brother + was thirsty (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My brother ______ thirsty today.",
      "answers": [
        "is"
      ],
      "explanation": "My brother is thirsty today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My brother ______ thirsty yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "My brother was thirsty yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My brother ______ happy today. (phủ định)",
      "options": [
        "weren't",
        "was not",
        "wasn't",
        "isn't"
      ],
      "answer": "isn't",
      "explanation": "My brother isn't happy today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My brother ______ happy yesterday. (phủ định)",
      "options": [
        "wasn't",
        "am not",
        "isn't",
        "aren't"
      ],
      "answer": "wasn't",
      "explanation": "My brother wasn't happy yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ My brother happy today?",
      "answers": [
        "Is"
      ],
      "explanation": "Is My brother happy today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ My brother happy yesterday?",
      "answers": [
        "Was"
      ],
      "explanation": "Was My brother happy yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My sister ______ sad today.",
      "options": [
        "am",
        "are",
        "was",
        "is"
      ],
      "answer": "is",
      "explanation": "My sister + is sad (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My sister ______ sad yesterday.",
      "options": [
        "were",
        "is",
        "are",
        "was"
      ],
      "answer": "was",
      "explanation": "My sister + was sad (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My sister ______ sad today.",
      "answers": [
        "is"
      ],
      "explanation": "My sister is sad today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My sister ______ sad yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "My sister was sad yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My sister ______ sick today.",
      "options": [
        "is",
        "was",
        "am",
        "were"
      ],
      "answer": "is",
      "explanation": "My sister + is sick (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My sister ______ sick yesterday.",
      "options": [
        "is",
        "are",
        "was",
        "were"
      ],
      "answer": "was",
      "explanation": "My sister + was sick (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My sister ______ sick today.",
      "answers": [
        "is"
      ],
      "explanation": "My sister is sick today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My sister ______ sick yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "My sister was sick yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My sister ______ sad today. (phủ định)",
      "options": [
        "was not",
        "wasn't",
        "isn't",
        "weren't"
      ],
      "answer": "isn't",
      "explanation": "My sister isn't sad today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My sister ______ sad yesterday. (phủ định)",
      "options": [
        "isn't",
        "wasn't",
        "aren't",
        "weren't"
      ],
      "answer": "wasn't",
      "explanation": "My sister wasn't sad yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ My sister sad today?",
      "answers": [
        "Is"
      ],
      "explanation": "Is My sister sad today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ My sister sad yesterday?",
      "answers": [
        "Was"
      ],
      "explanation": "Was My sister sad yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The teacher ______ tired today.",
      "options": [
        "am",
        "was",
        "are",
        "is"
      ],
      "answer": "is",
      "explanation": "The teacher + is tired (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The teacher ______ tired yesterday.",
      "options": [
        "were",
        "is",
        "am",
        "was"
      ],
      "answer": "was",
      "explanation": "The teacher + was tired (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The teacher ______ tired today.",
      "answers": [
        "is"
      ],
      "explanation": "The teacher is tired today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The teacher ______ tired yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "The teacher was tired yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The teacher ______ ready today.",
      "options": [
        "were",
        "are",
        "is",
        "was"
      ],
      "answer": "is",
      "explanation": "The teacher + is ready (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The teacher ______ ready yesterday.",
      "options": [
        "am",
        "are",
        "was",
        "is"
      ],
      "answer": "was",
      "explanation": "The teacher + was ready (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The teacher ______ ready today.",
      "answers": [
        "is"
      ],
      "explanation": "The teacher is ready today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The teacher ______ ready yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "The teacher was ready yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The teacher ______ tired today. (phủ định)",
      "options": [
        "was not",
        "am not",
        "isn't",
        "aren't"
      ],
      "answer": "isn't",
      "explanation": "The teacher isn't tired today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The teacher ______ tired yesterday. (phủ định)",
      "options": [
        "aren't",
        "weren't",
        "isn't",
        "wasn't"
      ],
      "answer": "wasn't",
      "explanation": "The teacher wasn't tired yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ The teacher tired today?",
      "answers": [
        "Is"
      ],
      "explanation": "Is The teacher tired today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ The teacher tired yesterday?",
      "answers": [
        "Was"
      ],
      "explanation": "Was The teacher tired yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Mr. Nam ______ busy today.",
      "options": [
        "is",
        "were",
        "are",
        "was"
      ],
      "answer": "is",
      "explanation": "Mr. Nam + is busy (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Mr. Nam ______ busy yesterday.",
      "options": [
        "are",
        "am",
        "is",
        "was"
      ],
      "answer": "was",
      "explanation": "Mr. Nam + was busy (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Mr. Nam ______ busy today.",
      "answers": [
        "is"
      ],
      "explanation": "Mr. Nam is busy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Mr. Nam ______ busy yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "Mr. Nam was busy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Mr. Nam ______ late today.",
      "options": [
        "was",
        "is",
        "are",
        "were"
      ],
      "answer": "is",
      "explanation": "Mr. Nam + is late (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Mr. Nam ______ late yesterday.",
      "options": [
        "am",
        "was",
        "is",
        "were"
      ],
      "answer": "was",
      "explanation": "Mr. Nam + was late (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Mr. Nam ______ late today.",
      "answers": [
        "is"
      ],
      "explanation": "Mr. Nam is late today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Mr. Nam ______ late yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "Mr. Nam was late yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Mr. Nam ______ busy today. (phủ định)",
      "options": [
        "aren't",
        "was not",
        "wasn't",
        "isn't"
      ],
      "answer": "isn't",
      "explanation": "Mr. Nam isn't busy today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Mr. Nam ______ busy yesterday. (phủ định)",
      "options": [
        "weren't",
        "aren't",
        "wasn't",
        "isn't"
      ],
      "answer": "wasn't",
      "explanation": "Mr. Nam wasn't busy yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ Mr. Nam busy today?",
      "answers": [
        "Is"
      ],
      "explanation": "Is Mr. Nam busy today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ Mr. Nam busy yesterday?",
      "answers": [
        "Was"
      ],
      "explanation": "Was Mr. Nam busy yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Mrs. Lan ______ hungry today.",
      "options": [
        "were",
        "is",
        "am",
        "was"
      ],
      "answer": "is",
      "explanation": "Mrs. Lan + is hungry (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Mrs. Lan ______ hungry yesterday.",
      "options": [
        "were",
        "are",
        "am",
        "was"
      ],
      "answer": "was",
      "explanation": "Mrs. Lan + was hungry (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Mrs. Lan ______ hungry today.",
      "answers": [
        "is"
      ],
      "explanation": "Mrs. Lan is hungry today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Mrs. Lan ______ hungry yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "Mrs. Lan was hungry yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Mrs. Lan ______ early today.",
      "options": [
        "were",
        "is",
        "are",
        "am"
      ],
      "answer": "is",
      "explanation": "Mrs. Lan + is early (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Mrs. Lan ______ early yesterday.",
      "options": [
        "am",
        "is",
        "was",
        "are"
      ],
      "answer": "was",
      "explanation": "Mrs. Lan + was early (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Mrs. Lan ______ early today.",
      "answers": [
        "is"
      ],
      "explanation": "Mrs. Lan is early today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Mrs. Lan ______ early yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "Mrs. Lan was early yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Mrs. Lan ______ hungry today. (phủ định)",
      "options": [
        "aren't",
        "weren't",
        "am not",
        "isn't"
      ],
      "answer": "isn't",
      "explanation": "Mrs. Lan isn't hungry today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Mrs. Lan ______ hungry yesterday. (phủ định)",
      "options": [
        "wasn't",
        "isn't",
        "weren't",
        "aren't"
      ],
      "answer": "wasn't",
      "explanation": "Mrs. Lan wasn't hungry yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ Mrs. Lan hungry today?",
      "answers": [
        "Is"
      ],
      "explanation": "Is Mrs. Lan hungry today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ Mrs. Lan hungry yesterday?",
      "answers": [
        "Was"
      ],
      "explanation": "Was Mrs. Lan hungry yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Tom ______ thirsty today.",
      "options": [
        "are",
        "is",
        "am",
        "were"
      ],
      "answer": "is",
      "explanation": "Tom + is thirsty (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Tom ______ thirsty yesterday.",
      "options": [
        "were",
        "are",
        "was",
        "am"
      ],
      "answer": "was",
      "explanation": "Tom + was thirsty (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Tom ______ thirsty today.",
      "answers": [
        "is"
      ],
      "explanation": "Tom is thirsty today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Tom ______ thirsty yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "Tom was thirsty yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Tom ______ free today.",
      "options": [
        "is",
        "were",
        "are",
        "am"
      ],
      "answer": "is",
      "explanation": "Tom + is free (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Tom ______ free yesterday.",
      "options": [
        "were",
        "was",
        "are",
        "is"
      ],
      "answer": "was",
      "explanation": "Tom + was free (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Tom ______ free today.",
      "answers": [
        "is"
      ],
      "explanation": "Tom is free today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Tom ______ free yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "Tom was free yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Tom ______ thirsty today. (phủ định)",
      "options": [
        "was not",
        "wasn't",
        "isn't",
        "am not"
      ],
      "answer": "isn't",
      "explanation": "Tom isn't thirsty today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Tom ______ thirsty yesterday. (phủ định)",
      "options": [
        "wasn't",
        "isn't",
        "weren't",
        "am not"
      ],
      "answer": "wasn't",
      "explanation": "Tom wasn't thirsty yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ Tom thirsty today?",
      "answers": [
        "Is"
      ],
      "explanation": "Is Tom thirsty today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ Tom thirsty yesterday?",
      "answers": [
        "Was"
      ],
      "explanation": "Was Tom thirsty yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Anna ______ sick today.",
      "options": [
        "are",
        "were",
        "was",
        "is"
      ],
      "answer": "is",
      "explanation": "Anna + is sick (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Anna ______ sick yesterday.",
      "options": [
        "is",
        "were",
        "am",
        "was"
      ],
      "answer": "was",
      "explanation": "Anna + was sick (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Anna ______ sick today.",
      "answers": [
        "is"
      ],
      "explanation": "Anna is sick today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Anna ______ sick yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "Anna was sick yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Anna ______ kind today.",
      "options": [
        "is",
        "was",
        "am",
        "are"
      ],
      "answer": "is",
      "explanation": "Anna + is kind (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Anna ______ kind yesterday.",
      "options": [
        "was",
        "am",
        "are",
        "is"
      ],
      "answer": "was",
      "explanation": "Anna + was kind (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Anna ______ kind today.",
      "answers": [
        "is"
      ],
      "explanation": "Anna is kind today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Anna ______ kind yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "Anna was kind yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Anna ______ sick today. (phủ định)",
      "options": [
        "wasn't",
        "weren't",
        "isn't",
        "am not"
      ],
      "answer": "isn't",
      "explanation": "Anna isn't sick today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Anna ______ sick yesterday. (phủ định)",
      "options": [
        "am not",
        "isn't",
        "wasn't",
        "weren't"
      ],
      "answer": "wasn't",
      "explanation": "Anna wasn't sick yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ Anna sick today?",
      "answers": [
        "Is"
      ],
      "explanation": "Is Anna sick today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ Anna sick yesterday?",
      "answers": [
        "Was"
      ],
      "explanation": "Was Anna sick yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The students ______ ready today.",
      "options": [
        "was",
        "were",
        "is",
        "are"
      ],
      "answer": "are",
      "explanation": "The students + are ready (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The students ______ ready yesterday.",
      "options": [
        "are",
        "is",
        "was",
        "were"
      ],
      "answer": "were",
      "explanation": "The students + were ready (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The students ______ ready today.",
      "answers": [
        "are"
      ],
      "explanation": "The students are ready today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The students ______ ready yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "The students were ready yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The students ______ happy today.",
      "options": [
        "was",
        "are",
        "were",
        "am"
      ],
      "answer": "are",
      "explanation": "The students + are happy (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The students ______ happy yesterday.",
      "options": [
        "are",
        "were",
        "was",
        "am"
      ],
      "answer": "were",
      "explanation": "The students + were happy (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The students ______ happy today.",
      "answers": [
        "are"
      ],
      "explanation": "The students are happy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The students ______ happy yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "The students were happy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The students ______ ready today. (phủ định)",
      "options": [
        "isn't",
        "am not",
        "aren't",
        "wasn't"
      ],
      "answer": "aren't",
      "explanation": "The students aren't ready today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The students ______ ready yesterday. (phủ định)",
      "options": [
        "weren't",
        "am not",
        "isn't",
        "wasn't"
      ],
      "answer": "weren't",
      "explanation": "The students weren't ready yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ The students ready today?",
      "answers": [
        "Are"
      ],
      "explanation": "Are The students ready today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ The students ready yesterday?",
      "answers": [
        "Were"
      ],
      "explanation": "Were The students ready yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My friends ______ late today.",
      "options": [
        "am",
        "are",
        "is",
        "were"
      ],
      "answer": "are",
      "explanation": "My friends + are late (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My friends ______ late yesterday.",
      "options": [
        "were",
        "is",
        "was",
        "am"
      ],
      "answer": "were",
      "explanation": "My friends + were late (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My friends ______ late today.",
      "answers": [
        "are"
      ],
      "explanation": "My friends are late today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My friends ______ late yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "My friends were late yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My friends ______ sad today.",
      "options": [
        "am",
        "were",
        "is",
        "are"
      ],
      "answer": "are",
      "explanation": "My friends + are sad (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My friends ______ sad yesterday.",
      "options": [
        "is",
        "were",
        "are",
        "was"
      ],
      "answer": "were",
      "explanation": "My friends + were sad (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My friends ______ sad today.",
      "answers": [
        "are"
      ],
      "explanation": "My friends are sad today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: My friends ______ sad yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "My friends were sad yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My friends ______ late today. (phủ định)",
      "options": [
        "aren't",
        "was not",
        "weren't",
        "wasn't"
      ],
      "answer": "aren't",
      "explanation": "My friends aren't late today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: My friends ______ late yesterday. (phủ định)",
      "options": [
        "isn't",
        "aren't",
        "weren't",
        "was not"
      ],
      "answer": "weren't",
      "explanation": "My friends weren't late yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ My friends late today?",
      "answers": [
        "Are"
      ],
      "explanation": "Are My friends late today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ My friends late yesterday?",
      "answers": [
        "Were"
      ],
      "explanation": "Were My friends late yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The birds ______ early today.",
      "options": [
        "were",
        "is",
        "are",
        "was"
      ],
      "answer": "are",
      "explanation": "The birds + are early (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The birds ______ early yesterday.",
      "options": [
        "am",
        "were",
        "is",
        "are"
      ],
      "answer": "were",
      "explanation": "The birds + were early (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The birds ______ early today.",
      "answers": [
        "are"
      ],
      "explanation": "The birds are early today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The birds ______ early yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "The birds were early yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The birds ______ tired today.",
      "options": [
        "is",
        "were",
        "are",
        "am"
      ],
      "answer": "are",
      "explanation": "The birds + are tired (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The birds ______ tired yesterday.",
      "options": [
        "was",
        "is",
        "are",
        "were"
      ],
      "answer": "were",
      "explanation": "The birds + were tired (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The birds ______ tired today.",
      "answers": [
        "are"
      ],
      "explanation": "The birds are tired today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The birds ______ tired yesterday.",
      "answers": [
        "were"
      ],
      "explanation": "The birds were tired yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The birds ______ early today. (phủ định)",
      "options": [
        "am not",
        "weren't",
        "aren't",
        "isn't"
      ],
      "answer": "aren't",
      "explanation": "The birds aren't early today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The birds ______ early yesterday. (phủ định)",
      "options": [
        "am not",
        "was not",
        "weren't",
        "isn't"
      ],
      "answer": "weren't",
      "explanation": "The birds weren't early yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ The birds early today?",
      "answers": [
        "Are"
      ],
      "explanation": "Are The birds early today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ The birds early yesterday?",
      "answers": [
        "Were"
      ],
      "explanation": "Were The birds early yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The book ______ free today.",
      "options": [
        "were",
        "is",
        "was",
        "are"
      ],
      "answer": "is",
      "explanation": "The book + is free (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The book ______ free yesterday.",
      "options": [
        "are",
        "was",
        "were",
        "am"
      ],
      "answer": "was",
      "explanation": "The book + was free (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The book ______ free today.",
      "answers": [
        "is"
      ],
      "explanation": "The book is free today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The book ______ free yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "The book was free yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The book ______ busy today.",
      "options": [
        "were",
        "are",
        "is",
        "am"
      ],
      "answer": "is",
      "explanation": "The book + is busy (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The book ______ busy yesterday.",
      "options": [
        "are",
        "was",
        "am",
        "were"
      ],
      "answer": "was",
      "explanation": "The book + was busy (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The book ______ busy today.",
      "answers": [
        "is"
      ],
      "explanation": "The book is busy today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The book ______ busy yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "The book was busy yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The book ______ free today. (phủ định)",
      "options": [
        "isn't",
        "was not",
        "weren't",
        "am not"
      ],
      "answer": "isn't",
      "explanation": "The book isn't free today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The book ______ free yesterday. (phủ định)",
      "options": [
        "weren't",
        "aren't",
        "wasn't",
        "am not"
      ],
      "answer": "wasn't",
      "explanation": "The book wasn't free yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ The book free today?",
      "answers": [
        "Is"
      ],
      "explanation": "Is The book free today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ The book free yesterday?",
      "answers": [
        "Was"
      ],
      "explanation": "Was The book free yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The school ______ kind today.",
      "options": [
        "was",
        "were",
        "am",
        "is"
      ],
      "answer": "is",
      "explanation": "The school + is kind (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The school ______ kind yesterday.",
      "options": [
        "am",
        "is",
        "was",
        "are"
      ],
      "answer": "was",
      "explanation": "The school + was kind (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The school ______ kind today.",
      "answers": [
        "is"
      ],
      "explanation": "The school is kind today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The school ______ kind yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "The school was kind yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The school ______ hungry today.",
      "options": [
        "is",
        "was",
        "are",
        "am"
      ],
      "answer": "is",
      "explanation": "The school + is hungry (hiện tại)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The school ______ hungry yesterday.",
      "options": [
        "am",
        "are",
        "were",
        "was"
      ],
      "answer": "was",
      "explanation": "The school + was hungry (quá khứ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The school ______ hungry today.",
      "answers": [
        "is"
      ],
      "explanation": "The school is hungry today."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: The school ______ hungry yesterday.",
      "answers": [
        "was"
      ],
      "explanation": "The school was hungry yesterday."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The school ______ kind today. (phủ định)",
      "options": [
        "weren't",
        "isn't",
        "was not",
        "wasn't"
      ],
      "answer": "isn't",
      "explanation": "The school isn't kind today."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: The school ______ kind yesterday. (phủ định)",
      "options": [
        "weren't",
        "wasn't",
        "isn't",
        "am not"
      ],
      "answer": "wasn't",
      "explanation": "The school wasn't kind yesterday."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ The school kind today?",
      "answers": [
        "Is"
      ],
      "explanation": "Is The school kind today?"
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: ______ The school kind yesterday?",
      "answers": [
        "Was"
      ],
      "explanation": "Was The school kind yesterday?"
    },
    {
      "type": "choice",
      "prompt": "Chọn câu đúng: He ______ happy.",
      "options": [
        "isn't",
        "am not",
        "wasn't",
        "aren’t"
      ],
      "answer": "isn't",
      "explanation": "He isn't happy. = Anh ấy không vui."
    },
    {
      "type": "choice",
      "prompt": "Chọn câu đúng: They ______ students.",
      "options": [
        "wasn't",
        "isn’t",
        "am not",
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
        "đi",
        "sửa",
        "chơi",
        "đánh (răng)"
      ],
      "answer": "đi",
      "explanation": "go → goes = đi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ to school every day. (đi)",
      "answers": [
        "goes"
      ],
      "explanation": "Câu đầy đủ: He goes to school every day."
    },
    {
      "type": "choice",
      "prompt": "\"watch → watches\" có nghĩa là gì?",
      "options": [
        "học",
        "bắt (xe)",
        "xem",
        "đi"
      ],
      "answer": "xem",
      "explanation": "watch → watches = xem."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ TV every evening. (xem)",
      "answers": [
        "watches"
      ],
      "explanation": "Câu đầy đủ: She watches TV every evening."
    },
    {
      "type": "choice",
      "prompt": "\"study → studies\" có nghĩa là gì?",
      "options": [
        "xem",
        "bay",
        "học",
        "chơi"
      ],
      "answer": "học",
      "explanation": "study → studies = học."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ English every day. (học)",
      "answers": [
        "studies"
      ],
      "explanation": "Câu đầy đủ: She studies English every day."
    },
    {
      "type": "choice",
      "prompt": "\"brush → brushes\" có nghĩa là gì?",
      "options": [
        "đánh (răng)",
        "sửa",
        "đi",
        "bay"
      ],
      "answer": "đánh (răng)",
      "explanation": "brush → brushes = đánh (răng)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ her teeth twice a day. (đánh (răng))",
      "answers": [
        "brushes"
      ],
      "explanation": "Câu đầy đủ: She brushes her teeth twice a day."
    },
    {
      "type": "choice",
      "prompt": "\"catch → catches\" có nghĩa là gì?",
      "options": [
        "học",
        "sửa",
        "bắt (xe)",
        "bay"
      ],
      "answer": "bắt (xe)",
      "explanation": "catch → catches = bắt (xe)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ the bus every morning. (bắt (xe))",
      "answers": [
        "catches"
      ],
      "explanation": "Câu đầy đủ: He catches the bus every morning."
    },
    {
      "type": "choice",
      "prompt": "\"fix → fixes\" có nghĩa là gì?",
      "options": [
        "sửa",
        "chơi",
        "đi",
        "đánh (răng)"
      ],
      "answer": "sửa",
      "explanation": "fix → fixes = sửa."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My brother ______ his bike on Sunday. (sửa)",
      "answers": [
        "fixes"
      ],
      "explanation": "Câu đầy đủ: My brother fixes his bike on Sunday."
    },
    {
      "type": "choice",
      "prompt": "\"play → plays\" có nghĩa là gì?",
      "options": [
        "đi",
        "bay",
        "chơi",
        "đánh (răng)"
      ],
      "answer": "chơi",
      "explanation": "play → plays = chơi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ tennis on Sunday. (chơi)",
      "answers": [
        "plays"
      ],
      "explanation": "Câu đầy đủ: She plays tennis on Sunday."
    },
    {
      "type": "choice",
      "prompt": "\"fly → flies\" có nghĩa là gì?",
      "options": [
        "đánh (răng)",
        "đi",
        "sửa",
        "bay"
      ],
      "answer": "bay",
      "explanation": "fly → flies = bay."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: A bird ______ in the sky. (bay)",
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
        "play",
        "playing",
        "played",
        "plays"
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
      "prompt": "Chọn dạng đúng: I ______ every day. (play)",
      "options": [
        "played",
        "playing",
        "play",
        "plays"
      ],
      "answer": "play",
      "explanation": "I + play (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (watch)",
      "options": [
        "watches",
        "watch",
        "watched",
        "watching"
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
      "prompt": "Chọn dạng đúng: You ______ every day. (watch)",
      "options": [
        "watched",
        "watch",
        "watches",
        "watching"
      ],
      "answer": "watch",
      "explanation": "You + watch (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (study)",
      "options": [
        "study",
        "studying",
        "studied",
        "studies"
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
      "prompt": "Chọn dạng đúng: We ______ every day. (study)",
      "options": [
        "studies",
        "studied",
        "studying",
        "study"
      ],
      "answer": "study",
      "explanation": "We + study (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (brush)",
      "options": [
        "brushing",
        "brushed",
        "brushes",
        "brush"
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
      "prompt": "Chọn dạng đúng: They ______ every day. (brush)",
      "options": [
        "brushes",
        "brushing",
        "brushed",
        "brush"
      ],
      "answer": "brush",
      "explanation": "They + brush (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (catch)",
      "options": [
        "catching",
        "catch",
        "catched",
        "catches"
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
      "prompt": "Chọn dạng đúng: I ______ every day. (catch)",
      "options": [
        "catches",
        "catched",
        "catch",
        "catching"
      ],
      "answer": "catch",
      "explanation": "I + catch (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (fix)",
      "options": [
        "fix",
        "fixing",
        "fixes",
        "fixed"
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
      "prompt": "Chọn dạng đúng: You ______ every day. (fix)",
      "options": [
        "fixing",
        "fix",
        "fixes",
        "fixed"
      ],
      "answer": "fix",
      "explanation": "You + fix (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (go)",
      "options": [
        "go",
        "goes",
        "going",
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
      "prompt": "Chọn dạng đúng: We ______ every day. (go)",
      "options": [
        "went",
        "goes",
        "go",
        "going"
      ],
      "answer": "go",
      "explanation": "We + go (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (do)",
      "options": [
        "does",
        "did",
        "doing",
        "do"
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
      "prompt": "Chọn dạng đúng: They ______ every day. (do)",
      "options": [
        "do",
        "does",
        "did",
        "doing"
      ],
      "answer": "do",
      "explanation": "They + do (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (read)",
      "options": [
        "read",
        "readed",
        "reads",
        "reading"
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
      "prompt": "Chọn dạng đúng: I ______ every day. (read)",
      "options": [
        "reads",
        "reading",
        "read",
        "readed"
      ],
      "answer": "read",
      "explanation": "I + read (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (sing)",
      "options": [
        "sing",
        "singing",
        "singed",
        "sings"
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
      "prompt": "Chọn dạng đúng: You ______ every day. (sing)",
      "options": [
        "sing",
        "singed",
        "singing",
        "sings"
      ],
      "answer": "sing",
      "explanation": "You + sing (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (dance)",
      "options": [
        "danced",
        "dance",
        "dances",
        "dancing"
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
      "prompt": "Chọn dạng đúng: We ______ every day. (dance)",
      "options": [
        "danced",
        "dance",
        "dances",
        "dancing"
      ],
      "answer": "dance",
      "explanation": "We + dance (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (cook)",
      "options": [
        "cooking",
        "cooked",
        "cook",
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
      "prompt": "Chọn dạng đúng: They ______ every day. (cook)",
      "options": [
        "cook",
        "cooked",
        "cooks",
        "cooking"
      ],
      "answer": "cook",
      "explanation": "They + cook (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (run)",
      "options": [
        "running",
        "runs",
        "run",
        "runned"
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
      "prompt": "Chọn dạng đúng: I ______ every day. (run)",
      "options": [
        "running",
        "runned",
        "runs",
        "run"
      ],
      "answer": "run",
      "explanation": "I + run (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (swim)",
      "options": [
        "swim",
        "swims",
        "swimming",
        "swimmed"
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
      "prompt": "Chọn dạng đúng: You ______ every day. (swim)",
      "options": [
        "swimming",
        "swimmed",
        "swims",
        "swim"
      ],
      "answer": "swim",
      "explanation": "You + swim (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (jump)",
      "options": [
        "jumped",
        "jump",
        "jumps",
        "jumping"
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
      "prompt": "Chọn dạng đúng: We ______ every day. (jump)",
      "options": [
        "jump",
        "jumps",
        "jumped",
        "jumping"
      ],
      "answer": "jump",
      "explanation": "We + jump (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (look)",
      "options": [
        "looked",
        "look",
        "looking",
        "looks"
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
      "prompt": "Chọn dạng đúng: They ______ every day. (look)",
      "options": [
        "looks",
        "look",
        "looking",
        "looked"
      ],
      "answer": "look",
      "explanation": "They + look (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (like)",
      "options": [
        "liked",
        "likes",
        "like",
        "liking"
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
      "prompt": "Chọn dạng đúng: I ______ every day. (like)",
      "options": [
        "liking",
        "liked",
        "like",
        "likes"
      ],
      "answer": "like",
      "explanation": "I + like (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (love)",
      "options": [
        "loved",
        "loves",
        "loving",
        "love"
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
      "prompt": "Chọn dạng đúng: You ______ every day. (love)",
      "options": [
        "loved",
        "loves",
        "love",
        "loving"
      ],
      "answer": "love",
      "explanation": "You + love (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (help)",
      "options": [
        "helped",
        "helps",
        "help",
        "helping"
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
      "prompt": "Chọn dạng đúng: We ______ every day. (help)",
      "options": [
        "helped",
        "helping",
        "helps",
        "help"
      ],
      "answer": "help",
      "explanation": "We + help (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (wash)",
      "options": [
        "washing",
        "wash",
        "washed",
        "washes"
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
      "prompt": "Chọn dạng đúng: They ______ every day. (wash)",
      "options": [
        "washes",
        "washed",
        "washing",
        "wash"
      ],
      "answer": "wash",
      "explanation": "They + wash (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (try)",
      "options": [
        "tried",
        "trying",
        "tries",
        "try"
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
      "prompt": "Chọn dạng đúng: I ______ every day. (try)",
      "options": [
        "tried",
        "trying",
        "try",
        "tries"
      ],
      "answer": "try",
      "explanation": "I + try (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (carry)",
      "options": [
        "carry",
        "carried",
        "carries",
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
      "prompt": "Chọn dạng đúng: You ______ every day. (carry)",
      "options": [
        "carry",
        "carries",
        "carried",
        "carrying"
      ],
      "answer": "carry",
      "explanation": "You + carry (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (fly)",
      "options": [
        "flying",
        "fly",
        "flies",
        "flied"
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
      "prompt": "Chọn dạng đúng: We ______ every day. (fly)",
      "options": [
        "flying",
        "flied",
        "flies",
        "fly"
      ],
      "answer": "fly",
      "explanation": "We + fly (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (work)",
      "options": [
        "work",
        "worked",
        "works",
        "working"
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
      "prompt": "Chọn dạng đúng: They ______ every day. (work)",
      "options": [
        "worked",
        "works",
        "working",
        "work"
      ],
      "answer": "work",
      "explanation": "They + work (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (eat)",
      "options": [
        "eating",
        "eated",
        "eats",
        "eat"
      ],
      "answer": "eats",
      "explanation": "He + eats (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (eat) every day.",
      "answers": [
        "eats"
      ],
      "explanation": "He eats every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ every day. (eat)",
      "options": [
        "eating",
        "eat",
        "eats",
        "eated"
      ],
      "answer": "eat",
      "explanation": "I + eat (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (drink)",
      "options": [
        "drinks",
        "drink",
        "drinked",
        "drinking"
      ],
      "answer": "drinks",
      "explanation": "She + drinks (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (drink) every day.",
      "answers": [
        "drinks"
      ],
      "explanation": "She drinks every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: You ______ every day. (drink)",
      "options": [
        "drinks",
        "drink",
        "drinked",
        "drinking"
      ],
      "answer": "drink",
      "explanation": "You + drink (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (sleep)",
      "options": [
        "sleeping",
        "sleeps",
        "sleeped",
        "sleep"
      ],
      "answer": "sleeps",
      "explanation": "Lan + sleeps (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (sleep) every day.",
      "answers": [
        "sleeps"
      ],
      "explanation": "Lan sleeps every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ every day. (sleep)",
      "options": [
        "sleeping",
        "sleeps",
        "sleeped",
        "sleep"
      ],
      "answer": "sleep",
      "explanation": "We + sleep (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (walk)",
      "options": [
        "walks",
        "walk",
        "walking",
        "walked"
      ],
      "answer": "walks",
      "explanation": "He + walks (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (walk) every day.",
      "answers": [
        "walks"
      ],
      "explanation": "He walks every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ every day. (walk)",
      "options": [
        "walking",
        "walked",
        "walk",
        "walks"
      ],
      "answer": "walk",
      "explanation": "They + walk (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (speak)",
      "options": [
        "speaks",
        "speaking",
        "speak",
        "speaked"
      ],
      "answer": "speaks",
      "explanation": "She + speaks (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (speak) every day.",
      "answers": [
        "speaks"
      ],
      "explanation": "She speaks every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ every day. (speak)",
      "options": [
        "speaking",
        "speaks",
        "speak",
        "speaked"
      ],
      "answer": "speak",
      "explanation": "I + speak (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (teach)",
      "options": [
        "teaching",
        "teach",
        "teached",
        "teaches"
      ],
      "answer": "teaches",
      "explanation": "Lan + teaches (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (teach) every day.",
      "answers": [
        "teaches"
      ],
      "explanation": "Lan teaches every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: You ______ every day. (teach)",
      "options": [
        "teaches",
        "teached",
        "teaching",
        "teach"
      ],
      "answer": "teach",
      "explanation": "You + teach (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (learn)",
      "options": [
        "learned",
        "learning",
        "learns",
        "learn"
      ],
      "answer": "learns",
      "explanation": "He + learns (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (learn) every day.",
      "answers": [
        "learns"
      ],
      "explanation": "He learns every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ every day. (learn)",
      "options": [
        "learn",
        "learning",
        "learned",
        "learns"
      ],
      "answer": "learn",
      "explanation": "We + learn (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (draw)",
      "options": [
        "draw",
        "drawing",
        "drawed",
        "draws"
      ],
      "answer": "draws",
      "explanation": "She + draws (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (draw) every day.",
      "answers": [
        "draws"
      ],
      "explanation": "She draws every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ every day. (draw)",
      "options": [
        "drawing",
        "drawed",
        "draw",
        "draws"
      ],
      "answer": "draw",
      "explanation": "They + draw (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (write)",
      "options": [
        "writed",
        "write",
        "writing",
        "writes"
      ],
      "answer": "writes",
      "explanation": "Lan + writes (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (write) every day.",
      "answers": [
        "writes"
      ],
      "explanation": "Lan writes every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ every day. (write)",
      "options": [
        "write",
        "writed",
        "writes",
        "writing"
      ],
      "answer": "write",
      "explanation": "I + write (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (sit)",
      "options": [
        "sitting",
        "sits",
        "sit",
        "sitted"
      ],
      "answer": "sits",
      "explanation": "He + sits (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (sit) every day.",
      "answers": [
        "sits"
      ],
      "explanation": "He sits every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: You ______ every day. (sit)",
      "options": [
        "sitting",
        "sitted",
        "sits",
        "sit"
      ],
      "answer": "sit",
      "explanation": "You + sit (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (stand)",
      "options": [
        "standed",
        "stands",
        "stand",
        "standing"
      ],
      "answer": "stands",
      "explanation": "She + stands (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (stand) every day.",
      "answers": [
        "stands"
      ],
      "explanation": "She stands every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ every day. (stand)",
      "options": [
        "stand",
        "stands",
        "standed",
        "standing"
      ],
      "answer": "stand",
      "explanation": "We + stand (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (open)",
      "options": [
        "opened",
        "opening",
        "open",
        "opens"
      ],
      "answer": "opens",
      "explanation": "Lan + opens (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (open) every day.",
      "answers": [
        "opens"
      ],
      "explanation": "Lan opens every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ every day. (open)",
      "options": [
        "open",
        "opens",
        "opened",
        "opening"
      ],
      "answer": "open",
      "explanation": "They + open (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (close)",
      "options": [
        "closes",
        "close",
        "closed",
        "closing"
      ],
      "answer": "closes",
      "explanation": "He + closes (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (close) every day.",
      "answers": [
        "closes"
      ],
      "explanation": "He closes every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ every day. (close)",
      "options": [
        "closed",
        "closes",
        "closing",
        "close"
      ],
      "answer": "close",
      "explanation": "I + close (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (clean)",
      "options": [
        "cleaned",
        "cleans",
        "clean",
        "cleaning"
      ],
      "answer": "cleans",
      "explanation": "She + cleans (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (clean) every day.",
      "answers": [
        "cleans"
      ],
      "explanation": "She cleans every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: You ______ every day. (clean)",
      "options": [
        "cleaned",
        "clean",
        "cleaning",
        "cleans"
      ],
      "answer": "clean",
      "explanation": "You + clean (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (listen)",
      "options": [
        "listens",
        "listening",
        "listen",
        "listened"
      ],
      "answer": "listens",
      "explanation": "Lan + listens (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (listen) every day.",
      "answers": [
        "listens"
      ],
      "explanation": "Lan listens every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ every day. (listen)",
      "options": [
        "listens",
        "listen",
        "listened",
        "listening"
      ],
      "answer": "listen",
      "explanation": "We + listen (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (say)",
      "options": [
        "sayed",
        "says",
        "saying",
        "say"
      ],
      "answer": "says",
      "explanation": "He + says (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (say) every day.",
      "answers": [
        "says"
      ],
      "explanation": "He says every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ every day. (say)",
      "options": [
        "sayed",
        "says",
        "say",
        "saying"
      ],
      "answer": "say",
      "explanation": "They + say (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (ask)",
      "options": [
        "asked",
        "asking",
        "asks",
        "ask"
      ],
      "answer": "asks",
      "explanation": "She + asks (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (ask) every day.",
      "answers": [
        "asks"
      ],
      "explanation": "She asks every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ every day. (ask)",
      "options": [
        "asks",
        "ask",
        "asking",
        "asked"
      ],
      "answer": "ask",
      "explanation": "I + ask (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (answer)",
      "options": [
        "answering",
        "answers",
        "answered",
        "answer"
      ],
      "answer": "answers",
      "explanation": "Lan + answers (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (answer) every day.",
      "answers": [
        "answers"
      ],
      "explanation": "Lan answers every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: You ______ every day. (answer)",
      "options": [
        "answering",
        "answers",
        "answered",
        "answer"
      ],
      "answer": "answer",
      "explanation": "You + answer (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (call)",
      "options": [
        "calls",
        "calling",
        "call",
        "called"
      ],
      "answer": "calls",
      "explanation": "He + calls (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (call) every day.",
      "answers": [
        "calls"
      ],
      "explanation": "He calls every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ every day. (call)",
      "options": [
        "calls",
        "call",
        "called",
        "calling"
      ],
      "answer": "call",
      "explanation": "We + call (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (visit)",
      "options": [
        "visits",
        "visited",
        "visit",
        "visiting"
      ],
      "answer": "visits",
      "explanation": "She + visits (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (visit) every day.",
      "answers": [
        "visits"
      ],
      "explanation": "She visits every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ every day. (visit)",
      "options": [
        "visit",
        "visiting",
        "visited",
        "visits"
      ],
      "answer": "visit",
      "explanation": "They + visit (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (wait)",
      "options": [
        "waits",
        "wait",
        "waiting",
        "waited"
      ],
      "answer": "waits",
      "explanation": "Lan + waits (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (wait) every day.",
      "answers": [
        "waits"
      ],
      "explanation": "Lan waits every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ every day. (wait)",
      "options": [
        "waiting",
        "waited",
        "waits",
        "wait"
      ],
      "answer": "wait",
      "explanation": "I + wait (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (laugh)",
      "options": [
        "laughed",
        "laughs",
        "laughing",
        "laugh"
      ],
      "answer": "laughs",
      "explanation": "He + laughs (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (laugh) every day.",
      "answers": [
        "laughs"
      ],
      "explanation": "He laughs every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: You ______ every day. (laugh)",
      "options": [
        "laughed",
        "laughs",
        "laughing",
        "laugh"
      ],
      "answer": "laugh",
      "explanation": "You + laugh (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (smile)",
      "options": [
        "smiles",
        "smile",
        "smiled",
        "smiling"
      ],
      "answer": "smiles",
      "explanation": "She + smiles (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (smile) every day.",
      "answers": [
        "smiles"
      ],
      "explanation": "She smiles every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ every day. (smile)",
      "options": [
        "smiling",
        "smiles",
        "smiled",
        "smile"
      ],
      "answer": "smile",
      "explanation": "We + smile (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ every day. (climb)",
      "options": [
        "climbing",
        "climb",
        "climbs",
        "climbed"
      ],
      "answer": "climbs",
      "explanation": "Lan + climbs (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (climb) every day.",
      "answers": [
        "climbs"
      ],
      "explanation": "Lan climbs every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ every day. (climb)",
      "options": [
        "climbed",
        "climbing",
        "climb",
        "climbs"
      ],
      "answer": "climb",
      "explanation": "They + climb (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ every day. (drive)",
      "options": [
        "drived",
        "driving",
        "drives",
        "drive"
      ],
      "answer": "drives",
      "explanation": "He + drives (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (drive) every day.",
      "answers": [
        "drives"
      ],
      "explanation": "He drives every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ every day. (drive)",
      "options": [
        "drive",
        "driving",
        "drives",
        "drived"
      ],
      "answer": "drive",
      "explanation": "I + drive (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ every day. (ride)",
      "options": [
        "ride",
        "riding",
        "rided",
        "rides"
      ],
      "answer": "rides",
      "explanation": "She + rides (he/she/it + động từ thêm -s/-es)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (ride) every day.",
      "answers": [
        "rides"
      ],
      "explanation": "She rides every day."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: You ______ every day. (ride)",
      "options": [
        "ride",
        "rides",
        "riding",
        "rided"
      ],
      "answer": "ride",
      "explanation": "You + ride (I/you/we/they + động từ nguyên thể)."
    },
    {
      "type": "choice",
      "prompt": "Dạng đúng của \"watch\" với she là gì?",
      "options": [
        "watch",
        "watching",
        "watched",
        "watches"
      ],
      "answer": "watches",
      "explanation": "She + watches."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (watch).",
      "answers": [
        "watches"
      ],
      "explanation": "She watches."
    },
    {
      "type": "choice",
      "prompt": "Dạng đúng của \"study\" với she là gì?",
      "options": [
        "study",
        "studied",
        "studies",
        "studying"
      ],
      "answer": "studies",
      "explanation": "She + studies."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (study).",
      "answers": [
        "studies"
      ],
      "explanation": "She studies."
    },
    {
      "type": "choice",
      "prompt": "Dạng đúng của \"brush\" với she là gì?",
      "options": [
        "brush",
        "brushed",
        "brushes",
        "brushing"
      ],
      "answer": "brushes",
      "explanation": "She + brushes."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (brush).",
      "answers": [
        "brushes"
      ],
      "explanation": "She brushes."
    },
    {
      "type": "choice",
      "prompt": "Dạng đúng của \"catch\" với she là gì?",
      "options": [
        "catch",
        "catches",
        "catching",
        "catched"
      ],
      "answer": "catches",
      "explanation": "She + catches."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (catch).",
      "answers": [
        "catches"
      ],
      "explanation": "She catches."
    },
    {
      "type": "choice",
      "prompt": "Dạng đúng của \"fix\" với she là gì?",
      "options": [
        "fixes",
        "fixed",
        "fixing",
        "fix"
      ],
      "answer": "fixes",
      "explanation": "She + fixes."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (fix).",
      "answers": [
        "fixes"
      ],
      "explanation": "She fixes."
    },
    {
      "type": "choice",
      "prompt": "Dạng đúng của \"go\" với she là gì?",
      "options": [
        "goes",
        "go",
        "going",
        "went"
      ],
      "answer": "goes",
      "explanation": "She + goes."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (go).",
      "answers": [
        "goes"
      ],
      "explanation": "She goes."
    },
    {
      "type": "choice",
      "prompt": "Dạng đúng của \"do\" với she là gì?",
      "options": [
        "do",
        "did",
        "doing",
        "does"
      ],
      "answer": "does",
      "explanation": "She + does."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (do).",
      "answers": [
        "does"
      ],
      "explanation": "She does."
    },
    {
      "type": "choice",
      "prompt": "Dạng đúng của \"wash\" với she là gì?",
      "options": [
        "washed",
        "wash",
        "washes",
        "washing"
      ],
      "answer": "washes",
      "explanation": "She + washes."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (wash).",
      "answers": [
        "washes"
      ],
      "explanation": "She washes."
    },
    {
      "type": "choice",
      "prompt": "Dạng đúng của \"try\" với she là gì?",
      "options": [
        "try",
        "tries",
        "tried",
        "trying"
      ],
      "answer": "tries",
      "explanation": "She + tries."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (try).",
      "answers": [
        "tries"
      ],
      "explanation": "She tries."
    },
    {
      "type": "choice",
      "prompt": "Dạng đúng của \"carry\" với she là gì?",
      "options": [
        "carried",
        "carrying",
        "carries",
        "carry"
      ],
      "answer": "carries",
      "explanation": "She + carries."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (carry).",
      "answers": [
        "carries"
      ],
      "explanation": "She carries."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (fly).",
      "answers": [
        "flies"
      ],
      "explanation": "She flies."
    },
    {
      "type": "choice",
      "prompt": "Dạng đúng của \"teach\" với she là gì?",
      "options": [
        "teaching",
        "teach",
        "teaches",
        "teached"
      ],
      "answer": "teaches",
      "explanation": "She + teaches."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (teach).",
      "answers": [
        "teaches"
      ],
      "explanation": "She teaches."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ play. (không)",
      "options": [
        "doesn't",
        "don't",
        "isn't",
        "won't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't play. = Cô ấy không play."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ play. (không)",
      "options": [
        "don't",
        "isn't",
        "doesn't",
        "won't"
      ],
      "answer": "don't",
      "explanation": "They don't play. = Họ không play."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she play?",
      "answers": [
        "does"
      ],
      "explanation": "Does she play? = Cô ấy có play không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they play?",
      "answers": [
        "do"
      ],
      "explanation": "Do they play? = Họ có play không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ watch. (không)",
      "options": [
        "doesn't",
        "isn't",
        "won't",
        "don't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't watch. = Cô ấy không watch."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ watch. (không)",
      "options": [
        "don't",
        "isn't",
        "doesn't",
        "won't"
      ],
      "answer": "don't",
      "explanation": "They don't watch. = Họ không watch."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she watch?",
      "answers": [
        "does"
      ],
      "explanation": "Does she watch? = Cô ấy có watch không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they watch?",
      "answers": [
        "do"
      ],
      "explanation": "Do they watch? = Họ có watch không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ study. (không)",
      "options": [
        "won't",
        "doesn't",
        "don't",
        "isn't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't study. = Cô ấy không study."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ study. (không)",
      "options": [
        "don't",
        "isn't",
        "doesn't",
        "won't"
      ],
      "answer": "don't",
      "explanation": "They don't study. = Họ không study."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she study?",
      "answers": [
        "does"
      ],
      "explanation": "Does she study? = Cô ấy có study không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they study?",
      "answers": [
        "do"
      ],
      "explanation": "Do they study? = Họ có study không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ brush. (không)",
      "options": [
        "doesn't",
        "won't",
        "don't",
        "isn't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't brush. = Cô ấy không brush."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ brush. (không)",
      "options": [
        "don't",
        "won't",
        "doesn't",
        "isn't"
      ],
      "answer": "don't",
      "explanation": "They don't brush. = Họ không brush."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she brush?",
      "answers": [
        "does"
      ],
      "explanation": "Does she brush? = Cô ấy có brush không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they brush?",
      "answers": [
        "do"
      ],
      "explanation": "Do they brush? = Họ có brush không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ catch. (không)",
      "options": [
        "doesn't",
        "isn't",
        "won't",
        "don't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't catch. = Cô ấy không catch."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ catch. (không)",
      "options": [
        "doesn't",
        "isn't",
        "don't",
        "won't"
      ],
      "answer": "don't",
      "explanation": "They don't catch. = Họ không catch."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she catch?",
      "answers": [
        "does"
      ],
      "explanation": "Does she catch? = Cô ấy có catch không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they catch?",
      "answers": [
        "do"
      ],
      "explanation": "Do they catch? = Họ có catch không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ fix. (không)",
      "options": [
        "don't",
        "doesn't",
        "isn't",
        "won't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't fix. = Cô ấy không fix."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ fix. (không)",
      "options": [
        "isn't",
        "don't",
        "doesn't",
        "won't"
      ],
      "answer": "don't",
      "explanation": "They don't fix. = Họ không fix."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she fix?",
      "answers": [
        "does"
      ],
      "explanation": "Does she fix? = Cô ấy có fix không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they fix?",
      "answers": [
        "do"
      ],
      "explanation": "Do they fix? = Họ có fix không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ go. (không)",
      "options": [
        "won't",
        "don't",
        "isn't",
        "doesn't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't go. = Cô ấy không go."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ go. (không)",
      "options": [
        "don't",
        "isn't",
        "doesn't",
        "won't"
      ],
      "answer": "don't",
      "explanation": "They don't go. = Họ không go."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she go?",
      "answers": [
        "does"
      ],
      "explanation": "Does she go? = Cô ấy có go không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they go?",
      "answers": [
        "do"
      ],
      "explanation": "Do they go? = Họ có go không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ do. (không)",
      "options": [
        "isn't",
        "won't",
        "don't",
        "doesn't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't do. = Cô ấy không do."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ do. (không)",
      "options": [
        "won't",
        "don't",
        "isn't",
        "doesn't"
      ],
      "answer": "don't",
      "explanation": "They don't do. = Họ không do."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she do?",
      "answers": [
        "does"
      ],
      "explanation": "Does she do? = Cô ấy có do không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they do?",
      "answers": [
        "do"
      ],
      "explanation": "Do they do? = Họ có do không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ read. (không)",
      "options": [
        "won't",
        "isn't",
        "doesn't",
        "don't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't read. = Cô ấy không read."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ read. (không)",
      "options": [
        "isn't",
        "won't",
        "doesn't",
        "don't"
      ],
      "answer": "don't",
      "explanation": "They don't read. = Họ không read."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she read?",
      "answers": [
        "does"
      ],
      "explanation": "Does she read? = Cô ấy có read không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they read?",
      "answers": [
        "do"
      ],
      "explanation": "Do they read? = Họ có read không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ sing. (không)",
      "options": [
        "won't",
        "don't",
        "doesn't",
        "isn't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't sing. = Cô ấy không sing."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ sing. (không)",
      "options": [
        "isn't",
        "don't",
        "doesn't",
        "won't"
      ],
      "answer": "don't",
      "explanation": "They don't sing. = Họ không sing."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she sing?",
      "answers": [
        "does"
      ],
      "explanation": "Does she sing? = Cô ấy có sing không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they sing?",
      "answers": [
        "do"
      ],
      "explanation": "Do they sing? = Họ có sing không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ dance. (không)",
      "options": [
        "won't",
        "isn't",
        "don't",
        "doesn't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't dance. = Cô ấy không dance."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ dance. (không)",
      "options": [
        "isn't",
        "don't",
        "won't",
        "doesn't"
      ],
      "answer": "don't",
      "explanation": "They don't dance. = Họ không dance."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she dance?",
      "answers": [
        "does"
      ],
      "explanation": "Does she dance? = Cô ấy có dance không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they dance?",
      "answers": [
        "do"
      ],
      "explanation": "Do they dance? = Họ có dance không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ cook. (không)",
      "options": [
        "don't",
        "isn't",
        "won't",
        "doesn't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't cook. = Cô ấy không cook."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ cook. (không)",
      "options": [
        "isn't",
        "doesn't",
        "don't",
        "won't"
      ],
      "answer": "don't",
      "explanation": "They don't cook. = Họ không cook."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she cook?",
      "answers": [
        "does"
      ],
      "explanation": "Does she cook? = Cô ấy có cook không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they cook?",
      "answers": [
        "do"
      ],
      "explanation": "Do they cook? = Họ có cook không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ run. (không)",
      "options": [
        "won't",
        "isn't",
        "don't",
        "doesn't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't run. = Cô ấy không run."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ run. (không)",
      "options": [
        "don't",
        "doesn't",
        "isn't",
        "won't"
      ],
      "answer": "don't",
      "explanation": "They don't run. = Họ không run."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she run?",
      "answers": [
        "does"
      ],
      "explanation": "Does she run? = Cô ấy có run không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they run?",
      "answers": [
        "do"
      ],
      "explanation": "Do they run? = Họ có run không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ swim. (không)",
      "options": [
        "doesn't",
        "won't",
        "don't",
        "isn't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't swim. = Cô ấy không swim."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ swim. (không)",
      "options": [
        "won't",
        "isn't",
        "don't",
        "doesn't"
      ],
      "answer": "don't",
      "explanation": "They don't swim. = Họ không swim."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she swim?",
      "answers": [
        "does"
      ],
      "explanation": "Does she swim? = Cô ấy có swim không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they swim?",
      "answers": [
        "do"
      ],
      "explanation": "Do they swim? = Họ có swim không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ jump. (không)",
      "options": [
        "doesn't",
        "don't",
        "isn't",
        "won't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't jump. = Cô ấy không jump."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ jump. (không)",
      "options": [
        "doesn't",
        "isn't",
        "don't",
        "won't"
      ],
      "answer": "don't",
      "explanation": "They don't jump. = Họ không jump."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she jump?",
      "answers": [
        "does"
      ],
      "explanation": "Does she jump? = Cô ấy có jump không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they jump?",
      "answers": [
        "do"
      ],
      "explanation": "Do they jump? = Họ có jump không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ look. (không)",
      "options": [
        "isn't",
        "don't",
        "doesn't",
        "won't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't look. = Cô ấy không look."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ look. (không)",
      "options": [
        "don't",
        "doesn't",
        "isn't",
        "won't"
      ],
      "answer": "don't",
      "explanation": "They don't look. = Họ không look."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she look?",
      "answers": [
        "does"
      ],
      "explanation": "Does she look? = Cô ấy có look không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they look?",
      "answers": [
        "do"
      ],
      "explanation": "Do they look? = Họ có look không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ like. (không)",
      "options": [
        "isn't",
        "doesn't",
        "won't",
        "don't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't like. = Cô ấy không like."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ like. (không)",
      "options": [
        "won't",
        "isn't",
        "doesn't",
        "don't"
      ],
      "answer": "don't",
      "explanation": "They don't like. = Họ không like."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she like?",
      "answers": [
        "does"
      ],
      "explanation": "Does she like? = Cô ấy có like không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they like?",
      "answers": [
        "do"
      ],
      "explanation": "Do they like? = Họ có like không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ love. (không)",
      "options": [
        "don't",
        "won't",
        "doesn't",
        "isn't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't love. = Cô ấy không love."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ love. (không)",
      "options": [
        "won't",
        "don't",
        "doesn't",
        "isn't"
      ],
      "answer": "don't",
      "explanation": "They don't love. = Họ không love."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she love?",
      "answers": [
        "does"
      ],
      "explanation": "Does she love? = Cô ấy có love không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they love?",
      "answers": [
        "do"
      ],
      "explanation": "Do they love? = Họ có love không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ help. (không)",
      "options": [
        "doesn't",
        "don't",
        "isn't",
        "won't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't help. = Cô ấy không help."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ help. (không)",
      "options": [
        "isn't",
        "don't",
        "won't",
        "doesn't"
      ],
      "answer": "don't",
      "explanation": "They don't help. = Họ không help."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she help?",
      "answers": [
        "does"
      ],
      "explanation": "Does she help? = Cô ấy có help không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they help?",
      "answers": [
        "do"
      ],
      "explanation": "Do they help? = Họ có help không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ wash. (không)",
      "options": [
        "isn't",
        "doesn't",
        "won't",
        "don't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't wash. = Cô ấy không wash."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ wash. (không)",
      "options": [
        "don't",
        "doesn't",
        "won't",
        "isn't"
      ],
      "answer": "don't",
      "explanation": "They don't wash. = Họ không wash."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she wash?",
      "answers": [
        "does"
      ],
      "explanation": "Does she wash? = Cô ấy có wash không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they wash?",
      "answers": [
        "do"
      ],
      "explanation": "Do they wash? = Họ có wash không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ try. (không)",
      "options": [
        "doesn't",
        "don't",
        "won't",
        "isn't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't try. = Cô ấy không try."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ try. (không)",
      "options": [
        "don't",
        "won't",
        "doesn't",
        "isn't"
      ],
      "answer": "don't",
      "explanation": "They don't try. = Họ không try."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she try?",
      "answers": [
        "does"
      ],
      "explanation": "Does she try? = Cô ấy có try không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they try?",
      "answers": [
        "do"
      ],
      "explanation": "Do they try? = Họ có try không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ carry. (không)",
      "options": [
        "doesn't",
        "won't",
        "isn't",
        "don't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't carry. = Cô ấy không carry."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ carry. (không)",
      "options": [
        "doesn't",
        "isn't",
        "won't",
        "don't"
      ],
      "answer": "don't",
      "explanation": "They don't carry. = Họ không carry."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she carry?",
      "answers": [
        "does"
      ],
      "explanation": "Does she carry? = Cô ấy có carry không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they carry?",
      "answers": [
        "do"
      ],
      "explanation": "Do they carry? = Họ có carry không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ fly. (không)",
      "options": [
        "isn't",
        "won't",
        "doesn't",
        "don't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't fly. = Cô ấy không fly."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ fly. (không)",
      "options": [
        "won't",
        "doesn't",
        "isn't",
        "don't"
      ],
      "answer": "don't",
      "explanation": "They don't fly. = Họ không fly."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she fly?",
      "answers": [
        "does"
      ],
      "explanation": "Does she fly? = Cô ấy có fly không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they fly?",
      "answers": [
        "do"
      ],
      "explanation": "Do they fly? = Họ có fly không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ work. (không)",
      "options": [
        "won't",
        "isn't",
        "don't",
        "doesn't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't work. = Cô ấy không work."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ work. (không)",
      "options": [
        "isn't",
        "don't",
        "won't",
        "doesn't"
      ],
      "answer": "don't",
      "explanation": "They don't work. = Họ không work."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she work?",
      "answers": [
        "does"
      ],
      "explanation": "Does she work? = Cô ấy có work không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they work?",
      "answers": [
        "do"
      ],
      "explanation": "Do they work? = Họ có work không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ eat. (không)",
      "options": [
        "isn't",
        "won't",
        "don't",
        "doesn't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't eat. = Cô ấy không eat."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ eat. (không)",
      "options": [
        "isn't",
        "won't",
        "don't",
        "doesn't"
      ],
      "answer": "don't",
      "explanation": "They don't eat. = Họ không eat."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ she eat?",
      "answers": [
        "does"
      ],
      "explanation": "Does she eat? = Cô ấy có eat không?"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ they eat?",
      "answers": [
        "do"
      ],
      "explanation": "Do they eat? = Họ có eat không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: She ______ like milk.",
      "options": [
        "won't",
        "isn't",
        "don’t",
        "doesn't"
      ],
      "answer": "doesn't",
      "explanation": "She doesn't like milk. = Cô ấy không thích sữa."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: They ______ like milk.",
      "options": [
        "isn't",
        "won't",
        "don't",
        "doesn’t"
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
        "đang chạy",
        "đang viết",
        "đang chơi",
        "đang đọc"
      ],
      "answer": "đang đọc",
      "explanation": "read → reading = đang đọc."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She is ______ a book now. (đang đọc)",
      "answers": [
        "reading"
      ],
      "explanation": "Câu đầy đủ: She is reading a book now."
    },
    {
      "type": "choice",
      "prompt": "\"run → running\" có nghĩa là gì?",
      "options": [
        "đang chơi",
        "đang làm",
        "đang chạy",
        "đang viết"
      ],
      "answer": "đang chạy",
      "explanation": "run → running = đang chạy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: Look! Lan is ______. (đang chạy)",
      "answers": [
        "running"
      ],
      "explanation": "Câu đầy đủ: Look! Lan is running."
    },
    {
      "type": "choice",
      "prompt": "\"make → making\" có nghĩa là gì?",
      "options": [
        "đang chạy",
        "đang đọc",
        "đang làm",
        "đang xem"
      ],
      "answer": "đang làm",
      "explanation": "make → making = đang làm."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He is ______ a cake now. (đang làm)",
      "answers": [
        "making"
      ],
      "explanation": "Câu đầy đủ: He is making a cake now."
    },
    {
      "type": "choice",
      "prompt": "\"swim → swimming\" có nghĩa là gì?",
      "options": [
        "đang chạy",
        "đang xem",
        "đang bơi",
        "đang viết"
      ],
      "answer": "đang bơi",
      "explanation": "swim → swimming = đang bơi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: We are ______ in the pool now. (đang bơi)",
      "answers": [
        "swimming"
      ],
      "explanation": "Câu đầy đủ: We are swimming in the pool now."
    },
    {
      "type": "choice",
      "prompt": "\"write → writing\" có nghĩa là gì?",
      "options": [
        "đang chơi",
        "đang làm",
        "đang bơi",
        "đang viết"
      ],
      "answer": "đang viết",
      "explanation": "write → writing = đang viết."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My father is ______ a letter. (đang viết)",
      "answers": [
        "writing"
      ],
      "explanation": "Câu đầy đủ: My father is writing a letter."
    },
    {
      "type": "choice",
      "prompt": "\"play → playing\" có nghĩa là gì?",
      "options": [
        "đang chạy",
        "đang ngủ",
        "đang chơi",
        "đang đọc"
      ],
      "answer": "đang chơi",
      "explanation": "play → playing = đang chơi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: They are ______ football now. (đang chơi)",
      "answers": [
        "playing"
      ],
      "explanation": "Câu đầy đủ: They are playing football now."
    },
    {
      "type": "choice",
      "prompt": "\"watch → watching\" có nghĩa là gì?",
      "options": [
        "đang xem",
        "đang chơi",
        "đang đọc",
        "đang làm"
      ],
      "answer": "đang xem",
      "explanation": "watch → watching = đang xem."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She is ______ TV now. (đang xem)",
      "answers": [
        "watching"
      ],
      "explanation": "Câu đầy đủ: She is watching TV now."
    },
    {
      "type": "choice",
      "prompt": "\"sleep → sleeping\" có nghĩa là gì?",
      "options": [
        "đang viết",
        "đang ngủ",
        "đang bơi",
        "đang đọc"
      ],
      "answer": "đang ngủ",
      "explanation": "sleep → sleeping = đang ngủ."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The baby is ______ now. (đang ngủ)",
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
        "is reading",
        "is read",
        "read",
        "am reading"
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
      "prompt": "Chọn dạng đúng: She ______ reading a book now. (phủ định)",
      "options": [
        "is not",
        "am not",
        "is",
        "are not"
      ],
      "answer": "is not",
      "explanation": "She is not reading a book now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ She reading a book now?",
      "answers": [
        "is"
      ],
      "explanation": "Is She reading a book now?"
    },
    {
      "type": "choice",
      "prompt": "What is She doing? (read a book)",
      "options": [
        "She are reading a book.",
        "She reading a book.",
        "She is read a book.",
        "She is reading a book."
      ],
      "answer": "She is reading a book.",
      "explanation": "She is reading a book."
    },
    {
      "type": "choice",
      "prompt": "Look! She ______ a book.",
      "options": [
        "is read",
        "is reading",
        "read",
        "reading"
      ],
      "answer": "is reading",
      "explanation": "Look! She is reading a book."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ a book at the moment. (read)",
      "options": [
        "is reading",
        "is read",
        "read",
        "am reading"
      ],
      "answer": "is reading",
      "explanation": "She is reading a book at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (read) a book at the moment.",
      "answers": [
        "is reading"
      ],
      "explanation": "She is reading a book at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ in the park now. (run)",
      "options": [
        "is run",
        "run",
        "is running",
        "am running"
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
      "prompt": "Chọn dạng đúng: He ______ running in the park now. (phủ định)",
      "options": [
        "are not",
        "is not",
        "is",
        "am not"
      ],
      "answer": "is not",
      "explanation": "He is not running in the park now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ He running in the park now?",
      "answers": [
        "is"
      ],
      "explanation": "Is He running in the park now?"
    },
    {
      "type": "choice",
      "prompt": "What is He doing? (run in the park)",
      "options": [
        "He are running in the park.",
        "He is running in the park.",
        "He running in the park.",
        "He is run in the park."
      ],
      "answer": "He is running in the park.",
      "explanation": "He is running in the park."
    },
    {
      "type": "choice",
      "prompt": "Look! He ______ in the park.",
      "options": [
        "is running",
        "is run",
        "run",
        "running"
      ],
      "answer": "is running",
      "explanation": "Look! He is running in the park."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ in the park at the moment. (run)",
      "options": [
        "is run",
        "am running",
        "is running",
        "run"
      ],
      "answer": "is running",
      "explanation": "He is running in the park at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (run) in the park at the moment.",
      "answers": [
        "is running"
      ],
      "explanation": "He is running in the park at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ in the pool now. (swim)",
      "options": [
        "is swimming",
        "swim",
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
      "prompt": "Chọn dạng đúng: Lan ______ swimming in the pool now. (phủ định)",
      "options": [
        "is",
        "am not",
        "are not",
        "is not"
      ],
      "answer": "is not",
      "explanation": "Lan is not swimming in the pool now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ Lan swimming in the pool now?",
      "answers": [
        "is"
      ],
      "explanation": "Is Lan swimming in the pool now?"
    },
    {
      "type": "choice",
      "prompt": "What is Lan doing? (swim in the pool)",
      "options": [
        "Lan is swim in the pool.",
        "Lan swimming in the pool.",
        "Lan is swimming in the pool.",
        "Lan are swimming in the pool."
      ],
      "answer": "Lan is swimming in the pool.",
      "explanation": "Lan is swimming in the pool."
    },
    {
      "type": "choice",
      "prompt": "Look! Lan ______ in the pool.",
      "options": [
        "is swim",
        "is swimming",
        "swimming",
        "swim"
      ],
      "answer": "is swimming",
      "explanation": "Look! Lan is swimming in the pool."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ in the pool at the moment. (swim)",
      "options": [
        "am swimming",
        "is swimming",
        "is swim",
        "swim"
      ],
      "answer": "is swimming",
      "explanation": "Lan is swimming in the pool at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (swim) in the pool at the moment.",
      "answers": [
        "is swimming"
      ],
      "explanation": "Lan is swimming in the pool at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ football now. (play)",
      "options": [
        "am play",
        "am playing",
        "is playing",
        "play"
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
      "prompt": "Chọn dạng đúng: I ______ playing football now. (phủ định)",
      "options": [
        "is not",
        "am",
        "are not",
        "am not"
      ],
      "answer": "am not",
      "explanation": "I am not playing football now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ I playing football now?",
      "answers": [
        "am"
      ],
      "explanation": "Am I playing football now?"
    },
    {
      "type": "choice",
      "prompt": "What am I doing? (play football)",
      "options": [
        "I is playing football.",
        "I playing football.",
        "I am playing football.",
        "I am play football."
      ],
      "answer": "I am playing football.",
      "explanation": "I am playing football."
    },
    {
      "type": "choice",
      "prompt": "Look! I ______ football.",
      "options": [
        "play",
        "am play",
        "playing",
        "am playing"
      ],
      "answer": "am playing",
      "explanation": "Look! I am playing football."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ football at the moment. (play)",
      "options": [
        "am play",
        "am playing",
        "is playing",
        "play"
      ],
      "answer": "am playing",
      "explanation": "I am playing football at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: I ______ (play) football at the moment.",
      "answers": [
        "am playing"
      ],
      "explanation": "I am playing football at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ a song now. (sing)",
      "options": [
        "are sing",
        "are singing",
        "sing",
        "am singing"
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
      "prompt": "Chọn dạng đúng: We ______ singing a song now. (phủ định)",
      "options": [
        "am not",
        "are",
        "is not",
        "are not"
      ],
      "answer": "are not",
      "explanation": "We are not singing a song now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ We singing a song now?",
      "answers": [
        "are"
      ],
      "explanation": "Are We singing a song now?"
    },
    {
      "type": "choice",
      "prompt": "What are We doing? (sing a song)",
      "options": [
        "We singing a song.",
        "We are sing a song.",
        "We are singing a song.",
        "We am singing a song."
      ],
      "answer": "We are singing a song.",
      "explanation": "We are singing a song."
    },
    {
      "type": "choice",
      "prompt": "Look! We ______ a song.",
      "options": [
        "singing",
        "are sing",
        "sing",
        "are singing"
      ],
      "answer": "are singing",
      "explanation": "Look! We are singing a song."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ a song at the moment. (sing)",
      "options": [
        "sing",
        "are sing",
        "am singing",
        "are singing"
      ],
      "answer": "are singing",
      "explanation": "We are singing a song at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ (sing) a song at the moment.",
      "answers": [
        "are singing"
      ],
      "explanation": "We are singing a song at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ at the party now. (dance)",
      "options": [
        "are dance",
        "am dancing",
        "are dancing",
        "dance"
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
      "prompt": "Chọn dạng đúng: They ______ dancing at the party now. (phủ định)",
      "options": [
        "is not",
        "are not",
        "are",
        "am not"
      ],
      "answer": "are not",
      "explanation": "They are not dancing at the party now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ They dancing at the party now?",
      "answers": [
        "are"
      ],
      "explanation": "Are They dancing at the party now?"
    },
    {
      "type": "choice",
      "prompt": "What are They doing? (dance at the party)",
      "options": [
        "They are dancing at the party.",
        "They dancing at the party.",
        "They am dancing at the party.",
        "They are dance at the party."
      ],
      "answer": "They are dancing at the party.",
      "explanation": "They are dancing at the party."
    },
    {
      "type": "choice",
      "prompt": "Look! They ______ at the party.",
      "options": [
        "are dancing",
        "dancing",
        "are dance",
        "dance"
      ],
      "answer": "are dancing",
      "explanation": "Look! They are dancing at the party."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ at the party at the moment. (dance)",
      "options": [
        "dance",
        "am dancing",
        "are dancing",
        "are dance"
      ],
      "answer": "are dancing",
      "explanation": "They are dancing at the party at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: They ______ (dance) at the party at the moment.",
      "answers": [
        "are dancing"
      ],
      "explanation": "They are dancing at the party at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ dinner now. (cook)",
      "options": [
        "is cooking",
        "is cook",
        "am cooking",
        "cook"
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
      "prompt": "Chọn dạng đúng: She ______ cooking dinner now. (phủ định)",
      "options": [
        "are not",
        "am not",
        "is",
        "is not"
      ],
      "answer": "is not",
      "explanation": "She is not cooking dinner now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ She cooking dinner now?",
      "answers": [
        "is"
      ],
      "explanation": "Is She cooking dinner now?"
    },
    {
      "type": "choice",
      "prompt": "What is She doing? (cook dinner)",
      "options": [
        "She are cooking dinner.",
        "She is cook dinner.",
        "She cooking dinner.",
        "She is cooking dinner."
      ],
      "answer": "She is cooking dinner.",
      "explanation": "She is cooking dinner."
    },
    {
      "type": "choice",
      "prompt": "Look! She ______ dinner.",
      "options": [
        "cook",
        "is cooking",
        "cooking",
        "is cook"
      ],
      "answer": "is cooking",
      "explanation": "Look! She is cooking dinner."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ dinner at the moment. (cook)",
      "options": [
        "is cooking",
        "is cook",
        "cook",
        "am cooking"
      ],
      "answer": "is cooking",
      "explanation": "She is cooking dinner at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (cook) dinner at the moment.",
      "answers": [
        "is cooking"
      ],
      "explanation": "She is cooking dinner at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ TV now. (watch)",
      "options": [
        "is watch",
        "am watching",
        "watch",
        "is watching"
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
      "prompt": "Chọn dạng đúng: He ______ watching TV now. (phủ định)",
      "options": [
        "am not",
        "is",
        "is not",
        "are not"
      ],
      "answer": "is not",
      "explanation": "He is not watching TV now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ He watching TV now?",
      "answers": [
        "is"
      ],
      "explanation": "Is He watching TV now?"
    },
    {
      "type": "choice",
      "prompt": "What is He doing? (watch TV)",
      "options": [
        "He watching TV.",
        "He are watching TV.",
        "He is watch TV.",
        "He is watching TV."
      ],
      "answer": "He is watching TV.",
      "explanation": "He is watching TV."
    },
    {
      "type": "choice",
      "prompt": "Look! He ______ TV.",
      "options": [
        "watching",
        "is watching",
        "watch",
        "is watch"
      ],
      "answer": "is watching",
      "explanation": "Look! He is watching TV."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ TV at the moment. (watch)",
      "options": [
        "is watching",
        "watch",
        "am watching",
        "is watch"
      ],
      "answer": "is watching",
      "explanation": "He is watching TV at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (watch) TV at the moment.",
      "answers": [
        "is watching"
      ],
      "explanation": "He is watching TV at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ English now. (study)",
      "options": [
        "is study",
        "is studying",
        "am studying",
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
      "prompt": "Chọn dạng đúng: Lan ______ studying English now. (phủ định)",
      "options": [
        "are not",
        "am not",
        "is",
        "is not"
      ],
      "answer": "is not",
      "explanation": "Lan is not studying English now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ Lan studying English now?",
      "answers": [
        "is"
      ],
      "explanation": "Is Lan studying English now?"
    },
    {
      "type": "choice",
      "prompt": "What is Lan doing? (study English)",
      "options": [
        "Lan are studying English.",
        "Lan studying English.",
        "Lan is studying English.",
        "Lan is study English."
      ],
      "answer": "Lan is studying English.",
      "explanation": "Lan is studying English."
    },
    {
      "type": "choice",
      "prompt": "Look! Lan ______ English.",
      "options": [
        "studying",
        "is studying",
        "is study",
        "study"
      ],
      "answer": "is studying",
      "explanation": "Look! Lan is studying English."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ English at the moment. (study)",
      "options": [
        "am studying",
        "is study",
        "is studying",
        "study"
      ],
      "answer": "is studying",
      "explanation": "Lan is studying English at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (study) English at the moment.",
      "answers": [
        "is studying"
      ],
      "explanation": "Lan is studying English at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ a letter now. (write)",
      "options": [
        "am write",
        "am writing",
        "write",
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
      "prompt": "Chọn dạng đúng: I ______ writing a letter now. (phủ định)",
      "options": [
        "are not",
        "am",
        "is not",
        "am not"
      ],
      "answer": "am not",
      "explanation": "I am not writing a letter now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ I writing a letter now?",
      "answers": [
        "am"
      ],
      "explanation": "Am I writing a letter now?"
    },
    {
      "type": "choice",
      "prompt": "What am I doing? (write a letter)",
      "options": [
        "I am writing a letter.",
        "I writing a letter.",
        "I is writing a letter.",
        "I am write a letter."
      ],
      "answer": "I am writing a letter.",
      "explanation": "I am writing a letter."
    },
    {
      "type": "choice",
      "prompt": "Look! I ______ a letter.",
      "options": [
        "writing",
        "am write",
        "write",
        "am writing"
      ],
      "answer": "am writing",
      "explanation": "Look! I am writing a letter."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ a letter at the moment. (write)",
      "options": [
        "is writing",
        "write",
        "am write",
        "am writing"
      ],
      "answer": "am writing",
      "explanation": "I am writing a letter at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: I ______ (write) a letter at the moment.",
      "answers": [
        "am writing"
      ],
      "explanation": "I am writing a letter at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ a cake now. (make)",
      "options": [
        "make",
        "am making",
        "are make",
        "are making"
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
      "prompt": "Chọn dạng đúng: We ______ making a cake now. (phủ định)",
      "options": [
        "is not",
        "are not",
        "am not",
        "are"
      ],
      "answer": "are not",
      "explanation": "We are not making a cake now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ We making a cake now?",
      "answers": [
        "are"
      ],
      "explanation": "Are We making a cake now?"
    },
    {
      "type": "choice",
      "prompt": "What are We doing? (make a cake)",
      "options": [
        "We are making a cake.",
        "We are make a cake.",
        "We making a cake.",
        "We am making a cake."
      ],
      "answer": "We are making a cake.",
      "explanation": "We are making a cake."
    },
    {
      "type": "choice",
      "prompt": "Look! We ______ a cake.",
      "options": [
        "making",
        "are making",
        "make",
        "are make"
      ],
      "answer": "are making",
      "explanation": "Look! We are making a cake."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ a cake at the moment. (make)",
      "options": [
        "make",
        "am making",
        "are making",
        "are make"
      ],
      "answer": "are making",
      "explanation": "We are making a cake at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ (make) a cake at the moment.",
      "answers": [
        "are making"
      ],
      "explanation": "We are making a cake at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ a bike now. (ride)",
      "options": [
        "are ride",
        "am riding",
        "ride",
        "are riding"
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
      "prompt": "Chọn dạng đúng: They ______ riding a bike now. (phủ định)",
      "options": [
        "are",
        "am not",
        "is not",
        "are not"
      ],
      "answer": "are not",
      "explanation": "They are not riding a bike now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ They riding a bike now?",
      "answers": [
        "are"
      ],
      "explanation": "Are They riding a bike now?"
    },
    {
      "type": "choice",
      "prompt": "What are They doing? (ride a bike)",
      "options": [
        "They riding a bike.",
        "They are ride a bike.",
        "They are riding a bike.",
        "They am riding a bike."
      ],
      "answer": "They are riding a bike.",
      "explanation": "They are riding a bike."
    },
    {
      "type": "choice",
      "prompt": "Look! They ______ a bike.",
      "options": [
        "ride",
        "are riding",
        "riding",
        "are ride"
      ],
      "answer": "are riding",
      "explanation": "Look! They are riding a bike."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ a bike at the moment. (ride)",
      "options": [
        "ride",
        "are riding",
        "are ride",
        "am riding"
      ],
      "answer": "are riding",
      "explanation": "They are riding a bike at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: They ______ (ride) a bike at the moment.",
      "answers": [
        "are riding"
      ],
      "explanation": "They are riding a bike at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ very high now. (jump)",
      "options": [
        "am jumping",
        "is jump",
        "jump",
        "is jumping"
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
      "prompt": "Chọn dạng đúng: She ______ jumping very high now. (phủ định)",
      "options": [
        "am not",
        "are not",
        "is",
        "is not"
      ],
      "answer": "is not",
      "explanation": "She is not jumping very high now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ She jumping very high now?",
      "answers": [
        "is"
      ],
      "explanation": "Is She jumping very high now?"
    },
    {
      "type": "choice",
      "prompt": "What is She doing? (jump very high)",
      "options": [
        "She is jumping very high.",
        "She is jump very high.",
        "She are jumping very high.",
        "She jumping very high."
      ],
      "answer": "She is jumping very high.",
      "explanation": "She is jumping very high."
    },
    {
      "type": "choice",
      "prompt": "Look! She ______ very high.",
      "options": [
        "jump",
        "is jump",
        "jumping",
        "is jumping"
      ],
      "answer": "is jumping",
      "explanation": "Look! She is jumping very high."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ very high at the moment. (jump)",
      "options": [
        "am jumping",
        "jump",
        "is jump",
        "is jumping"
      ],
      "answer": "is jumping",
      "explanation": "She is jumping very high at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (jump) very high at the moment.",
      "answers": [
        "is jumping"
      ],
      "explanation": "She is jumping very high at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ at the picture now. (look)",
      "options": [
        "is looking",
        "look",
        "am looking",
        "is look"
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
      "prompt": "Chọn dạng đúng: He ______ looking at the picture now. (phủ định)",
      "options": [
        "is not",
        "am not",
        "are not",
        "is"
      ],
      "answer": "is not",
      "explanation": "He is not looking at the picture now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ He looking at the picture now?",
      "answers": [
        "is"
      ],
      "explanation": "Is He looking at the picture now?"
    },
    {
      "type": "choice",
      "prompt": "What is He doing? (look at the picture)",
      "options": [
        "He is looking at the picture.",
        "He looking at the picture.",
        "He are looking at the picture.",
        "He is look at the picture."
      ],
      "answer": "He is looking at the picture.",
      "explanation": "He is looking at the picture."
    },
    {
      "type": "choice",
      "prompt": "Look! He ______ at the picture.",
      "options": [
        "looking",
        "look",
        "is looking",
        "is look"
      ],
      "answer": "is looking",
      "explanation": "Look! He is looking at the picture."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ at the picture at the moment. (look)",
      "options": [
        "is looking",
        "is look",
        "am looking",
        "look"
      ],
      "answer": "is looking",
      "explanation": "He is looking at the picture at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (look) at the picture at the moment.",
      "answers": [
        "is looking"
      ],
      "explanation": "He is looking at the picture at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ to music now. (listen)",
      "options": [
        "is listening",
        "am listening",
        "is listen",
        "listen"
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
      "prompt": "Chọn dạng đúng: Lan ______ listening to music now. (phủ định)",
      "options": [
        "am not",
        "is",
        "is not",
        "are not"
      ],
      "answer": "is not",
      "explanation": "Lan is not listening to music now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ Lan listening to music now?",
      "answers": [
        "is"
      ],
      "explanation": "Is Lan listening to music now?"
    },
    {
      "type": "choice",
      "prompt": "What is Lan doing? (listen to music)",
      "options": [
        "Lan is listen to music.",
        "Lan are listening to music.",
        "Lan listening to music.",
        "Lan is listening to music."
      ],
      "answer": "Lan is listening to music.",
      "explanation": "Lan is listening to music."
    },
    {
      "type": "choice",
      "prompt": "Look! Lan ______ to music.",
      "options": [
        "listen",
        "is listen",
        "listening",
        "is listening"
      ],
      "answer": "is listening",
      "explanation": "Look! Lan is listening to music."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ to music at the moment. (listen)",
      "options": [
        "listen",
        "is listen",
        "is listening",
        "am listening"
      ],
      "answer": "is listening",
      "explanation": "Lan is listening to music at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (listen) to music at the moment.",
      "answers": [
        "is listening"
      ],
      "explanation": "Lan is listening to music at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ in bed now. (sleep)",
      "options": [
        "is sleeping",
        "sleep",
        "am sleep",
        "am sleeping"
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
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ sleeping in bed now. (phủ định)",
      "options": [
        "are not",
        "am",
        "am not",
        "is not"
      ],
      "answer": "am not",
      "explanation": "I am not sleeping in bed now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ I sleeping in bed now?",
      "answers": [
        "am"
      ],
      "explanation": "Am I sleeping in bed now?"
    },
    {
      "type": "choice",
      "prompt": "What am I doing? (sleep in bed)",
      "options": [
        "I is sleeping in bed.",
        "I am sleeping in bed.",
        "I am sleep in bed.",
        "I sleeping in bed."
      ],
      "answer": "I am sleeping in bed.",
      "explanation": "I am sleeping in bed."
    },
    {
      "type": "choice",
      "prompt": "Look! I ______ in bed.",
      "options": [
        "sleeping",
        "am sleep",
        "am sleeping",
        "sleep"
      ],
      "answer": "am sleeping",
      "explanation": "Look! I am sleeping in bed."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ in bed at the moment. (sleep)",
      "options": [
        "am sleep",
        "is sleeping",
        "am sleeping",
        "sleep"
      ],
      "answer": "am sleeping",
      "explanation": "I am sleeping in bed at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: I ______ (sleep) in bed at the moment.",
      "answers": [
        "am sleeping"
      ],
      "explanation": "I am sleeping in bed at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ lunch now. (eat)",
      "options": [
        "eat",
        "am eating",
        "are eat",
        "are eating"
      ],
      "answer": "are eating",
      "explanation": "We are eating lunch now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ (eat) lunch now.",
      "answers": [
        "are eating"
      ],
      "explanation": "We are eating lunch now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ eating lunch now. (phủ định)",
      "options": [
        "are",
        "am not",
        "is not",
        "are not"
      ],
      "answer": "are not",
      "explanation": "We are not eating lunch now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ We eating lunch now?",
      "answers": [
        "are"
      ],
      "explanation": "Are We eating lunch now?"
    },
    {
      "type": "choice",
      "prompt": "What are We doing? (eat lunch)",
      "options": [
        "We are eating lunch.",
        "We are eat lunch.",
        "We eating lunch.",
        "We am eating lunch."
      ],
      "answer": "We are eating lunch.",
      "explanation": "We are eating lunch."
    },
    {
      "type": "choice",
      "prompt": "Look! We ______ lunch.",
      "options": [
        "are eat",
        "are eating",
        "eat",
        "eating"
      ],
      "answer": "are eating",
      "explanation": "Look! We are eating lunch."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ lunch at the moment. (eat)",
      "options": [
        "are eating",
        "eat",
        "are eat",
        "am eating"
      ],
      "answer": "are eating",
      "explanation": "We are eating lunch at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ (eat) lunch at the moment.",
      "answers": [
        "are eating"
      ],
      "explanation": "We are eating lunch at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ milk now. (drink)",
      "options": [
        "drink",
        "am drinking",
        "are drinking",
        "are drink"
      ],
      "answer": "are drinking",
      "explanation": "They are drinking milk now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: They ______ (drink) milk now.",
      "answers": [
        "are drinking"
      ],
      "explanation": "They are drinking milk now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ drinking milk now. (phủ định)",
      "options": [
        "are",
        "am not",
        "is not",
        "are not"
      ],
      "answer": "are not",
      "explanation": "They are not drinking milk now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ They drinking milk now?",
      "answers": [
        "are"
      ],
      "explanation": "Are They drinking milk now?"
    },
    {
      "type": "choice",
      "prompt": "What are They doing? (drink milk)",
      "options": [
        "They am drinking milk.",
        "They are drinking milk.",
        "They are drink milk.",
        "They drinking milk."
      ],
      "answer": "They are drinking milk.",
      "explanation": "They are drinking milk."
    },
    {
      "type": "choice",
      "prompt": "Look! They ______ milk.",
      "options": [
        "are drink",
        "drink",
        "drinking",
        "are drinking"
      ],
      "answer": "are drinking",
      "explanation": "Look! They are drinking milk."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ milk at the moment. (drink)",
      "options": [
        "am drinking",
        "drink",
        "are drinking",
        "are drink"
      ],
      "answer": "are drinking",
      "explanation": "They are drinking milk at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: They ______ (drink) milk at the moment.",
      "answers": [
        "are drinking"
      ],
      "explanation": "They are drinking milk at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ to school now. (walk)",
      "options": [
        "is walk",
        "is walking",
        "walk",
        "am walking"
      ],
      "answer": "is walking",
      "explanation": "She is walking to school now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (walk) to school now.",
      "answers": [
        "is walking"
      ],
      "explanation": "She is walking to school now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ walking to school now. (phủ định)",
      "options": [
        "are not",
        "is not",
        "is",
        "am not"
      ],
      "answer": "is not",
      "explanation": "She is not walking to school now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ She walking to school now?",
      "answers": [
        "is"
      ],
      "explanation": "Is She walking to school now?"
    },
    {
      "type": "choice",
      "prompt": "What is She doing? (walk to school)",
      "options": [
        "She is walk to school.",
        "She walking to school.",
        "She is walking to school.",
        "She are walking to school."
      ],
      "answer": "She is walking to school.",
      "explanation": "She is walking to school."
    },
    {
      "type": "choice",
      "prompt": "Look! She ______ to school.",
      "options": [
        "walk",
        "walking",
        "is walking",
        "is walk"
      ],
      "answer": "is walking",
      "explanation": "Look! She is walking to school."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ to school at the moment. (walk)",
      "options": [
        "is walking",
        "walk",
        "is walk",
        "am walking"
      ],
      "answer": "is walking",
      "explanation": "She is walking to school at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (walk) to school at the moment.",
      "answers": [
        "is walking"
      ],
      "explanation": "She is walking to school at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ a picture now. (draw)",
      "options": [
        "is drawing",
        "am drawing",
        "draw",
        "is draw"
      ],
      "answer": "is drawing",
      "explanation": "He is drawing a picture now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (draw) a picture now.",
      "answers": [
        "is drawing"
      ],
      "explanation": "He is drawing a picture now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ drawing a picture now. (phủ định)",
      "options": [
        "are not",
        "is not",
        "is",
        "am not"
      ],
      "answer": "is not",
      "explanation": "He is not drawing a picture now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ He drawing a picture now?",
      "answers": [
        "is"
      ],
      "explanation": "Is He drawing a picture now?"
    },
    {
      "type": "choice",
      "prompt": "What is He doing? (draw a picture)",
      "options": [
        "He drawing a picture.",
        "He is draw a picture.",
        "He are drawing a picture.",
        "He is drawing a picture."
      ],
      "answer": "He is drawing a picture.",
      "explanation": "He is drawing a picture."
    },
    {
      "type": "choice",
      "prompt": "Look! He ______ a picture.",
      "options": [
        "is draw",
        "is drawing",
        "draw",
        "drawing"
      ],
      "answer": "is drawing",
      "explanation": "Look! He is drawing a picture."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ a picture at the moment. (draw)",
      "options": [
        "draw",
        "is draw",
        "am drawing",
        "is drawing"
      ],
      "answer": "is drawing",
      "explanation": "He is drawing a picture at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (draw) a picture at the moment.",
      "answers": [
        "is drawing"
      ],
      "explanation": "He is drawing a picture at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ on a chair now. (sit)",
      "options": [
        "is sitting",
        "am sitting",
        "sit",
        "is sit"
      ],
      "answer": "is sitting",
      "explanation": "Lan is sitting on a chair now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (sit) on a chair now.",
      "answers": [
        "is sitting"
      ],
      "explanation": "Lan is sitting on a chair now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ sitting on a chair now. (phủ định)",
      "options": [
        "are not",
        "is not",
        "is",
        "am not"
      ],
      "answer": "is not",
      "explanation": "Lan is not sitting on a chair now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ Lan sitting on a chair now?",
      "answers": [
        "is"
      ],
      "explanation": "Is Lan sitting on a chair now?"
    },
    {
      "type": "choice",
      "prompt": "What is Lan doing? (sit on a chair)",
      "options": [
        "Lan are sitting on a chair.",
        "Lan sitting on a chair.",
        "Lan is sit on a chair.",
        "Lan is sitting on a chair."
      ],
      "answer": "Lan is sitting on a chair.",
      "explanation": "Lan is sitting on a chair."
    },
    {
      "type": "choice",
      "prompt": "Look! Lan ______ on a chair.",
      "options": [
        "sitting",
        "sit",
        "is sit",
        "is sitting"
      ],
      "answer": "is sitting",
      "explanation": "Look! Lan is sitting on a chair."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ on a chair at the moment. (sit)",
      "options": [
        "is sitting",
        "is sit",
        "sit",
        "am sitting"
      ],
      "answer": "is sitting",
      "explanation": "Lan is sitting on a chair at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (sit) on a chair at the moment.",
      "answers": [
        "is sitting"
      ],
      "explanation": "Lan is sitting on a chair at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ to a friend now. (talk)",
      "options": [
        "am talk",
        "am talking",
        "is talking",
        "talk"
      ],
      "answer": "am talking",
      "explanation": "I am talking to a friend now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: I ______ (talk) to a friend now.",
      "answers": [
        "am talking"
      ],
      "explanation": "I am talking to a friend now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ talking to a friend now. (phủ định)",
      "options": [
        "am not",
        "are not",
        "am",
        "is not"
      ],
      "answer": "am not",
      "explanation": "I am not talking to a friend now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ I talking to a friend now?",
      "answers": [
        "am"
      ],
      "explanation": "Am I talking to a friend now?"
    },
    {
      "type": "choice",
      "prompt": "What am I doing? (talk to a friend)",
      "options": [
        "I am talk to a friend.",
        "I is talking to a friend.",
        "I am talking to a friend.",
        "I talking to a friend."
      ],
      "answer": "I am talking to a friend.",
      "explanation": "I am talking to a friend."
    },
    {
      "type": "choice",
      "prompt": "Look! I ______ to a friend.",
      "options": [
        "talking",
        "talk",
        "am talking",
        "am talk"
      ],
      "answer": "am talking",
      "explanation": "Look! I am talking to a friend."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ to a friend at the moment. (talk)",
      "options": [
        "is talking",
        "talk",
        "am talk",
        "am talking"
      ],
      "answer": "am talking",
      "explanation": "I am talking to a friend at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: I ______ (talk) to a friend at the moment.",
      "answers": [
        "am talking"
      ],
      "explanation": "I am talking to a friend at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ with friends now. (laugh)",
      "options": [
        "are laughing",
        "am laughing",
        "are laugh",
        "laugh"
      ],
      "answer": "are laughing",
      "explanation": "We are laughing with friends now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ (laugh) with friends now.",
      "answers": [
        "are laughing"
      ],
      "explanation": "We are laughing with friends now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ laughing with friends now. (phủ định)",
      "options": [
        "am not",
        "are",
        "is not",
        "are not"
      ],
      "answer": "are not",
      "explanation": "We are not laughing with friends now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ We laughing with friends now?",
      "answers": [
        "are"
      ],
      "explanation": "Are We laughing with friends now?"
    },
    {
      "type": "choice",
      "prompt": "What are We doing? (laugh with friends)",
      "options": [
        "We are laughing with friends.",
        "We are laugh with friends.",
        "We laughing with friends.",
        "We am laughing with friends."
      ],
      "answer": "We are laughing with friends.",
      "explanation": "We are laughing with friends."
    },
    {
      "type": "choice",
      "prompt": "Look! We ______ with friends.",
      "options": [
        "laughing",
        "are laugh",
        "are laughing",
        "laugh"
      ],
      "answer": "are laughing",
      "explanation": "Look! We are laughing with friends."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ with friends at the moment. (laugh)",
      "options": [
        "laugh",
        "are laughing",
        "am laughing",
        "are laugh"
      ],
      "answer": "are laughing",
      "explanation": "We are laughing with friends at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ (laugh) with friends at the moment.",
      "answers": [
        "are laughing"
      ],
      "explanation": "We are laughing with friends at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ at me now. (smile)",
      "options": [
        "are smile",
        "am smiling",
        "smile",
        "are smiling"
      ],
      "answer": "are smiling",
      "explanation": "They are smiling at me now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: They ______ (smile) at me now.",
      "answers": [
        "are smiling"
      ],
      "explanation": "They are smiling at me now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ smiling at me now. (phủ định)",
      "options": [
        "are not",
        "is not",
        "am not",
        "are"
      ],
      "answer": "are not",
      "explanation": "They are not smiling at me now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ They smiling at me now?",
      "answers": [
        "are"
      ],
      "explanation": "Are They smiling at me now?"
    },
    {
      "type": "choice",
      "prompt": "What are They doing? (smile at me)",
      "options": [
        "They are smile at me.",
        "They smiling at me.",
        "They am smiling at me.",
        "They are smiling at me."
      ],
      "answer": "They are smiling at me.",
      "explanation": "They are smiling at me."
    },
    {
      "type": "choice",
      "prompt": "Look! They ______ at me.",
      "options": [
        "are smiling",
        "smiling",
        "smile",
        "are smile"
      ],
      "answer": "are smiling",
      "explanation": "Look! They are smiling at me."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ at me at the moment. (smile)",
      "options": [
        "are smile",
        "am smiling",
        "smile",
        "are smiling"
      ],
      "answer": "are smiling",
      "explanation": "They are smiling at me at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: They ______ (smile) at me at the moment.",
      "answers": [
        "are smiling"
      ],
      "explanation": "They are smiling at me at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ a tree now. (climb)",
      "options": [
        "is climb",
        "climb",
        "is climbing",
        "am climbing"
      ],
      "answer": "is climbing",
      "explanation": "She is climbing a tree now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (climb) a tree now.",
      "answers": [
        "is climbing"
      ],
      "explanation": "She is climbing a tree now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ climbing a tree now. (phủ định)",
      "options": [
        "is not",
        "is",
        "am not",
        "are not"
      ],
      "answer": "is not",
      "explanation": "She is not climbing a tree now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ She climbing a tree now?",
      "answers": [
        "is"
      ],
      "explanation": "Is She climbing a tree now?"
    },
    {
      "type": "choice",
      "prompt": "What is She doing? (climb a tree)",
      "options": [
        "She is climb a tree.",
        "She are climbing a tree.",
        "She is climbing a tree.",
        "She climbing a tree."
      ],
      "answer": "She is climbing a tree.",
      "explanation": "She is climbing a tree."
    },
    {
      "type": "choice",
      "prompt": "Look! She ______ a tree.",
      "options": [
        "climb",
        "climbing",
        "is climb",
        "is climbing"
      ],
      "answer": "is climbing",
      "explanation": "Look! She is climbing a tree."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ a tree at the moment. (climb)",
      "options": [
        "is climb",
        "am climbing",
        "climb",
        "is climbing"
      ],
      "answer": "is climbing",
      "explanation": "She is climbing a tree at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ (climb) a tree at the moment.",
      "answers": [
        "is climbing"
      ],
      "explanation": "She is climbing a tree at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ a car now. (drive)",
      "options": [
        "is driving",
        "drive",
        "is drive",
        "am driving"
      ],
      "answer": "is driving",
      "explanation": "He is driving a car now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (drive) a car now.",
      "answers": [
        "is driving"
      ],
      "explanation": "He is driving a car now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ driving a car now. (phủ định)",
      "options": [
        "is not",
        "are not",
        "am not",
        "is"
      ],
      "answer": "is not",
      "explanation": "He is not driving a car now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ He driving a car now?",
      "answers": [
        "is"
      ],
      "explanation": "Is He driving a car now?"
    },
    {
      "type": "choice",
      "prompt": "What is He doing? (drive a car)",
      "options": [
        "He is drive a car.",
        "He driving a car.",
        "He are driving a car.",
        "He is driving a car."
      ],
      "answer": "He is driving a car.",
      "explanation": "He is driving a car."
    },
    {
      "type": "choice",
      "prompt": "Look! He ______ a car.",
      "options": [
        "is drive",
        "is driving",
        "driving",
        "drive"
      ],
      "answer": "is driving",
      "explanation": "Look! He is driving a car."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ a car at the moment. (drive)",
      "options": [
        "is drive",
        "am driving",
        "is driving",
        "drive"
      ],
      "answer": "is driving",
      "explanation": "He is driving a car at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ (drive) a car at the moment.",
      "answers": [
        "is driving"
      ],
      "explanation": "He is driving a car at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ the room now. (clean)",
      "options": [
        "am cleaning",
        "is cleaning",
        "clean",
        "is clean"
      ],
      "answer": "is cleaning",
      "explanation": "Lan is cleaning the room now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (clean) the room now.",
      "answers": [
        "is cleaning"
      ],
      "explanation": "Lan is cleaning the room now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ cleaning the room now. (phủ định)",
      "options": [
        "is not",
        "are not",
        "is",
        "am not"
      ],
      "answer": "is not",
      "explanation": "Lan is not cleaning the room now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ Lan cleaning the room now?",
      "answers": [
        "is"
      ],
      "explanation": "Is Lan cleaning the room now?"
    },
    {
      "type": "choice",
      "prompt": "What is Lan doing? (clean the room)",
      "options": [
        "Lan cleaning the room.",
        "Lan is cleaning the room.",
        "Lan are cleaning the room.",
        "Lan is clean the room."
      ],
      "answer": "Lan is cleaning the room.",
      "explanation": "Lan is cleaning the room."
    },
    {
      "type": "choice",
      "prompt": "Look! Lan ______ the room.",
      "options": [
        "is clean",
        "is cleaning",
        "cleaning",
        "clean"
      ],
      "answer": "is cleaning",
      "explanation": "Look! Lan is cleaning the room."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ the room at the moment. (clean)",
      "options": [
        "clean",
        "am cleaning",
        "is cleaning",
        "is clean"
      ],
      "answer": "is cleaning",
      "explanation": "Lan is cleaning the room at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ (clean) the room at the moment.",
      "answers": [
        "is cleaning"
      ],
      "explanation": "Lan is cleaning the room at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ her hands now. (wash)",
      "options": [
        "is washing",
        "wash",
        "am wash",
        "am washing"
      ],
      "answer": "am washing",
      "explanation": "I am washing her hands now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: I ______ (wash) her hands now.",
      "answers": [
        "am washing"
      ],
      "explanation": "I am washing her hands now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ washing her hands now. (phủ định)",
      "options": [
        "am not",
        "are not",
        "am",
        "is not"
      ],
      "answer": "am not",
      "explanation": "I am not washing her hands now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ I washing her hands now?",
      "answers": [
        "am"
      ],
      "explanation": "Am I washing her hands now?"
    },
    {
      "type": "choice",
      "prompt": "What am I doing? (wash her hands)",
      "options": [
        "I am wash her hands.",
        "I am washing her hands.",
        "I washing her hands.",
        "I is washing her hands."
      ],
      "answer": "I am washing her hands.",
      "explanation": "I am washing her hands."
    },
    {
      "type": "choice",
      "prompt": "Look! I ______ her hands.",
      "options": [
        "am washing",
        "am wash",
        "washing",
        "wash"
      ],
      "answer": "am washing",
      "explanation": "Look! I am washing her hands."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ her hands at the moment. (wash)",
      "options": [
        "is washing",
        "am washing",
        "wash",
        "am wash"
      ],
      "answer": "am washing",
      "explanation": "I am washing her hands at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: I ______ (wash) her hands at the moment.",
      "answers": [
        "am washing"
      ],
      "explanation": "I am washing her hands at the moment."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ for a bus now. (wait)",
      "options": [
        "am waiting",
        "wait",
        "are wait",
        "are waiting"
      ],
      "answer": "are waiting",
      "explanation": "We are waiting for a bus now."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ (wait) for a bus now.",
      "answers": [
        "are waiting"
      ],
      "explanation": "We are waiting for a bus now."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ waiting for a bus now. (phủ định)",
      "options": [
        "are",
        "is not",
        "are not",
        "am not"
      ],
      "answer": "are not",
      "explanation": "We are not waiting for a bus now."
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ We waiting for a bus now?",
      "answers": [
        "are"
      ],
      "explanation": "Are We waiting for a bus now?"
    },
    {
      "type": "choice",
      "prompt": "What are We doing? (wait for a bus)",
      "options": [
        "We are waiting for a bus.",
        "We waiting for a bus.",
        "We am waiting for a bus.",
        "We are wait for a bus."
      ],
      "answer": "We are waiting for a bus.",
      "explanation": "We are waiting for a bus."
    },
    {
      "type": "choice",
      "prompt": "Look! We ______ for a bus.",
      "options": [
        "wait",
        "are waiting",
        "are wait",
        "waiting"
      ],
      "answer": "are waiting",
      "explanation": "Look! We are waiting for a bus."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ for a bus at the moment. (wait)",
      "options": [
        "am waiting",
        "are wait",
        "wait",
        "are waiting"
      ],
      "answer": "are waiting",
      "explanation": "We are waiting for a bus at the moment."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ (wait) for a bus at the moment.",
      "answers": [
        "are waiting"
      ],
      "explanation": "We are waiting for a bus at the moment."
    }
  ],
  "past-regular": [
    {
      "type": "choice",
      "prompt": "\"work → worked\" có nghĩa là gì?",
      "options": [
        "đã học",
        "đã chơi",
        "đã sống",
        "đã làm việc"
      ],
      "answer": "đã làm việc",
      "explanation": "work → worked = đã làm việc."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ yesterday. (đã làm việc)",
      "answers": [
        "worked"
      ],
      "explanation": "Câu đầy đủ: He worked yesterday."
    },
    {
      "type": "choice",
      "prompt": "\"live → lived\" có nghĩa là gì?",
      "options": [
        "đã lên kế hoạch",
        "đã làm việc",
        "đã sống",
        "đã học"
      ],
      "answer": "đã sống",
      "explanation": "live → lived = đã sống."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ in Hanoi in 2020. (đã sống)",
      "answers": [
        "lived"
      ],
      "explanation": "Câu đầy đủ: He lived in Hanoi in 2020."
    },
    {
      "type": "choice",
      "prompt": "\"study → studied\" có nghĩa là gì?",
      "options": [
        "đã làm việc",
        "đã lên kế hoạch",
        "đã chơi",
        "đã học"
      ],
      "answer": "đã học",
      "explanation": "study → studied = đã học."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ English last night. (đã học)",
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
        "đã chơi",
        "đã xem",
        "đã làm việc"
      ],
      "answer": "đã dừng",
      "explanation": "stop → stopped = đã dừng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: The bus ______ at the station. (đã dừng)",
      "answers": [
        "stopped"
      ],
      "explanation": "Câu đầy đủ: The bus stopped at the station."
    },
    {
      "type": "choice",
      "prompt": "\"plan → planned\" có nghĩa là gì?",
      "options": [
        "đã chơi",
        "đã làm việc",
        "đã lên kế hoạch",
        "đã sống"
      ],
      "answer": "đã lên kế hoạch",
      "explanation": "plan → planned = đã lên kế hoạch."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: They ______ a trip last month. (đã lên kế hoạch)",
      "answers": [
        "planned"
      ],
      "explanation": "Câu đầy đủ: They planned a trip last month."
    },
    {
      "type": "choice",
      "prompt": "\"play → played\" có nghĩa là gì?",
      "options": [
        "đã học",
        "đã chơi",
        "đã xem",
        "đã dừng"
      ],
      "answer": "đã chơi",
      "explanation": "play → played = đã chơi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: We ______ football yesterday. (đã chơi)",
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
        "đã làm việc",
        "đã xem",
        "đã chơi"
      ],
      "answer": "đã xem",
      "explanation": "watch → watched = đã xem."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ a film last night. (đã xem)",
      "answers": [
        "watched"
      ],
      "explanation": "Câu đầy đủ: I watched a film last night."
    },
    {
      "type": "choice",
      "prompt": "\"visit → visited\" có nghĩa là gì?",
      "options": [
        "đã lên kế hoạch",
        "đã thăm",
        "đã dừng",
        "đã xem"
      ],
      "answer": "đã thăm",
      "explanation": "visit → visited = đã thăm."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: They ______ their grandparents last Sunday. (đã thăm)",
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
        "working",
        "work",
        "worked",
        "works"
      ],
      "answer": "worked",
      "explanation": "work → worked (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ at home. (work)",
      "options": [
        "work",
        "worked",
        "working",
        "works"
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
      "prompt": "Chọn dạng đúng: She ______ work yesterday. (không)",
      "options": [
        "wasn't",
        "doesn't",
        "didn't",
        "don't"
      ],
      "answer": "didn't",
      "explanation": "She didn't work yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you work yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you work yesterday? = Hôm qua bạn có work không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she works, yesterday she ______.",
      "options": [
        "worked",
        "work",
        "working",
        "works"
      ],
      "answer": "worked",
      "explanation": "Today she works, yesterday she worked."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"watch\":",
      "options": [
        "watches",
        "watched",
        "watch",
        "watching"
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
      "prompt": "Chọn dạng đúng: She ______ watch yesterday. (không)",
      "options": [
        "wasn't",
        "doesn't",
        "didn't",
        "don't"
      ],
      "answer": "didn't",
      "explanation": "She didn't watch yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you watch yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you watch yesterday? = Hôm qua bạn có watch không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she watches, yesterday she ______.",
      "options": [
        "watching",
        "watch",
        "watched",
        "watches"
      ],
      "answer": "watched",
      "explanation": "Today she watches, yesterday she watched."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"visit\":",
      "options": [
        "visits",
        "visiting",
        "visit",
        "visited"
      ],
      "answer": "visited",
      "explanation": "visit → visited (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ her grandmother. (visit)",
      "options": [
        "visit",
        "visiting",
        "visited",
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
      "prompt": "Chọn dạng đúng: She ______ visit yesterday. (không)",
      "options": [
        "don't",
        "didn't",
        "wasn't",
        "doesn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't visit yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you visit yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you visit yesterday? = Hôm qua bạn có visit không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she visits, yesterday she ______.",
      "options": [
        "visits",
        "visit",
        "visiting",
        "visited"
      ],
      "answer": "visited",
      "explanation": "Today she visits, yesterday she visited."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"live\":",
      "options": [
        "lived",
        "live",
        "living",
        "lives"
      ],
      "answer": "lived",
      "explanation": "live → lived (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ live yesterday. (không)",
      "options": [
        "wasn't",
        "doesn't",
        "don't",
        "didn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't live yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you live yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you live yesterday? = Hôm qua bạn có live không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she lives, yesterday she ______.",
      "options": [
        "living",
        "live",
        "lives",
        "lived"
      ],
      "answer": "lived",
      "explanation": "Today she lives, yesterday she lived."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"study\":",
      "options": [
        "studied",
        "studying",
        "studies",
        "study"
      ],
      "answer": "studied",
      "explanation": "study → studied (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ English. (study)",
      "options": [
        "studying",
        "study",
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
      "prompt": "Chọn dạng đúng: She ______ study yesterday. (không)",
      "options": [
        "doesn't",
        "didn't",
        "wasn't",
        "don't"
      ],
      "answer": "didn't",
      "explanation": "She didn't study yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you study yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you study yesterday? = Hôm qua bạn có study không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she studies, yesterday she ______.",
      "options": [
        "studies",
        "study",
        "studied",
        "studying"
      ],
      "answer": "studied",
      "explanation": "Today she studies, yesterday she studied."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"play\":",
      "options": [
        "played",
        "play",
        "playing",
        "plays"
      ],
      "answer": "played",
      "explanation": "play → played (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ football. (play)",
      "options": [
        "plays",
        "played",
        "playing",
        "play"
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
      "prompt": "Chọn dạng đúng: She ______ play yesterday. (không)",
      "options": [
        "doesn't",
        "wasn't",
        "don't",
        "didn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't play yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you play yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you play yesterday? = Hôm qua bạn có play không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she plays, yesterday she ______.",
      "options": [
        "playing",
        "play",
        "plays",
        "played"
      ],
      "answer": "played",
      "explanation": "Today she plays, yesterday she played."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"stop\":",
      "options": [
        "stopping",
        "stopped",
        "stop",
        "stops"
      ],
      "answer": "stopped",
      "explanation": "stop → stopped (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ at the shop. (stop)",
      "options": [
        "stops",
        "stop",
        "stopped",
        "stopping"
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
      "prompt": "Chọn dạng đúng: She ______ stop yesterday. (không)",
      "options": [
        "don't",
        "didn't",
        "wasn't",
        "doesn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't stop yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you stop yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you stop yesterday? = Hôm qua bạn có stop không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she stops, yesterday she ______.",
      "options": [
        "stopped",
        "stop",
        "stopping",
        "stops"
      ],
      "answer": "stopped",
      "explanation": "Today she stops, yesterday she stopped."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"plan\":",
      "options": [
        "plan",
        "plans",
        "planning",
        "planned"
      ],
      "answer": "planned",
      "explanation": "plan → planned (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ a trip. (plan)",
      "options": [
        "plans",
        "planned",
        "planning",
        "plan"
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
      "prompt": "Chọn dạng đúng: She ______ plan yesterday. (không)",
      "options": [
        "didn't",
        "don't",
        "doesn't",
        "wasn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't plan yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you plan yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you plan yesterday? = Hôm qua bạn có plan không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she plans, yesterday she ______.",
      "options": [
        "planned",
        "plan",
        "plans",
        "planning"
      ],
      "answer": "planned",
      "explanation": "Today she plans, yesterday she planned."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"look\":",
      "options": [
        "looks",
        "looked",
        "look",
        "looking"
      ],
      "answer": "looked",
      "explanation": "look → looked (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ at the picture. (look)",
      "options": [
        "looking",
        "look",
        "looks",
        "looked"
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
      "prompt": "Chọn dạng đúng: She ______ look yesterday. (không)",
      "options": [
        "wasn't",
        "didn't",
        "doesn't",
        "don't"
      ],
      "answer": "didn't",
      "explanation": "She didn't look yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you look yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you look yesterday? = Hôm qua bạn có look không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she looks, yesterday she ______.",
      "options": [
        "looking",
        "looked",
        "look",
        "looks"
      ],
      "answer": "looked",
      "explanation": "Today she looks, yesterday she looked."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"cook\":",
      "options": [
        "cooking",
        "cooks",
        "cooked",
        "cook"
      ],
      "answer": "cooked",
      "explanation": "cook → cooked (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ dinner. (cook)",
      "options": [
        "cooking",
        "cook",
        "cooks",
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
      "prompt": "Chọn dạng đúng: She ______ cook yesterday. (không)",
      "options": [
        "didn't",
        "doesn't",
        "don't",
        "wasn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't cook yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you cook yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you cook yesterday? = Hôm qua bạn có cook không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she cooks, yesterday she ______.",
      "options": [
        "cooked",
        "cooks",
        "cook",
        "cooking"
      ],
      "answer": "cooked",
      "explanation": "Today she cooks, yesterday she cooked."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"clean\":",
      "options": [
        "cleans",
        "cleaning",
        "cleaned",
        "clean"
      ],
      "answer": "cleaned",
      "explanation": "clean → cleaned (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ the room. (clean)",
      "options": [
        "cleans",
        "cleaning",
        "cleaned",
        "clean"
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
      "prompt": "Chọn dạng đúng: She ______ clean yesterday. (không)",
      "options": [
        "doesn't",
        "didn't",
        "wasn't",
        "don't"
      ],
      "answer": "didn't",
      "explanation": "She didn't clean yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you clean yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you clean yesterday? = Hôm qua bạn có clean không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she cleans, yesterday she ______.",
      "options": [
        "cleans",
        "cleaning",
        "cleaned",
        "clean"
      ],
      "answer": "cleaned",
      "explanation": "Today she cleans, yesterday she cleaned."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"wash\":",
      "options": [
        "washing",
        "washed",
        "wash",
        "washes"
      ],
      "answer": "washed",
      "explanation": "wash → washed (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ her hands. (wash)",
      "options": [
        "washing",
        "washed",
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
      "prompt": "Chọn dạng đúng: She ______ wash yesterday. (không)",
      "options": [
        "doesn't",
        "didn't",
        "wasn't",
        "don't"
      ],
      "answer": "didn't",
      "explanation": "She didn't wash yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you wash yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you wash yesterday? = Hôm qua bạn có wash không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she washes, yesterday she ______.",
      "options": [
        "washed",
        "wash",
        "washes",
        "washing"
      ],
      "answer": "washed",
      "explanation": "Today she washes, yesterday she washed."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"help\":",
      "options": [
        "help",
        "helping",
        "helped",
        "helps"
      ],
      "answer": "helped",
      "explanation": "help → helped (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ her mother. (help)",
      "options": [
        "helps",
        "helped",
        "help",
        "helping"
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
      "prompt": "Chọn dạng đúng: She ______ help yesterday. (không)",
      "options": [
        "didn't",
        "doesn't",
        "don't",
        "wasn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't help yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you help yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you help yesterday? = Hôm qua bạn có help không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she helps, yesterday she ______.",
      "options": [
        "helped",
        "helping",
        "helps",
        "help"
      ],
      "answer": "helped",
      "explanation": "Today she helps, yesterday she helped."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"dance\":",
      "options": [
        "danced",
        "dancing",
        "dance",
        "dances"
      ],
      "answer": "danced",
      "explanation": "dance → danced (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ at the party. (dance)",
      "options": [
        "dance",
        "dances",
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
      "prompt": "Chọn dạng đúng: She ______ dance yesterday. (không)",
      "options": [
        "doesn't",
        "wasn't",
        "didn't",
        "don't"
      ],
      "answer": "didn't",
      "explanation": "She didn't dance yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you dance yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you dance yesterday? = Hôm qua bạn có dance không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she dances, yesterday she ______.",
      "options": [
        "dance",
        "dancing",
        "danced",
        "dances"
      ],
      "answer": "danced",
      "explanation": "Today she dances, yesterday she danced."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"move\":",
      "options": [
        "moving",
        "moved",
        "moves",
        "move"
      ],
      "answer": "moved",
      "explanation": "move → moved (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ the chair. (move)",
      "options": [
        "move",
        "moved",
        "moving",
        "moves"
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
      "prompt": "Chọn dạng đúng: She ______ move yesterday. (không)",
      "options": [
        "wasn't",
        "don't",
        "didn't",
        "doesn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't move yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you move yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you move yesterday? = Hôm qua bạn có move không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she moves, yesterday she ______.",
      "options": [
        "moved",
        "moves",
        "moving",
        "move"
      ],
      "answer": "moved",
      "explanation": "Today she moves, yesterday she moved."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"like\":",
      "options": [
        "liking",
        "like",
        "likes",
        "liked"
      ],
      "answer": "liked",
      "explanation": "like → liked (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ ice cream. (like)",
      "options": [
        "liked",
        "like",
        "likes",
        "liking"
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
      "prompt": "Chọn dạng đúng: She ______ like yesterday. (không)",
      "options": [
        "didn't",
        "don't",
        "doesn't",
        "wasn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't like yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you like yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you like yesterday? = Hôm qua bạn có like không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she likes, yesterday she ______.",
      "options": [
        "likes",
        "liking",
        "like",
        "liked"
      ],
      "answer": "liked",
      "explanation": "Today she likes, yesterday she liked."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"love\":",
      "options": [
        "loving",
        "loves",
        "loved",
        "love"
      ],
      "answer": "loved",
      "explanation": "love → loved (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ music. (love)",
      "options": [
        "love",
        "loving",
        "loves",
        "loved"
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
      "prompt": "Chọn dạng đúng: She ______ love yesterday. (không)",
      "options": [
        "wasn't",
        "didn't",
        "doesn't",
        "don't"
      ],
      "answer": "didn't",
      "explanation": "She didn't love yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you love yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you love yesterday? = Hôm qua bạn có love không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she loves, yesterday she ______.",
      "options": [
        "love",
        "loves",
        "loved",
        "loving"
      ],
      "answer": "loved",
      "explanation": "Today she loves, yesterday she loved."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"jump\":",
      "options": [
        "jumped",
        "jumping",
        "jumps",
        "jump"
      ],
      "answer": "jumped",
      "explanation": "jump → jumped (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ very high. (jump)",
      "options": [
        "jumped",
        "jumping",
        "jump",
        "jumps"
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
      "prompt": "Chọn dạng đúng: She ______ jump yesterday. (không)",
      "options": [
        "didn't",
        "don't",
        "doesn't",
        "wasn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't jump yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you jump yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you jump yesterday? = Hôm qua bạn có jump không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she jumps, yesterday she ______.",
      "options": [
        "jump",
        "jumping",
        "jumped",
        "jumps"
      ],
      "answer": "jumped",
      "explanation": "Today she jumps, yesterday she jumped."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"arrive\":",
      "options": [
        "arrived",
        "arriving",
        "arrive",
        "arrives"
      ],
      "answer": "arrived",
      "explanation": "arrive → arrived (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ home. (arrive)",
      "options": [
        "arriving",
        "arrived",
        "arrives",
        "arrive"
      ],
      "answer": "arrived",
      "explanation": "Yesterday, she arrived home."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ home. (arrive)",
      "answers": [
        "arrived"
      ],
      "explanation": "Yesterday, I arrived home."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ arrive yesterday. (không)",
      "options": [
        "don't",
        "doesn't",
        "wasn't",
        "didn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't arrive yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you arrive yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you arrive yesterday? = Hôm qua bạn có arrive không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she arrives, yesterday she ______.",
      "options": [
        "arrived",
        "arrives",
        "arrive",
        "arriving"
      ],
      "answer": "arrived",
      "explanation": "Today she arrives, yesterday she arrived."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"wait\":",
      "options": [
        "waited",
        "waits",
        "waiting",
        "wait"
      ],
      "answer": "waited",
      "explanation": "wait → waited (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ for a bus. (wait)",
      "options": [
        "waits",
        "waited",
        "waiting",
        "wait"
      ],
      "answer": "waited",
      "explanation": "Yesterday, she waited for a bus."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ for a bus. (wait)",
      "answers": [
        "waited"
      ],
      "explanation": "Yesterday, I waited for a bus."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ wait yesterday. (không)",
      "options": [
        "don't",
        "doesn't",
        "wasn't",
        "didn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't wait yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you wait yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you wait yesterday? = Hôm qua bạn có wait không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she waits, yesterday she ______.",
      "options": [
        "wait",
        "waited",
        "waits",
        "waiting"
      ],
      "answer": "waited",
      "explanation": "Today she waits, yesterday she waited."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"walk\":",
      "options": [
        "walked",
        "walks",
        "walk",
        "walking"
      ],
      "answer": "walked",
      "explanation": "walk → walked (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ to school. (walk)",
      "options": [
        "walk",
        "walking",
        "walked",
        "walks"
      ],
      "answer": "walked",
      "explanation": "Yesterday, she walked to school."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ to school. (walk)",
      "answers": [
        "walked"
      ],
      "explanation": "Yesterday, I walked to school."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ walk yesterday. (không)",
      "options": [
        "didn't",
        "doesn't",
        "wasn't",
        "don't"
      ],
      "answer": "didn't",
      "explanation": "She didn't walk yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you walk yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you walk yesterday? = Hôm qua bạn có walk không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she walks, yesterday she ______.",
      "options": [
        "walk",
        "walking",
        "walked",
        "walks"
      ],
      "answer": "walked",
      "explanation": "Today she walks, yesterday she walked."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"talk\":",
      "options": [
        "talks",
        "talking",
        "talked",
        "talk"
      ],
      "answer": "talked",
      "explanation": "talk → talked (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ to a friend. (talk)",
      "options": [
        "talks",
        "talking",
        "talk",
        "talked"
      ],
      "answer": "talked",
      "explanation": "Yesterday, she talked to a friend."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ to a friend. (talk)",
      "answers": [
        "talked"
      ],
      "explanation": "Yesterday, I talked to a friend."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ talk yesterday. (không)",
      "options": [
        "wasn't",
        "didn't",
        "doesn't",
        "don't"
      ],
      "answer": "didn't",
      "explanation": "She didn't talk yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you talk yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you talk yesterday? = Hôm qua bạn có talk không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she talks, yesterday she ______.",
      "options": [
        "talk",
        "talking",
        "talked",
        "talks"
      ],
      "answer": "talked",
      "explanation": "Today she talks, yesterday she talked."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"laugh\":",
      "options": [
        "laughs",
        "laugh",
        "laughed",
        "laughing"
      ],
      "answer": "laughed",
      "explanation": "laugh → laughed (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ with friends. (laugh)",
      "options": [
        "laugh",
        "laughing",
        "laughs",
        "laughed"
      ],
      "answer": "laughed",
      "explanation": "Yesterday, she laughed with friends."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ with friends. (laugh)",
      "answers": [
        "laughed"
      ],
      "explanation": "Yesterday, I laughed with friends."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ laugh yesterday. (không)",
      "options": [
        "don't",
        "doesn't",
        "didn't",
        "wasn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't laugh yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you laugh yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you laugh yesterday? = Hôm qua bạn có laugh không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she laughs, yesterday she ______.",
      "options": [
        "laughed",
        "laughing",
        "laughs",
        "laugh"
      ],
      "answer": "laughed",
      "explanation": "Today she laughs, yesterday she laughed."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"smile\":",
      "options": [
        "smiles",
        "smiling",
        "smiled",
        "smile"
      ],
      "answer": "smiled",
      "explanation": "smile → smiled (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ at me. (smile)",
      "options": [
        "smiled",
        "smile",
        "smiling",
        "smiles"
      ],
      "answer": "smiled",
      "explanation": "Yesterday, she smiled at me."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ at me. (smile)",
      "answers": [
        "smiled"
      ],
      "explanation": "Yesterday, I smiled at me."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ smile yesterday. (không)",
      "options": [
        "doesn't",
        "don't",
        "didn't",
        "wasn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't smile yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you smile yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you smile yesterday? = Hôm qua bạn có smile không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she smiles, yesterday she ______.",
      "options": [
        "smiled",
        "smiling",
        "smile",
        "smiles"
      ],
      "answer": "smiled",
      "explanation": "Today she smiles, yesterday she smiled."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"climb\":",
      "options": [
        "climb",
        "climbs",
        "climbing",
        "climbed"
      ],
      "answer": "climbed",
      "explanation": "climb → climbed (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ a tree. (climb)",
      "options": [
        "climb",
        "climbing",
        "climbs",
        "climbed"
      ],
      "answer": "climbed",
      "explanation": "Yesterday, she climbed a tree."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ a tree. (climb)",
      "answers": [
        "climbed"
      ],
      "explanation": "Yesterday, I climbed a tree."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ climb yesterday. (không)",
      "options": [
        "doesn't",
        "don't",
        "didn't",
        "wasn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't climb yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you climb yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you climb yesterday? = Hôm qua bạn có climb không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she climbs, yesterday she ______.",
      "options": [
        "climbing",
        "climb",
        "climbed",
        "climbs"
      ],
      "answer": "climbed",
      "explanation": "Today she climbs, yesterday she climbed."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"open\":",
      "options": [
        "opens",
        "opening",
        "open",
        "opened"
      ],
      "answer": "opened",
      "explanation": "open → opened (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ the door. (open)",
      "options": [
        "open",
        "opens",
        "opened",
        "opening"
      ],
      "answer": "opened",
      "explanation": "Yesterday, she opened the door."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ the door. (open)",
      "answers": [
        "opened"
      ],
      "explanation": "Yesterday, I opened the door."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ open yesterday. (không)",
      "options": [
        "wasn't",
        "didn't",
        "don't",
        "doesn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't open yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you open yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you open yesterday? = Hôm qua bạn có open không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she opens, yesterday she ______.",
      "options": [
        "opened",
        "open",
        "opens",
        "opening"
      ],
      "answer": "opened",
      "explanation": "Today she opens, yesterday she opened."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"close\":",
      "options": [
        "close",
        "closes",
        "closed",
        "closing"
      ],
      "answer": "closed",
      "explanation": "close → closed (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ the window. (close)",
      "options": [
        "closed",
        "closes",
        "closing",
        "close"
      ],
      "answer": "closed",
      "explanation": "Yesterday, she closed the window."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ the window. (close)",
      "answers": [
        "closed"
      ],
      "explanation": "Yesterday, I closed the window."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ close yesterday. (không)",
      "options": [
        "doesn't",
        "wasn't",
        "don't",
        "didn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't close yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you close yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you close yesterday? = Hôm qua bạn có close không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she closes, yesterday she ______.",
      "options": [
        "closed",
        "close",
        "closes",
        "closing"
      ],
      "answer": "closed",
      "explanation": "Today she closes, yesterday she closed."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"ask\":",
      "options": [
        "asks",
        "ask",
        "asked",
        "asking"
      ],
      "answer": "asked",
      "explanation": "ask → asked (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ a question. (ask)",
      "options": [
        "asking",
        "ask",
        "asked",
        "asks"
      ],
      "answer": "asked",
      "explanation": "Yesterday, she asked a question."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ a question. (ask)",
      "answers": [
        "asked"
      ],
      "explanation": "Yesterday, I asked a question."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ ask yesterday. (không)",
      "options": [
        "don't",
        "didn't",
        "wasn't",
        "doesn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't ask yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you ask yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you ask yesterday? = Hôm qua bạn có ask không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she asks, yesterday she ______.",
      "options": [
        "asked",
        "asking",
        "ask",
        "asks"
      ],
      "answer": "asked",
      "explanation": "Today she asks, yesterday she asked."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"answer\":",
      "options": [
        "answer",
        "answering",
        "answers",
        "answered"
      ],
      "answer": "answered",
      "explanation": "answer → answered (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ the teacher. (answer)",
      "options": [
        "answers",
        "answering",
        "answer",
        "answered"
      ],
      "answer": "answered",
      "explanation": "Yesterday, she answered the teacher."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ the teacher. (answer)",
      "answers": [
        "answered"
      ],
      "explanation": "Yesterday, I answered the teacher."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ answer yesterday. (không)",
      "options": [
        "wasn't",
        "don't",
        "doesn't",
        "didn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't answer yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you answer yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you answer yesterday? = Hôm qua bạn có answer không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she answers, yesterday she ______.",
      "options": [
        "answered",
        "answers",
        "answer",
        "answering"
      ],
      "answer": "answered",
      "explanation": "Today she answers, yesterday she answered."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"call\":",
      "options": [
        "called",
        "calls",
        "calling",
        "call"
      ],
      "answer": "called",
      "explanation": "call → called (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ her mother. (call)",
      "options": [
        "calls",
        "call",
        "calling",
        "called"
      ],
      "answer": "called",
      "explanation": "Yesterday, she called her mother."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ her mother. (call)",
      "answers": [
        "called"
      ],
      "explanation": "Yesterday, I called her mother."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ call yesterday. (không)",
      "options": [
        "wasn't",
        "didn't",
        "doesn't",
        "don't"
      ],
      "answer": "didn't",
      "explanation": "She didn't call yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you call yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you call yesterday? = Hôm qua bạn có call không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she calls, yesterday she ______.",
      "options": [
        "calling",
        "calls",
        "called",
        "call"
      ],
      "answer": "called",
      "explanation": "Today she calls, yesterday she called."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"want\":",
      "options": [
        "wanting",
        "wants",
        "wanted",
        "want"
      ],
      "answer": "wanted",
      "explanation": "want → wanted (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ a new bike. (want)",
      "options": [
        "wanting",
        "wanted",
        "wants",
        "want"
      ],
      "answer": "wanted",
      "explanation": "Yesterday, she wanted a new bike."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ a new bike. (want)",
      "answers": [
        "wanted"
      ],
      "explanation": "Yesterday, I wanted a new bike."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ want yesterday. (không)",
      "options": [
        "doesn't",
        "wasn't",
        "didn't",
        "don't"
      ],
      "answer": "didn't",
      "explanation": "She didn't want yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you want yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you want yesterday? = Hôm qua bạn có want không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she wants, yesterday she ______.",
      "options": [
        "wanted",
        "wanting",
        "wants",
        "want"
      ],
      "answer": "wanted",
      "explanation": "Today she wants, yesterday she wanted."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"need\":",
      "options": [
        "needing",
        "needed",
        "needs",
        "need"
      ],
      "answer": "needed",
      "explanation": "need → needed (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ some water. (need)",
      "options": [
        "needed",
        "needs",
        "need",
        "needing"
      ],
      "answer": "needed",
      "explanation": "Yesterday, she needed some water."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ some water. (need)",
      "answers": [
        "needed"
      ],
      "explanation": "Yesterday, I needed some water."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ need yesterday. (không)",
      "options": [
        "didn't",
        "wasn't",
        "don't",
        "doesn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't need yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you need yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you need yesterday? = Hôm qua bạn có need không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she needs, yesterday she ______.",
      "options": [
        "needed",
        "need",
        "needs",
        "needing"
      ],
      "answer": "needed",
      "explanation": "Today she needs, yesterday she needed."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"start\":",
      "options": [
        "started",
        "start",
        "starts",
        "starting"
      ],
      "answer": "started",
      "explanation": "start → started (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ a new book. (start)",
      "options": [
        "starting",
        "started",
        "starts",
        "start"
      ],
      "answer": "started",
      "explanation": "Yesterday, she started a new book."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ a new book. (start)",
      "answers": [
        "started"
      ],
      "explanation": "Yesterday, I started a new book."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ start yesterday. (không)",
      "options": [
        "didn't",
        "doesn't",
        "don't",
        "wasn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't start yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you start yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you start yesterday? = Hôm qua bạn có start không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she starts, yesterday she ______.",
      "options": [
        "starts",
        "started",
        "starting",
        "start"
      ],
      "answer": "started",
      "explanation": "Today she starts, yesterday she started."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"finish\":",
      "options": [
        "finish",
        "finishs",
        "finished",
        "finishing"
      ],
      "answer": "finished",
      "explanation": "finish → finished (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ her homework. (finish)",
      "options": [
        "finish",
        "finished",
        "finishs",
        "finishing"
      ],
      "answer": "finished",
      "explanation": "Yesterday, she finished her homework."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ her homework. (finish)",
      "answers": [
        "finished"
      ],
      "explanation": "Yesterday, I finished her homework."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ finish yesterday. (không)",
      "options": [
        "didn't",
        "doesn't",
        "don't",
        "wasn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't finish yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you finish yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you finish yesterday? = Hôm qua bạn có finish không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she finishs, yesterday she ______.",
      "options": [
        "finishs",
        "finishing",
        "finished",
        "finish"
      ],
      "answer": "finished",
      "explanation": "Today she finishs, yesterday she finished."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"paint\":",
      "options": [
        "painted",
        "paint",
        "painting",
        "paints"
      ],
      "answer": "painted",
      "explanation": "paint → painted (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ a picture. (paint)",
      "options": [
        "paints",
        "paint",
        "painted",
        "painting"
      ],
      "answer": "painted",
      "explanation": "Yesterday, she painted a picture."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ a picture. (paint)",
      "answers": [
        "painted"
      ],
      "explanation": "Yesterday, I painted a picture."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ paint yesterday. (không)",
      "options": [
        "wasn't",
        "don't",
        "didn't",
        "doesn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't paint yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you paint yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you paint yesterday? = Hôm qua bạn có paint không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she paints, yesterday she ______.",
      "options": [
        "painted",
        "painting",
        "paint",
        "paints"
      ],
      "answer": "painted",
      "explanation": "Today she paints, yesterday she painted."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"count\":",
      "options": [
        "counts",
        "counting",
        "counted",
        "count"
      ],
      "answer": "counted",
      "explanation": "count → counted (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ to ten. (count)",
      "options": [
        "counts",
        "count",
        "counting",
        "counted"
      ],
      "answer": "counted",
      "explanation": "Yesterday, she counted to ten."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ to ten. (count)",
      "answers": [
        "counted"
      ],
      "explanation": "Yesterday, I counted to ten."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ count yesterday. (không)",
      "options": [
        "didn't",
        "wasn't",
        "doesn't",
        "don't"
      ],
      "answer": "didn't",
      "explanation": "She didn't count yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you count yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you count yesterday? = Hôm qua bạn có count không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she counts, yesterday she ______.",
      "options": [
        "counting",
        "counted",
        "count",
        "counts"
      ],
      "answer": "counted",
      "explanation": "Today she counts, yesterday she counted."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"show\":",
      "options": [
        "showing",
        "show",
        "showed",
        "shows"
      ],
      "answer": "showed",
      "explanation": "show → showed (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ me the photo. (show)",
      "options": [
        "shows",
        "showing",
        "showed",
        "show"
      ],
      "answer": "showed",
      "explanation": "Yesterday, she showed me the photo."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ me the photo. (show)",
      "answers": [
        "showed"
      ],
      "explanation": "Yesterday, I showed me the photo."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ show yesterday. (không)",
      "options": [
        "wasn't",
        "don't",
        "didn't",
        "doesn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't show yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you show yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you show yesterday? = Hôm qua bạn có show không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she shows, yesterday she ______.",
      "options": [
        "showed",
        "show",
        "shows",
        "showing"
      ],
      "answer": "showed",
      "explanation": "Today she shows, yesterday she showed."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng quá khứ đúng của \"use\":",
      "options": [
        "using",
        "use",
        "used",
        "uses"
      ],
      "answer": "used",
      "explanation": "use → used (quá khứ đơn có quy tắc)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______ a pen. (use)",
      "options": [
        "using",
        "uses",
        "use",
        "used"
      ],
      "answer": "used",
      "explanation": "Yesterday, she used a pen."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Yesterday, I ______ a pen. (use)",
      "answers": [
        "used"
      ],
      "explanation": "Yesterday, I used a pen."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ use yesterday. (không)",
      "options": [
        "wasn't",
        "don't",
        "didn't",
        "doesn't"
      ],
      "answer": "didn't",
      "explanation": "She didn't use yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền trợ động từ: ______ you use yesterday?",
      "answers": [
        "did"
      ],
      "explanation": "Did you use yesterday? = Hôm qua bạn có use không?"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Today she uses, yesterday she ______.",
      "options": [
        "use",
        "uses",
        "used",
        "using"
      ],
      "answer": "used",
      "explanation": "Today she uses, yesterday she used."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Last night, she ______ at home. (work)",
      "options": [
        "work",
        "working",
        "worked",
        "works"
      ],
      "answer": "worked",
      "explanation": "Last night, she worked at home."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Last night, I ______ at home. (work)",
      "answers": [
        "worked"
      ],
      "explanation": "Last night, I worked at home."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Last night, she ______ TV. (watch)",
      "options": [
        "watch",
        "watched",
        "watches",
        "watching"
      ],
      "answer": "watched",
      "explanation": "Last night, she watched TV."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Last night, I ______ TV. (watch)",
      "answers": [
        "watched"
      ],
      "explanation": "Last night, I watched TV."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Last night, she ______ her grandmother. (visit)",
      "options": [
        "visits",
        "visiting",
        "visited",
        "visit"
      ],
      "answer": "visited",
      "explanation": "Last night, she visited her grandmother."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Last night, I ______ her grandmother. (visit)",
      "answers": [
        "visited"
      ],
      "explanation": "Last night, I visited her grandmother."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Last night, she ______ English. (study)",
      "options": [
        "studying",
        "studies",
        "study",
        "studied"
      ],
      "answer": "studied",
      "explanation": "Last night, she studied English."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Last night, I ______ English. (study)",
      "answers": [
        "studied"
      ],
      "explanation": "Last night, I studied English."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Last night, she ______ football. (play)",
      "options": [
        "played",
        "play",
        "playing",
        "plays"
      ],
      "answer": "played",
      "explanation": "Last night, she played football."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Last night, I ______ football. (play)",
      "answers": [
        "played"
      ],
      "explanation": "Last night, I played football."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Last night, she ______ at the shop. (stop)",
      "options": [
        "stopped",
        "stopping",
        "stop",
        "stops"
      ],
      "answer": "stopped",
      "explanation": "Last night, she stopped at the shop."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Last night, I ______ at the shop. (stop)",
      "answers": [
        "stopped"
      ],
      "explanation": "Last night, I stopped at the shop."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Last night, she ______ a trip. (plan)",
      "options": [
        "plan",
        "plans",
        "planned",
        "planning"
      ],
      "answer": "planned",
      "explanation": "Last night, she planned a trip."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Last night, I ______ a trip. (plan)",
      "answers": [
        "planned"
      ],
      "explanation": "Last night, I planned a trip."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Last night, she ______ at the picture. (look)",
      "options": [
        "looking",
        "looked",
        "look",
        "looks"
      ],
      "answer": "looked",
      "explanation": "Last night, she looked at the picture."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Last night, I ______ at the picture. (look)",
      "answers": [
        "looked"
      ],
      "explanation": "Last night, I looked at the picture."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Last night, she ______ dinner. (cook)",
      "options": [
        "cooks",
        "cook",
        "cooked",
        "cooking"
      ],
      "answer": "cooked",
      "explanation": "Last night, she cooked dinner."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Last night, I ______ dinner. (cook)",
      "answers": [
        "cooked"
      ],
      "explanation": "Last night, I cooked dinner."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: She ______ visit her grandmother yesterday.",
      "options": [
        "wasn't",
        "don't",
        "doesn’t",
        "didn't"
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
        "đã thấy",
        "đã đi",
        "đã cho/tặng",
        "đã uống"
      ],
      "answer": "đã đi",
      "explanation": "go → went = đã đi."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: They ______ to Da Nang last summer. (đã đi)",
      "answers": [
        "went"
      ],
      "explanation": "Câu đầy đủ: They went to Da Nang last summer."
    },
    {
      "type": "choice",
      "prompt": "\"see → saw\" có nghĩa là gì?",
      "options": [
        "đã mua",
        "đã lấy/chụp",
        "đã cho/tặng",
        "đã thấy"
      ],
      "answer": "đã thấy",
      "explanation": "see → saw = đã thấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ a good film yesterday. (đã thấy)",
      "answers": [
        "saw"
      ],
      "explanation": "Câu đầy đủ: I saw a good film yesterday."
    },
    {
      "type": "choice",
      "prompt": "\"buy → bought\" có nghĩa là gì?",
      "options": [
        "đã đi",
        "đã ăn",
        "đã mua",
        "đã thấy"
      ],
      "answer": "đã mua",
      "explanation": "buy → bought = đã mua."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ a new book last week. (đã mua)",
      "answers": [
        "bought"
      ],
      "explanation": "Câu đầy đủ: She bought a new book last week."
    },
    {
      "type": "choice",
      "prompt": "\"eat → ate\" có nghĩa là gì?",
      "options": [
        "đã ăn",
        "đã tìm thấy",
        "đã cho/tặng",
        "đã uống"
      ],
      "answer": "đã ăn",
      "explanation": "eat → ate = đã ăn."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ an apple for lunch. (đã ăn)",
      "answers": [
        "ate"
      ],
      "explanation": "Câu đầy đủ: He ate an apple for lunch."
    },
    {
      "type": "choice",
      "prompt": "\"drink → drank\" có nghĩa là gì?",
      "options": [
        "đã uống",
        "đã ăn",
        "đã đi",
        "đã lấy/chụp"
      ],
      "answer": "đã uống",
      "explanation": "drink → drank = đã uống."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ milk yesterday. (đã uống)",
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
        "đã tìm thấy",
        "đã ăn",
        "đã thấy"
      ],
      "answer": "đã lấy/chụp",
      "explanation": "take → took = đã lấy/chụp."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: We ______ photos yesterday. (đã lấy/chụp)",
      "answers": [
        "took"
      ],
      "explanation": "Câu đầy đủ: We took photos yesterday."
    },
    {
      "type": "choice",
      "prompt": "\"give → gave\" có nghĩa là gì?",
      "options": [
        "đã thấy",
        "đã ăn",
        "đã cho/tặng",
        "đã tìm thấy"
      ],
      "answer": "đã cho/tặng",
      "explanation": "give → gave = đã cho/tặng."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: My father ______ me a pen. (đã cho/tặng)",
      "answers": [
        "gave"
      ],
      "explanation": "Câu đầy đủ: My father gave me a pen."
    },
    {
      "type": "choice",
      "prompt": "\"find → found\" có nghĩa là gì?",
      "options": [
        "đã mua",
        "đã đi",
        "đã lấy/chụp",
        "đã tìm thấy"
      ],
      "answer": "đã tìm thấy",
      "explanation": "find → found = đã tìm thấy."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ her key. (đã tìm thấy)",
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
        "caught",
        "was / were",
        "took",
        "went"
      ],
      "answer": "was / were",
      "explanation": "be → was / were (là, thì, ở)."
    },
    {
      "type": "choice",
      "prompt": "\"was / were\" là quá khứ của động từ nào?",
      "options": [
        "keep",
        "hurt",
        "speak",
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (be)",
      "options": [
        "spoke",
        "be",
        "was",
        "been"
      ],
      "answer": "was",
      "explanation": "Yesterday, she was (be)."
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"become\" là gì?",
      "options": [
        "became",
        "chose",
        "gave",
        "shut"
      ],
      "answer": "became",
      "explanation": "become → became (trở nên)."
    },
    {
      "type": "choice",
      "prompt": "\"became\" là quá khứ của động từ nào?",
      "options": [
        "choose",
        "become",
        "shut",
        "pay"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (become)",
      "options": [
        "became",
        "become",
        "hold",
        "knew"
      ],
      "answer": "became",
      "explanation": "Yesterday, she became (become)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (become)",
      "options": [
        "buy",
        "became",
        "knew",
        "become"
      ],
      "answer": "become",
      "explanation": "She didn't become yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"begin\" là gì?",
      "options": [
        "began",
        "gave",
        "sang",
        "understood"
      ],
      "answer": "began",
      "explanation": "begin → began (bắt đầu)."
    },
    {
      "type": "choice",
      "prompt": "\"began\" là quá khứ của động từ nào?",
      "options": [
        "sing",
        "give",
        "begin",
        "think"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (begin)",
      "options": [
        "began",
        "went",
        "begun",
        "begin"
      ],
      "answer": "began",
      "explanation": "Yesterday, she began (begin)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (begin)",
      "options": [
        "began",
        "went",
        "begun",
        "begin"
      ],
      "answer": "begin",
      "explanation": "She didn't begin yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"break\" là gì?",
      "options": [
        "saw",
        "wrote",
        "broke",
        "brought"
      ],
      "answer": "broke",
      "explanation": "break → broke (làm vỡ)."
    },
    {
      "type": "choice",
      "prompt": "\"broke\" là quá khứ của động từ nào?",
      "options": [
        "hit",
        "break",
        "cut",
        "dream"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (break)",
      "options": [
        "lost",
        "break",
        "broken",
        "broke"
      ],
      "answer": "broke",
      "explanation": "Yesterday, she broke (break)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (break)",
      "options": [
        "lost",
        "broken",
        "broke",
        "break"
      ],
      "answer": "break",
      "explanation": "She didn't break yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"bring\" là gì?",
      "options": [
        "forgot",
        "brought",
        "knew",
        "lost"
      ],
      "answer": "brought",
      "explanation": "bring → brought (mang đến)."
    },
    {
      "type": "choice",
      "prompt": "\"brought\" là quá khứ của động từ nào?",
      "options": [
        "bring",
        "tell",
        "sell",
        "teach"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (bring)",
      "options": [
        "ate",
        "went",
        "brought",
        "bring"
      ],
      "answer": "brought",
      "explanation": "Yesterday, she brought (bring)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (bring)",
      "options": [
        "went",
        "bring",
        "brought",
        "come"
      ],
      "answer": "bring",
      "explanation": "She didn't bring yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"build\" là gì?",
      "options": [
        "built",
        "understood",
        "rode",
        "fought"
      ],
      "answer": "built",
      "explanation": "build → built (xây, dựng)."
    },
    {
      "type": "choice",
      "prompt": "\"built\" là quá khứ của động từ nào?",
      "options": [
        "catch",
        "wake",
        "build",
        "lose"
      ],
      "answer": "build",
      "explanation": "build → built (xây, dựng)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (build).",
      "answers": [
        "built"
      ],
      "explanation": "Yesterday, she built (build)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (build)",
      "options": [
        "build",
        "built",
        "left",
        "hide"
      ],
      "answer": "built",
      "explanation": "Yesterday, she built (build)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (build)",
      "options": [
        "build",
        "caught",
        "left",
        "built"
      ],
      "answer": "build",
      "explanation": "She didn't build yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"buy\" là gì?",
      "options": [
        "bought",
        "sold",
        "sang",
        "read"
      ],
      "answer": "bought",
      "explanation": "buy → bought (mua)."
    },
    {
      "type": "choice",
      "prompt": "\"bought\" là quá khứ của động từ nào?",
      "options": [
        "say",
        "buy",
        "stand",
        "think"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (buy)",
      "options": [
        "buy",
        "bought",
        "kept",
        "hit"
      ],
      "answer": "bought",
      "explanation": "Yesterday, she bought (buy)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (buy)",
      "options": [
        "wake",
        "buy",
        "hit",
        "bought"
      ],
      "answer": "buy",
      "explanation": "She didn't buy yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"catch\" là gì?",
      "options": [
        "caught",
        "left",
        "hit",
        "grew"
      ],
      "answer": "caught",
      "explanation": "catch → caught (bắt, đón)."
    },
    {
      "type": "choice",
      "prompt": "\"caught\" là quá khứ của động từ nào?",
      "options": [
        "build",
        "leave",
        "catch",
        "fight"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (catch)",
      "options": [
        "write",
        "catch",
        "caught",
        "paid"
      ],
      "answer": "caught",
      "explanation": "Yesterday, she caught (catch)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (catch)",
      "options": [
        "spoken",
        "paid",
        "caught",
        "catch"
      ],
      "answer": "catch",
      "explanation": "She didn't catch yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"choose\" là gì?",
      "options": [
        "found",
        "chose",
        "met",
        "saw"
      ],
      "answer": "chose",
      "explanation": "choose → chose (chọn)."
    },
    {
      "type": "choice",
      "prompt": "\"chose\" là quá khứ của động từ nào?",
      "options": [
        "come",
        "keep",
        "choose",
        "do"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (choose)",
      "options": [
        "sang",
        "chose",
        "chosen",
        "choose"
      ],
      "answer": "chose",
      "explanation": "Yesterday, she chose (choose)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (choose)",
      "options": [
        "chosen",
        "sang",
        "chose",
        "choose"
      ],
      "answer": "choose",
      "explanation": "She didn't choose yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"come\" là gì?",
      "options": [
        "let",
        "stood",
        "slept",
        "came"
      ],
      "answer": "came",
      "explanation": "come → came (đến)."
    },
    {
      "type": "choice",
      "prompt": "\"came\" là quá khứ của động từ nào?",
      "options": [
        "fall",
        "sing",
        "come",
        "say"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (come)",
      "options": [
        "come",
        "came",
        "wore",
        "send"
      ],
      "answer": "came",
      "explanation": "Yesterday, she came (come)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (come)",
      "options": [
        "wore",
        "come",
        "came",
        "began"
      ],
      "answer": "come",
      "explanation": "She didn't come yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"cost\" là gì?",
      "options": [
        "sent",
        "cost",
        "went",
        "began"
      ],
      "answer": "cost",
      "explanation": "cost → cost (tốn, giá)."
    },
    {
      "type": "choice",
      "prompt": "\"cost\" là quá khứ của động từ nào?",
      "options": [
        "dream",
        "shut",
        "cost",
        "hold"
      ],
      "answer": "cost",
      "explanation": "cost → cost (tốn, giá)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (cost).",
      "answers": [
        "cost"
      ],
      "explanation": "Yesterday, she cost (cost)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (cost)",
      "options": [
        "know",
        "cost",
        "did",
        "said"
      ],
      "answer": "cost",
      "explanation": "Yesterday, she cost (cost)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (cost)",
      "options": [
        "did",
        "tell",
        "understood",
        "cost"
      ],
      "answer": "cost",
      "explanation": "She didn't cost yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"cut\" là gì?",
      "options": [
        "broke",
        "cut",
        "did",
        "won"
      ],
      "answer": "cut",
      "explanation": "cut → cut (cắt)."
    },
    {
      "type": "choice",
      "prompt": "\"cut\" là quá khứ của động từ nào?",
      "options": [
        "cut",
        "do",
        "hold",
        "leave"
      ],
      "answer": "cut",
      "explanation": "cut → cut (cắt)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (cut).",
      "answers": [
        "cut"
      ],
      "explanation": "Yesterday, she cut (cut)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (cut)",
      "options": [
        "cut",
        "paid",
        "taken",
        "pay"
      ],
      "answer": "cut",
      "explanation": "Yesterday, she cut (cut)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (cut)",
      "options": [
        "taught",
        "flew",
        "cut",
        "paid"
      ],
      "answer": "cut",
      "explanation": "She didn't cut yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"do\" là gì?",
      "options": [
        "broke",
        "got",
        "wrote",
        "did"
      ],
      "answer": "did",
      "explanation": "do → did (làm)."
    },
    {
      "type": "choice",
      "prompt": "\"did\" là quá khứ của động từ nào?",
      "options": [
        "do",
        "meet",
        "sit",
        "go"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (do)",
      "options": [
        "done",
        "do",
        "did",
        "found"
      ],
      "answer": "did",
      "explanation": "Yesterday, she did (do)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (do)",
      "options": [
        "done",
        "do",
        "found",
        "did"
      ],
      "answer": "do",
      "explanation": "She didn't do yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"dream\" là gì?",
      "options": [
        "got",
        "spoke",
        "cost",
        "dreamt"
      ],
      "answer": "dreamt",
      "explanation": "dream → dreamt (mơ)."
    },
    {
      "type": "choice",
      "prompt": "\"dreamt\" là quá khứ của động từ nào?",
      "options": [
        "go",
        "build",
        "take",
        "dream"
      ],
      "answer": "dream",
      "explanation": "dream → dreamt (mơ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (dream).",
      "answers": [
        "dreamt"
      ],
      "explanation": "Yesterday, she dreamt (dream)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (dream)",
      "options": [
        "dreamt",
        "dream",
        "drank",
        "put"
      ],
      "answer": "dreamt",
      "explanation": "Yesterday, she dreamt (dream)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (dream)",
      "options": [
        "drank",
        "woken",
        "dream",
        "dreamt"
      ],
      "answer": "dream",
      "explanation": "She didn't dream yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"drink\" là gì?",
      "options": [
        "lost",
        "sold",
        "won",
        "drank"
      ],
      "answer": "drank",
      "explanation": "drink → drank (uống)."
    },
    {
      "type": "choice",
      "prompt": "\"drank\" là quá khứ của động từ nào?",
      "options": [
        "drink",
        "buy",
        "set",
        "feed"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (drink)",
      "options": [
        "became",
        "drank",
        "drink",
        "drunk"
      ],
      "answer": "drank",
      "explanation": "Yesterday, she drank (drink)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (drink)",
      "options": [
        "became",
        "drank",
        "drink",
        "drunk"
      ],
      "answer": "drink",
      "explanation": "She didn't drink yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"drive\" là gì?",
      "options": [
        "sent",
        "forgot",
        "ran",
        "drove"
      ],
      "answer": "drove",
      "explanation": "drive → drove (lái xe)."
    },
    {
      "type": "choice",
      "prompt": "\"drove\" là quá khứ của động từ nào?",
      "options": [
        "drive",
        "lose",
        "know",
        "read"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (drive)",
      "options": [
        "driven",
        "drove",
        "drive",
        "did"
      ],
      "answer": "drove",
      "explanation": "Yesterday, she drove (drive)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (drive)",
      "options": [
        "did",
        "driven",
        "drove",
        "drive"
      ],
      "answer": "drive",
      "explanation": "She didn't drive yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"eat\" là gì?",
      "options": [
        "drank",
        "ate",
        "told",
        "let"
      ],
      "answer": "ate",
      "explanation": "eat → ate (ăn)."
    },
    {
      "type": "choice",
      "prompt": "\"ate\" là quá khứ của động từ nào?",
      "options": [
        "begin",
        "eat",
        "wear",
        "read"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (eat)",
      "options": [
        "ate",
        "cut",
        "eat",
        "eaten"
      ],
      "answer": "ate",
      "explanation": "Yesterday, she ate (eat)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (eat)",
      "options": [
        "eat",
        "cut",
        "eaten",
        "ate"
      ],
      "answer": "eat",
      "explanation": "She didn't eat yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"fall\" là gì?",
      "options": [
        "met",
        "wore",
        "lost",
        "fell"
      ],
      "answer": "fell",
      "explanation": "fall → fell (ngã)."
    },
    {
      "type": "choice",
      "prompt": "\"fell\" là quá khứ của động từ nào?",
      "options": [
        "wake",
        "ride",
        "hit",
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (fall)",
      "options": [
        "fell",
        "fall",
        "said",
        "fallen"
      ],
      "answer": "fell",
      "explanation": "Yesterday, she fell (fall)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (fall)",
      "options": [
        "fallen",
        "said",
        "fall",
        "fell"
      ],
      "answer": "fall",
      "explanation": "She didn't fall yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"feed\" là gì?",
      "options": [
        "came",
        "fed",
        "broke",
        "said"
      ],
      "answer": "fed",
      "explanation": "feed → fed (cho ăn)."
    },
    {
      "type": "choice",
      "prompt": "\"fed\" là quá khứ của động từ nào?",
      "options": [
        "feed",
        "fall",
        "win",
        "set"
      ],
      "answer": "feed",
      "explanation": "feed → fed (cho ăn)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (feed).",
      "answers": [
        "fed"
      ],
      "explanation": "Yesterday, she fed (feed)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (feed)",
      "options": [
        "hid",
        "grown",
        "feed",
        "fed"
      ],
      "answer": "fed",
      "explanation": "Yesterday, she fed (feed)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (feed)",
      "options": [
        "fed",
        "feed",
        "hid",
        "build"
      ],
      "answer": "feed",
      "explanation": "She didn't feed yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"feel\" là gì?",
      "options": [
        "slept",
        "drove",
        "felt",
        "left"
      ],
      "answer": "felt",
      "explanation": "feel → felt (cảm thấy)."
    },
    {
      "type": "choice",
      "prompt": "\"felt\" là quá khứ của động từ nào?",
      "options": [
        "swim",
        "cut",
        "read",
        "feel"
      ],
      "answer": "feel",
      "explanation": "feel → felt (cảm thấy)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (feel).",
      "answers": [
        "felt"
      ],
      "explanation": "Yesterday, she felt (feel)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (feel)",
      "options": [
        "found",
        "felt",
        "ate",
        "feel"
      ],
      "answer": "felt",
      "explanation": "Yesterday, she felt (feel)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (feel)",
      "options": [
        "ate",
        "write",
        "felt",
        "feel"
      ],
      "answer": "feel",
      "explanation": "She didn't feel yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"find\" là gì?",
      "options": [
        "sang",
        "found",
        "forgot",
        "hit"
      ],
      "answer": "found",
      "explanation": "find → found (tìm thấy)."
    },
    {
      "type": "choice",
      "prompt": "\"found\" là quá khứ của động từ nào?",
      "options": [
        "bring",
        "find",
        "swim",
        "fight"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (find)",
      "options": [
        "find",
        "found",
        "lost",
        "put"
      ],
      "answer": "found",
      "explanation": "Yesterday, she found (find)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (find)",
      "options": [
        "lost",
        "found",
        "know",
        "find"
      ],
      "answer": "find",
      "explanation": "She didn't find yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"fight\" là gì?",
      "options": [
        "wore",
        "put",
        "fought",
        "set"
      ],
      "answer": "fought",
      "explanation": "fight → fought (đánh nhau)."
    },
    {
      "type": "choice",
      "prompt": "\"fought\" là quá khứ của động từ nào?",
      "options": [
        "choose",
        "fall",
        "dream",
        "fight"
      ],
      "answer": "fight",
      "explanation": "fight → fought (đánh nhau)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (fight).",
      "answers": [
        "fought"
      ],
      "explanation": "Yesterday, she fought (fight)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (fight)",
      "options": [
        "caught",
        "woke",
        "fought",
        "fight"
      ],
      "answer": "fought",
      "explanation": "Yesterday, she fought (fight)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (fight)",
      "options": [
        "fight",
        "fought",
        "woke",
        "cost"
      ],
      "answer": "fight",
      "explanation": "She didn't fight yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"fly\" là gì?",
      "options": [
        "sent",
        "rode",
        "flew",
        "knew"
      ],
      "answer": "flew",
      "explanation": "fly → flew (bay)."
    },
    {
      "type": "choice",
      "prompt": "\"flew\" là quá khứ của động từ nào?",
      "options": [
        "hide",
        "fly",
        "leave",
        "do"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (fly)",
      "options": [
        "knew",
        "flew",
        "fly",
        "flown"
      ],
      "answer": "flew",
      "explanation": "Yesterday, she flew (fly)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (fly)",
      "options": [
        "flew",
        "fly",
        "flown",
        "knew"
      ],
      "answer": "fly",
      "explanation": "She didn't fly yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"forget\" là gì?",
      "options": [
        "sold",
        "forgot",
        "kept",
        "found"
      ],
      "answer": "forgot",
      "explanation": "forget → forgot (quên)."
    },
    {
      "type": "choice",
      "prompt": "\"forgot\" là quá khứ của động từ nào?",
      "options": [
        "see",
        "forget",
        "build",
        "feed"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (forget)",
      "options": [
        "began",
        "forget",
        "forgotten",
        "forgot"
      ],
      "answer": "forgot",
      "explanation": "Yesterday, she forgot (forget)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (forget)",
      "options": [
        "forgot",
        "began",
        "forgotten",
        "forget"
      ],
      "answer": "forget",
      "explanation": "She didn't forget yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"get\" là gì?",
      "options": [
        "held",
        "told",
        "got",
        "drank"
      ],
      "answer": "got",
      "explanation": "get → got (lấy, nhận)."
    },
    {
      "type": "choice",
      "prompt": "\"got\" là quá khứ của động từ nào?",
      "options": [
        "lose",
        "know",
        "get",
        "hurt"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (get)",
      "options": [
        "get",
        "got",
        "forgotten",
        "read"
      ],
      "answer": "got",
      "explanation": "Yesterday, she got (get)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (get)",
      "options": [
        "brought",
        "get",
        "read",
        "got"
      ],
      "answer": "get",
      "explanation": "She didn't get yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"give\" là gì?",
      "options": [
        "let",
        "made",
        "held",
        "gave"
      ],
      "answer": "gave",
      "explanation": "give → gave (cho, tặng)."
    },
    {
      "type": "choice",
      "prompt": "\"gave\" là quá khứ của động từ nào?",
      "options": [
        "stand",
        "catch",
        "give",
        "write"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (give)",
      "options": [
        "given",
        "rode",
        "give",
        "gave"
      ],
      "answer": "gave",
      "explanation": "Yesterday, she gave (give)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (give)",
      "options": [
        "give",
        "gave",
        "rode",
        "given"
      ],
      "answer": "give",
      "explanation": "She didn't give yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"go\" là gì?",
      "options": [
        "went",
        "held",
        "drank",
        "became"
      ],
      "answer": "went",
      "explanation": "go → went (đi)."
    },
    {
      "type": "choice",
      "prompt": "\"went\" là quá khứ của động từ nào?",
      "options": [
        "hear",
        "become",
        "go",
        "say"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (go)",
      "options": [
        "go",
        "went",
        "swam",
        "gone"
      ],
      "answer": "went",
      "explanation": "Yesterday, she went (go)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (go)",
      "options": [
        "went",
        "swam",
        "gone",
        "go"
      ],
      "answer": "go",
      "explanation": "She didn't go yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"grow\" là gì?",
      "options": [
        "kept",
        "gave",
        "caught",
        "grew"
      ],
      "answer": "grew",
      "explanation": "grow → grew (lớn lên, trồng)."
    },
    {
      "type": "choice",
      "prompt": "\"grew\" là quá khứ của động từ nào?",
      "options": [
        "get",
        "build",
        "grow",
        "choose"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (grow)",
      "options": [
        "grow",
        "cut",
        "grown",
        "grew"
      ],
      "answer": "grew",
      "explanation": "Yesterday, she grew (grow)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (grow)",
      "options": [
        "grew",
        "grown",
        "cut",
        "grow"
      ],
      "answer": "grow",
      "explanation": "She didn't grow yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"hear\" là gì?",
      "options": [
        "spent",
        "heard",
        "lost",
        "gave"
      ],
      "answer": "heard",
      "explanation": "hear → heard (nghe)."
    },
    {
      "type": "choice",
      "prompt": "\"heard\" là quá khứ của động từ nào?",
      "options": [
        "forget",
        "hear",
        "come",
        "become"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (hear)",
      "options": [
        "heard",
        "run",
        "took",
        "hear"
      ],
      "answer": "heard",
      "explanation": "Yesterday, she heard (hear)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (hear)",
      "options": [
        "hear",
        "spoken",
        "took",
        "heard"
      ],
      "answer": "hear",
      "explanation": "She didn't hear yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"hide\" là gì?",
      "options": [
        "fed",
        "hid",
        "hurt",
        "drove"
      ],
      "answer": "hid",
      "explanation": "hide → hid (trốn, giấu)."
    },
    {
      "type": "choice",
      "prompt": "\"hid\" là quá khứ của động từ nào?",
      "options": [
        "hide",
        "sell",
        "teach",
        "drive"
      ],
      "answer": "hide",
      "explanation": "hide → hid (trốn, giấu)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (hide).",
      "answers": [
        "hid"
      ],
      "explanation": "Yesterday, she hid (hide)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (hide)",
      "options": [
        "fed",
        "hidden",
        "hid",
        "hide"
      ],
      "answer": "hid",
      "explanation": "Yesterday, she hid (hide)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (hide)",
      "options": [
        "hide",
        "fed",
        "hid",
        "hidden"
      ],
      "answer": "hide",
      "explanation": "She didn't hide yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"hit\" là gì?",
      "options": [
        "hit",
        "fell",
        "won",
        "sang"
      ],
      "answer": "hit",
      "explanation": "hit → hit (đánh trúng)."
    },
    {
      "type": "choice",
      "prompt": "\"hit\" là quá khứ của động từ nào?",
      "options": [
        "hit",
        "lose",
        "write",
        "read"
      ],
      "answer": "hit",
      "explanation": "hit → hit (đánh trúng)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (hit).",
      "answers": [
        "hit"
      ],
      "explanation": "Yesterday, she hit (hit)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (hit)",
      "options": [
        "cut",
        "hit",
        "flew",
        "forget"
      ],
      "answer": "hit",
      "explanation": "Yesterday, she hit (hit)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (hit)",
      "options": [
        "flew",
        "get",
        "hit",
        "found"
      ],
      "answer": "hit",
      "explanation": "She didn't hit yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"hold\" là gì?",
      "options": [
        "held",
        "came",
        "chose",
        "sang"
      ],
      "answer": "held",
      "explanation": "hold → held (cầm, nắm)."
    },
    {
      "type": "choice",
      "prompt": "\"held\" là quá khứ của động từ nào?",
      "options": [
        "hold",
        "forget",
        "catch",
        "think"
      ],
      "answer": "hold",
      "explanation": "hold → held (cầm, nắm)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (hold).",
      "answers": [
        "held"
      ],
      "explanation": "Yesterday, she held (hold)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (hold)",
      "options": [
        "was",
        "hold",
        "held",
        "swam"
      ],
      "answer": "held",
      "explanation": "Yesterday, she held (hold)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (hold)",
      "options": [
        "pay",
        "swam",
        "held",
        "hold"
      ],
      "answer": "hold",
      "explanation": "She didn't hold yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"hurt\" là gì?",
      "options": [
        "put",
        "fed",
        "hurt",
        "understood"
      ],
      "answer": "hurt",
      "explanation": "hurt → hurt (làm đau)."
    },
    {
      "type": "choice",
      "prompt": "\"hurt\" là quá khứ của động từ nào?",
      "options": [
        "see",
        "bring",
        "ride",
        "hurt"
      ],
      "answer": "hurt",
      "explanation": "hurt → hurt (làm đau)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (hurt).",
      "answers": [
        "hurt"
      ],
      "explanation": "Yesterday, she hurt (hurt)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (hurt)",
      "options": [
        "hurt",
        "forget",
        "paid",
        "did"
      ],
      "answer": "hurt",
      "explanation": "Yesterday, she hurt (hurt)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (hurt)",
      "options": [
        "stood",
        "did",
        "say",
        "hurt"
      ],
      "answer": "hurt",
      "explanation": "She didn't hurt yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"know\" là gì?",
      "options": [
        "kept",
        "thought",
        "flew",
        "knew"
      ],
      "answer": "knew",
      "explanation": "know → knew (biết)."
    },
    {
      "type": "choice",
      "prompt": "\"knew\" là quá khứ của động từ nào?",
      "options": [
        "begin",
        "know",
        "give",
        "let"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (know)",
      "options": [
        "ran",
        "knew",
        "know",
        "known"
      ],
      "answer": "knew",
      "explanation": "Yesterday, she knew (know)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (know)",
      "options": [
        "known",
        "know",
        "knew",
        "ran"
      ],
      "answer": "know",
      "explanation": "She didn't know yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"keep\" là gì?",
      "options": [
        "drove",
        "sang",
        "kept",
        "wore"
      ],
      "answer": "kept",
      "explanation": "keep → kept (giữ)."
    },
    {
      "type": "choice",
      "prompt": "\"kept\" là quá khứ của động từ nào?",
      "options": [
        "hurt",
        "sleep",
        "make",
        "keep"
      ],
      "answer": "keep",
      "explanation": "keep → kept (giữ)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (keep).",
      "answers": [
        "kept"
      ],
      "explanation": "Yesterday, she kept (keep)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (keep)",
      "options": [
        "kept",
        "keep",
        "said",
        "brought"
      ],
      "answer": "kept",
      "explanation": "Yesterday, she kept (keep)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (keep)",
      "options": [
        "keep",
        "said",
        "kept",
        "dreamt"
      ],
      "answer": "keep",
      "explanation": "She didn't keep yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"leave\" là gì?",
      "options": [
        "hurt",
        "cost",
        "held",
        "left"
      ],
      "answer": "left",
      "explanation": "leave → left (rời đi, để lại)."
    },
    {
      "type": "choice",
      "prompt": "\"left\" là quá khứ của động từ nào?",
      "options": [
        "leave",
        "take",
        "cut",
        "find"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (leave)",
      "options": [
        "leave",
        "be",
        "left",
        "began"
      ],
      "answer": "left",
      "explanation": "Yesterday, she left (leave)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (leave)",
      "options": [
        "left",
        "let",
        "leave",
        "began"
      ],
      "answer": "leave",
      "explanation": "She didn't leave yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"lend\" là gì?",
      "options": [
        "won",
        "lent",
        "wrote",
        "became"
      ],
      "answer": "lent",
      "explanation": "lend → lent (cho mượn)."
    },
    {
      "type": "choice",
      "prompt": "\"lent\" là quá khứ của động từ nào?",
      "options": [
        "read",
        "lose",
        "ride",
        "lend"
      ],
      "answer": "lend",
      "explanation": "lend → lent (cho mượn)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (lend).",
      "answers": [
        "lent"
      ],
      "explanation": "Yesterday, she lent (lend)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (lend)",
      "options": [
        "was",
        "hit",
        "lent",
        "lend"
      ],
      "answer": "lent",
      "explanation": "Yesterday, she lent (lend)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (lend)",
      "options": [
        "was",
        "lent",
        "meet",
        "lend"
      ],
      "answer": "lend",
      "explanation": "She didn't lend yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"let\" là gì?",
      "options": [
        "paid",
        "forgot",
        "drove",
        "let"
      ],
      "answer": "let",
      "explanation": "let → let (để cho)."
    },
    {
      "type": "choice",
      "prompt": "\"let\" là quá khứ của động từ nào?",
      "options": [
        "sell",
        "pay",
        "write",
        "let"
      ],
      "answer": "let",
      "explanation": "let → let (để cho)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (let).",
      "answers": [
        "let"
      ],
      "explanation": "Yesterday, she let (let)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (let)",
      "options": [
        "let",
        "swam",
        "hear",
        "spent"
      ],
      "answer": "let",
      "explanation": "Yesterday, she let (let)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (let)",
      "options": [
        "run",
        "drunk",
        "let",
        "swam"
      ],
      "answer": "let",
      "explanation": "She didn't let yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"lose\" là gì?",
      "options": [
        "brought",
        "gave",
        "thought",
        "lost"
      ],
      "answer": "lost",
      "explanation": "lose → lost (mất, thua)."
    },
    {
      "type": "choice",
      "prompt": "\"lost\" là quá khứ của động từ nào?",
      "options": [
        "send",
        "lend",
        "choose",
        "lose"
      ],
      "answer": "lose",
      "explanation": "lose → lost (mất, thua)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (lose).",
      "answers": [
        "lost"
      ],
      "explanation": "Yesterday, she lost (lose)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (lose)",
      "options": [
        "lost",
        "hit",
        "lose",
        "paid"
      ],
      "answer": "lost",
      "explanation": "Yesterday, she lost (lose)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (lose)",
      "options": [
        "paid",
        "begin",
        "lose",
        "lost"
      ],
      "answer": "lose",
      "explanation": "She didn't lose yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"make\" là gì?",
      "options": [
        "made",
        "rode",
        "took",
        "let"
      ],
      "answer": "made",
      "explanation": "make → made (làm, chế tạo)."
    },
    {
      "type": "choice",
      "prompt": "\"made\" là quá khứ của động từ nào?",
      "options": [
        "spend",
        "make",
        "bring",
        "find"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (make)",
      "options": [
        "made",
        "drove",
        "fall",
        "make"
      ],
      "answer": "made",
      "explanation": "Yesterday, she made (make)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (make)",
      "options": [
        "drove",
        "make",
        "made",
        "thought"
      ],
      "answer": "make",
      "explanation": "She didn't make yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"meet\" là gì?",
      "options": [
        "sang",
        "held",
        "bought",
        "met"
      ],
      "answer": "met",
      "explanation": "meet → met (gặp)."
    },
    {
      "type": "choice",
      "prompt": "\"met\" là quá khứ của động từ nào?",
      "options": [
        "lend",
        "give",
        "meet",
        "hear"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (meet)",
      "options": [
        "met",
        "sold",
        "meet",
        "sent"
      ],
      "answer": "met",
      "explanation": "Yesterday, she met (meet)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (meet)",
      "options": [
        "sent",
        "slept",
        "meet",
        "met"
      ],
      "answer": "meet",
      "explanation": "She didn't meet yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"pay\" là gì?",
      "options": [
        "slept",
        "paid",
        "stood",
        "lent"
      ],
      "answer": "paid",
      "explanation": "pay → paid (trả tiền)."
    },
    {
      "type": "choice",
      "prompt": "\"paid\" là quá khứ của động từ nào?",
      "options": [
        "pay",
        "meet",
        "break",
        "fly"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (pay)",
      "options": [
        "hit",
        "chose",
        "pay",
        "paid"
      ],
      "answer": "paid",
      "explanation": "Yesterday, she paid (pay)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (pay)",
      "options": [
        "pay",
        "paid",
        "sent",
        "chose"
      ],
      "answer": "pay",
      "explanation": "She didn't pay yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"put\" là gì?",
      "options": [
        "put",
        "caught",
        "bought",
        "thought"
      ],
      "answer": "put",
      "explanation": "put → put (đặt, để)."
    },
    {
      "type": "choice",
      "prompt": "\"put\" là quá khứ của động từ nào?",
      "options": [
        "wear",
        "set",
        "put",
        "buy"
      ],
      "answer": "put",
      "explanation": "put → put (đặt, để)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (put).",
      "answers": [
        "put"
      ],
      "explanation": "Yesterday, she put (put)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (put)",
      "options": [
        "made",
        "let",
        "put",
        "dreamt"
      ],
      "answer": "put",
      "explanation": "Yesterday, she put (put)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (put)",
      "options": [
        "put",
        "dreamt",
        "ride",
        "began"
      ],
      "answer": "put",
      "explanation": "She didn't put yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"read\" là gì?",
      "options": [
        "wrote",
        "read",
        "held",
        "found"
      ],
      "answer": "read",
      "explanation": "read → read (đọc)."
    },
    {
      "type": "choice",
      "prompt": "\"read\" là quá khứ của động từ nào?",
      "options": [
        "come",
        "hurt",
        "grow",
        "read"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (read)",
      "options": [
        "choose",
        "read",
        "drove",
        "paid"
      ],
      "answer": "read",
      "explanation": "Yesterday, she read (read)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (read)",
      "options": [
        "drove",
        "eaten",
        "read",
        "knew"
      ],
      "answer": "read",
      "explanation": "She didn't read yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"ride\" là gì?",
      "options": [
        "was / were",
        "rode",
        "became",
        "woke"
      ],
      "answer": "rode",
      "explanation": "ride → rode (cưỡi, đạp xe)."
    },
    {
      "type": "choice",
      "prompt": "\"rode\" là quá khứ của động từ nào?",
      "options": [
        "drink",
        "ride",
        "be",
        "teach"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (ride)",
      "options": [
        "ridden",
        "ride",
        "rode",
        "put"
      ],
      "answer": "rode",
      "explanation": "Yesterday, she rode (ride)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (ride)",
      "options": [
        "put",
        "ridden",
        "rode",
        "ride"
      ],
      "answer": "ride",
      "explanation": "She didn't ride yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"run\" là gì?",
      "options": [
        "ran",
        "cut",
        "swam",
        "lost"
      ],
      "answer": "ran",
      "explanation": "run → ran (chạy)."
    },
    {
      "type": "choice",
      "prompt": "\"ran\" là quá khứ của động từ nào?",
      "options": [
        "fly",
        "break",
        "run",
        "win"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (run)",
      "options": [
        "run",
        "paid",
        "let",
        "ran"
      ],
      "answer": "ran",
      "explanation": "Yesterday, she ran (run)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (run)",
      "options": [
        "flew",
        "ran",
        "paid",
        "run"
      ],
      "answer": "run",
      "explanation": "She didn't run yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"say\" là gì?",
      "options": [
        "said",
        "told",
        "read",
        "stood"
      ],
      "answer": "said",
      "explanation": "say → said (nói)."
    },
    {
      "type": "choice",
      "prompt": "\"said\" là quá khứ của động từ nào?",
      "options": [
        "write",
        "say",
        "come",
        "wake"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (say)",
      "options": [
        "said",
        "understood",
        "say",
        "bought"
      ],
      "answer": "said",
      "explanation": "Yesterday, she said (say)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (say)",
      "options": [
        "sat",
        "said",
        "say",
        "bought"
      ],
      "answer": "say",
      "explanation": "She didn't say yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"see\" là gì?",
      "options": [
        "saw",
        "lost",
        "understood",
        "forgot"
      ],
      "answer": "saw",
      "explanation": "see → saw (nhìn thấy)."
    },
    {
      "type": "choice",
      "prompt": "\"saw\" là quá khứ của động từ nào?",
      "options": [
        "eat",
        "see",
        "be",
        "say"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (see)",
      "options": [
        "found",
        "see",
        "saw",
        "seen"
      ],
      "answer": "saw",
      "explanation": "Yesterday, she saw (see)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (see)",
      "options": [
        "saw",
        "found",
        "see",
        "seen"
      ],
      "answer": "see",
      "explanation": "She didn't see yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"sell\" là gì?",
      "options": [
        "swam",
        "made",
        "fed",
        "sold"
      ],
      "answer": "sold",
      "explanation": "sell → sold (bán)."
    },
    {
      "type": "choice",
      "prompt": "\"sold\" là quá khứ của động từ nào?",
      "options": [
        "sell",
        "run",
        "forget",
        "choose"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (sell)",
      "options": [
        "sold",
        "set",
        "lent",
        "sell"
      ],
      "answer": "sold",
      "explanation": "Yesterday, she sold (sell)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (sell)",
      "options": [
        "felt",
        "lent",
        "sell",
        "sold"
      ],
      "answer": "sell",
      "explanation": "She didn't sell yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"send\" là gì?",
      "options": [
        "lent",
        "fought",
        "sent",
        "gave"
      ],
      "answer": "sent",
      "explanation": "send → sent (gửi)."
    },
    {
      "type": "choice",
      "prompt": "\"sent\" là quá khứ của động từ nào?",
      "options": [
        "teach",
        "begin",
        "send",
        "feel"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (send)",
      "options": [
        "sent",
        "send",
        "make",
        "let"
      ],
      "answer": "sent",
      "explanation": "Yesterday, she sent (send)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (send)",
      "options": [
        "send",
        "sent",
        "worn",
        "let"
      ],
      "answer": "send",
      "explanation": "She didn't send yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"set\" là gì?",
      "options": [
        "set",
        "found",
        "chose",
        "held"
      ],
      "answer": "set",
      "explanation": "set → set (đặt, sắp xếp)."
    },
    {
      "type": "choice",
      "prompt": "\"set\" là quá khứ của động từ nào?",
      "options": [
        "fight",
        "be",
        "begin",
        "set"
      ],
      "answer": "set",
      "explanation": "set → set (đặt, sắp xếp)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (set).",
      "answers": [
        "set"
      ],
      "explanation": "Yesterday, she set (set)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (set)",
      "options": [
        "set",
        "cost",
        "wake",
        "forgot"
      ],
      "answer": "set",
      "explanation": "Yesterday, she set (set)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (set)",
      "options": [
        "written",
        "let",
        "set",
        "forgot"
      ],
      "answer": "set",
      "explanation": "She didn't set yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"shut\" là gì?",
      "options": [
        "was / were",
        "lost",
        "shut",
        "forgot"
      ],
      "answer": "shut",
      "explanation": "shut → shut (đóng)."
    },
    {
      "type": "choice",
      "prompt": "\"shut\" là quá khứ của động từ nào?",
      "options": [
        "shut",
        "speak",
        "feed",
        "spend"
      ],
      "answer": "shut",
      "explanation": "shut → shut (đóng)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (shut).",
      "answers": [
        "shut"
      ],
      "explanation": "Yesterday, she shut (shut)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (shut)",
      "options": [
        "give",
        "taught",
        "did",
        "shut"
      ],
      "answer": "shut",
      "explanation": "Yesterday, she shut (shut)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (shut)",
      "options": [
        "shut",
        "flew",
        "taught",
        "read"
      ],
      "answer": "shut",
      "explanation": "She didn't shut yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"spend\" là gì?",
      "options": [
        "spent",
        "woke",
        "hurt",
        "saw"
      ],
      "answer": "spent",
      "explanation": "spend → spent (tiêu, dành)."
    },
    {
      "type": "choice",
      "prompt": "\"spent\" là quá khứ của động từ nào?",
      "options": [
        "dream",
        "spend",
        "feel",
        "catch"
      ],
      "answer": "spend",
      "explanation": "spend → spent (tiêu, dành)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (spend).",
      "answers": [
        "spent"
      ],
      "explanation": "Yesterday, she spent (spend)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (spend)",
      "options": [
        "spent",
        "spend",
        "kept",
        "understood"
      ],
      "answer": "spent",
      "explanation": "Yesterday, she spent (spend)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (spend)",
      "options": [
        "spent",
        "cost",
        "kept",
        "spend"
      ],
      "answer": "spend",
      "explanation": "She didn't spend yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"stand\" là gì?",
      "options": [
        "stood",
        "hid",
        "lost",
        "sang"
      ],
      "answer": "stood",
      "explanation": "stand → stood (đứng)."
    },
    {
      "type": "choice",
      "prompt": "\"stood\" là quá khứ của động từ nào?",
      "options": [
        "forget",
        "come",
        "stand",
        "hear"
      ],
      "answer": "stand",
      "explanation": "stand → stood (đứng)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (stand).",
      "answers": [
        "stood"
      ],
      "explanation": "Yesterday, she stood (stand)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (stand)",
      "options": [
        "let",
        "stand",
        "began",
        "stood"
      ],
      "answer": "stood",
      "explanation": "Yesterday, she stood (stand)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (stand)",
      "options": [
        "stand",
        "meet",
        "began",
        "stood"
      ],
      "answer": "stand",
      "explanation": "She didn't stand yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"sing\" là gì?",
      "options": [
        "lent",
        "sang",
        "broke",
        "dreamt"
      ],
      "answer": "sang",
      "explanation": "sing → sang (hát)."
    },
    {
      "type": "choice",
      "prompt": "\"sang\" là quá khứ của động từ nào?",
      "options": [
        "run",
        "build",
        "sing",
        "bring"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (sing)",
      "options": [
        "came",
        "sing",
        "sang",
        "sung"
      ],
      "answer": "sang",
      "explanation": "Yesterday, she sang (sing)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (sing)",
      "options": [
        "sang",
        "sung",
        "came",
        "sing"
      ],
      "answer": "sing",
      "explanation": "She didn't sing yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"sit\" là gì?",
      "options": [
        "sat",
        "heard",
        "grew",
        "lost"
      ],
      "answer": "sat",
      "explanation": "sit → sat (ngồi)."
    },
    {
      "type": "choice",
      "prompt": "\"sat\" là quá khứ của động từ nào?",
      "options": [
        "sit",
        "come",
        "build",
        "hold"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (sit)",
      "options": [
        "let",
        "stand",
        "sat",
        "sit"
      ],
      "answer": "sat",
      "explanation": "Yesterday, she sat (sit)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (sit)",
      "options": [
        "let",
        "sit",
        "sat",
        "felt"
      ],
      "answer": "sit",
      "explanation": "She didn't sit yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"sleep\" là gì?",
      "options": [
        "was / were",
        "came",
        "slept",
        "spoke"
      ],
      "answer": "slept",
      "explanation": "sleep → slept (ngủ)."
    },
    {
      "type": "choice",
      "prompt": "\"slept\" là quá khứ của động từ nào?",
      "options": [
        "ride",
        "sing",
        "sleep",
        "read"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (sleep)",
      "options": [
        "sang",
        "sleep",
        "slept",
        "seen"
      ],
      "answer": "slept",
      "explanation": "Yesterday, she slept (sleep)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (sleep)",
      "options": [
        "sang",
        "dreamt",
        "sleep",
        "slept"
      ],
      "answer": "sleep",
      "explanation": "She didn't sleep yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"speak\" là gì?",
      "options": [
        "began",
        "heard",
        "spoke",
        "forgot"
      ],
      "answer": "spoke",
      "explanation": "speak → spoke (nói)."
    },
    {
      "type": "choice",
      "prompt": "\"spoke\" là quá khứ của động từ nào?",
      "options": [
        "sit",
        "speak",
        "build",
        "go"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (speak)",
      "options": [
        "speak",
        "spoke",
        "spoken",
        "shut"
      ],
      "answer": "spoke",
      "explanation": "Yesterday, she spoke (speak)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (speak)",
      "options": [
        "spoken",
        "shut",
        "speak",
        "spoke"
      ],
      "answer": "speak",
      "explanation": "She didn't speak yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"swim\" là gì?",
      "options": [
        "sent",
        "paid",
        "set",
        "swam"
      ],
      "answer": "swam",
      "explanation": "swim → swam (bơi)."
    },
    {
      "type": "choice",
      "prompt": "\"swam\" là quá khứ của động từ nào?",
      "options": [
        "eat",
        "feed",
        "drink",
        "swim"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (swim)",
      "options": [
        "swum",
        "cut",
        "swam",
        "swim"
      ],
      "answer": "swam",
      "explanation": "Yesterday, she swam (swim)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (swim)",
      "options": [
        "swum",
        "cut",
        "swim",
        "swam"
      ],
      "answer": "swim",
      "explanation": "She didn't swim yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"take\" là gì?",
      "options": [
        "took",
        "felt",
        "drove",
        "hit"
      ],
      "answer": "took",
      "explanation": "take → took (lấy, chụp)."
    },
    {
      "type": "choice",
      "prompt": "\"took\" là quá khứ của động từ nào?",
      "options": [
        "win",
        "swim",
        "take",
        "shut"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (take)",
      "options": [
        "took",
        "take",
        "shut",
        "taken"
      ],
      "answer": "took",
      "explanation": "Yesterday, she took (take)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (take)",
      "options": [
        "taken",
        "took",
        "take",
        "shut"
      ],
      "answer": "take",
      "explanation": "She didn't take yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"teach\" là gì?",
      "options": [
        "taught",
        "sat",
        "shut",
        "met"
      ],
      "answer": "taught",
      "explanation": "teach → taught (dạy)."
    },
    {
      "type": "choice",
      "prompt": "\"taught\" là quá khứ của động từ nào?",
      "options": [
        "dream",
        "sit",
        "teach",
        "wear"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (teach)",
      "options": [
        "teach",
        "understood",
        "brought",
        "taught"
      ],
      "answer": "taught",
      "explanation": "Yesterday, she taught (teach)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (teach)",
      "options": [
        "taught",
        "teach",
        "brought",
        "set"
      ],
      "answer": "teach",
      "explanation": "She didn't teach yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"tell\" là gì?",
      "options": [
        "told",
        "fed",
        "forgot",
        "sat"
      ],
      "answer": "told",
      "explanation": "tell → told (kể, bảo)."
    },
    {
      "type": "choice",
      "prompt": "\"told\" là quá khứ của động từ nào?",
      "options": [
        "choose",
        "tell",
        "win",
        "fight"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (tell)",
      "options": [
        "knew",
        "broke",
        "told",
        "tell"
      ],
      "answer": "told",
      "explanation": "Yesterday, she told (tell)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (tell)",
      "options": [
        "told",
        "tell",
        "taught",
        "broke"
      ],
      "answer": "tell",
      "explanation": "She didn't tell yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"think\" là gì?",
      "options": [
        "paid",
        "thought",
        "saw",
        "sent"
      ],
      "answer": "thought",
      "explanation": "think → thought (nghĩ)."
    },
    {
      "type": "choice",
      "prompt": "\"thought\" là quá khứ của động từ nào?",
      "options": [
        "understand",
        "hurt",
        "think",
        "fall"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (think)",
      "options": [
        "hurt",
        "think",
        "give",
        "thought"
      ],
      "answer": "thought",
      "explanation": "Yesterday, she thought (think)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (think)",
      "options": [
        "driven",
        "think",
        "thought",
        "hurt"
      ],
      "answer": "think",
      "explanation": "She didn't think yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"understand\" là gì?",
      "options": [
        "understood",
        "wore",
        "began",
        "gave"
      ],
      "answer": "understood",
      "explanation": "understand → understood (hiểu)."
    },
    {
      "type": "choice",
      "prompt": "\"understood\" là quá khứ của động từ nào?",
      "options": [
        "take",
        "leave",
        "understand",
        "fight"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (understand)",
      "options": [
        "understand",
        "understood",
        "took",
        "felt"
      ],
      "answer": "understood",
      "explanation": "Yesterday, she understood (understand)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (understand)",
      "options": [
        "took",
        "sung",
        "understood",
        "understand"
      ],
      "answer": "understand",
      "explanation": "She didn't understand yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"wake\" là gì?",
      "options": [
        "spent",
        "shut",
        "woke",
        "hurt"
      ],
      "answer": "woke",
      "explanation": "wake → woke (thức dậy)."
    },
    {
      "type": "choice",
      "prompt": "\"woke\" là quá khứ của động từ nào?",
      "options": [
        "wake",
        "cut",
        "see",
        "get"
      ],
      "answer": "wake",
      "explanation": "wake → woke (thức dậy)."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng quá khứ: Yesterday, she ______ (wake).",
      "answers": [
        "woke"
      ],
      "explanation": "Yesterday, she woke (wake)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (wake)",
      "options": [
        "woken",
        "came",
        "woke",
        "wake"
      ],
      "answer": "woke",
      "explanation": "Yesterday, she woke (wake)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (wake)",
      "options": [
        "woke",
        "wake",
        "woken",
        "came"
      ],
      "answer": "wake",
      "explanation": "She didn't wake yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"wear\" là gì?",
      "options": [
        "sat",
        "brought",
        "wore",
        "said"
      ],
      "answer": "wore",
      "explanation": "wear → wore (mặc, đeo)."
    },
    {
      "type": "choice",
      "prompt": "\"wore\" là quá khứ của động từ nào?",
      "options": [
        "wear",
        "sing",
        "cost",
        "be"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (wear)",
      "options": [
        "wear",
        "worn",
        "spoke",
        "wore"
      ],
      "answer": "wore",
      "explanation": "Yesterday, she wore (wear)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (wear)",
      "options": [
        "spoke",
        "worn",
        "wore",
        "wear"
      ],
      "answer": "wear",
      "explanation": "She didn't wear yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"win\" là gì?",
      "options": [
        "kept",
        "felt",
        "wrote",
        "won"
      ],
      "answer": "won",
      "explanation": "win → won (thắng)."
    },
    {
      "type": "choice",
      "prompt": "\"won\" là quá khứ của động từ nào?",
      "options": [
        "win",
        "give",
        "run",
        "break"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (win)",
      "options": [
        "lent",
        "win",
        "won",
        "sent"
      ],
      "answer": "won",
      "explanation": "Yesterday, she won (win)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (win)",
      "options": [
        "won",
        "win",
        "lent",
        "shut"
      ],
      "answer": "win",
      "explanation": "She didn't win yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Quá khứ của \"write\" là gì?",
      "options": [
        "sold",
        "drank",
        "wrote",
        "taught"
      ],
      "answer": "wrote",
      "explanation": "write → wrote (viết)."
    },
    {
      "type": "choice",
      "prompt": "\"wrote\" là quá khứ của động từ nào?",
      "options": [
        "write",
        "choose",
        "sing",
        "feel"
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
      "prompt": "Chọn dạng đúng: Yesterday, she ______. (write)",
      "options": [
        "wrote",
        "thought",
        "write",
        "written"
      ],
      "answer": "wrote",
      "explanation": "Yesterday, she wrote (write)."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She didn't ______ yesterday. (write)",
      "options": [
        "write",
        "wrote",
        "written",
        "thought"
      ],
      "answer": "write",
      "explanation": "She didn't write yesterday. (sau didn't dùng dạng gốc V1)"
    },
    {
      "type": "choice",
      "prompt": "Câu nào đúng ở quá khứ?",
      "options": [
        "He doesn’t go.",
        "He didn't went.",
        "He didn't go.",
        "He didn't goes."
      ],
      "answer": "He didn't go.",
      "explanation": "Phủ định quá khứ: didn’t + động từ nguyên thể."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: She didn’t ______ yesterday.",
      "options": [
        "buy",
        "buys",
        "buying",
        "bought"
      ],
      "answer": "buy",
      "explanation": "She didn’t buy yesterday. = Hôm qua cô ấy đã không mua."
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: Did you ______ TV yesterday?",
      "options": [
        "watches",
        "watched",
        "watching",
        "watch"
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
        "sẽ xem (đã định)",
        "sẽ đi",
        "sẽ thăm",
        "sẽ không"
      ],
      "answer": "sẽ đi",
      "explanation": "will go = sẽ đi."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"sẽ đi\"?",
      "options": [
        "going to watch",
        "will go",
        "is going to study",
        "will visit"
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
      "prompt": "Điền từ còn thiếu: I ______ to school tomorrow. (sẽ đi)",
      "answers": [
        "will go"
      ],
      "explanation": "Câu đầy đủ: I will go to school tomorrow."
    },
    {
      "type": "choice",
      "prompt": "\"will visit\" có nghĩa là gì?",
      "options": [
        "sẽ thăm",
        "sẽ đi",
        "sẽ không",
        "sẽ học (đã định)"
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
        "will go",
        "going to watch"
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
      "prompt": "Điền từ còn thiếu: I ______ my grandmother tomorrow. (sẽ thăm)",
      "answers": [
        "will visit"
      ],
      "explanation": "Câu đầy đủ: I will visit my grandmother tomorrow."
    },
    {
      "type": "choice",
      "prompt": "\"are going to travel\" có nghĩa là gì?",
      "options": [
        "sẽ xem (đã định)",
        "sẽ đi du lịch (đã định)",
        "sẽ đi",
        "sẽ là"
      ],
      "answer": "sẽ đi du lịch (đã định)",
      "explanation": "are going to travel = sẽ đi du lịch (đã định)."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"sẽ đi du lịch (đã định)\"?",
      "options": [
        "will visit",
        "will go",
        "won't",
        "are going to travel"
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
      "prompt": "Điền từ còn thiếu: We ______ next month. (sẽ đi du lịch (đã định))",
      "answers": [
        "are going to travel"
      ],
      "explanation": "Câu đầy đủ: We are going to travel next month."
    },
    {
      "type": "choice",
      "prompt": "\"is going to study\" có nghĩa là gì?",
      "options": [
        "sẽ học (đã định)",
        "sẽ đi",
        "sẽ không",
        "sẽ là"
      ],
      "answer": "sẽ học (đã định)",
      "explanation": "is going to study = sẽ học (đã định)."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"sẽ học (đã định)\"?",
      "options": [
        "will help",
        "will go",
        "going to watch",
        "is going to study"
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
      "prompt": "Điền từ còn thiếu: He ______ tonight. (sẽ học (đã định))",
      "answers": [
        "is going to study"
      ],
      "explanation": "Câu đầy đủ: He is going to study tonight."
    },
    {
      "type": "choice",
      "prompt": "\"won't\" có nghĩa là gì?",
      "options": [
        "sẽ không",
        "sẽ đi du lịch (đã định)",
        "sẽ là",
        "sẽ đi"
      ],
      "answer": "sẽ không",
      "explanation": "won't = sẽ không."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"sẽ không\"?",
      "options": [
        "won't",
        "going to watch",
        "will visit",
        "will help"
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
      "prompt": "Điền từ còn thiếu: I ______ go to school tomorrow. (sẽ không)",
      "answers": [
        "won't"
      ],
      "explanation": "Câu đầy đủ: I won't go to school tomorrow."
    },
    {
      "type": "choice",
      "prompt": "\"will be\" có nghĩa là gì?",
      "options": [
        "sẽ là",
        "sẽ đi",
        "sẽ đi du lịch (đã định)",
        "sẽ thăm"
      ],
      "answer": "sẽ là",
      "explanation": "will be = sẽ là."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"sẽ là\"?",
      "options": [
        "will go",
        "will be",
        "are going to travel",
        "is going to study"
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
      "prompt": "Điền từ còn thiếu: It ______ sunny tomorrow. (sẽ là)",
      "answers": [
        "will be"
      ],
      "explanation": "Câu đầy đủ: It will be sunny tomorrow."
    },
    {
      "type": "choice",
      "prompt": "\"going to watch\" có nghĩa là gì?",
      "options": [
        "sẽ đi du lịch (đã định)",
        "sẽ thăm",
        "sẽ giúp",
        "sẽ xem (đã định)"
      ],
      "answer": "sẽ xem (đã định)",
      "explanation": "going to watch = sẽ xem (đã định)."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"sẽ xem (đã định)\"?",
      "options": [
        "will be",
        "will visit",
        "going to watch",
        "will help"
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
      "prompt": "Điền từ còn thiếu: My mother is ______ a film tonight. (sẽ xem (đã định))",
      "answers": [
        "going to watch"
      ],
      "explanation": "Câu đầy đủ: My mother is going to watch a film tonight."
    },
    {
      "type": "choice",
      "prompt": "\"will help\" có nghĩa là gì?",
      "options": [
        "sẽ xem (đã định)",
        "sẽ giúp",
        "sẽ đi",
        "sẽ học (đã định)"
      ],
      "answer": "sẽ giúp",
      "explanation": "will help = sẽ giúp."
    },
    {
      "type": "choice",
      "prompt": "Từ tiếng Anh nào có nghĩa là \"sẽ giúp\"?",
      "options": [
        "is going to study",
        "will go",
        "will help",
        "are going to travel"
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
      "prompt": "Điền từ còn thiếu: She ______ you with homework. (sẽ giúp)",
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
      "prompt": "Câu tiếng Anh của \"Tôi sẽ giúp bạn!\" là câu nào?",
      "options": [
        "I will cook dinner.",
        "I will help you!",
        "They will travel to Da Lat.",
        "He will come soon."
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
      "prompt": "Câu tiếng Anh của \"Trời sẽ mưa ngày mai.\" là câu nào?",
      "options": [
        "It will rain tomorrow.",
        "We will watch TV.",
        "We will travel next week.",
        "They will visit us."
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
      "prompt": "Câu tiếng Anh của \"Cô ấy sẽ gọi cho bạn tối nay.\" là câu nào?",
      "options": [
        "They will build a sandcastle.",
        "She will call you tonight.",
        "I will write a letter.",
        "I will buy a new pen."
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
      "prompt": "Câu tiếng Anh của \"Chúng tôi sẽ đi du lịch tuần tới.\" là câu nào?",
      "options": [
        "She will sing a song.",
        "He will fix his bike.",
        "We will travel next week.",
        "They will travel to Da Lat."
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
      "prompt": "Câu tiếng Anh của \"Tôi sẽ mở cửa.\" là câu nào?",
      "options": [
        "I will open the door.",
        "They will travel to Da Lat.",
        "She will sing a song.",
        "I will help you!"
      ],
      "answer": "I will open the door.",
      "explanation": "I will open the door. = Tôi sẽ mở cửa. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ open the door.",
      "answers": [
        "will"
      ],
      "explanation": "I will open the door. = Tôi sẽ mở cửa."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Cô ấy sẽ hát một bài hát.\" là câu nào?",
      "options": [
        "I will buy a new pen.",
        "We will learn English.",
        "It will rain tomorrow.",
        "She will sing a song."
      ],
      "answer": "She will sing a song.",
      "explanation": "She will sing a song. = Cô ấy sẽ hát một bài hát. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ sing a song.",
      "answers": [
        "will"
      ],
      "explanation": "She will sing a song. = Cô ấy sẽ hát một bài hát."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Anh ấy sẽ đến sớm.\" là câu nào?",
      "options": [
        "I will write a letter.",
        "It will be sunny.",
        "She will read a book.",
        "He will come soon."
      ],
      "answer": "He will come soon.",
      "explanation": "He will come soon. = Anh ấy sẽ đến sớm. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ come soon.",
      "answers": [
        "will"
      ],
      "explanation": "He will come soon. = Anh ấy sẽ đến sớm."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Họ sẽ thăm chúng tôi.\" là câu nào?",
      "options": [
        "They will travel to Da Lat.",
        "She will sing a song.",
        "He will come soon.",
        "They will visit us."
      ],
      "answer": "They will visit us.",
      "explanation": "They will visit us. = Họ sẽ thăm chúng tôi. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: They ______ visit us.",
      "answers": [
        "will"
      ],
      "explanation": "They will visit us. = Họ sẽ thăm chúng tôi."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Tôi sẽ mua một cây bút mới.\" là câu nào?",
      "options": [
        "I will buy a new pen.",
        "They will travel to Da Lat.",
        "He will come soon.",
        "She will sing a song."
      ],
      "answer": "I will buy a new pen.",
      "explanation": "I will buy a new pen. = Tôi sẽ mua một cây bút mới. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ buy a new pen.",
      "answers": [
        "will"
      ],
      "explanation": "I will buy a new pen. = Tôi sẽ mua một cây bút mới."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Cô ấy sẽ đọc một quyển sách.\" là câu nào?",
      "options": [
        "She will read a book.",
        "I will help you!",
        "He will clean the room.",
        "We will learn English."
      ],
      "answer": "She will read a book.",
      "explanation": "She will read a book. = Cô ấy sẽ đọc một quyển sách. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ read a book.",
      "answers": [
        "will"
      ],
      "explanation": "She will read a book. = Cô ấy sẽ đọc một quyển sách."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Chúng tôi sẽ xem TV.\" là câu nào?",
      "options": [
        "We will watch TV.",
        "They will visit us.",
        "I will cook dinner.",
        "They will travel to Da Lat."
      ],
      "answer": "We will watch TV.",
      "explanation": "We will watch TV. = Chúng tôi sẽ xem TV. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: We ______ watch TV.",
      "answers": [
        "will"
      ],
      "explanation": "We will watch TV. = Chúng tôi sẽ xem TV."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Trời sẽ nắng.\" là câu nào?",
      "options": [
        "It will be sunny.",
        "I will help you!",
        "She will call you tonight.",
        "They will visit us."
      ],
      "answer": "It will be sunny.",
      "explanation": "It will be sunny. = Trời sẽ nắng. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: It ______ be sunny.",
      "answers": [
        "will"
      ],
      "explanation": "It will be sunny. = Trời sẽ nắng."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Tôi sẽ nấu bữa tối.\" là câu nào?",
      "options": [
        "I will open the door.",
        "I will cook dinner.",
        "It will be sunny.",
        "She will dance at the party."
      ],
      "answer": "I will cook dinner.",
      "explanation": "I will cook dinner. = Tôi sẽ nấu bữa tối. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ cook dinner.",
      "answers": [
        "will"
      ],
      "explanation": "I will cook dinner. = Tôi sẽ nấu bữa tối."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Anh ấy sẽ sửa xe đạp.\" là câu nào?",
      "options": [
        "We will travel next week.",
        "He will clean the room.",
        "He will fix his bike.",
        "They will visit us."
      ],
      "answer": "He will fix his bike.",
      "explanation": "He will fix his bike. = Anh ấy sẽ sửa xe đạp. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ fix his bike.",
      "answers": [
        "will"
      ],
      "explanation": "He will fix his bike. = Anh ấy sẽ sửa xe đạp."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Họ sẽ đi du lịch Đà Lạt.\" là câu nào?",
      "options": [
        "She will sing a song.",
        "I will buy a new pen.",
        "We will watch TV.",
        "They will travel to Da Lat."
      ],
      "answer": "They will travel to Da Lat.",
      "explanation": "They will travel to Da Lat. = Họ sẽ đi du lịch Đà Lạt. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: They ______ travel to Da Lat.",
      "answers": [
        "will"
      ],
      "explanation": "They will travel to Da Lat. = Họ sẽ đi du lịch Đà Lạt."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Cô ấy sẽ nhảy ở bữa tiệc.\" là câu nào?",
      "options": [
        "I will open the door.",
        "She will dance at the party.",
        "I will help you!",
        "He will come soon."
      ],
      "answer": "She will dance at the party.",
      "explanation": "She will dance at the party. = Cô ấy sẽ nhảy ở bữa tiệc. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: She ______ dance at the party.",
      "answers": [
        "will"
      ],
      "explanation": "She will dance at the party. = Cô ấy sẽ nhảy ở bữa tiệc."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Chúng tôi sẽ học tiếng Anh.\" là câu nào?",
      "options": [
        "I will open the door.",
        "He will come soon.",
        "We will learn English.",
        "She will call you tonight."
      ],
      "answer": "We will learn English.",
      "explanation": "We will learn English. = Chúng tôi sẽ học tiếng Anh. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: We ______ learn English.",
      "answers": [
        "will"
      ],
      "explanation": "We will learn English. = Chúng tôi sẽ học tiếng Anh."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Tôi sẽ viết một lá thư.\" là câu nào?",
      "options": [
        "She will read a book.",
        "She will dance at the party.",
        "I will cook dinner.",
        "I will write a letter."
      ],
      "answer": "I will write a letter.",
      "explanation": "I will write a letter. = Tôi sẽ viết một lá thư. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: I ______ write a letter.",
      "answers": [
        "will"
      ],
      "explanation": "I will write a letter. = Tôi sẽ viết một lá thư."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Anh ấy sẽ dọn phòng.\" là câu nào?",
      "options": [
        "He will clean the room.",
        "I will buy a new pen.",
        "It will rain tomorrow.",
        "They will visit us."
      ],
      "answer": "He will clean the room.",
      "explanation": "He will clean the room. = Anh ấy sẽ dọn phòng. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: He ______ clean the room.",
      "answers": [
        "will"
      ],
      "explanation": "He will clean the room. = Anh ấy sẽ dọn phòng."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Họ sẽ xây lâu đài cát.\" là câu nào?",
      "options": [
        "They will build a sandcastle.",
        "They will visit us.",
        "I will open the door.",
        "They will travel to Da Lat."
      ],
      "answer": "They will build a sandcastle.",
      "explanation": "They will build a sandcastle. = Họ sẽ xây lâu đài cát. (will + V: quyết định ngay lúc nói)."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: They ______ build a sandcastle.",
      "answers": [
        "will"
      ],
      "explanation": "They will build a sandcastle. = Họ sẽ xây lâu đài cát."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Chúng tôi định đi du lịch tháng tới.\" là câu nào?",
      "options": [
        "She is going to buy a dress.",
        "They are going to clean the house.",
        "We are going to travel next month.",
        "I am going to draw a picture."
      ],
      "answer": "We are going to travel next month.",
      "explanation": "We are going to travel next month. = Chúng tôi định đi du lịch tháng tới. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: We ______ travel next month. (Chúng tôi định đi du lịch tháng tới.)",
      "answers": [
        "are going to"
      ],
      "explanation": "We are going to travel next month. = Chúng tôi định đi du lịch tháng tới."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Cô ấy định nấu bữa tối.\" là câu nào?",
      "options": [
        "We are going to have a party.",
        "She is going to cook dinner.",
        "She is going to buy a dress.",
        "We are going to travel next month."
      ],
      "answer": "She is going to cook dinner.",
      "explanation": "She is going to cook dinner. = Cô ấy định nấu bữa tối. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: She ______ cook dinner. (Cô ấy định nấu bữa tối.)",
      "answers": [
        "is going to"
      ],
      "explanation": "She is going to cook dinner. = Cô ấy định nấu bữa tối."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Họ định chơi bóng đá.\" là câu nào?",
      "options": [
        "She is going to buy a dress.",
        "We are going to travel next month.",
        "They are going to play football.",
        "He is going to play chess."
      ],
      "answer": "They are going to play football.",
      "explanation": "They are going to play football. = Họ định chơi bóng đá. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: They ______ play football. (Họ định chơi bóng đá.)",
      "answers": [
        "are going to"
      ],
      "explanation": "They are going to play football. = Họ định chơi bóng đá."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Tôi định đọc một quyển sách.\" là câu nào?",
      "options": [
        "He is going to fix his bike.",
        "They are going to play football.",
        "I am going to read a book.",
        "I am going to visit my grandmother."
      ],
      "answer": "I am going to read a book.",
      "explanation": "I am going to read a book. = Tôi định đọc một quyển sách. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: I ______ read a book. (Tôi định đọc một quyển sách.)",
      "answers": [
        "am going to"
      ],
      "explanation": "I am going to read a book. = Tôi định đọc một quyển sách."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Anh ấy định học tối nay.\" là câu nào?",
      "options": [
        "We are going to travel next month.",
        "I am going to read a book.",
        "He is going to study tonight.",
        "I am going to visit my grandmother."
      ],
      "answer": "He is going to study tonight.",
      "explanation": "He is going to study tonight. = Anh ấy định học tối nay. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: He ______ study tonight. (Anh ấy định học tối nay.)",
      "answers": [
        "is going to"
      ],
      "explanation": "He is going to study tonight. = Anh ấy định học tối nay."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Chúng tôi định thăm vịnh Hạ Long.\" là câu nào?",
      "options": [
        "We are going to visit Ha Long Bay.",
        "They are going to watch a film.",
        "He is going to fix his bike.",
        "They are going to build a sandcastle."
      ],
      "answer": "We are going to visit Ha Long Bay.",
      "explanation": "We are going to visit Ha Long Bay. = Chúng tôi định thăm vịnh Hạ Long. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: We ______ visit Ha Long Bay. (Chúng tôi định thăm vịnh Hạ Long.)",
      "answers": [
        "are going to"
      ],
      "explanation": "We are going to visit Ha Long Bay. = Chúng tôi định thăm vịnh Hạ Long."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Cô ấy định mua một cái váy.\" là câu nào?",
      "options": [
        "She is going to buy a dress.",
        "We are going to travel next month.",
        "He is going to wash his car.",
        "He is going to play chess."
      ],
      "answer": "She is going to buy a dress.",
      "explanation": "She is going to buy a dress. = Cô ấy định mua một cái váy. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: She ______ buy a dress. (Cô ấy định mua một cái váy.)",
      "answers": [
        "is going to"
      ],
      "explanation": "She is going to buy a dress. = Cô ấy định mua một cái váy."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Họ định xem một bộ phim.\" là câu nào?",
      "options": [
        "He is going to wash his car.",
        "We are going to travel next month.",
        "They are going to build a sandcastle.",
        "They are going to watch a film."
      ],
      "answer": "They are going to watch a film.",
      "explanation": "They are going to watch a film. = Họ định xem một bộ phim. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: They ______ watch a film. (Họ định xem một bộ phim.)",
      "answers": [
        "are going to"
      ],
      "explanation": "They are going to watch a film. = Họ định xem một bộ phim."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Tôi định học bơi.\" là câu nào?",
      "options": [
        "She is going to sing a song.",
        "He is going to fix his bike.",
        "We are going to have a party.",
        "I am going to learn to swim."
      ],
      "answer": "I am going to learn to swim.",
      "explanation": "I am going to learn to swim. = Tôi định học bơi. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: I ______ learn to swim. (Tôi định học bơi.)",
      "answers": [
        "am going to"
      ],
      "explanation": "I am going to learn to swim. = Tôi định học bơi."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Anh ấy định sửa xe đạp.\" là câu nào?",
      "options": [
        "He is going to fix his bike.",
        "She is going to buy a dress.",
        "They are going to play football.",
        "He is going to wash his car."
      ],
      "answer": "He is going to fix his bike.",
      "explanation": "He is going to fix his bike. = Anh ấy định sửa xe đạp. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: He ______ fix his bike. (Anh ấy định sửa xe đạp.)",
      "answers": [
        "is going to"
      ],
      "explanation": "He is going to fix his bike. = Anh ấy định sửa xe đạp."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Chúng tôi định tổ chức tiệc.\" là câu nào?",
      "options": [
        "I am going to draw a picture.",
        "They are going to clean the house.",
        "We are going to have a party.",
        "He is going to wash his car."
      ],
      "answer": "We are going to have a party.",
      "explanation": "We are going to have a party. = Chúng tôi định tổ chức tiệc. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: We ______ have a party. (Chúng tôi định tổ chức tiệc.)",
      "answers": [
        "are going to"
      ],
      "explanation": "We are going to have a party. = Chúng tôi định tổ chức tiệc."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Cô ấy định làm một cái bánh.\" là câu nào?",
      "options": [
        "She is going to make a cake.",
        "I am going to read a book.",
        "I am going to visit my grandmother.",
        "They are going to build a sandcastle."
      ],
      "answer": "She is going to make a cake.",
      "explanation": "She is going to make a cake. = Cô ấy định làm một cái bánh. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: She ______ make a cake. (Cô ấy định làm một cái bánh.)",
      "answers": [
        "is going to"
      ],
      "explanation": "She is going to make a cake. = Cô ấy định làm một cái bánh."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Họ định dọn nhà.\" là câu nào?",
      "options": [
        "They are going to build a sandcastle.",
        "I am going to visit my grandmother.",
        "He is going to fix his bike.",
        "They are going to clean the house."
      ],
      "answer": "They are going to clean the house.",
      "explanation": "They are going to clean the house. = Họ định dọn nhà. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: They ______ clean the house. (Họ định dọn nhà.)",
      "answers": [
        "are going to"
      ],
      "explanation": "They are going to clean the house. = Họ định dọn nhà."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Tôi định thăm bà.\" là câu nào?",
      "options": [
        "They are going to play football.",
        "I am going to visit my grandmother.",
        "She is going to cook dinner.",
        "I am going to learn to swim."
      ],
      "answer": "I am going to visit my grandmother.",
      "explanation": "I am going to visit my grandmother. = Tôi định thăm bà. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: I ______ visit my grandmother. (Tôi định thăm bà.)",
      "answers": [
        "am going to"
      ],
      "explanation": "I am going to visit my grandmother. = Tôi định thăm bà."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Anh ấy định chơi cờ vua.\" là câu nào?",
      "options": [
        "He is going to study tonight.",
        "I am going to visit my grandmother.",
        "He is going to play chess.",
        "They are going to play football."
      ],
      "answer": "He is going to play chess.",
      "explanation": "He is going to play chess. = Anh ấy định chơi cờ vua. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: He ______ play chess. (Anh ấy định chơi cờ vua.)",
      "answers": [
        "is going to"
      ],
      "explanation": "He is going to play chess. = Anh ấy định chơi cờ vua."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Chúng tôi định trồng một cái cây.\" là câu nào?",
      "options": [
        "She is going to make a cake.",
        "I am going to read a book.",
        "I am going to draw a picture.",
        "We are going to plant a tree."
      ],
      "answer": "We are going to plant a tree.",
      "explanation": "We are going to plant a tree. = Chúng tôi định trồng một cái cây. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: We ______ plant a tree. (Chúng tôi định trồng một cái cây.)",
      "answers": [
        "are going to"
      ],
      "explanation": "We are going to plant a tree. = Chúng tôi định trồng một cái cây."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Cô ấy định hát một bài hát.\" là câu nào?",
      "options": [
        "She is going to cook dinner.",
        "She is going to sing a song.",
        "She is going to make a cake.",
        "They are going to build a sandcastle."
      ],
      "answer": "She is going to sing a song.",
      "explanation": "She is going to sing a song. = Cô ấy định hát một bài hát. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: She ______ sing a song. (Cô ấy định hát một bài hát.)",
      "answers": [
        "is going to"
      ],
      "explanation": "She is going to sing a song. = Cô ấy định hát một bài hát."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Họ định xây lâu đài cát.\" là câu nào?",
      "options": [
        "I am going to learn to swim.",
        "I am going to draw a picture.",
        "They are going to build a sandcastle.",
        "She is going to make a cake."
      ],
      "answer": "They are going to build a sandcastle.",
      "explanation": "They are going to build a sandcastle. = Họ định xây lâu đài cát. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: They ______ build a sandcastle. (Họ định xây lâu đài cát.)",
      "answers": [
        "are going to"
      ],
      "explanation": "They are going to build a sandcastle. = Họ định xây lâu đài cát."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Tôi định vẽ một bức tranh.\" là câu nào?",
      "options": [
        "I am going to visit my grandmother.",
        "I am going to read a book.",
        "I am going to draw a picture.",
        "She is going to cook dinner."
      ],
      "answer": "I am going to draw a picture.",
      "explanation": "I am going to draw a picture. = Tôi định vẽ một bức tranh. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: I ______ draw a picture. (Tôi định vẽ một bức tranh.)",
      "answers": [
        "am going to"
      ],
      "explanation": "I am going to draw a picture. = Tôi định vẽ một bức tranh."
    },
    {
      "type": "choice",
      "prompt": "Câu tiếng Anh của \"Anh ấy định rửa xe.\" là câu nào?",
      "options": [
        "She is going to sing a song.",
        "We are going to plant a tree.",
        "He is going to wash his car.",
        "I am going to visit my grandmother."
      ],
      "answer": "He is going to wash his car.",
      "explanation": "He is going to wash his car. = Anh ấy định rửa xe. (be going to + V: kế hoạch đã định)."
    },
    {
      "type": "fill",
      "prompt": "Điền cụm còn thiếu: He ______ wash his car. (Anh ấy định rửa xe.)",
      "answers": [
        "is going to"
      ],
      "explanation": "He is going to wash his car. = Anh ấy định rửa xe."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: I ______ going to cook dinner.",
      "answers": [
        "am"
      ],
      "explanation": "I am going to cook dinner."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ going to cook dinner.",
      "options": [
        "are",
        "is",
        "am",
        "will"
      ],
      "answer": "am",
      "explanation": "I am going to cook dinner."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: I ______ going to play football.",
      "answers": [
        "am"
      ],
      "explanation": "I am going to play football."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ going to play football.",
      "options": [
        "will",
        "are",
        "is",
        "am"
      ],
      "answer": "am",
      "explanation": "I am going to play football."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ going to cook dinner.",
      "answers": [
        "is"
      ],
      "explanation": "She is going to cook dinner."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ going to cook dinner.",
      "options": [
        "am",
        "will",
        "is",
        "are"
      ],
      "answer": "is",
      "explanation": "She is going to cook dinner."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: She ______ going to play football.",
      "answers": [
        "is"
      ],
      "explanation": "She is going to play football."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: She ______ going to play football.",
      "options": [
        "are",
        "will",
        "am",
        "is"
      ],
      "answer": "is",
      "explanation": "She is going to play football."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ going to cook dinner.",
      "answers": [
        "is"
      ],
      "explanation": "He is going to cook dinner."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ going to cook dinner.",
      "options": [
        "is",
        "will",
        "are",
        "am"
      ],
      "answer": "is",
      "explanation": "He is going to cook dinner."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: He ______ going to play football.",
      "answers": [
        "is"
      ],
      "explanation": "He is going to play football."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: He ______ going to play football.",
      "options": [
        "is",
        "are",
        "will",
        "am"
      ],
      "answer": "is",
      "explanation": "He is going to play football."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ going to cook dinner.",
      "answers": [
        "are"
      ],
      "explanation": "We are going to cook dinner."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ going to cook dinner.",
      "options": [
        "will",
        "am",
        "are",
        "is"
      ],
      "answer": "are",
      "explanation": "We are going to cook dinner."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: We ______ going to play football.",
      "answers": [
        "are"
      ],
      "explanation": "We are going to play football."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ going to play football.",
      "options": [
        "are",
        "am",
        "will",
        "is"
      ],
      "answer": "are",
      "explanation": "We are going to play football."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: They ______ going to cook dinner.",
      "answers": [
        "are"
      ],
      "explanation": "They are going to cook dinner."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ going to cook dinner.",
      "options": [
        "are",
        "is",
        "will",
        "am"
      ],
      "answer": "are",
      "explanation": "They are going to cook dinner."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: They ______ going to play football.",
      "answers": [
        "are"
      ],
      "explanation": "They are going to play football."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: They ______ going to play football.",
      "options": [
        "will",
        "are",
        "am",
        "is"
      ],
      "answer": "are",
      "explanation": "They are going to play football."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ going to cook dinner.",
      "answers": [
        "is"
      ],
      "explanation": "Lan is going to cook dinner."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ going to cook dinner.",
      "options": [
        "will",
        "am",
        "is",
        "are"
      ],
      "answer": "is",
      "explanation": "Lan is going to cook dinner."
    },
    {
      "type": "fill",
      "prompt": "Điền dạng đúng: Lan ______ going to play football.",
      "answers": [
        "is"
      ],
      "explanation": "Lan is going to play football."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: Lan ______ going to play football.",
      "options": [
        "is",
        "are",
        "will",
        "am"
      ],
      "answer": "is",
      "explanation": "Lan is going to play football."
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ you visit us tomorrow?",
      "answers": [
        "will"
      ],
      "explanation": "Will you visit us tomorrow?"
    },
    {
      "type": "choice",
      "prompt": "Chọn từ đúng: ______ you help me?",
      "options": [
        "Are",
        "Will",
        "Did",
        "Do"
      ],
      "answer": "Will",
      "explanation": "Will you help me? = Bạn sẽ giúp tôi chứ?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ she call you tonight?",
      "answers": [
        "will"
      ],
      "explanation": "Will she call you tonight?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ they travel next week?",
      "answers": [
        "will"
      ],
      "explanation": "Will they travel next week?"
    },
    {
      "type": "fill",
      "prompt": "Điền từ còn thiếu: ______ it rain tomorrow?",
      "answers": [
        "will"
      ],
      "explanation": "Will it rain tomorrow?"
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: I ______ go to school tomorrow. (sẽ không)",
      "answers": [
        "will not",
        "won't"
      ],
      "explanation": "I will not (won't) go to school tomorrow. (sau will/won't, động từ giữ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: I ______ watch TV tonight. (sẽ không)",
      "answers": [
        "will not",
        "won't"
      ],
      "explanation": "I will not (won't) watch TV tonight. (sau will/won't, động từ giữ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: I ______ play football tomorrow. (sẽ không)",
      "answers": [
        "will not",
        "won't"
      ],
      "explanation": "I will not (won't) play football tomorrow. (sau will/won't, động từ giữ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: I ______ visit us next week. (sẽ không)",
      "answers": [
        "will not",
        "won't"
      ],
      "explanation": "I will not (won't) visit us next week. (sau will/won't, động từ giữ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: I ______ help you. (sẽ không)",
      "answers": [
        "will not",
        "won't"
      ],
      "explanation": "I will not (won't) help you. (sau will/won't, động từ giữ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: I ______ cook dinner tonight. (sẽ không)",
      "answers": [
        "will not",
        "won't"
      ],
      "explanation": "I will not (won't) cook dinner tonight. (sau will/won't, động từ giữ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: I ______ travel next month. (sẽ không)",
      "answers": [
        "will not",
        "won't"
      ],
      "explanation": "I will not (won't) travel next month. (sau will/won't, động từ giữ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: I ______ call you tonight. (sẽ không)",
      "answers": [
        "will not",
        "won't"
      ],
      "explanation": "I will not (won't) call you tonight. (sau will/won't, động từ giữ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: I ______ read a book tomorrow. (sẽ không)",
      "answers": [
        "will not",
        "won't"
      ],
      "explanation": "I will not (won't) read a book tomorrow. (sau will/won't, động từ giữ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: I ______ clean the room today. (sẽ không)",
      "answers": [
        "will not",
        "won't"
      ],
      "explanation": "I will not (won't) clean the room today. (sau will/won't, động từ giữ nguyên thể)"
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: She ______ going to cook dinner. (sẽ không nấu)",
      "answers": [
        "isn't"
      ],
      "explanation": "She isn't going to cook dinner."
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: He ______ going to cook dinner. (sẽ không nấu)",
      "answers": [
        "isn't"
      ],
      "explanation": "He isn't going to cook dinner."
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: We ______ going to cook dinner. (sẽ không nấu)",
      "answers": [
        "aren't"
      ],
      "explanation": "We aren't going to cook dinner."
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: They ______ going to cook dinner. (sẽ không nấu)",
      "answers": [
        "aren't"
      ],
      "explanation": "They aren't going to cook dinner."
    },
    {
      "type": "fill",
      "prompt": "Điền phủ định: Lan ______ going to cook dinner. (sẽ không nấu)",
      "answers": [
        "isn't"
      ],
      "explanation": "Lan isn't going to cook dinner."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi sẽ giúp bạn!\"",
      "answers": [
        "i will help you"
      ],
      "explanation": "I will help you! = Tôi sẽ giúp bạn!"
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Trời sẽ mưa ngày mai.\"",
      "answers": [
        "it will rain tomorrow"
      ],
      "explanation": "It will rain tomorrow. = Trời sẽ mưa ngày mai."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Cô ấy sẽ gọi cho bạn tối nay.\"",
      "answers": [
        "she will call you tonight"
      ],
      "explanation": "She will call you tonight. = Cô ấy sẽ gọi cho bạn tối nay."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Chúng tôi sẽ đi du lịch tuần tới.\"",
      "answers": [
        "we will travel next week"
      ],
      "explanation": "We will travel next week. = Chúng tôi sẽ đi du lịch tuần tới."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi sẽ mở cửa.\"",
      "answers": [
        "i will open the door"
      ],
      "explanation": "I will open the door. = Tôi sẽ mở cửa."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Cô ấy sẽ hát một bài hát.\"",
      "answers": [
        "she will sing a song"
      ],
      "explanation": "She will sing a song. = Cô ấy sẽ hát một bài hát."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Anh ấy sẽ đến sớm.\"",
      "answers": [
        "he will come soon"
      ],
      "explanation": "He will come soon. = Anh ấy sẽ đến sớm."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Họ sẽ thăm chúng tôi.\"",
      "answers": [
        "they will visit us"
      ],
      "explanation": "They will visit us. = Họ sẽ thăm chúng tôi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi sẽ mua một cây bút mới.\"",
      "answers": [
        "i will buy a new pen"
      ],
      "explanation": "I will buy a new pen. = Tôi sẽ mua một cây bút mới."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Cô ấy sẽ đọc một quyển sách.\"",
      "answers": [
        "she will read a book"
      ],
      "explanation": "She will read a book. = Cô ấy sẽ đọc một quyển sách."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Chúng tôi định đi du lịch tháng tới.\"",
      "answers": [
        "we are going to travel next month"
      ],
      "explanation": "We are going to travel next month. = Chúng tôi định đi du lịch tháng tới."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Cô ấy định nấu bữa tối.\"",
      "answers": [
        "she is going to cook dinner"
      ],
      "explanation": "She is going to cook dinner. = Cô ấy định nấu bữa tối."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Họ định chơi bóng đá.\"",
      "answers": [
        "they are going to play football"
      ],
      "explanation": "They are going to play football. = Họ định chơi bóng đá."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi định đọc một quyển sách.\"",
      "answers": [
        "i am going to read a book"
      ],
      "explanation": "I am going to read a book. = Tôi định đọc một quyển sách."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Anh ấy định học tối nay.\"",
      "answers": [
        "he is going to study tonight"
      ],
      "explanation": "He is going to study tonight. = Anh ấy định học tối nay."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Chúng tôi định thăm vịnh Hạ Long.\"",
      "answers": [
        "we are going to visit ha long bay"
      ],
      "explanation": "We are going to visit Ha Long Bay. = Chúng tôi định thăm vịnh Hạ Long."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Cô ấy định mua một cái váy.\"",
      "answers": [
        "she is going to buy a dress"
      ],
      "explanation": "She is going to buy a dress. = Cô ấy định mua một cái váy."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Họ định xem một bộ phim.\"",
      "answers": [
        "they are going to watch a film"
      ],
      "explanation": "They are going to watch a film. = Họ định xem một bộ phim."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Tôi định học bơi.\"",
      "answers": [
        "i am going to learn to swim"
      ],
      "explanation": "I am going to learn to swim. = Tôi định học bơi."
    },
    {
      "type": "translate",
      "prompt": "Dịch sang tiếng Anh: \"Anh ấy định sửa xe đạp.\"",
      "answers": [
        "he is going to fix his bike"
      ],
      "explanation": "He is going to fix his bike. = Anh ấy định sửa xe đạp."
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: I ______ help you! (quyết định ngay lúc nói)",
      "options": [
        "will to",
        "will",
        "going to",
        "am going to"
      ],
      "answer": "will",
      "explanation": "I will help you! = Tôi sẽ giúp bạn!"
    },
    {
      "type": "choice",
      "prompt": "Chọn dạng đúng: We ______ travel next month. (kế hoạch đã định)",
      "options": [
        "will",
        "will to",
        "are going to",
        "are going"
      ],
      "answer": "are going to",
      "explanation": "We are going to travel next month. = Chúng tôi định đi du lịch tháng tới."
    }
  ]
}
