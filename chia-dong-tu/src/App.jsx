import { useEffect, useState } from 'react'
import { lessons, POINTS_PER_QUESTION } from './data/lessons.js'
import { irregularVerbs } from './data/irregular.js'

const STORAGE_KEY = 'chia-dong-tu-progress-v1'

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[.!?]+$/g, '')
    .replace(/\s+/g, ' ')
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function starsFor(score) {
  if (score >= 90) return 3
  if (score >= 70) return 2
  if (score >= 50) return 1
  return 0
}

function prepareQuiz(questions) {
  return questions.map((q) => {
    if (q.type === 'choice') return { ...q, options: shuffle(q.options) }
    return { ...q }
  })
}

function typeLabel(type) {
  if (type === 'choice') return 'Trắc nghiệm'
  if (type === 'fill') return 'Điền dạng đúng'
  return 'Dịch câu'
}

function IrregularLookup() {
  const [query, setQuery] = useState('')
  const q = query.toLowerCase().trim()
  const rows = irregularVerbs.filter((v) =>
    !q || [v.v1, v.v2, v.v3, v.vi].join(' ').toLowerCase().includes(q),
  )
  return (
    <div>
      <input
        className="text-input"
        value={query}
        placeholder="Gõ để tra: go, went, mua, ate…"
        onChange={(e) => setQuery(e.target.value)}
      />
      <p className="meta">Hiển thị {rows.length} / {irregularVerbs.length} động từ. Cột V2 dùng cho quá khứ đơn, cột V3 dùng sau have/has (sẽ học ở cấp cao hơn).</p>
      <div className="verb-table">
        <div className="verb-row verb-head"><span>V1</span><span>V2 (quá khứ)</span><span>V3</span><span>Nghĩa</span></div>
        {rows.map((v) => (
          <div className="verb-row" key={v.v1}>
            <span><strong>{v.v1}</strong></span><span>{v.v2}</span><span>{v.v3}</span><span>{v.vi}</span>
          </div>
        ))}
      </div>
      {rows.length === 0 && <p className="lead">Không tìm thấy động từ nào khớp.</p>}
    </div>
  )
}

