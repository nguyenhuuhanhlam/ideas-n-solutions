// Sinh ngân hàng câu hỏi cho TuTi Learn English.
// QUAN TRỌNG VỀ NGUỒN: các câu hỏi ở đây là câu MỚI do chương trình soạn
// theo đúng chủ đề, từ vựng và dạng bài chuẩn của chương trình tiếng Anh
// tiểu học (CEFR Pre-A1/A1, dạng bài Cambridge Young Learners Starters/
// Movers và các chủ đề quen thuộc: chào hỏi, số đếm, gia đình, sinh hoạt,
// màu sắc, đồ ăn; ngữ pháp to be, hiện tại đơn, hiện tại tiếp diễn, quá khứ
// đơn, tương lai) — KHÔNG sao chép nguyên văn câu hỏi từ bất kỳ giáo trình
// có bản quyền nào. Chạy lại script sẽ cho cùng một file (RNG có seed).
// Cách dùng: node tools/generate-questions.mjs  (ghi ra src/data/questions.js)
import { writeFileSync } from 'node:fs'
import { lessons, conjugationGroups } from '../src/data/lessons.js'
import { irregularVerbs } from '../src/data/irregular.js'

// RNG có seed để file sinh ra ổn định, kiểm chứng được.
let seed = 20261104
function rnd() {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
function shuffleArr(a) {
  const x = [...a]
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]
  }
  return x
}
function pick(arr, n, exclude = []) {
  const pool = arr.filter((x) => !exclude.includes(x))
  const out = []
  const copy = [...pool]
  while (out.length < n && copy.length) out.push(copy.splice(Math.floor(rnd() * copy.length), 1)[0])
  return out
}
function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

function choice(prompt, answer, distractors, explanation) {
  return { type: 'choice', prompt, options: shuffleArr([answer, ...distractors]), answer, explanation }
}
function fill(prompt, answers, explanation) {
  return { type: 'fill', prompt, answers: Array.isArray(answers) ? answers : [answers], explanation }
}
function translate(prompt, answers, explanation) {
  return { type: 'translate', prompt, answers: Array.isArray(answers) ? answers : [answers], explanation }
}

// ---- Quy tắc chia động từ (chỉ dùng cho các động từ trong danh sách dưới) ----
const S_ES = new Set(['go', 'do', 'watch', 'catch', 'brush', 'fix', 'wash', 'teach'])
const DOUBLE = new Set(['run', 'swim', 'stop', 'plan', 'get', 'sit'])
function sForm(v) {
  if (v === 'go') return 'goes'
  if (v === 'do') return 'does'
  if (S_ES.has(v)) return v + 'es'
  if (/[^aeiou]y$/.test(v)) return v.slice(0, -1) + 'ies'
  return v + 's'
}
function ingForm(v) {
  if (v === 'lie') return 'lying'
  if (v === 'die') return 'dying'
  if (DOUBLE.has(v)) return v + v.slice(-1) + 'ing'
  if (v.endsWith('e') && v !== 'be') return v.slice(0, -1) + 'ing'
  return v + 'ing'
}
function edForm(v) {
  if (v.endsWith('e')) return v + 'd'
  if (/[^aeiou]y$/.test(v)) return v.slice(0, -1) + 'ied'
  if (DOUBLE.has(v)) return v + v.slice(-1) + 'ed'
  return v + 'ed'
}

// ---- Khung chung cho mọi bài: từ vựng sẵn có + câu hỏi viết tay cũ ----
function generic(lesson, add) {
  const v = lesson.vocab
  for (const item of v) {
    add(choice(`"${item.en}" có nghĩa là gì?`, item.vi, pick(v.map((x) => x.vi), 3, [item.vi]), `${item.en} = ${item.vi}.`))
    if (!item.en.includes('/') && !item.en.includes('→')) {
      const singles = v.filter((x) => !x.en.includes('/') && !x.en.includes('→')).map((x) => x.en)
      add(choice(`Từ tiếng Anh nào có nghĩa là "${item.vi}"?`, item.en, pick(singles, 3, [item.en]), `${item.en} = ${item.vi}.`))
      add(translate(`Dịch sang tiếng Anh: "${item.vi}"`, item.en, `${item.en} = ${item.vi}.`))
    }
    // Điền từ từ chính câu ví dụ của mục đó (chỉ khi dạng cần điền có mặt nguyên vẹn).
    const parts = item.en.split(/[/→]/).map((p) => p.trim()).filter((p) => p.length >= 2)
    for (const part of parts) {
      const re = new RegExp(`\\b${esc(part)}\\b`, 'i')
      if (re.test(item.example)) {
        add(fill(`Điền từ còn thiếu: ${item.example.replace(re, '______')} (${item.vi})`, part, `Câu đầy đủ: ${item.example}`))
        break
      }
    }
  }
  for (const q of lesson.questions) add(q)
}

