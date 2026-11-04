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
const S_ES = new Set(['go', 'do', 'watch', 'catch', 'brush', 'fix', 'wash'])
const DOUBLE = new Set(['run', 'swim', 'stop', 'plan', 'get'])
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
        add(fill(`Điền từ còn thiếu: ${item.example.replace(re, '______')}`, part, `Câu đầy đủ: ${item.example}`))
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
    ]
    words.forEach((w, i) => {
      const n = i + 1
      add(choice(`Số ${n} trong tiếng Anh là gì?`, w, pick(words, 3, [w]), `${w} = số ${n}.`))
      add(choice(`"${w}" là số mấy?`, String(n), pick(words.map((_, j) => String(j + 1)), 3, [String(n)]), `${w} = số ${n}.`))
      const o = objs[i % objs.length]
      add(choice(`I have ${w} ${o.plural}. Tôi có mấy ${o.vi}?`, String(n), pick(words.map((_, j) => String(j + 1)), 3, [String(n)]), `I have ${w} ${o.plural}. = Tôi có ${n} ${o.vi}.`))
      add(fill(`Điền từ còn thiếu: I have ______ ${o.plural}. (${n})`, w, `I have ${w} ${o.plural}. = Tôi có ${n} ${o.vi}.`))
    })
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
  }
  if (lesson.id === 'family') {
    const members = [
      { en: 'mother', vi: 'mẹ' }, { en: 'father', vi: 'bố' }, { en: 'sister', vi: 'chị/em gái' },
      { en: 'brother', vi: 'anh/em trai' }, { en: 'grandmother', vi: 'bà' }, { en: 'grandfather', vi: 'ông' },
    ]
    const poss = [
      { en: 'my', tail: 'tôi' }, { en: 'his', tail: 'của anh ấy' }, { en: 'her', tail: 'của cô ấy' },
    ]
    for (const p of poss) for (const m of members) {
      const vi = `${m.vi} ${p.tail}`
      const others = poss.flatMap((pp) => members.map((mm) => `${mm.vi} ${pp.tail}`)).filter((x) => x !== vi)
      add(choice(`"${p.en} ${m.en}" có nghĩa là gì?`, vi, pick(others, 3, [vi]), `${p.en} ${m.en} = ${vi}.`))
      add(fill(`Điền từ còn thiếu: This is ______ ${m.en}. (Đây là ${vi}.)`, p.en, `This is ${p.en} ${m.en}. = Đây là ${vi}.`))
      add(translate(`Dịch sang tiếng Anh: "Đây là ${vi}."`, `this is ${p.en} ${m.en}`, `This is ${p.en} ${m.en}. = Đây là ${vi}.`))
    }
  }
  if (lesson.id === 'daily-routine') {
    const acts = [
      { base: 'get up', third: 'gets up', ing: 'getting up', past: 'got up', vi: 'thức dậy' },
      { base: 'brush my teeth', third: 'brushes his teeth', vi: 'đánh răng' },
      { base: 'have breakfast', third: 'has breakfast', ing: 'having breakfast', past: 'had breakfast', vi: 'ăn sáng' },
      { base: 'go to school', third: 'goes to school', ing: 'going to school', past: 'went to school', vi: 'đi học' },
      { base: 'have lunch', third: 'has lunch', vi: 'ăn trưa' },
      { base: 'go home', third: 'goes home', vi: 'về nhà' },
      { base: 'do homework', third: 'does homework', ing: 'doing homework', past: 'did homework', vi: 'làm bài tập' },
      { base: 'go to bed', third: 'goes to bed', vi: 'đi ngủ' },
    ]
    const times = ['six', 'seven', 'eight', 'nine']
    acts.forEach((a, i) => {
      for (const t of [times[i % 4], times[(i + 2) % 4]]) {
        add(fill(`Điền từ còn thiếu: I ______ at ${t}.`, a.base, `I ${a.base} at ${t}.`))
      }
      add(choice(`I ${a.base} at six. Câu này nói tôi làm gì?`, a.vi, pick(acts.map((x) => x.vi), 3, [a.vi]), `I ${a.base} at six. = Tôi ${a.vi} lúc 6 giờ.`))
    })
    for (const a of acts.filter((x) => x.ing)) {
      add(choice(`He ______ at seven.`, a.third, [a.base, a.ing, a.past], `He/she + động từ thêm -s: He ${a.third} at seven.`))
      add(fill(`Điền dạng đúng: He ______ (${a.base}) at seven.`, a.third, `He ${a.third} at seven.`))
    }
  }
  if (lesson.id === 'colors-objects') {
    const colors = [
      { en: 'red', vi: 'màu đỏ', short: 'đỏ' }, { en: 'blue', vi: 'màu xanh dương', short: 'xanh dương' },
      { en: 'green', vi: 'màu xanh lá', short: 'xanh lá' }, { en: 'yellow', vi: 'màu vàng', short: 'vàng' },
    ]
    const objs = [
      { en: 'pen', vi: 'cây bút', art: 'a' }, { en: 'book', vi: 'quyển sách', art: 'a' },
      { en: 'bag', vi: 'cái cặp', art: 'a' }, { en: 'chair', vi: 'cái ghế', art: 'a' },
      { en: 'apple', vi: 'quả táo', art: 'an' }, { en: 'egg', vi: 'quả trứng', art: 'an' },
    ]
    colors.forEach((c, i) => {
      for (const o of [objs[i % 6], objs[(i + 2) % 6], objs[(i + 4) % 6]]) {
        add(fill(`Điền từ còn thiếu: The ${o.en} is ______ (${c.vi}).`, c.en, `The ${o.en} is ${c.en}.`))
        add(translate(`Dịch sang tiếng Anh: "${o.vi} màu ${c.short}."`, `the ${o.en} is ${c.en}`, `The ${o.en} is ${c.en}. = ${o.vi} màu ${c.short}.`))
      }
    })
    for (const o of objs) {
      add(choice(`Chọn từ đúng: This is ______ ${o.en}.`, o.art, pick(['a', 'an', 'the', 'không cần từ nào'], 3, [o.art]), `This is ${o.art} ${o.en}.`))
    }
  }
  if (lesson.id === 'food-drink') {
    const foods = [
      { en: 'rice', vi: 'cơm' }, { en: 'bread', vi: 'bánh mì' }, { en: 'egg', vi: 'quả trứng' },
      { en: 'milk', vi: 'sữa' }, { en: 'water', vi: 'nước' }, { en: 'coffee', vi: 'cà phê' },
      { en: 'apple', vi: 'quả táo' }, { en: 'banana', vi: 'quả chuối' },
    ]
    for (const f of foods) {
      add(choice(`Bạn có thích ${f.vi} không? Hỏi bằng tiếng Anh thế nào?`, `Do you like ${f.en}?`, [`Do you likes ${f.en}?`, `Are you like ${f.en}?`, `You like ${f.en}?`], `Do you like ${f.en}? = Bạn có thích ${f.vi} không?`))
      add(fill(`Điền từ còn thiếu: I ______ ${f.en}. (thích)`, 'like', `I like ${f.en}. = Tôi thích ${f.vi}.`))
      add(fill(`Điền từ còn thiếu: She ______ ${f.en}. (thích)`, 'likes', `She likes ${f.en}. = Cô ấy thích ${f.vi}.`))
      add(fill(`Điền từ còn thiếu: I do not ______ ${f.en}. (thích)`, 'like', `I do not like ${f.en}. = Tôi không thích ${f.vi}.`))
    }
    for (const f of foods.filter((x) => ['milk', 'water', 'coffee'].includes(x.en))) {
      add(fill(`Điền từ còn thiếu: I drink ______ (${f.vi}).`, f.en, `I drink ${f.en}. = Tôi uống ${f.vi}.`))
    }
    for (const f of foods.filter((x) => ['rice', 'bread', 'egg', 'apple', 'banana'].includes(x.en))) {
      add(fill(`Điền từ còn thiếu: I eat ______ (${f.vi}).`, f.en, `I eat ${f.en}. = Tôi ăn ${f.vi}.`))
    }
  }
}

