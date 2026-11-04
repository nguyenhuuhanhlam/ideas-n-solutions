import { useEffect, useState } from 'react'
import { lessons, conjugationGroups, POINTS_PER_QUESTION } from './data/lessons.js'
import { irregularVerbs } from './data/irregular.js'

const STORAGE_KEY = 'english-learning-progress-v1'
const allLessons = [...lessons, ...conjugationGroups]
// Tiến độ cũ của 2 bài chia động từ trước khi gộp thành tabs (verb-to-be, present-simple-verbs)
// được chuyển sang nhóm mới tương ứng (to-be, present-simple) để không mất điểm đã làm.
const PROGRESS_MIGRATION = { 'verb-to-be': 'to-be', 'present-simple-verbs': 'present-simple' }

function loadProgress() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
    for (const [oldId, newId] of Object.entries(PROGRESS_MIGRATION)) {
      if (data[oldId] && !data[newId]) data[newId] = data[oldId]
    }
    return data
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
  if (type === 'fill') return 'Điền vào chỗ trống'
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

const CONJ_TAB_LABELS = {
  'to-be': 'To be',
  'present-simple': 'Hiện tại đơn',
  'present-continuous': 'Hiện tại tiếp diễn',
  'past-regular': 'Quá khứ -ed',
  'past-irregular': 'Quá khứ bất quy tắc',
  future: 'Tương lai',
}