// ---- Bài cơ bản: bài tập riêng theo chủ đề ----
function extraBasic(lesson, add) {
  if (lesson.id === 'numbers') {
    const words = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']
    const objs = [
      { en: 'pen', plural: 'pens', vi: 'cây bút' }, { en: 'book', plural: 'books', vi: 'quyển sách' },
      { en: 'cat', plural: 'cats', vi: 'con mèo' }, { en: 'dog', plural: 'dogs', vi: 'con chó' },
      { en: 'apple', plural: 'apples', vi: 'quả táo' }, { en: 'ball', plural: 'balls', vi: 'quả bóng' },
      { en: 'chair', plural: 'chairs', vi: 'cái ghế' }, { en: 'bird', plural: 'birds', vi: 'con chim' },
      { en: 'ruler', plural: 'rulers', vi: 'cái thước' }, { en: 'pencil', plural: 'pencils', vi: 'cây bút chì' },
      { en: 'orange', plural: 'oranges', vi: 'quả cam' }, { en: 'cake', plural: 'cakes', vi: 'cái bánh' },
    ]
    words.forEach((w, i) => {
      const n = i + 1
      add(choice(`Số ${n} trong tiếng Anh là gì?`, w, pick(words, 3, [w]), `${w} = số ${n}.`))
      add(choice(`"${w}" là số mấy?`, String(n), pick(words.map((_, j) => String(j + 1)), 3, [String(n)]), `${w} = số ${n}.`))
      const o = objs[i % objs.length]
      add(choice(`I have ${w} ${o.plural}. Tôi có mấy ${o.vi}?`, String(n), pick(words.map((_, j) => String(j + 1)), 3, [String(n)]), `I have ${w} ${o.plural}. = Tôi có ${n} ${o.vi}.`))
      add(fill(`Điền từ còn thiếu: I have ______ ${o.plural}. (${n})`, w, `I have ${w} ${o.plural}. = Tôi có ${n} ${o.vi}.`))
    })
    // Cộng trừ bằng tiếng Anh (số 1–10, cộng kết quả ≤ 15, trừ kết quả ≥ 1).
    const numWord = (n) => words[n - 1]
    for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) {
      if (a + b > 15) continue
      const sum = a + b
      add(fill(`${numWord(a)} + ${numWord(b)} = ______`, numWord(sum), `${numWord(a)} + ${numWord(b)} = ${numWord(sum)}.`))
      add(choice(`What is ${numWord(a)} plus ${numWord(b)}?`, numWord(sum), pick(words, 3, [numWord(sum)]), `${numWord(a)} plus ${numWord(b)} = ${numWord(sum)}.`))
    }
    for (let a = 2; a <= 10; a++) for (let b = 1; b < a; b++) {
      const diff = a - b
      add(fill(`${numWord(a)} - ${numWord(b)} = ______`, numWord(diff), `${numWord(a)} - ${numWord(b)} = ${numWord(diff)}.`))
      add(choice(`What is ${numWord(a)} minus ${numWord(b)}?`, numWord(diff), pick(words, 3, [numWord(diff)]), `${numWord(a)} minus ${numWord(b)} = ${numWord(diff)}.`))
    }
    // Số liền trước / liền sau trong dãy 1–20.
    for (let n = 1; n <= 19; n++) {
      add(choice(`What number comes after ${numWord(n)}?`, numWord(n + 1), pick(words, 3, [numWord(n + 1)]), `After ${numWord(n)} comes ${numWord(n + 1)}.`))
    }
    for (let n = 2; n <= 20; n++) {
      add(choice(`What number comes before ${numWord(n)}?`, numWord(n - 1), pick(words, 3, [numWord(n - 1)]), `Before ${numWord(n)} comes ${numWord(n - 1)}.`))
    }
  }
  if (lesson.id === 'greetings') {
    const sits = [
      { time: 'buổi sáng', g: 'Good morning' }, { time: 'buổi chiều', g: 'Good afternoon' },
      { time: 'buổi tối', g: 'Good evening' }, { time: 'trước khi đi ngủ', g: 'Good night' },
    ]
    for (const s of sits) add(choice(`${s.time} gặp bạn bè, bạn chào thế nào?`, s.g, pick(sits.map((x) => x.g), 3, [s.g]), `${s.g} dùng vào ${s.time}.`))
    add(choice('Câu nào dùng để tạm biệt?', 'Goodbye', ['Hello', 'Thank you', 'Please'], 'Goodbye = tạm biệt.'))
    add(choice('Câu nào dùng để cảm ơn?', 'Thank you', ['Sorry', 'Goodbye', 'Please'], 'Thank you = cảm ơn.'))
    add(choice('Muốn nhờ ai đó làm gì, bạn nói gì trước câu nhờ?', 'Please', ['Sorry', 'Thank you', 'Goodbye'], 'Please = làm ơn, dùng khi nhờ ai làm gì.'))
    for (const name of ['Lan', 'Minh', 'Hoa', 'Nam', 'An']) add(fill(`Điền từ còn thiếu: My ______ is ${name}.`, 'name', `My name is ${name}. = Tôi tên là ${name}.`))
    const names10 = ['Lan', 'Minh', 'Hoa', 'Nam', 'An', 'Mai', 'Tom', 'Anna', 'Linh', 'Tuan']
    for (const name of ['Mai', 'Tom', 'Anna', 'Linh', 'Tuan']) add(fill(`Điền từ còn thiếu: My ______ is ${name}.`, 'name', `My name is ${name}. = Tôi tên là ${name}.`))
    // Hỏi thăm sức khỏe và đáp lại.
    add(choice('Khi gặp bạn, bạn hỏi "Bạn khỏe không?" bằng câu nào?', 'How are you?', ['How old are you?', 'What is your name?', 'Good night!'], 'How are you? = Bạn khỏe không?'))
    add(fill('Điền từ còn thiếu: ______ are you? (Bạn khỏe không?)', 'how', 'How are you? = Bạn khỏe không?'))
    add(choice('Bạn trả lời "Tôi khỏe, cảm ơn" thế nào?', "I'm fine, thank you.", ["I'm five.", 'My name is Lan.', 'Goodbye!'], "I'm fine, thank you. = Tôi khỏe, cảm ơn."))
    add(fill('Điền cụm còn thiếu: ______ fine, thank you. (Tôi khỏe, cảm ơn)', "i'm", "I'm fine, thank you. = Tôi khỏe, cảm ơn."))
    // Hỏi tên và tuổi khi giới thiệu.
    add(choice('Hỏi tên bạn mới thế nào?', 'What is your name?', ['How old are you?', 'How are you?', 'Good night!'], 'What is your name? = Tên bạn là gì?'))
    add(fill('Điền từ còn thiếu: ______ is your name? (Tên bạn là gì?)', 'what', 'What is your name? = Tên bạn là gì?'))
    add(translate('Dịch sang tiếng Anh: "Tên bạn là gì?"', 'what is your name', 'What is your name? = Tên bạn là gì?'))
    const ages = [['six', 6], ['seven', 7], ['eight', 8], ['nine', 9], ['ten', 10], ['eleven', 11], ['twelve', 12]]
    for (const [aw, ad] of ages) {
      add(choice(`Lan is ${aw} years old. Lan mấy tuổi?`, String(ad), pick(ages.map((x) => String(x[1])), 3, [String(ad)]), `Lan is ${aw} years old. = Lan ${ad} tuổi.`))
      add(fill(`Điền từ còn thiếu: I am ______ years old. (Tôi ${ad} tuổi.)`, aw, `I am ${aw} years old. = Tôi ${ad} tuổi.`))
      add(translate(`Dịch sang tiếng Anh: "Tôi ${ad} tuổi."`, `i am ${aw} years old`, `I am ${aw} years old. = Tôi ${ad} tuổi.`))
    }
    // Chào theo buổi (dạng điền từ) và tạm biệt kiểu khác.
    for (const s of sits) add(fill(`Điền từ còn thiếu: ______ ${s.g.split(' ')[1]}! (${s.time})`, 'good', `${s.g}! dùng vào ${s.time}.`))
    add(choice('Câu nào dùng để tạm biệt và hẹn gặp lại sau?', 'See you later!', ['Good morning!', 'Thank you!', 'Sorry!'], 'See you later! = Hẹn gặp lại sau!'))
    add(choice('"See you tomorrow!" có nghĩa là gì?', 'Hẹn gặp lại ngày mai!', ['Chào buổi sáng!', 'Cảm ơn bạn!', 'Xin lỗi nhé!'], 'See you tomorrow! = Hẹn gặp lại ngày mai!'))
    add(choice('Câu nào dùng khi gặp thầy cô buổi sáng?', 'Good morning, teacher!', ['Good night, teacher!', 'Goodbye, teacher!', 'Thank you, teacher!'], 'Good morning, teacher! = Chào thầy/cô buổi sáng!'))
    add(choice('Câu nào dùng khi gặp thầy cô buổi chiều?', 'Good afternoon, teacher!', ['Good night, teacher!', 'Goodbye, teacher!', 'Thank you, teacher!'], 'Good afternoon, teacher! = Chào thầy/cô buổi chiều!'))
    add(choice('Câu nào dùng khi gặp thầy cô buổi tối?', 'Good evening, teacher!', ['Good night, teacher!', 'Goodbye, teacher!', 'Thank you, teacher!'], 'Good evening, teacher! = Chào thầy/cô buổi tối!'))
    // Hội thoại ngắn: chào lại và đáp lại lời cảm ơn.
    add(choice('A: Hello! B: ______', 'Hi!', ['Goodbye!', 'Thank you!', 'Sorry!'], 'A: Hello! B: Hi! = Chào! — Chào!'))
    add(choice('A: Thank you! B: ______', "You're welcome!", ['Goodbye!', 'Sorry!', 'Good morning!'], "You're welcome! = Không có gì! (đáp lại lời cảm ơn)"))
    // Tự giới thiệu có tên riêng.
    for (const name of names10) {
      add(translate(`Dịch sang tiếng Anh: "Xin chào, tôi tên là ${name}."`, `hello, my name is ${name.toLowerCase()}`, `Hello, my name is ${name}. = Xin chào, tôi tên là ${name}.`))
    }
  }
  if (lesson.id === 'family') {
    const members = [
      { en: 'mother', vi: 'mẹ' }, { en: 'father', vi: 'bố' }, { en: 'sister', vi: 'chị/em gái' },
      { en: 'brother', vi: 'anh/em trai' }, { en: 'grandmother', vi: 'bà' }, { en: 'grandfather', vi: 'ông' },
      { en: 'uncle', vi: 'chú/bác' }, { en: 'aunt', vi: 'cô/dì' }, { en: 'son', vi: 'con trai' },
      { en: 'daughter', vi: 'con gái' }, { en: 'baby', vi: 'em bé' },
    ]
    const poss = [
      { en: 'my', tail: 'tôi' }, { en: 'his', tail: 'của anh ấy' }, { en: 'her', tail: 'của cô ấy' },
      { en: 'your', tail: 'của bạn' }, { en: 'our', tail: 'của chúng tôi' }, { en: 'their', tail: 'của họ' },
    ]
    for (const p of poss) for (const m of members) {
      const vi = `${m.vi} ${p.tail}`
      const others = poss.flatMap((pp) => members.map((mm) => `${mm.vi} ${pp.tail}`)).filter((x) => x !== vi)
      add(choice(`"${p.en} ${m.en}" có nghĩa là gì?`, vi, pick(others, 3, [vi]), `${p.en} ${m.en} = ${vi}.`))
      add(fill(`Điền từ còn thiếu: This is ______ ${m.en}. (Đây là ${vi}.)`, p.en, `This is ${p.en} ${m.en}. = Đây là ${vi}.`))
      add(translate(`Dịch sang tiếng Anh: "Đây là ${vi}."`, `this is ${p.en} ${m.en}`, `This is ${p.en} ${m.en}. = Đây là ${vi}.`))
    }
    // Sở hữu cách 's: mẹ của Lan = Lan's mother.
    for (const m of members.slice(0, 6)) {
      add(choice(`"Lan's ${m.en}" có nghĩa là gì?`, `${m.vi} của Lan`, pick(members.filter((x) => x.en !== m.en).map((x) => `${x.vi} của Lan`), 3), `Lan's ${m.en} = ${m.vi} của Lan.`))
    }
    // Câu trả lời ngắn viết đúng ngữ pháp cho câu hỏi Is this...?
    for (const m of members.slice(0, 6)) {
      add(choice(`Câu trả lời ngắn nào viết đúng ngữ pháp cho "Is this your ${m.en}?"?`, 'Yes, it is.', ['Yes, it are.', 'No, it am.', 'Yes, it do.'], `Is this your ${m.en}? — Yes, it is. (it + is, không dùng are/am/do)`))
    }
  }
  if (lesson.id === 'daily-routine') {
    const acts = [
      { base: 'get up', third: 'gets up', ing: 'getting up', past: 'got up', vi: 'thức dậy', time: 'morning' },
      { base: 'brush my teeth', third: 'brushes his teeth', thirdShe: 'brushes her teeth', ing: 'brushing teeth', past: 'brushed my teeth', vi: 'đánh răng', time: 'morning' },
      { base: 'have breakfast', third: 'has breakfast', ing: 'having breakfast', past: 'had breakfast', vi: 'ăn sáng', time: 'morning' },
      { base: 'go to school', third: 'goes to school', ing: 'going to school', past: 'went to school', vi: 'đi học', time: 'morning' },
      { base: 'have lunch', third: 'has lunch', ing: 'having lunch', past: 'had lunch', vi: 'ăn trưa', time: 'afternoon' },
      { base: 'go home', third: 'goes home', ing: 'going home', past: 'went home', vi: 'về nhà', time: 'afternoon' },
      { base: 'do homework', third: 'does homework', ing: 'doing homework', past: 'did homework', vi: 'làm bài tập', time: 'evening' },
      { base: 'go to bed', third: 'goes to bed', ing: 'going to bed', past: 'went to bed', vi: 'đi ngủ', time: 'evening' },
    ]
    const times = ['five', 'six', 'seven', 'eight', 'nine', 'ten']
    acts.forEach((a, i) => {
      for (const t of [times[i % 6], times[(i + 3) % 6]]) {
        add(fill(`Điền từ còn thiếu: I ______ at ${t}. (${a.vi})`, a.base, `I ${a.base} at ${t}.`))
      }
      add(choice(`I ${a.base} at six. Câu này nói tôi làm gì?`, a.vi, pick(acts.map((x) => x.vi), 3, [a.vi]), `I ${a.base} at six. = Tôi ${a.vi} lúc 6 giờ.`))
      // He/She + dạng -s (brush my teeth: his/her theo chủ ngữ).
      add(choice(`He ______ at seven. (${a.base})`, a.third, [a.base, a.ing, a.past], `He/she + động từ thêm -s: He ${a.third} at seven.`))
      add(fill(`Điền dạng đúng: He ______ (${a.base}) at seven.`, a.third, `He ${a.third} at seven.`))
      const sheForm = a.thirdShe ?? a.third
      add(choice(`She ______ at seven. (${a.base})`, sheForm, [a.base, a.ing, a.past], `He/she + động từ thêm -s: She ${sheForm} at seven.`))
      add(fill(`Điền dạng đúng: She ______ (${a.base}) at seven.`, sheForm, `She ${sheForm} at seven.`))
      // Phủ định don't / doesn't.
      add(choice(`Chọn dạng đúng: I ______ ${a.base} at six. (không làm)`, "don't", ["doesn't", "isn't", "won't"], `I don't ${a.base} at six. = Tôi không ${a.vi} lúc 6 giờ.`))
      add(choice(`Chọn dạng đúng: She ______ ${a.base} at seven. (không làm)`, "doesn't", ["don't", "isn't", "won't"], `She doesn't ${a.base} at seven. = Cô ấy không ${a.vi} lúc 7 giờ.`))
      // Câu hỏi Do / Does.
      add(fill(`Điền từ còn thiếu: ______ you ${a.base} at six?`, 'do', `Do you ${a.base} at six? = Bạn có ${a.vi} lúc 6 giờ không?`))
      add(fill(`Điền từ còn thiếu: ______ she ${a.base} at seven?`, 'does', `Does she ${a.base} at seven? = Cô ấy có ${a.vi} lúc 7 giờ không?`))
      // Buổi trong ngày và dịch câu sinh hoạt.
      add(fill(`Điền từ còn thiếu: I ${a.base} in the ______.`, a.time, `I ${a.base} in the ${a.time}.`))
      add(translate(`Dịch sang tiếng Anh: "Tôi ${a.vi} lúc 6 giờ."`, `i ${a.base} at six`, `I ${a.base} at six. = Tôi ${a.vi} lúc 6 giờ.`))
    })
    // Thứ tự sinh hoạt: làm gì sau hoạt động trước đó?
    for (let i = 0; i < acts.length - 1; i++) {
      const cur = acts[i], next = acts[i + 1]
      add(choice(`Bạn làm gì sau khi ${cur.vi}?`, next.base, pick(acts.map((x) => x.base), 3, [next.base]), `Sau khi ${cur.vi} thì ${next.vi}: after ${cur.ing}, I ${next.base}.`))
      add(fill(`Điền từ còn thiếu: After ${cur.ing}, I ______.`, next.base, `After ${cur.ing}, I ${next.base}.`))
    }
  }
  if (lesson.id === 'colors-objects') {
    const colors = [
      { en: 'red', vi: 'màu đỏ', short: 'đỏ' }, { en: 'blue', vi: 'màu xanh dương', short: 'xanh dương' },
      { en: 'green', vi: 'màu xanh lá', short: 'xanh lá' }, { en: 'yellow', vi: 'màu vàng', short: 'vàng' },
      { en: 'pink', vi: 'màu hồng', short: 'hồng' }, { en: 'purple', vi: 'màu tím', short: 'tím' },
      { en: 'orange', vi: 'màu cam', short: 'cam' }, { en: 'black', vi: 'màu đen', short: 'đen' },
      { en: 'white', vi: 'màu trắng', short: 'trắng' }, { en: 'brown', vi: 'màu nâu', short: 'nâu' },
    ]
    const objs = [
      { en: 'pen', plural: 'pens', vi: 'cây bút', art: 'a' }, { en: 'book', plural: 'books', vi: 'quyển sách', art: 'a' },
      { en: 'bag', plural: 'bags', vi: 'cái cặp', art: 'a' }, { en: 'chair', plural: 'chairs', vi: 'cái ghế', art: 'a' },
      { en: 'apple', plural: 'apples', vi: 'quả táo', art: 'an' }, { en: 'egg', plural: 'eggs', vi: 'quả trứng', art: 'an' },
      { en: 'ruler', plural: 'rulers', vi: 'cái thước', art: 'a' }, { en: 'pencil', plural: 'pencils', vi: 'cây bút chì', art: 'a' },
      { en: 'eraser', plural: 'erasers', vi: 'cục tẩy', art: 'an' }, { en: 'desk', plural: 'desks', vi: 'cái bàn', art: 'a' },
      { en: 'door', plural: 'doors', vi: 'cánh cửa', art: 'a' }, { en: 'ball', plural: 'balls', vi: 'quả bóng', art: 'a' },
    ]
    colors.forEach((c, i) => {
      for (const o of [objs[i % 12], objs[(i + 3) % 12], objs[(i + 6) % 12], objs[(i + 9) % 12]]) {
        add(fill(`Điền từ còn thiếu: The ${o.en} is ______ (${c.vi}).`, c.en, `The ${o.en} is ${c.en}.`))
        add(translate(`Dịch sang tiếng Anh: "${o.vi} màu ${c.short}."`, `the ${o.en} is ${c.en}`, `The ${o.en} is ${c.en}. = ${o.vi} màu ${c.short}.`))
      }
      // Số nhiều: The pens are red.
      for (const o of [objs[(i + 1) % 12], objs[(i + 5) % 12]]) {
        add(fill(`Điền từ còn thiếu: The ${o.plural} are ______ (${c.vi}).`, c.en, `The ${o.plural} are ${c.en}.`))
      }
      // Thích đồ màu nào: I like the red pen.
      for (const o of [objs[(i + 2) % 12], objs[(i + 7) % 12]]) {
        const otherColor = colors[(i + 4) % 10]
        const otherObj = objs[(i + 4) % 12]
        add(choice(`Bạn thích ${o.vi} màu ${c.short}. Nói bằng tiếng Anh thế nào?`, `I like the ${c.en} ${o.en}.`, [`I like the ${otherColor.en} ${o.en}.`, `I like the ${c.en} ${otherObj.en}.`, `I like ${c.en} ${o.en}.`], `I like the ${c.en} ${o.en}. = Tôi thích ${o.vi} màu ${c.short}.`))
      }
    })
    for (const o of objs) {
      add(choice(`Chọn từ đúng: This is ______ ${o.en}.`, o.art, pick(['a', 'an', 'the', 'không cần từ nào'], 3, [o.art]), `This is ${o.art} ${o.en}.`))
    }
  }
  if (lesson.id === 'food-drink') {
    const foods = [
      { en: 'rice', vi: 'cơm', kind: 'eat' }, { en: 'bread', vi: 'bánh mì', kind: 'eat' }, { en: 'egg', vi: 'quả trứng', kind: 'eat' },
      { en: 'milk', vi: 'sữa', kind: 'drink' }, { en: 'water', vi: 'nước', kind: 'drink' }, { en: 'coffee', vi: 'cà phê', kind: 'drink' },
      { en: 'apple', vi: 'quả táo', kind: 'eat' }, { en: 'banana', vi: 'quả chuối', kind: 'eat' },
      { en: 'cake', vi: 'bánh ngọt', kind: 'eat' }, { en: 'fish', vi: 'cá', kind: 'eat' }, { en: 'chicken', vi: 'thịt gà', kind: 'eat' },
      { en: 'noodles', vi: 'mì', kind: 'eat' }, { en: 'juice', vi: 'nước ép', kind: 'drink' }, { en: 'tea', vi: 'trà', kind: 'drink' },
      { en: 'sandwich', vi: 'bánh mì kẹp', kind: 'eat' }, { en: 'pizza', vi: 'pizza', kind: 'eat' },
    ]
    for (const f of foods) {
      add(choice(`Bạn có thích ${f.vi} không? Hỏi bằng tiếng Anh thế nào?`, `Do you like ${f.en}?`, [`Do you likes ${f.en}?`, `Are you like ${f.en}?`, `You like ${f.en}?`], `Do you like ${f.en}? = Bạn có thích ${f.vi} không?`))
      add(fill(`Điền từ còn thiếu: I ______ ${f.en}. (thích)`, 'like', `I like ${f.en}. = Tôi thích ${f.vi}.`))
      add(fill(`Điền từ còn thiếu: She ______ ${f.en}. (thích)`, 'likes', `She likes ${f.en}. = Cô ấy thích ${f.vi}.`))
      add(fill(`Điền từ còn thiếu: I do not ______ ${f.en}. (thích)`, 'like', `I do not like ${f.en}. = Tôi không thích ${f.vi}.`))
      add(fill(`Trả lời ngắn: Do you like ${f.en}? — Yes, ______.`, 'i do', `Do you like ${f.en}? — Yes, I do. = Bạn có thích ${f.vi} không? — Có.`))
      add(fill(`Trả lời ngắn: Do you like ${f.en}? — No, ______.`, ['i do not', "i don't"], `Do you like ${f.en}? — No, I do not. = Bạn có thích ${f.vi} không? — Không.`))
      add(choice(`Bạn thích ${f.vi}. Nói bằng tiếng Anh thế nào?`, `I like ${f.en}.`, pick(foods.map((x) => `I like ${x.en}.`), 3, [`I like ${f.en}.`]), `I like ${f.en}. = Tôi thích ${f.vi}.`))
      add(fill(`Điền từ còn thiếu: She wants ______. (${f.vi})`, f.en, `She wants ${f.en}. = Cô ấy muốn ${f.vi}.`))
      add(fill(`Điền từ còn thiếu: I want some ______. (${f.vi})`, f.en, `I want some ${f.en}. = Tôi muốn một ít ${f.vi}.`))
      const verb = f.kind === 'eat' ? 'eat' : 'drink'
      const verb3 = f.kind === 'eat' ? 'eats' : 'drinks'
      const verbVi = f.kind === 'eat' ? 'ăn' : 'uống'
      add(fill(`Điền từ còn thiếu: I ${verb} ______. (${f.vi})`, f.en, `I ${verb} ${f.en}. = Tôi ${verbVi} ${f.vi}.`))
      add(fill(`Điền từ còn thiếu: She ______ ${f.en}. (${verbVi})`, verb3, `She ${verb3} ${f.en}. = Cô ấy ${verbVi} ${f.vi}.`))
    }
  }
}