// ---- Nhóm chia động từ: bài tập theo quy tắc ----
function extraConj(lesson, add) {
  if (lesson.id === 'to-be') {
    const subs = [
      { s: 'I', pres: 'am', past: 'was' }, { s: 'He', pres: 'is', past: 'was' },
      { s: 'She', pres: 'is', past: 'was' }, { s: 'It', pres: 'is', past: 'was' },
      { s: 'We', pres: 'are', past: 'were' }, { s: 'They', pres: 'are', past: 'were' },
      { s: 'Lan', pres: 'is', past: 'was' }, { s: 'Nam', pres: 'is', past: 'was' },
      { s: 'My parents', pres: 'are', past: 'were' }, { s: 'The cat', pres: 'is', past: 'was' },
      { s: 'Hoa', pres: 'is', past: 'was' }, { s: 'The dogs', pres: 'are', past: 'were' },
    ]
    const forms = ['am', 'is', 'are', 'was', 'were']
    for (const sub of subs) {
      add(choice(`Chọn dạng đúng: ${sub.s} ______ happy today.`, sub.pres, pick(forms, 3, [sub.pres]), `${sub.s} + ${sub.pres} (hiện tại).`))
      add(choice(`Chọn dạng đúng: ${sub.s} ______ happy yesterday.`, sub.past, pick(forms, 3, [sub.past]), `${sub.s} + ${sub.past} (quá khứ).`))
      add(fill(`Điền dạng đúng: ${sub.s} ______ happy today.`, sub.pres, `${sub.s} ${sub.pres} happy today.`))
      add(fill(`Điền dạng đúng: ${sub.s} ______ happy yesterday.`, sub.past, `${sub.s} ${sub.past} happy yesterday.`))
    }
    add(choice('Chọn câu đúng: He ______ happy.', "isn't", ['aren’t', 'am not', "wasn't"], "He isn't happy. = Anh ấy không vui."))
    add(choice('Chọn câu đúng: They ______ students.', "aren't", ['isn’t', 'am not', "wasn't"], "They aren't students. = Họ không phải là học sinh."))
  }
  if (lesson.id === 'present-simple') {
    const verbs = ['play', 'watch', 'study', 'brush', 'catch', 'fix', 'go', 'do', 'read', 'sing', 'dance', 'cook', 'run', 'swim', 'jump', 'look', 'like', 'love', 'help', 'wash', 'try', 'carry', 'fly', 'work']
    const thirds = ['He', 'She', 'Lan']
    const pastOf = (v) => ({ go: 'went', do: 'did' })[v] || edForm(v)
    verbs.forEach((v, i) => {
      const subj = thirds[i % 3]
      const f = sForm(v)
      add(choice(`Chọn dạng đúng: ${subj} ______ every day. (${v})`, f, pick([v, ingForm(v), pastOf(v)], 3, [f]), `${subj} + ${f} (he/she/it + động từ thêm -s/-es).`))
      add(fill(`Điền dạng đúng: ${subj} ______ (${v}) every day.`, f, `${subj} ${f} every day.`))
    })
    const bases = ['I', 'You', 'We', 'They']
    verbs.slice(0, 12).forEach((v, i) => {
      const subj = bases[i % 4]
      add(choice(`Chọn dạng đúng: ${subj} ______ every day. (${v})`, v, pick([sForm(v), ingForm(v), pastOf(v)], 3, [v]), `${subj} + ${v} (I/you/we/they + động từ nguyên thể).`))
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
    ]
    for (const item of verbs) {
      const f = edForm(item.v)
      add(choice(`Chọn dạng quá khứ đúng của "${item.v}":`, f, pick([item.v, ingForm(item.v), sForm(item.v)], 3, [f]), `${item.v} → ${f} (quá khứ đơn có quy tắc).`))
      if (item.obj) {
        add(choice(`Chọn dạng đúng: Yesterday, she ______ ${item.obj}. (${item.v})`, f, pick([item.v, ingForm(item.v), sForm(item.v)], 3, [f]), `Yesterday, she ${f} ${item.obj}.`))
        add(fill(`Điền dạng đúng: Yesterday, I ______ ${item.obj}. (${item.v})`, f, `Yesterday, I ${f} ${item.obj}.`))
      }
    }
    add(choice("Chọn từ đúng: She ______ visit her grandmother yesterday.", "didn't", ['doesn’t', "don't", "wasn't"], "She didn't visit her grandmother yesterday. = Hôm qua cô ấy đã không thăm bà."))
  }
  if (lesson.id === 'past-irregular') {
    for (const v of irregularVerbs) {
      const v2answers = v.v2.split(' / ').map((x) => x.trim())
      add(choice(`Quá khứ của "${v.v1}" là gì?`, v.v2, pick(irregularVerbs.map((x) => x.v2), 3, [v.v2]), `${v.v1} → ${v.v2} (${v.vi}).`))
      add(choice(`"${v.v2}" là quá khứ của động từ nào?`, v.v1, pick(irregularVerbs.map((x) => x.v1), 3, [v.v1]), `${v.v1} → ${v.v2} (${v.vi}).`))
      add(fill(`Điền dạng quá khứ: Yesterday, she ______ (${v.v1}).`, v2answers, `Yesterday, she ${v2answers[0]} (${v.v1}).`))
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
    ]
    const goings = [
      { en: 'We are going to travel next month.', vi: 'Chúng tôi định đi du lịch tháng tới.' },
      { en: 'She is going to cook dinner.', vi: 'Cô ấy định nấu bữa tối.' },
      { en: 'They are going to play football.', vi: 'Họ định chơi bóng đá.' },
      { en: 'I am going to read a book.', vi: 'Tôi định đọc một quyển sách.' },
    ]
    for (const w of wills) {
      add(choice('Câu nào là quyết định ngay lúc nói?', w.en, pick(goings.map((x) => x.en), 3, [w.en]), `${w.en} = ${w.vi} (will + V: quyết định ngay lúc nói).`))
      add(fill(`Điền từ còn thiếu: ${w.en.replace('will', '______')}`, 'will', `${w.en} = ${w.vi}`))
    }
    for (const g of goings) {
      add(choice('Câu nào là kế hoạch đã định?', g.en, pick(wills.map((x) => x.en), 3, [g.en]), `${g.en} = ${g.vi} (be going to + V: kế hoạch đã định).`))
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
if (total < 1000) throw new Error(`Tổng chỉ có ${total} câu, chưa đạt 1000`)
console.log(`TỔNG: ${total} câu`)
writeFileSync(
  new URL('../src/data/questions.js', import.meta.url),
  `// Ngân hàng câu hỏi — SINH TỰ ĐỘNG bằng tools/generate-questions.mjs, đừng sửa tay.\n// Câu hỏi mới soạn theo chủ đề/dạng bài chuẩn, không sao chép giáo trình có bản quyền.\nexport const questionBanks = ${JSON.stringify(banks, null, 2)}\n`,
)