export default function App() {
  const [progress, setProgress] = useState(loadProgress)
  const [view, setView] = useState({ name: 'home' }) // home | lesson | quiz
  const [quiz, setQuiz] = useState(null)
  const [tab, setTab] = useState('all') // all | basic | conjugation | lookup
  const [conjId, setConjId] = useState('to-be')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  // progress.best lưu theo % (bài cũ 10 câu thì điểm /100 trùng với % nên dữ liệu cũ vẫn dùng được)
  const completedCount = allLessons.filter((l) => (progress[l.id]?.best || 0) >= 70).length
  const totalQuestions = allLessons.reduce((sum, l) => sum + l.questions.length, 0)

  function openLesson(lesson) {
    setView({ name: 'lesson', lesson })
  }

  function startQuiz(lesson, practice = false) {
    let questions
    let title
    if (practice) {
      const all = allLessons.flatMap((l) => l.questions.map((q) => ({ ...q, lessonTitle: l.title })))
      questions = shuffle(all).slice(20)
      title = 'Ôn tập tổng hợp (20 câu ngẫu nhiên)'
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
              <button onClick={() => startQuiz(allLessons.find((l) => l.id === quiz.lessonId))}>Làm lại bài này</button>
            )}
            <button onClick={() => startQuiz(null, true)}>Ôn tập tổng hợp</button>
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
        <p className="lead">3 dạng: trắc nghiệm, điền từ vào chỗ trống và dịch câu. Trả lời xong bấm “Chấm câu này” để xem giải thích ngay, cuối bài có tổng điểm và danh sách câu sai để ôn lại.</p>
        <button className="primary big" onClick={() => startQuiz(lesson)}>Bắt đầu làm bài →</button>
      </div>
    )
  }

  // ---- Trang chính: phân loại bằng tabs ----
  const shownLessons = tab === 'basic' ? lessons : tab === 'all' ? allLessons : []
  const conjLesson = conjugationGroups.find((l) => l.id === conjId) || conjugationGroups[0]
  const conjBest = progress[conjLesson.id]?.best || 0
  return (
    <div className="page">
      <h1>🇬🇧 English Basic</h1>
      <p className="lead">Học tiếng Anh cơ bản bằng cách làm bài tập là chính: học nhanh 1 quy tắc + 8 từ, rồi làm bài tập có chấm điểm và giải thích ngay sau mỗi câu.</p>
      <div className="stats">
        <div><strong>{completedCount} / {allLessons.length}</strong><span>bài đã đạt (≥ 70%)</span></div>
        <div><strong>{totalQuestions}</strong><span>câu hỏi có sẵn</span></div>
        <div><strong>{lessons.length} + {conjugationGroups.length}</strong><span>bài cơ bản + nhóm chia động từ</span></div>
      </div>
      <button className="primary big" onClick={() => startQuiz(null, true)}>🔀 Ôn tập tổng hợp — 20 câu ngẫu nhiên</button>

      <div className="tabs" role="tablist">
        <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>Tất cả</button>
        <button className={`tab ${tab === 'basic' ? 'active' : ''}`} onClick={() => setTab('basic')}>Bài cơ bản</button>
        <button className={`tab ${tab === 'conjugation' ? 'active' : ''}`} onClick={() => setTab('conjugation')}>Chia động từ</button>
        <button className={`tab ${tab === 'lookup' ? 'active' : ''}`} onClick={() => setTab('lookup')}>Tra cứu</button>
      </div>

      {tab === 'lookup' && (
        <>
          <h2>📖 Tra cứu động từ bất quy tắc</h2>
          <p className="lead">Bảng này dùng cho nhóm Quá khứ bất quy tắc trong tab Chia động từ. Gõ tiếng Anh hoặc tiếng Việt để lọc, ví dụ “go”, “went” hoặc “mua”.</p>
          <IrregularLookup />
        </>
      )}

      {tab === 'conjugation' && (
        <>
          <h2>Chia động từ — chọn 1 nhóm</h2>
          <p className="lead">Mỗi tab là 1 cách chia khác nhau. Gặp dạng nào thì chia theo tab đó: to be thì đổi be, hiện tại đơn thì thêm -s/-es, đang diễn ra thì be + V-ing, quá khứ có quy tắc thì -ed, quá khứ bất quy tắc thì học thuộc V2, tương lai thì will/be going to.</p>
          <div className="tabs sub-tabs" role="tablist">
            {conjugationGroups.map((g) => (
              <button key={g.id} className={`tab ${conjId === g.id ? 'active' : ''}`} onClick={() => setConjId(g.id)}>
                {CONJ_TAB_LABELS[g.id] || g.topic}
              </button>
            ))}
          </div>
          <div className="card">
            <h2 style={{ marginTop: 0 }}>{conjLesson.title}</h2>
            <p className="lead">{conjLesson.description}</p>
            {conjBest > 0 && <p className="meta">Điểm cao nhất của bạn ở nhóm này: <strong>{conjBest}%</strong> · Đã làm {progress[conjLesson.id].attempts} lần</p>}
            <h2>📖 {conjLesson.grammarTitle}</h2>
            <p>{conjLesson.grammar}</p>
            <h2>📚 Dạng mẫu ({conjLesson.vocab.length} mục)</h2>
            <div className="vocab">
              {conjLesson.vocab.map((v) => (
                <div className="vocab-item" key={v.en}>
                  <strong>{v.en}</strong><span>{v.vi}</span><em>{v.example}</em>
                </div>
              ))}
            </div>
            <div className="row">
              <button className="primary big" onClick={() => startQuiz(conjLesson)}>Bắt đầu làm {conjLesson.questions.length} câu →</button>
            </div>
          </div>
        </>
      )}

      {(tab === 'all' || tab === 'basic') && (
        <>
          <h2>{tab === 'basic' ? 'Các bài cơ bản' : 'Tất cả các bài'}</h2>
          <div className="lesson-list">
            {shownLessons.map((lesson, i) => {
              const best = progress[lesson.id]?.best || 0
              const done = best >= 70
              const isConj = conjugationGroups.some((g) => g.id === lesson.id)
              return (
                <button className="lesson-card" key={lesson.id} onClick={() => openLesson(lesson)}>
                  <span className="lesson-num">{i + 1}</span>
                  <span className="lesson-main">
                    <strong>{lesson.title}</strong>
                    <span>{lesson.description}</span>
                    <span className="lesson-meta">{isConj ? 'Chia động từ · ' : ''}{lesson.vocab.length} mục · {lesson.questions.length} câu · {best > 0 ? `Điểm cao nhất: ${best}% ${done ? '✅' : ''}` : 'Chưa làm'}</span>
                  </span>
                  <span className="arrow">→</span>
                </button>
              )
            })}
          </div>
        </>
      )}
      <p className="note">Tiến độ lưu trên trình duyệt này (localStorage). Đạt từ 70% được tính là hoàn thành bài. Không cần tài khoản, không cần mạng sau khi tải trang.</p>
    </div>
  )
}