// ---- Nhóm chia động từ: bài tập theo quy tắc ----
function extraConj(lesson, add) {
  if (lesson.id === 'to-be') {
    const subs = [
      { s: 'I', pres: 'am', past: 'was', negPres: 'am not', negPast: 'was not', qPres: 'Am', qPast: 'Was' },
      { s: 'He', pres: 'is', past: 'was', negPres: "isn't", negPast: "wasn't", qPres: 'Is', qPast: 'Was' },
      { s: 'She', pres: 'is', past: 'was', negPres: "isn't", negPast: "wasn't", qPres: 'Is', qPast: 'Was' },
      { s: 'It', pres: 'is', past: 'was', negPres: "isn't", negPast: "wasn't", qPres: 'Is', qPast: 'Was' },
      { s: 'We', pres: 'are', past: 'were', negPres: "aren't", negPast: "weren't", qPres: 'Are', qPast: 'Were' },
      { s: 'They', pres: 'are', past: 'were', negPres: "aren't", negPast: "weren't", qPres: 'Are', qPast: 'Were' },
      { s: 'Lan', pres: 'is', past: 'was', negPres: "isn't", negPast: "wasn't", qPres: 'Is', qPast: 'Was' },
      { s: 'Nam', pres: 'is', past: 'was', negPres: "isn't", negPast: "wasn't", qPres: 'Is', qPast: 'Was' },
      { s: 'My parents', pres: 'are', past: 'were', negPres: "aren't", negPast: "weren't", qPres: 'Are', qPast: 'Were' },
      { s: 'The cat', pres: 'is', past: 'was', negPres: "isn't", negPast: "wasn't", qPres: 'Is', qPast: 'Was' },
      { s: 'Hoa', pres: 'is', past: 'was', negPres: "isn't", negPast: "wasn't", qPres: 'Is', qPast: 'Was' },
      { s: 'The dogs', pres: 'are', past: 'were', negPres: "aren't", negPast: "weren't", qPres: 'Are', qPast: 'Were' },
      { s: 'My brother', pres: 'is', past: 'was', negPres: "isn't", negPast: "wasn't", qPres: 'Is', qPast: 'Was' },
      { s: 'My sister', pres: 'is', past: 'was', negPres: "isn't", negPast: "wasn't", qPres: 'Is', qPast: 'Was' },
      { s: 'The teacher', pres: 'is', past: 'was', negPres: "isn't", negPast: "wasn't", qPres: 'Is', qPast: 'Was' },
      { s: 'Mr. Nam', pres: 'is', past: 'was', negPres: "isn't", negPast: "wasn't", qPres: 'Is', qPast: 'Was' },
      { s: 'Mrs. Lan', pres: 'is', past: 'was', negPres: "isn't", negPast: "wasn't", qPres: 'Is', qPast: 'Was' },
      { s: 'Tom', pres: 'is', past: 'was', negPres: "isn't", negPast: "wasn't", qPres: 'Is', qPast: 'Was' },
      { s: 'Anna', pres: 'is', past: 'was', negPres: "isn't", negPast: "wasn't", qPres: 'Is', qPast: 'Was' },
      { s: 'The students', pres: 'are', past: 'were', negPres: "aren't", negPast: "weren't", qPres: 'Are', qPast: 'Were' },
      { s: 'My friends', pres: 'are', past: 'were', negPres: "aren't", negPast: "weren't", qPres: 'Are', qPast: 'Were' },
      { s: 'The birds', pres: 'are', past: 'were', negPres: "aren't", negPast: "weren't", qPres: 'Are', qPast: 'Were' },
      { s: 'The book', pres: 'is', past: 'was', negPres: "isn't", negPast: "wasn't", qPres: 'Is', qPast: 'Was' },
      { s: 'The school', pres: 'is', past: 'was', negPres: "isn't", negPast: "wasn't", qPres: 'Is', qPast: 'Was' },
    ]
    const adjs = ['happy', 'sad', 'tired', 'busy', 'hungry', 'thirsty', 'sick', 'ready', 'late', 'early', 'free', 'kind']
    const forms = ['am', 'is', 'are', 'was', 'were']
    const negPool = ['am not', "isn't", "aren't", 'was not', "wasn't", "weren't"]
    const negTwin = { 'was not': "wasn't", "wasn't": 'was not' }
    for (let i = 0; i < subs.length; i++) {
      const sub = subs[i]
      const adj1 = adjs[i % adjs.length]
      const adj2 = adjs[(i + 5) % adjs.length]
      for (const adj of [adj1, adj2]) {
        add(choice(`Chọn dạng đúng: ${sub.s} ______ ${adj} today.`, sub.pres, pick(forms, 3, [sub.pres]), `${sub.s} + ${sub.pres} ${adj} (hiện tại).`))
        add(choice(`Chọn dạng đúng: ${sub.s} ______ ${adj} yesterday.`, sub.past, pick(forms, 3, [sub.past]), `${sub.s} + ${sub.past} ${adj} (quá khứ).`))
        add(fill(`Điền dạng đúng: ${sub.s} ______ ${adj} today.`, sub.pres, `${sub.s} ${sub.pres} ${adj} today.`))
        add(fill(`Điền dạng đúng: ${sub.s} ______ ${adj} yesterday.`, sub.past, `${sub.s} ${sub.past} ${adj} yesterday.`))
      }
      // Phủ định và câu hỏi (dùng tính từ đầu tiên của chủ ngữ đó).
      // Chú ý: was not và wasn't là 1 dạng nên không được cùng làm đáp án nhiễu.
      add(choice(`Chọn dạng đúng: ${sub.s} ______ ${adj1} today. (phủ định)`, sub.negPres, pick(negPool, 3, [sub.negPres, negTwin[sub.negPres]].filter(Boolean)), `${sub.s} ${sub.negPres} ${adj1} today.`))
      add(choice(`Chọn dạng đúng: ${sub.s} ______ ${adj1} yesterday. (phủ định)`, sub.negPast, pick(negPool, 3, [sub.negPast, negTwin[sub.negPast]].filter(Boolean)), `${sub.s} ${sub.negPast} ${adj1} yesterday.`))
      add(fill(`Điền dạng đúng: ______ ${sub.s} ${adj1} today?`, sub.qPres, `${sub.qPres} ${sub.s} ${adj1} today?`))
      add(fill(`Điền dạng đúng: ______ ${sub.s} ${adj1} yesterday?`, sub.qPast, `${sub.qPast} ${sub.s} ${adj1} yesterday?`))
    }
    add(choice('Chọn câu đúng: He ______ happy.', "isn't", ['aren’t', 'am not', "wasn't"], "He isn't happy. = Anh ấy không vui."))
    add(choice('Chọn câu đúng: They ______ students.', "aren't", ['isn’t', 'am not', "wasn't"], "They aren't students. = Họ không phải là học sinh."))
  }
  if (lesson.id === 'present-simple') {
    const verbs = ['play', 'watch', 'study', 'brush', 'catch', 'fix', 'go', 'do', 'read', 'sing', 'dance', 'cook', 'run', 'swim', 'jump', 'look', 'like', 'love', 'help', 'wash', 'try', 'carry', 'fly', 'work', 'eat', 'drink', 'sleep', 'walk', 'speak', 'teach', 'learn', 'draw', 'write', 'sit', 'stand', 'open', 'close', 'clean', 'listen', 'say', 'ask', 'answer', 'call', 'visit', 'wait', 'laugh', 'smile', 'climb', 'drive', 'ride']
    const thirds = ['He', 'She', 'Lan']
    const bases = ['I', 'You', 'We', 'They']
    const pastOf = (v) => ({ go: 'went', do: 'did' })[v] || edForm(v)
    verbs.forEach((v, i) => {
      const subj = thirds[i % 3]
      const f = sForm(v)
      add(choice(`Chọn dạng đúng: ${subj} ______ every day. (${v})`, f, pick([v, ingForm(v), pastOf(v)], 3, [f]), `${subj} + ${f} (he/she/it + động từ thêm -s/-es).`))
      add(fill(`Điền dạng đúng: ${subj} ______ (${v}) every day.`, f, `${subj} ${f} every day.`))
      const subj2 = bases[i % 4]
      add(choice(`Chọn dạng đúng: ${subj2} ______ every day. (${v})`, v, pick([sForm(v), ingForm(v), pastOf(v)], 3, [v]), `${subj2} + ${v} (I/you/we/they + động từ nguyên thể).`))
    })
    // Dạng -s/-es/-ies hỏi trực tiếp (chỉ các động từ có quy tắc đặc biệt).
    for (const v of verbs.filter((x) => S_ES.has(x) || /[^aeiou]y$/.test(x) || x === 'go' || x === 'do')) {
      add(choice(`Dạng đúng của "${v}" với she là gì?`, sForm(v), pick([v, ingForm(v), pastOf(v)], 3, [sForm(v)]), `She + ${sForm(v)}.`))
      add(fill(`Điền dạng đúng: She ______ (${v}).`, sForm(v), `She ${sForm(v)}.`))
    }
    // Phủ định và câu hỏi với does/do.
    verbs.slice(0, 25).forEach((v) => {
      add(choice(`Chọn dạng đúng: She ______ ${v}. (không)`, "doesn't", ["don't", "isn't", "won't"], `She doesn't ${v}. = Cô ấy không ${v}.`))
      add(choice(`Chọn dạng đúng: They ______ ${v}. (không)`, "don't", ["doesn't", "isn't", "won't"], `They don't ${v}. = Họ không ${v}.`))
      add(fill(`Điền trợ động từ: ______ she ${v}?`, 'does', `Does she ${v}? = Cô ấy có ${v} không?`))
      add(fill(`Điền trợ động từ: ______ they ${v}?`, 'do', `Do they ${v}? = Họ có ${v} không?`))
    })
    add(choice('Chọn từ đúng: She ______ like milk.', "doesn't", ['don’t', "isn't", "won't"], "She doesn't like milk. = Cô ấy không thích sữa."))
    add(choice('Chọn từ đúng: They ______ like milk.', "don't", ['doesn’t', "isn't", "won't"], "They don't like milk. = Họ không thích sữa."))
  }
  if (lesson.id === 'present-continuous') {
    // Mỗi động từ đi với tân ngữ/phó từ riêng để câu luôn có nghĩa
    // (tránh lỗi kiểu "She is swimming a book now").
    const verbs = [
      { v: 'read', obj: 'a book' }, { v: 'run', obj: 'in the park' }, { v: 'swim', obj: 'in the pool' },
      { v: 'play', obj: 'football' }, { v: 'sing', obj: 'a song' }, { v: 'dance', obj: 'at the party' },
      { v: 'cook', obj: 'dinner' }, { v: 'watch', obj: 'TV' }, { v: 'study', obj: 'English' },
      { v: 'write', obj: 'a letter' }, { v: 'make', obj: 'a cake' }, { v: 'ride', obj: 'a bike' },
      { v: 'jump', obj: 'very high' }, { v: 'look', obj: 'at the picture' }, { v: 'listen', obj: 'to music' },
      { v: 'sleep', obj: 'in bed' },
      { v: 'eat', obj: 'lunch' }, { v: 'drink', obj: 'milk' }, { v: 'walk', obj: 'to school' },
      { v: 'draw', obj: 'a picture' }, { v: 'sit', obj: 'on a chair' }, { v: 'talk', obj: 'to a friend' },
      { v: 'laugh', obj: 'with friends' }, { v: 'smile', obj: 'at me' }, { v: 'climb', obj: 'a tree' },
      { v: 'drive', obj: 'a car' }, { v: 'clean', obj: 'the room' }, { v: 'wash', obj: 'her hands' },
      { v: 'wait', obj: 'for a bus' },
    ]
    const subs = [
      { s: 'She', be: 'is' }, { s: 'He', be: 'is' }, { s: 'Lan', be: 'is' }, { s: 'I', be: 'am' },
      { s: 'We', be: 'are' }, { s: 'They', be: 'are' },
    ]
    verbs.forEach((item, i) => {
      const sub = subs[i % subs.length]
      const form = `${sub.be} ${ingForm(item.v)}`
      add(choice(`Chọn dạng đúng: ${sub.s} ______ ${item.obj} now. (${item.v})`, form, [`${sub.be} ${item.v}`, `${sub.be === 'am' ? 'is' : 'am'} ${ingForm(item.v)}`, item.v], `${sub.s} ${form} ${item.obj} now.`))
      add(fill(`Điền dạng đúng: ${sub.s} ______ (${item.v}) ${item.obj} now.`, form, `${sub.s} ${form} ${item.obj} now.`))
      // Phủ định: is not / are not / am not.
      const neg = sub.be === 'am' ? 'am not' : sub.be === 'is' ? 'is not' : 'are not'
      add(choice(`Chọn dạng đúng: ${sub.s} ______ ${ingForm(item.v)} ${item.obj} now. (phủ định)`, neg, ['am not', 'is not', 'are not'].filter((x) => x !== neg).concat([sub.be]), `${sub.s} ${neg} ${ingForm(item.v)} ${item.obj} now.`))
      // Câu hỏi: Is/Are + chủ ngữ + V-ing?
      add(fill(`Điền trợ động từ: ______ ${sub.s} ${ingForm(item.v)} ${item.obj} now?`, sub.be, `${sub.be[0].toUpperCase() + sub.be.slice(1)} ${sub.s} ${ingForm(item.v)} ${item.obj} now?`))
      // Hỏi đang làm gì: prompt có gợi ý động từ/tân ngữ để đáp án là duy nhất
      // (không gợi ý thì mọi câu đều là "What is She doing?" nhưng đáp án khác nhau).
      const wrongBe = sub.be === 'am' ? 'is' : sub.be === 'is' ? 'are' : 'am'
      add(choice(`What ${sub.be} ${sub.s} doing? (${item.v} ${item.obj})`, `${sub.s} ${sub.be} ${ingForm(item.v)} ${item.obj}.`, [`${sub.s} ${sub.be} ${item.v} ${item.obj}.`, `${sub.s} ${ingForm(item.v)} ${item.obj}.`, `${sub.s} ${wrongBe} ${ingForm(item.v)} ${item.obj}.`], `${sub.s} ${sub.be} ${ingForm(item.v)} ${item.obj}.`))
      // Look! + câu tiếp diễn.
      add(choice(`Look! ${sub.s} ______ ${item.obj}.`, form, [`${sub.be} ${item.v}`, item.v, ingForm(item.v)], `Look! ${sub.s} ${form} ${item.obj}.`))
      // Dấu hiệu at the moment.
      add(choice(`Chọn dạng đúng: ${sub.s} ______ ${item.obj} at the moment. (${item.v})`, form, [`${sub.be} ${item.v}`, `${sub.be === 'am' ? 'is' : 'am'} ${ingForm(item.v)}`, item.v], `${sub.s} ${form} ${item.obj} at the moment.`))
      add(fill(`Điền dạng đúng: ${sub.s} ______ (${item.v}) ${item.obj} at the moment.`, form, `${sub.s} ${form} ${item.obj} at the moment.`))
    })
  }
  if (lesson.id === 'past-regular') {
    // Mỗi động từ đi với tân ngữ riêng để câu luôn có nghĩa
    // (tránh lỗi kiểu "she worked her grandmother").
    const verbs = [
      { v: 'work', obj: 'at home' }, { v: 'watch', obj: 'TV' }, { v: 'visit', obj: 'her grandmother' },
      { v: 'live', obj: null }, { v: 'study', obj: 'English' }, { v: 'play', obj: 'football' },
      { v: 'stop', obj: 'at the shop' }, { v: 'plan', obj: 'a trip' }, { v: 'look', obj: 'at the picture' },
      { v: 'cook', obj: 'dinner' }, { v: 'clean', obj: 'the room' }, { v: 'wash', obj: 'her hands' },
      { v: 'help', obj: 'her mother' }, { v: 'dance', obj: 'at the party' }, { v: 'move', obj: 'the chair' },
      { v: 'like', obj: 'ice cream' }, { v: 'love', obj: 'music' }, { v: 'jump', obj: 'very high' },
      { v: 'arrive', obj: 'home' }, { v: 'wait', obj: 'for a bus' }, { v: 'walk', obj: 'to school' },
      { v: 'talk', obj: 'to a friend' }, { v: 'laugh', obj: 'with friends' }, { v: 'smile', obj: 'at me' },
      { v: 'climb', obj: 'a tree' }, { v: 'open', obj: 'the door' }, { v: 'close', obj: 'the window' },
      { v: 'ask', obj: 'a question' }, { v: 'answer', obj: 'the teacher' }, { v: 'call', obj: 'her mother' },
      { v: 'want', obj: 'a new bike' }, { v: 'need', obj: 'some water' }, { v: 'start', obj: 'a new book' },
      { v: 'finish', obj: 'her homework' }, { v: 'paint', obj: 'a picture' }, { v: 'count', obj: 'to ten' },
      { v: 'show', obj: 'me the photo' }, { v: 'use', obj: 'a pen' },
    ]
    for (const item of verbs) {
      const f = edForm(item.v)
      add(choice(`Chọn dạng quá khứ đúng của "${item.v}":`, f, pick([item.v, ingForm(item.v), sForm(item.v)], 3, [f]), `${item.v} → ${f} (quá khứ đơn có quy tắc).`))
      if (item.obj) {
        add(choice(`Chọn dạng đúng: Yesterday, she ______ ${item.obj}. (${item.v})`, f, pick([item.v, ingForm(item.v), sForm(item.v)], 3, [f]), `Yesterday, she ${f} ${item.obj}.`))
        add(fill(`Điền dạng đúng: Yesterday, I ______ ${item.obj}. (${item.v})`, f, `Yesterday, I ${f} ${item.obj}.`))
      }
      // Phủ định didn't + V1, câu hỏi Did + V1, đối chiếu hôm nay / hôm qua.
      add(choice(`Chọn dạng đúng: She ______ ${item.v} yesterday. (không)`, "didn't", ["doesn't", "don't", "wasn't"], `She didn't ${item.v} yesterday. (phủ định quá khứ: didn't + động từ nguyên thể)`))
      add(fill(`Điền trợ động từ: ______ you ${item.v} yesterday?`, 'did', `Did you ${item.v} yesterday? = Hôm qua bạn có ${item.v} không?`))
      add(choice(`Chọn dạng đúng: Today she ${sForm(item.v)}, yesterday she ______.`, f, pick([item.v, ingForm(item.v), sForm(item.v)], 3, [f]), `Today she ${sForm(item.v)}, yesterday she ${f}.`))
    }
    // Đổi mốc thời gian sang last night cho 10 động từ đầu.
    for (const item of verbs.slice(0, 10)) {
      if (!item.obj) continue
      const f = edForm(item.v)
      add(choice(`Chọn dạng đúng: Last night, she ______ ${item.obj}. (${item.v})`, f, pick([item.v, ingForm(item.v), sForm(item.v)], 3, [f]), `Last night, she ${f} ${item.obj}.`))
      add(fill(`Điền dạng đúng: Last night, I ______ ${item.obj}. (${item.v})`, f, `Last night, I ${f} ${item.obj}.`))
    }
    add(choice("Chọn từ đúng: She ______ visit her grandmother yesterday.", "didn't", ['doesn’t', "don't", "wasn't"], "She didn't visit her grandmother yesterday. = Hôm qua cô ấy đã không thăm bà."))
  }
  if (lesson.id === 'past-irregular') {
    // Đáp án nhiễu không trùng đáp án đúng (cẩn thận các động từ v1 == v2 như read, cut, put).
    const uniqDists = (answer, seeds) => {
      const out = []
      const pool = [...seeds, ...shuffleArr(irregularVerbs.flatMap((x) => [x.v1, x.v2.split(' / ')[0].trim(), x.v3]))]
      for (const d of pool) {
        if (d !== answer && !out.includes(d)) out.push(d)
        if (out.length === 3) break
      }
      return out
    }
    for (const v of irregularVerbs) {
      const v2answers = v.v2.split(' / ').map((x) => x.trim())
      const v2first = v2answers[0]
      const otherV2 = pick(irregularVerbs.map((x) => x.v2.split(' / ')[0].trim()), 1, [v2first])[0]
      add(choice(`Quá khứ của "${v.v1}" là gì?`, v.v2, pick(irregularVerbs.map((x) => x.v2), 3, [v.v2]), `${v.v1} → ${v.v2} (${v.vi}).`))
      add(choice(`"${v.v2}" là quá khứ của động từ nào?`, v.v1, pick(irregularVerbs.map((x) => x.v1), 3, [v.v1]), `${v.v1} → ${v.v2} (${v.vi}).`))
      add(fill(`Điền dạng quá khứ: Yesterday, she ______ (${v.v1}).`, v2answers, `Yesterday, she ${v2answers[0]} (${v.v1}).`))
      // Câu hoàn chỉnh ở quá khứ: Yesterday, she ______.
      add(choice(`Chọn dạng đúng: Yesterday, she ______. (${v.v1})`, v2first, uniqDists(v2first, [v.v1, v.v3, otherV2]), `Yesterday, she ${v2first} (${v.v1}).`))
      // Phủ định: didn't + V1 (be không dùng didn't + be nên bỏ qua be).
      if (v.v1 !== 'be') {
        add(choice(`Chọn dạng đúng: She didn't ______ yesterday. (${v.v1})`, v.v1, uniqDists(v.v1, [v2first, v.v3, otherV2]), `She didn't ${v.v1} yesterday. (sau didn't dùng dạng gốc V1)`))
      }
    }
    add(choice('Câu nào đúng ở quá khứ?', "He didn't go.", ["He didn't went.", 'He doesn’t go.', "He didn't goes."], 'Phủ định quá khứ: didn’t + động từ nguyên thể.'))
    add(choice('Chọn từ đúng: She didn’t ______ yesterday.', 'buy', ['bought', 'buys', 'buying'], 'She didn’t buy yesterday. = Hôm qua cô ấy đã không mua.'))
    add(choice('Chọn từ đúng: Did you ______ TV yesterday?', 'watch', ['watched', 'watches', 'watching'], 'Did + chủ ngữ + động từ nguyên thể.'))
  }
  if (lesson.id === 'future') {
    const wills = [
      { en: 'I will help you!', vi: 'Tôi sẽ giúp bạn!' },
      { en: 'It will rain tomorrow.', vi: 'Trời sẽ mưa ngày mai.' },
      { en: 'She will call you tonight.', vi: 'Cô ấy sẽ gọi cho bạn tối nay.' },
      { en: 'We will travel next week.', vi: 'Chúng tôi sẽ đi du lịch tuần tới.' },
      { en: 'I will open the door.', vi: 'Tôi sẽ mở cửa.' },
      { en: 'She will sing a song.', vi: 'Cô ấy sẽ hát một bài hát.' },
      { en: 'He will come soon.', vi: 'Anh ấy sẽ đến sớm.' },
      { en: 'They will visit us.', vi: 'Họ sẽ thăm chúng tôi.' },
      { en: 'I will buy a new pen.', vi: 'Tôi sẽ mua một cây bút mới.' },
      { en: 'She will read a book.', vi: 'Cô ấy sẽ đọc một quyển sách.' },
      { en: 'We will watch TV.', vi: 'Chúng tôi sẽ xem TV.' },
      { en: 'It will be sunny.', vi: 'Trời sẽ nắng.' },
      { en: 'I will cook dinner.', vi: 'Tôi sẽ nấu bữa tối.' },
      { en: 'He will fix his bike.', vi: 'Anh ấy sẽ sửa xe đạp.' },
      { en: 'They will travel to Da Lat.', vi: 'Họ sẽ đi du lịch Đà Lạt.' },
      { en: 'She will dance at the party.', vi: 'Cô ấy sẽ nhảy ở bữa tiệc.' },
      { en: 'We will learn English.', vi: 'Chúng tôi sẽ học tiếng Anh.' },
      { en: 'I will write a letter.', vi: 'Tôi sẽ viết một lá thư.' },
      { en: 'He will clean the room.', vi: 'Anh ấy sẽ dọn phòng.' },
      { en: 'They will build a sandcastle.', vi: 'Họ sẽ xây lâu đài cát.' },
    ]
    const goings = [
      { en: 'We are going to travel next month.', vi: 'Chúng tôi định đi du lịch tháng tới.' },
      { en: 'She is going to cook dinner.', vi: 'Cô ấy định nấu bữa tối.' },
      { en: 'They are going to play football.', vi: 'Họ định chơi bóng đá.' },
      { en: 'I am going to read a book.', vi: 'Tôi định đọc một quyển sách.' },
      { en: 'He is going to study tonight.', vi: 'Anh ấy định học tối nay.' },
      { en: 'We are going to visit Ha Long Bay.', vi: 'Chúng tôi định thăm vịnh Hạ Long.' },
      { en: 'She is going to buy a dress.', vi: 'Cô ấy định mua một cái váy.' },
      { en: 'They are going to watch a film.', vi: 'Họ định xem một bộ phim.' },
      { en: 'I am going to learn to swim.', vi: 'Tôi định học bơi.' },
      { en: 'He is going to fix his bike.', vi: 'Anh ấy định sửa xe đạp.' },
      { en: 'We are going to have a party.', vi: 'Chúng tôi định tổ chức tiệc.' },
      { en: 'She is going to make a cake.', vi: 'Cô ấy định làm một cái bánh.' },
      { en: 'They are going to clean the house.', vi: 'Họ định dọn nhà.' },
      { en: 'I am going to visit my grandmother.', vi: 'Tôi định thăm bà.' },
      { en: 'He is going to play chess.', vi: 'Anh ấy định chơi cờ vua.' },
      { en: 'We are going to plant a tree.', vi: 'Chúng tôi định trồng một cái cây.' },
      { en: 'She is going to sing a song.', vi: 'Cô ấy định hát một bài hát.' },
      { en: 'They are going to build a sandcastle.', vi: 'Họ định xây lâu đài cát.' },
      { en: 'I am going to draw a picture.', vi: 'Tôi định vẽ một bức tranh.' },
      { en: 'He is going to wash his car.', vi: 'Anh ấy định rửa xe.' },
    ]
    for (const w of wills) {
      add(choice(`Câu tiếng Anh của "${w.vi}" là câu nào?`, w.en, pick(wills.map((x) => x.en), 3, [w.en]), `${w.en} = ${w.vi} (will + V: quyết định ngay lúc nói).`))
      add(fill(`Điền từ còn thiếu: ${w.en.replace('will', '______')}`, 'will', `${w.en} = ${w.vi}`))
    }
    for (const g of goings) {
      add(choice(`Câu tiếng Anh của "${g.vi}" là câu nào?`, g.en, pick(goings.map((x) => x.en), 3, [g.en]), `${g.en} = ${g.vi} (be going to + V: kế hoạch đã định).`))
      const m = g.en.match(/^(I|She|He|We|They) (am|is|are) going to (.+)\.$/)
      if (m) add(fill(`Điền cụm còn thiếu: ${m[1]} ______ ${m[3]}. (${g.vi})`, `${m[2]} going to`, `${g.en} = ${g.vi}`))
    }
    // Drill be trong be going to: I am / She is / They are + going to.
    const beSubs = [{ s: 'I', be: 'am' }, { s: 'She', be: 'is' }, { s: 'He', be: 'is' }, { s: 'We', be: 'are' }, { s: 'They', be: 'are' }, { s: 'Lan', be: 'is' }]
    for (const sub of beSubs) for (const act of ['cook dinner', 'play football']) {
      add(fill(`Điền dạng đúng: ${sub.s} ______ going to ${act}.`, sub.be, `${sub.s} ${sub.be} going to ${act}.`))
      add(choice(`Chọn dạng đúng: ${sub.s} ______ going to ${act}.`, sub.be, ['am', 'is', 'are'].filter((x) => x !== sub.be).concat(['will']), `${sub.s} ${sub.be} going to ${act}.`))
    }
    // Câu hỏi Will...? và phủ định won't / isn't going to.
    const willQs = [
      { q: 'Will you visit us tomorrow?', a: 'will' }, { q: 'Will she call you tonight?', a: 'will' },
      { q: 'Will they travel next week?', a: 'will' }, { q: 'Will it rain tomorrow?', a: 'will' },
    ]
    for (const wq of willQs) {
      add(fill(`Điền từ còn thiếu: ${wq.q.replace('Will', '______')}`, 'will', `${wq.q}`))
      add(choice(`Chọn từ đúng: ______ you help me?`, 'Will', ['Are', 'Do', 'Did'], 'Will you help me? = Bạn sẽ giúp tôi chứ?'))
    }
    const wontActs = ['go to school tomorrow', 'watch TV tonight', 'play football tomorrow', 'visit us next week', 'help you', 'cook dinner tonight', 'travel next month', 'call you tonight', 'read a book tomorrow', 'clean the room today']
    for (const act of wontActs) {
      add(fill(`Điền phủ định: I ______ ${act}. (sẽ không)`, ['will not', "won't"], `I will not (won't) ${act}. (sau will/won't, động từ giữ nguyên thể)`))
    }
    for (const sub of beSubs.slice(1)) {
      const neg = sub.be === 'is' ? "isn't" : "aren't"
      add(fill(`Điền phủ định: ${sub.s} ______ going to cook dinner. (sẽ không nấu)`, neg, `${sub.s} ${neg} going to cook dinner.`))
    }
    // Dịch câu will và going to (10 câu mỗi loại).
    for (const w of wills.slice(0, 10)) {
      add(translate(`Dịch sang tiếng Anh: "${w.vi}"`, w.en.toLowerCase().replace(/!$/, '').replace(/\.$/, ''), `${w.en} = ${w.vi}`))
    }
    for (const g of goings.slice(0, 10)) {
      add(translate(`Dịch sang tiếng Anh: "${g.vi}"`, g.en.toLowerCase().replace(/\.$/, ''), `${g.en} = ${g.vi}`))
    }
    add(choice('Chọn dạng đúng: I ______ help you! (quyết định ngay lúc nói)', 'will', ['am going to', 'will to', 'going to'], 'I will help you! = Tôi sẽ giúp bạn!'))
    add(choice('Chọn dạng đúng: We ______ travel next month. (kế hoạch đã định)', 'are going to', ['will', 'are going', 'will to'], 'We are going to travel next month. = Chúng tôi định đi du lịch tháng tới.'))
  }
}