export default function App() {
  const [progress, setProgress] = useState(loadProgress)
  const [view, setView] = useState({ name: 'home' }) // home | lesson | quiz
  const [quiz, setQuiz] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  // progress.best lưu theo % (bài cũ 10 câu thì điểm /100 trùng với % nên dữ liệu cũ vẫn dùng được)
  const completedCount = lessons.filter((l) => (progress[l.id]?.best || 0) >= 70).length
  const totalQuestions = lessons.reduce((sum, l) => sum + l.questions.length, 0)

  function openLesson(lesson) {
    setView({ name: 'lesson', lesson })
  }

  function startQuiz(lesson, practice = false) {
    let questions
    let title
    if (practice) {
      const all = lessons.flatMap((l) => l.questions.map((q) => ({ ...q, lessonTitle: l.title })))
      questions = shuffle(all).slice(20)
      title = 'Bài tổng hợp phân loại (20 câu ngẫu nhiên từ 6 nhóm)'
    } else {
      questions = lesson.questions
      title = lesson.title
    }
    setQuiz({
      title,
      lessonId: practice ? null : lesson.id,
      questions: prepareQuiz(questions),
      index: 0,
      input: '',
      checked: null, // { correct, userAnswer }
      score: 0,
      log: [],
      finished: false,
    })
    setView({ name: 'quiz' })
  }

  function checkAnswer() {
    if (!quiz || quiz.checked) return
    const q = quiz.questions[quiz.index]
    const userAnswer = quiz.input.trim()
    if (!userAnswer) return
    const correct = q.type === 'choice'
      ? userAnswer === q.answer
      : q.answers.some((a) => normalize(a) === normalize(userAnswer))
    const correctAnswer = q.type === 'choice' ? q.answer : q.answers[0]
    setQuiz({
      ...quiz,
      checked: { correct, userAnswer },
      score: quiz.score + (correct ? POINTS_PER_QUESTION : 0),
      log: [...quiz.log, { question: q, userAnswer, correct, correctAnswer }],
    })
  }

  function nextQuestion() {
    if (!quiz) return
    if (quiz.index + 1 >= quiz.questions.length) {
      const maxScore = quiz.questions.length * POINTS_PER_QUESTION
      const finalPercent = Math.round((quiz.score / maxScore) * 100)
      setQuiz({ ...quiz, finished: true, percent: finalPercent })
      if (quiz.lessonId) {
        setProgress((prev) => {
          const old = prev[quiz.lessonId] || { best: 0, attempts: 0 }
          return {
            ...prev,
            [quiz.lessonId]: {
              best: Math.max(old.best, finalPercent),
              attempts: old.attempts + 1,
            },
          }
        })
      }
    } else {
      setQuiz({ ...quiz, index: quiz.index + 1, input: '', checked: null })
    }
  }

  // ---- Màn hình làm bài ----
  if (view.name === 'quiz' && quiz) {
    if (quiz.finished) {
      const stars = starsFor(quiz.percent)
      const passed = quiz.percent >= 70
      const wrong = quiz.log.filter((x) => !x.correct)
      return (
        <div className="page">
          <header className="top"><button className="link" onClick={() => setView({ name: 'home' })}>← Về trang chính</button></header>
          <h1>Kết quả: {quiz.score} / {quiz.questions.length * POINTS_PER_QUESTION} điểm ({quiz.percent}%)</h1>
          <p className="lead">
            {passed ? '🎉 Đạt! Bạn đã nắm được bài này.' : 'Chưa đạt (cần từ 70%). Xem lại phần sai rồi làm lại nhé!'}
            {' '}Số sao: {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
          </p>
          {wrong.length > 0 && (
            <>
              <h2>Câu làm sai — xem lại</h2>
              {wrong.map((x, i) => (
                <div className="review" key={i}>
                  <p><strong>{x.question.prompt}</strong></p>
                  <p>Bạn trả lời: <span className="wrong">{x.userAnswer}</span></p>
                  <p>Đáp án đúng: <span className="right">{x.correctAnswer}</span></p>
                  <p className="explain">{x.question.explanation}</p>
                </div>
              ))}
            </>
          )}
          <div className="row">
            <button className="primary" onClick={() => setView({ name: 'home' })}>Về trang chính</button>
            {quiz.lessonId && (
              <button onClick={() => startQuiz(lessons.find((l) => l.id === quiz.lessonId))}>Làm lại bài này</button>
            )}
            <button onClick={() => startQuiz(null, true)}>Bài tổng hợp phân loại</button>
          </div>
        </div>
      )
    }

    const q = quiz.questions[quiz.index]
    const progressPct = Math.round(((quiz.index + (quiz.checked ? 1 : 0)) / quiz.questions.length) * 100)
    return (
      <div className="page">
        <header className="top"><button className="link" onClick={() => setView({ name: 'home' })}>← Thoát bài (không lưu điểm)</button></header>
        <h1>{quiz.title}</h1>
        <div className="bar"><div style={{ width: `${progressPct}%` }} /></div>
        <p className="meta">Câu {quiz.index + 1} / {quiz.questions.length} · Điểm hiện tại: {quiz.score} · {typeLabel(q.type)}
          {q.lessonTitle ? ` · ${q.lessonTitle}` : ''}</p>
        <div className="card">
          <p className="question">{q.prompt}</p>
          {q.type === 'choice' ? (
            <div className="options">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  className={`option ${quiz.input === opt ? 'selected' : ''} ${quiz.checked && opt === q.answer ? 'correct' : ''} ${quiz.checked && quiz.input === opt && !quiz.checked.correct ? 'incorrect' : ''}`}
                  disabled={!!quiz.checked}
                  onClick={() => setQuiz({ ...quiz, input: opt })}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <input
              className="text-input"
              value={quiz.input}
              disabled={!!quiz.checked}
              placeholder={q.type === 'fill' ? 'Nhập từ còn thiếu…' : 'Nhập câu tiếng Anh…'}
              onChange={(e) => setQuiz({ ...quiz, input: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Enter') quiz.checked ? nextQuestion() : checkAnswer() }}
              autoFocus
            />
          )}
          {quiz.checked && (
            <div className={`feedback ${quiz.checked.correct ? 'ok' : 'bad'}`}>
              <p>{quiz.checked.correct ? '✅ Đúng rồi!' : `❌ Chưa đúng. Đáp án: ${q.type === 'choice' ? q.answer : q.answers[0]}`}</p>
              <p className="explain">{q.explanation}</p>
            </div>
          )}
          <div className="row">
            {!quiz.checked
              ? <button className="primary" disabled={!quiz.input.trim()} onClick={checkAnswer}>Chấm câu này</button>
              : <button className="primary" onClick={nextQuestion}>{quiz.index + 1 >= quiz.questions.length ? 'Xem kết quả' : 'Câu tiếp theo →'}</button>}
          </div>
        </div>
      </div>
    )
  }

  // ---- Màn hình chi tiết bài ----
  if (view.name === 'lesson') {
    const lesson = view.lesson
    const best = progress[lesson.id]?.best || 0
    return (
      <div className="page">
        <header className="top"><button className="link" onClick={() => setView({ name: 'home' })}>← Tất cả các bài</button></header>
        <h1>{lesson.title}</h1>
        <p className="lead">{lesson.description}</p>
        {best > 0 && <p className="meta">Điểm cao nhất của bạn ở bài này: <strong>{best}%</strong> · Đã làm {progress[lesson.id].attempts} lần</p>}
        <h2>📖 {lesson.grammarTitle}</h2>
        <div className="card"><p>{lesson.grammar}</p></div>
        <h2>📚 Từ vựng ({lesson.vocab.length} từ)</h2>
        <div className="vocab">
          {lesson.vocab.map((v) => (
            <div className="vocab-item" key={v.en}>
              <strong>{v.en}</strong><span>{v.vi}</span><em>{v.example}</em>
            </div>
          ))}
        </div>
        <h2>✏️ Bài tập ({lesson.questions.length} câu, mỗi câu 10 điểm)</h2>
        <p className="lead">3 dạng: trắc nghiệm, điền dạng đúng của động từ và dịch câu. Trả lời xong bấm “Chấm câu này” để xem giải thích ngay, cuối bài có tổng điểm, tỉ lệ % và danh sách câu sai để ôn lại.</p>
        <button className="primary big" onClick={() => startQuiz(lesson)}>Bắt đầu làm bài →</button>
      </div>
    )
  }

  // ---- Trang chính ----
  return (
    <div className="page">
      <h1>📝 Chia Động Từ</h1>
      <p className="lead">Hệ thống bài riêng về chia động từ, tách khỏi English Basic. Mỗi nhóm là 1 cách chia khác nhau: học bảng chia + quy tắc viết, rồi làm 15 câu có chấm điểm và giải thích ngay sau mỗi câu.</p>
      <h2>Phân loại nhanh — gặp dạng nào thì chia theo nhóm đó</h2>
      <div className="card">
        <p><strong>Nhóm 1 — To be:</strong> không thêm -s/-ed, chỉ đổi be: am/is/are (hiện tại), was/were (quá khứ).</p>
        <p><strong>Nhóm 2 — Hiện tại đơn:</strong> thói quen, sự thật: he/she/it thêm -s/-es/-ies; do/does cho phủ định, câu hỏi.</p>
        <p><strong>Nhóm 3 — Hiện tại tiếp diễn:</strong> đang diễn ra: be + V-ing, chú ý cách viết -ing (making, running).</p>
        <p><strong>Nhóm 4 — Quá khứ đơn có quy tắc:</strong> chỉ thêm -ed/-d/-ied, gấp đôi phụ âm khi cần (stopped, planned).</p>
        <p><strong>Nhóm 5 — Quá khứ đơn bất quy tắc:</strong> học thuộc V2 (went, saw, bought); sau didn't/Did vẫn dùng V1.</p>
        <p><strong>Nhóm 6 — Tương lai:</strong> will + V (quyết định, dự đoán) và be going to + V (kế hoạch đã định).</p>
      </div>
      <div className="stats">
        <div><strong>{completedCount} / {lessons.length}</strong><span>nhóm đã đạt (≥ 70%)</span></div>
        <div><strong>{totalQuestions}</strong><span>câu hỏi có sẵn</span></div>
        <div><strong>{lessons.length}</strong><span>nhóm bài</span></div>
      </div>
      <button className="primary big" onClick={() => startQuiz(null, true)}>🔀 Bài tổng hợp phân loại — 20 câu ngẫu nhiên</button>
      <h2>Các nhóm bài</h2>
      <div className="lesson-list">
        {lessons.map((lesson, i) => {
          const best = progress[lesson.id]?.best || 0
          const done = best >= 70
          return (
            <button className="lesson-card" key={lesson.id} onClick={() => openLesson(lesson)}>
              <span className="lesson-num">{i + 1}</span>
              <span className="lesson-main">
                <strong>{lesson.title}</strong>
                <span>{lesson.description}</span>
                <span className="lesson-meta">{lesson.vocab.length} từ · {lesson.questions.length} câu · {best > 0 ? `Điểm cao nhất: ${best}% ${done ? '✅' : ''}` : 'Chưa làm'}</span>
              </span>
              <span className="arrow">→</span>
            </button>
          )
        })}
      </div>
      <h2>📖 Tra cứu động từ bất quy tắc</h2>
      <p className="lead">Bảng này dùng cho Nhóm 5. Gõ tiếng Anh hoặc tiếng Việt để lọc, ví dụ “go”, “went” hoặc “mua”.</p>
      <IrregularLookup />
      <p className="note">Tiến độ lưu trên trình duyệt này (localStorage), riêng với English Basic. Đạt từ 70% được tính là hoàn thành nhóm. Không cần tài khoản, không cần mạng sau khi tải trang.</p>
    </div>
  )
}