// ---- Chạy ----
const banks = {}
let total = 0
for (const lesson of [...lessons, ...conjugationGroups]) {
  const bank = []
  const seen = new Set()
  const add = (q) => {
    if (!q || !q.prompt) return
    const key = `${q.type}|${q.prompt.toLowerCase().trim()}|${(q.answer || q.answers?.[0] || '').toLowerCase().trim()}`
    if (seen.has(key)) return
    seen.add(key)
    bank.push(q)
  }
  generic(lesson, add)
  if (lessons.some((l) => l.id === lesson.id)) extraBasic(lesson, add)
  else extraConj(lesson, add)
  // Kiểm tra chất lượng ngân hàng trước khi ghi file.
  for (const q of bank) {
    if (q.type === 'choice') {
      if (!q.options || q.options.length !== 4) throw new Error(`${lesson.id}: choice không đủ 4 đáp án: ${q.prompt}`)
      if (new Set(q.options).size !== 4) throw new Error(`${lesson.id}: đáp án trùng nhau: ${q.prompt}`)
      if (!q.options.includes(q.answer)) throw new Error(`${lesson.id}: đáp án không nằm trong lựa chọn: ${q.prompt}`)
    }
    if (q.type === 'fill') {
      if (!q.prompt.includes('______')) throw new Error(`${lesson.id}: fill thiếu chỗ trống: ${q.prompt}`)
      if (!q.answers?.length) throw new Error(`${lesson.id}: fill thiếu đáp án: ${q.prompt}`)
    }
    if (q.type === 'translate' && !q.answers?.length) throw new Error(`${lesson.id}: translate thiếu đáp án: ${q.prompt}`)
  }
  if (bank.length < 25) throw new Error(`${lesson.id}: ngân hàng chỉ có ${bank.length} câu, dưới 25 câu/phiên`)
  banks[lesson.id] = bank
  total += bank.length
  console.log(`${lesson.id}: ${bank.length} câu`)
}
if (total < 2900) throw new Error(`Tổng chỉ có ${total} câu, chưa đạt 2900`)
console.log(`TỔNG: ${total} câu`)
writeFileSync(
  new URL('../src/data/questions.js', import.meta.url),
  `// Ngân hàng câu hỏi — SINH TỰ ĐỘNG bằng tools/generate-questions.mjs, đừng sửa tay.\n// Câu hỏi mới soạn theo chủ đề/dạng bài chuẩn, không sao chép giáo trình có bản quyền.\nexport const questionBanks = ${JSON.stringify(banks, null, 2)}\n`,
)
