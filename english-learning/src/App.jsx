import { Badge } from '@astryxdesign/core/Badge'
import { Banner } from '@astryxdesign/core/Banner'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import { AppShell } from '@astryxdesign/core/AppShell'
import { ClickableCard } from '@astryxdesign/core/ClickableCard'
import { Heading } from '@astryxdesign/core/Heading'
import { HStack } from '@astryxdesign/core/HStack'
import { ProgressBar } from '@astryxdesign/core/ProgressBar'
import { SideNav } from '@astryxdesign/core/SideNav'
import { TopNav } from '@astryxdesign/core/TopNav'
import { TreeList } from '@astryxdesign/core/TreeList'
import { Table } from '@astryxdesign/core/Table'
import { Text } from '@astryxdesign/core/Text'
import { TextInput } from '@astryxdesign/core/TextInput'
import { VStack } from '@astryxdesign/core/VStack'
import { useEffect, useMemo, useState } from 'react'
import { lessons, conjugationGroups, POINTS_PER_QUESTION } from './data/lessons.js'
import { questionBanks } from './data/questions.js'
import { conjugationGuides } from './data/conjugationGuides.js'
import { irregularVerbs } from './data/irregular.js'

const STORAGE_KEY = 'english-learning-progress-v1'
const SETTINGS_KEY = 'english-learning-settings-v1'
// Cỡ chữ trong Cài đặt: tỉ lệ nhân với cỡ mặc định của app (cỡ Vừa =
// chữ thường 20px, tức theme 16px tăng 25% như trước). Đổi cỡ là đổi
// biến --font-scale trên documentElement nên toàn app đổi ngay.
const FONT_SIZE_OPTIONS = [
  { id: 'small', label: 'Nhỏ', scale: 0.8, px: 16 },
  { id: 'medium', label: 'Vừa', scale: 1, px: 20 },
  { id: 'large', label: 'Lớn', scale: 1.25, px: 25 },
  { id: 'xlarge', label: 'Rất lớn', scale: 1.5, px: 30 },
]
// Ngân hàng câu hỏi (tools/generate-questions.mjs sinh ra, 1043 câu):
// mỗi bài lấy ngẫu nhiên 25 câu mỗi phiên thay vì làm hết cả ngân hàng.
const QUESTIONS_PER_SESSION = 25
const allLessons = [...lessons, ...conjugationGroups].map((l) => ({
  ...l,
  questions: questionBanks[l.id] || l.questions,
}))
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
    <VStack gap={2}>
      <TextInput
        label="Tra cứu động từ"
        isLabelHidden
        placeholder="Gõ để tra: go, went, mua, ate…"
        value={query}
        onChange={(v) => setQuery(v)}
        hasClear
      />
      <Text type="supporting">
        Hiển thị {rows.length} / {irregularVerbs.length} động từ. Cột V2 dùng cho quá khứ đơn, cột V3 dùng sau have/has (sẽ học ở cấp cao hơn).
      </Text>
      <Table
        data={rows}
        idKey="v1"
        density="balanced"
        isStriped
        hasHover
        columns={[
          // Động từ (V1/V2/V3) dùng Badge xanh lá nhạt — màu nhẹ của nhóm Tra cứu,
          // để mắt trẻ phân biệt ngay dạng động từ với cột nghĩa tiếng Việt.
          { key: 'v1', header: 'V1', renderCell: (row) => <Badge variant="green" label={row.v1} /> },
          { key: 'v2', header: 'V2 (quá khứ)', renderCell: (row) => <Badge variant="green" label={row.v2} /> },
          { key: 'v3', header: 'V3', renderCell: (row) => <Badge variant="green" label={row.v3} /> },
          { key: 'vi', header: 'Nghĩa' },
        ]}
      />
      {rows.length === 0 && <Text>Không tìm thấy động từ nào khớp.</Text>}
    </VStack>
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

// Hệ màu cho trẻ em: MỖI Ý CHÍNH MỘT MÀU, dùng nhất quán ở mọi nơi
// (menu trái, thẻ bài, chi tiết bài, màn hình làm bài) để trẻ nhận ra
// bằng màu trước khi đọc chữ. Dùng đúng variant màu phân loại của Astryx
// (Card/ClickableCard/Badge) — theo tài liệu Astryx, variant màu dùng để
// phân loại, còn variant success/error chỉ dùng cho trạng thái đúng/sai.
// Nút hành động vẫn giữ primary để không lẫn với màu phân loại.
const CATEGORY_COLORS = {
  basic: { dot: '🔵', badge: 'blue', card: 'blue', label: 'Bài cơ bản' },
  conjugation: { dot: '🟣', badge: 'purple', card: 'purple', label: 'Chia động từ' },
  lookup: { dot: '🟢', badge: 'green', card: 'green', label: 'Tra cứu' },
  practice: { dot: '🟠', badge: 'orange', card: 'orange', label: 'Ôn tập tổng hợp' },
}
function categoryOfLesson(lesson) {
  return conjugationGroups.some((g) => g.id === lesson.id) ? CATEGORY_COLORS.conjugation : CATEGORY_COLORS.basic
}
function categoryOfQuiz(quiz) {
  if (!quiz?.lessonId) return CATEGORY_COLORS.practice
  const lesson = allLessons.find((l) => l.id === quiz.lessonId)
  return lesson ? categoryOfLesson(lesson) : CATEGORY_COLORS.basic
}

// Trình bày mẫu câu rõ ràng cho trẻ em:
// - Ngữ pháp: tách thành từng khối riêng (mỗi khối 1 thẻ), không còn là 1 đoạn
//   dài. Khối dạng "Câu tiếng Anh — nghĩa tiếng Việt" thì tách 2 dòng:
//   dòng trên là câu tiếng Anh in đậm, dòng dưới là nghĩa.
//   Khối chỉ là quy tắc/ghi chú thì giữ nguyên 1 dòng.
// - Từ vựng: mỗi mục 2 dòng riêng biệt: dòng 1 là từ + nghĩa,
//   dòng 2 là câu ví dụ (có nhãn "Ví dụ:"), không còn dồn chung 1 dòng.
function splitGrammar(grammar) {
  return String(grammar || '')
    .split(/(?<=[.!?])\s+(?=[A-ZÀ-ÝĐ])/)
    .map((chunk) => chunk.replace(/^\/\s*/, '').trim())
    .filter(Boolean)
}

function GrammarExamples({ grammar, card }) {
  const chunks = splitGrammar(grammar)
  return (
    <VStack gap={2}>
      {chunks.map((chunk, i) => {
        const sep = chunk.indexOf(' — ')
        const left = sep >= 0 ? chunk.slice(0, sep).trim() : ''
        const isPair = sep >= 0 && /^[A-Za-z0-9\s.,'\u2019?!/()\-:;|]+$/.test(left)
        if (isPair) {
          return (
            <Card key={i} variant={card || 'default'}>
              <VStack gap={1}>
                <Text weight="bold" size="lg">💬 {left}</Text>
                <Text>{chunk.slice(sep + 3).trim()}</Text>
              </VStack>
            </Card>
          )
        }
        return (
          <Card key={i} variant={card || 'default'}>
            <Text>{chunk}</Text>
          </Card>
        )
      })}
    </VStack>
  )
}

function VocabList({ items, verbTint }) {
  return (
    <VStack gap={3}>
      {items.map((v, i) => (
        <VStack key={v.en} gap={1}>
          <HStack gap={2} wrap="wrap">
            {verbTint
              ? (<><Text weight="bold">{i + 1}.</Text><Badge variant="purple" label={v.en} /></>)
              : (<Text weight="bold" size="lg">{i + 1}. {v.en}</Text>)}
            <Text type="supporting">— {v.vi}</Text>
          </HStack>
          <HStack gap={2} wrap="wrap">
            <Text type="supporting">💬 Ví dụ:</Text>
            <Text weight="bold">{v.example}</Text>
          </HStack>
        </VStack>
      ))}
    </VStack>
  )
}

// Hướng dẫn chia động từ chi tiết: sơ đồ bảng + sơ đồ luồng các bước
// làm (phần quan trọng nhất) + mẹo nhớ + ví dụ đặc biệt về số ít/số
// nhiều (phần trẻ hay nhầm nhất). Trình bày theo nguyên tắc: các
// section tách nhau bằng khoảng trắng lớn, KHÔNG tô màu cả cụm — màu
// chỉ xuất hiện ở nhãn nhỏ (số bước, thẻ nhánh) để dẫn mắt, nền các
// khối giữ trung tính; hướng dẫn nằm NGOÀI thẻ tím của bài để khỏi
// chìm trong một khối màu dài.
// Sơ đồ luồng: hộp bước nối nhau bằng mũi tên đi xuống; gặp nút hỏi
// thì rẽ sang 1 trong 2 nhánh rồi đi tiếp xuống dưới.
function FlowDiagram({ flow }) {
  let stepNo = 0
  const nodes = []
  flow.forEach((node, i) => {
    if (i > 0) {
      nodes.push(
        <HStack key={`arrow-${i}`} justify="center">
          <Text size="xl">↓</Text>
        </HStack>,
      )
    }
    if (node.decision) {
      nodes.push(
        <VStack key={`node-${i}`} gap={2}>
          <HStack gap={2} align="center">
            <Badge variant="purple" label="?" />
            <Text weight="bold" size="lg">{node.decision}</Text>
          </HStack>
          <HStack gap={2} wrap="wrap">
            {node.branches.map((b, j) => (
              <Card key={j}>
                <VStack gap={1}>
                  <Badge variant={j === 0 ? 'purple' : 'neutral'} label={b.tag} />
                  <Text weight="bold" size="lg">{b.result}</Text>
                  {b.note && <Text type="supporting">{b.note}</Text>}
                </VStack>
              </Card>
            ))}
          </HStack>
        </VStack>,
      )
    } else {
      stepNo += 1
      nodes.push(
        <Card key={`node-${i}`}>
          <HStack gap={2} align="center">
            <Badge variant="purple" label={`Bước ${stepNo}`} />
            <VStack gap={1}>
              <Text weight="bold" size="lg">{node.label}</Text>
              {node.sub && <Text type="supporting">{node.sub}</Text>}
            </VStack>
          </HStack>
        </Card>,
      )
    }
  })
  return <VStack gap={2}>{nodes}</VStack>
}

function ConjugationGuide({ guide }) {
  if (!guide) return null
  return (
    <VStack gap={6}>
      <VStack gap={2}>
        <Heading level={4} weight="bold">🧭 Sơ đồ chia động từ</Heading>
        <Table
          data={guide.table.rows}
          idKey={guide.table.idKey}
          density="balanced"
          isStriped
          hasHover
          columns={guide.table.columns}
        />
      </VStack>
      <VStack gap={2}>
        <Heading level={4} weight="bold">🪜 Các bước làm — đi theo sơ đồ này</Heading>
        <Text type="supporting">Đi từ trên xuống dưới; gặp nút hỏi thì rẽ sang nhánh đúng rồi đi tiếp.</Text>
        <FlowDiagram flow={guide.flow} />
      </VStack>
      <VStack gap={2}>
        <Heading level={4} weight="bold">💡 Mẹo nhớ</Heading>
        <VStack gap={1}>
          {guide.tips.map((tip, i) => (
            <Text key={i}>💡 {tip}</Text>
          ))}
        </VStack>
      </VStack>
      <VStack gap={2}>
        <Heading level={4} weight="bold">⚠️ Số ít / Số nhiều — ví dụ đặc biệt</Heading>
        <VStack gap={2}>
          {guide.specials.map((sp, i) => (
            <VStack key={i} gap={1}>
              <Text weight="bold" size="lg">{sp.example}</Text>
              <Text>{sp.why}</Text>
            </VStack>
          ))}
        </VStack>
      </VStack>
    </VStack>
  )
}

// Hộp nhớ nhanh số ít/số nhiều cho bài cơ bản: đếm chủ ngữ trước,
// rồi mới chia động từ — kèm các trường hợp đặc biệt hay lừa.
function SingularPluralBox() {
  return (
    <VStack gap={2}>
      <Heading level={4} weight="bold">🔢 Số ít / Số nhiều — nhớ nhanh</Heading>
      <Table
        data={[
          { kind: '1 người/vật', subjects: 'he, she, it, Lan, the dog', verb: '+ -s / is (She plays, Lan is kind)' },
          { kind: 'Nhiều người/vật', subjects: 'I, you, we, they, Lan and Minh, the dogs', verb: 'nguyên thể / are (They play, Lan and Minh are kind)' },
          { kind: 'Đặc biệt: everyone, everybody', subjects: 'coi như 1 người', verb: '+ -s / is (Everyone likes ice cream.)' },
          { kind: 'Đặc biệt: children, people', subjects: 'đã là số nhiều', verb: 'nguyên thể / are (Children play, People are happy.)' },
          { kind: 'Danh từ đổi hẳn dạng', subjects: 'child → children, person → people, man → men, woman → women, foot → feet, tooth → teeth', verb: 'không thêm -s (Children are happy.)' },
          { kind: 'Quá khứ', subjects: 'he hay they đều giống nhau', verb: 'played, went (quá khứ không chia theo số)' },
        ]}
        idKey="kind"
        density="balanced"
        isStriped
        hasHover
        columns={[
          { key: 'kind', header: 'Dạng' },
          { key: 'subjects', header: 'Chủ ngữ ví dụ' },
          { key: 'verb', header: 'Động từ đi kèm' },
        ]}
      />
      <Text type="supporting">Mẹo: đếm chủ ngữ trước, rồi mới chia động từ — 1 thì thêm -s (hiện tại đơn), nhiều thì giữ nguyên.</Text>
    </VStack>
  )
}

// Khung shell-nav theo template Astryx (giống NSDT App): thanh trên + rail
// trái có thể kéo giãn, phân loại bài học nằm ở menu trái thay cho tabs.
function Shell({ activeId, onNavigate, children }) {
  const items = useMemo(
    () => [
      {
        id: 'group-lessons',
        label: <Text maxLines={1}>Bài học</Text>,
        isExpanded: true,
        children: [
          { id: 'all', label: <Text maxLines={1}>Tất cả các bài</Text>, startContent: <Text>🌈</Text> },
          { id: 'basic', label: <Text maxLines={1}>Bài cơ bản</Text>, startContent: <Text>🔵</Text> },
          { id: 'practice', label: <Text maxLines={1}>Ôn tập tổng hợp</Text>, startContent: <Text>🟠</Text> },
        ].map((item) => ({ ...item, isSelected: item.id === activeId, onClick: () => onNavigate(item.id) })),
      },
      {
        id: 'group-conjugation',
        label: <Text maxLines={1}>Chia động từ</Text>,
        isExpanded: true,
        children: conjugationGroups.map((g) => ({
          id: `conj:${g.id}`,
          label: <Text maxLines={1}>{CONJ_TAB_LABELS[g.id] || g.topic}</Text>,
          startContent: <Text>🟣</Text>,
          isSelected: `conj:${g.id}` === activeId,
          onClick: () => onNavigate(`conj:${g.id}`),
        })),
      },
      {
        id: 'group-settings',
        label: <Text maxLines={1}>Cài đặt</Text>,
        isExpanded: true,
        children: [
          {
            id: 'settings',
            label: <Text maxLines={1}>Cỡ chữ</Text>,
            startContent: <Text>⚙️</Text>,
            isSelected: 'settings' === activeId,
            onClick: () => onNavigate('settings'),
          },
        ],
      },
      {
        id: 'group-lookup',
        label: <Text maxLines={1}>Tra cứu</Text>,
        isExpanded: true,
        children: [
          {
            id: 'lookup',
            label: <Text maxLines={1}>Động từ bất quy tắc</Text>,
            startContent: <Text>🟢</Text>,
            isSelected: 'lookup' === activeId,
            onClick: () => onNavigate('lookup'),
          },
        ],
      },
    ],
    [activeId, onNavigate],
  )
  return (
    <AppShell
      height="fill"
      contentPadding={4}
      topNav={
        <TopNav
          label="Thanh điều hướng chính"
          heading={<Heading level={4} weight="bold">🇬🇧 TuTi Learn English</Heading>}
        />
      }
      sideNav={
        <SideNav
          label="Phân loại bài học"
          resizable={{ defaultWidth: 280, minWidth: 220, maxWidth: 420 }}
        >
          <TreeList items={items} density="spacious" />
        </SideNav>
      }
    >
      {children}
    </AppShell>
  )
}

function Page({ activeId, onNavigate, children }) {
  return (
    <Shell activeId={activeId} onNavigate={onNavigate}>
      <VStack gap={4} width="100%" maxWidth={900}>
        {children}
      </VStack>
    </Shell>
  )
}

function Stat({ label, value }) {
  return (
    <VStack gap={1}>
      <Text type="supporting">{label}</Text>
      <Heading level={4} weight="bold">{value}</Heading>
    </VStack>
  )
}

export default function App() {
  const [progress, setProgress] = useState(loadProgress)
  const [view, setView] = useState({ name: 'home' }) // home | lesson | quiz
  const [quiz, setQuiz] = useState(null)
  const [section, setSection] = useState('all') // all | basic | lookup | conj:<id> | practice | settings
  const [fontSize, setFontSize] = useState(() => {
    try { return localStorage.getItem(SETTINGS_KEY) || 'medium' } catch { return 'medium' }
  })
  const fontSizeOpt = FONT_SIZE_OPTIONS.find((o) => o.id === fontSize) || FONT_SIZE_OPTIONS[1]
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontSizeOpt.scale))
    try { localStorage.setItem(SETTINGS_KEY, fontSize) } catch { /* không lưu được thì vẫn dùng cỡ đã chọn trong phiên */ }
  }, [fontSize, fontSizeOpt.scale])

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
      questions = shuffle(all).slice(0, QUESTIONS_PER_SESSION)
      title = 'Ôn tập tổng hợp (25 câu ngẫu nhiên)'
    } else {
      questions = shuffle(lesson.questions).slice(0, QUESTIONS_PER_SESSION)
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

  // Mục đang chọn trên menu trái: màn hình bài/quiz suy ra từ bài đang mở,
  // màn hình chính dùng section hiện tại.
  const activeLessonId = view.name === 'lesson' ? view.lesson.id : view.name === 'quiz' && quiz?.lessonId ? quiz.lessonId : null
  const activeId = view.name === 'quiz' && !quiz?.lessonId
    ? 'practice'
    : activeLessonId
      ? (conjugationGroups.some((g) => g.id === activeLessonId) ? `conj:${activeLessonId}` : 'basic')
      : section
  function handleNavigate(id) {
    if (id === 'practice') {
      startQuiz(null, true)
    } else {
      setSection(id)
      setView({ name: 'home' })
    }
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
    if (!quiz.questions.length) {
      return (
        <Page activeId={activeId} onNavigate={handleNavigate}>
          <Heading level={2}>Bài này chưa có câu hỏi.</Heading>
          <Text type="supporting">Hãy quay về trang chính và chọn bài khác.</Text>
          <Button variant="primary" label="Về trang chính" onClick={() => setView({ name: 'home' })} />
        </Page>
      )
    }
    if (quiz.finished) {
      const quizCat = categoryOfQuiz(quiz)
      const stars = starsFor(quiz.percent)
      const passed = quiz.percent >= 70
      const wrong = quiz.log.filter((x) => !x.correct)
      return (
        <Page activeId={activeId} onNavigate={handleNavigate}>
          <Button variant="ghost" label="← Về trang chính" onClick={() => setView({ name: 'home' })} />
          <Badge variant={quizCat.badge} label={quizCat.label} />
          <Heading level={2}>Kết quả: {quiz.score} / {quiz.questions.length * POINTS_PER_QUESTION} điểm ({quiz.percent}%)</Heading>
          <Banner
            status={passed ? 'success' : 'error'}
            title={passed ? 'Đạt! Bạn đã nắm được bài này.' : 'Chưa đạt (cần từ 70%). Xem lại phần sai rồi làm lại nhé!'}
            description={`Số sao: ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}`}
            collapsible={false}
          />
          {wrong.length > 0 && (
            <VStack gap={2}>
              <Heading level={4} weight="bold">Câu làm sai — xem lại</Heading>
              {wrong.map((x, i) => (
                <Card key={i}>
                  <VStack gap={1}>
                    <Text weight="bold">{x.question.prompt}</Text>
                    <Text>Bạn trả lời: {x.userAnswer}</Text>
                    <Text>Đáp án đúng: {x.correctAnswer}</Text>
                    <Text type="supporting">{x.question.explanation}</Text>
                  </VStack>
                </Card>
              ))}
            </VStack>
          )}
          <HStack gap={2} wrap="wrap">
            <Button variant="primary" label="Về trang chính" onClick={() => setView({ name: 'home' })} />
            {quiz.lessonId && (
              <Button label="Làm lại bài này" onClick={() => startQuiz(allLessons.find((l) => l.id === quiz.lessonId))} />
            )}
            <Button label="Bài tổng hợp phân loại" onClick={() => startQuiz(null, true)} />
          </HStack>
        </Page>
      )
    }

    const q = quiz.questions[quiz.index]
    const quizCat = categoryOfQuiz(quiz)
    return (
      <Page activeId={activeId} onNavigate={handleNavigate}>
        <Button variant="ghost" label="← Thoát bài (không lưu điểm)" onClick={() => setView({ name: 'home' })} />
        <Badge variant={quizCat.badge} label={quizCat.label} />
        <Heading level={2}>{quiz.title}</Heading>
        <ProgressBar
          label="Tiến độ bài làm"
          value={quiz.index + (quiz.checked ? 1 : 0)}
          max={quiz.questions.length}
          hasValueLabel
        />
        <Text type="supporting">
          Câu {quiz.index + 1} / {quiz.questions.length} · Điểm hiện tại: {quiz.score} · {typeLabel(q.type)}
          {q.lessonTitle ? ` · ${q.lessonTitle}` : ''}
        </Text>
        <Card variant={quizCat.card}>
          <VStack gap={3}>
            <Text weight="bold" size="lg">{q.prompt}</Text>
            {q.type === 'choice' ? (
              <VStack gap={2}>
                {q.options.map((opt) => {
                  let variant = 'secondary'
                  if (quiz.checked && opt === q.answer) variant = 'primary'
                  else if (quiz.checked && quiz.input === opt && !quiz.checked.correct) variant = 'destructive'
                  else if (quiz.input === opt) variant = 'primary'
                  return (
                    <Button
                      key={opt}
                      label={opt}
                      variant={variant}
                      isDisabled={!!quiz.checked}
                      onClick={() => setQuiz({ ...quiz, input: opt })}
                    />
                  )
                })}
              </VStack>
            ) : (
              <TextInput
                label="Câu trả lời"
                isLabelHidden
                placeholder={q.type === 'fill' ? 'Nhập từ / dạng đúng còn thiếu…' : 'Nhập câu tiếng Anh…'}
                value={quiz.input}
                isDisabled={!!quiz.checked}
                hasAutoFocus
                onChange={(v) => setQuiz({ ...quiz, input: v })}
                onEnter={() => { if (quiz.checked) nextQuestion(); else checkAnswer() }}
              />
            )}
            {quiz.checked && (
              <Banner
                status={quiz.checked.correct ? 'success' : 'error'}
                title={quiz.checked.correct ? 'Đúng rồi!' : `Chưa đúng. Đáp án: ${q.type === 'choice' ? q.answer : q.answers[0]}`}
                description={q.explanation}
                collapsible={false}
              />
            )}
          </VStack>
        </Card>
        {/* Nút hành động tách hẳn ra khỏi thẻ câu hỏi (và khỏi danh sách chọn
            đáp án) để không lẫn với các nút đáp án: "Chấm câu này" nhỏ gọn
            (sm) và màu khác (secondary, nhạt) thay vì primary đậm như đáp án
            đang chọn; nút "Câu tiếp theo" giữ primary vì lúc đó danh sách
            đáp án đã khóa, không còn gây nhầm. */}
        {!quiz.checked
          ? <Button variant="secondary" size="sm" label="Chấm câu này" isDisabled={!quiz.input.trim()} onClick={checkAnswer} />
          : <Button variant="primary" label={quiz.index + 1 >= quiz.questions.length ? 'Xem kết quả' : 'Câu tiếp theo →'} onClick={nextQuestion} />}
      </Page>
    )
  }

  // ---- Màn hình chi tiết bài ----
  if (view.name === 'lesson') {
    const lesson = view.lesson
    const lessonCat = categoryOfLesson(lesson)
    const best = progress[lesson.id]?.best || 0
    return (
      <Page activeId={activeId} onNavigate={handleNavigate}>
        <Button variant="ghost" label="← Về danh sách bài" onClick={() => setView({ name: 'home' })} />
        <Badge variant={lessonCat.badge} label={lessonCat.label} />
        <Heading level={2}>{lesson.title}</Heading>
        <Text type="supporting">{lesson.description}</Text>
        {best > 0 && <Text type="supporting">Điểm cao nhất của bạn ở bài này: {best}% · Đã làm {progress[lesson.id].attempts} lần</Text>}
        <Heading level={4} weight="bold">📖 {lesson.grammarTitle}</Heading>
        <GrammarExamples grammar={lesson.grammar} card={lessonCat.card} />
        <Heading level={4} weight="bold">📚 Dạng mẫu ({lesson.vocab.length} mục)</Heading>
        <Card variant={lessonCat.card}>
          <VocabList items={lesson.vocab} />
        </Card>
        <SingularPluralBox />
        <Heading level={4} weight="bold">✏️ Bài tập (ngân hàng {lesson.questions.length} câu — mỗi lần làm 25 câu, mỗi câu 1 điểm)</Heading>
        <Text type="supporting">3 dạng: trắc nghiệm, điền dạng đúng vào chỗ trống và dịch câu. Mỗi lần làm bài lấy ngẫu nhiên 25 câu từ ngân hàng nên làm lại sẽ gặp câu khác. Trả lời xong bấm “Chấm câu này” để xem giải thích ngay, cuối bài có tổng điểm /25, tỉ lệ % và danh sách câu sai để ôn lại.</Text>
        <Button variant="primary" size="lg" label="Bắt đầu làm bài →" onClick={() => startQuiz(lesson)} />
      </Page>
    )
  }

  // ---- Trang chính: phân loại ở menu trái (shell-nav), không dùng tabs nữa ----
  const isConjSection = section.startsWith('conj:')
  const conjId = isConjSection ? section.slice(5) : 'to-be'
  const shownLessons = section === 'basic'
    ? allLessons.filter((l) => !conjugationGroups.some((g) => g.id === l.id))
    : section === 'all' ? allLessons : []
  const conjLesson = allLessons.find((l) => l.id === conjId) || allLessons.find((l) => l.id === 'to-be')
  const conjBest = progress[conjLesson.id]?.best || 0
  return (
    <Page activeId={activeId} onNavigate={handleNavigate}>
      <Heading level={1} type="display-2">🇬🇧 TuTi Learn English</Heading>
      <Text type="supporting">Học tiếng Anh cơ bản bằng cách làm bài tập là chính: học nhanh 1 quy tắc + 8 mục dạng mẫu, rồi làm bài tập có chấm điểm và giải thích ngay sau mỗi câu.</Text>
      <Card>
        <HStack gap={8} wrap="wrap">
          <Stat label="Bài đã đạt (≥ 70%)" value={`${completedCount} / ${allLessons.length}`} />
          <Stat label="Câu hỏi có sẵn" value={String(totalQuestions)} />
          <Stat label="Bài cơ bản + nhóm chia động từ" value={`${lessons.length} + ${conjugationGroups.length}`} />
        </HStack>
      </Card>
      <Button variant="primary" size="lg" label="🔀 Ôn tập tổng hợp — 25 câu ngẫu nhiên" onClick={() => startQuiz(null, true)} />

      {section === 'settings' && (
        <VStack gap={2}>
          <Badge variant="neutral" label="Cài đặt" />
          <Heading level={4} weight="bold">⚙️ Cài đặt — Cỡ chữ</Heading>
          <Text type="supporting">Chọn một cỡ, toàn bộ app (menu, bài học, bài tập) đổi ngay lập tức và lần sau mở lại vẫn giữ cỡ đó.</Text>
          <HStack gap={2} wrap="wrap">
            {FONT_SIZE_OPTIONS.map((opt) => (
              <Button
                key={opt.id}
                variant={fontSize === opt.id ? 'primary' : 'secondary'}
                label={opt.label}
                onClick={() => setFontSize(opt.id)}
              />
            ))}
          </HStack>
          <Text type="supporting">Cỡ hiện tại: {fontSizeOpt.label} — chữ thường khoảng {fontSizeOpt.px}px.</Text>
          <Card>
            <VStack gap={1}>
              <Text weight="bold" size="lg">Chữ xem trước: She plays football every day.</Text>
              <Text>Chữ xem trước: Lan and Minh are happy today.</Text>
              <Text type="supporting">Đoạn này đổi theo cỡ bạn chọn ở trên.</Text>
            </VStack>
          </Card>
        </VStack>
      )}

      {section === 'lookup' && (
        <VStack gap={2}>
          <Badge variant="green" label="Tra cứu" />
          <Heading level={4} weight="bold">📖 Tra cứu động từ bất quy tắc</Heading>
          <Text type="supporting">Bảng này dùng cho nhóm Quá khứ bất quy tắc trong Chia động từ. Gõ tiếng Anh hoặc tiếng Việt để lọc, ví dụ “go”, “went” hoặc “mua”.</Text>
          <IrregularLookup />
        </VStack>
      )}

      {isConjSection && (
        <VStack gap={4}>
          <Badge variant="purple" label="Chia động từ" />
          <Heading level={4} weight="bold">Chia động từ — {CONJ_TAB_LABELS[conjLesson.id] || conjLesson.topic}</Heading>
          <Text type="supporting">Mỗi nhóm là 1 cách chia khác nhau. Gặp dạng nào thì chia theo nhóm đó: to be thì đổi be, hiện tại đơn thì thêm -s/-es, đang diễn ra thì be + V-ing, quá khứ có quy tắc thì -ed, quá khứ bất quy tắc thì học thuộc V2, tương lai thì will/be going to. Chọn nhóm khác ở menu trái.</Text>
          <Card variant="purple">
            <VStack gap={3}>
              <Heading level={4} weight="bold">{conjLesson.title}</Heading>
              <Text type="supporting">{conjLesson.description}</Text>
              {conjBest > 0 && <Text type="supporting">Điểm cao nhất của bạn ở nhóm này: {conjBest}% · Đã làm {progress[conjLesson.id].attempts} lần</Text>}
              <Heading level={4} weight="bold">📖 {conjLesson.grammarTitle}</Heading>
              <GrammarExamples grammar={conjLesson.grammar} card="purple" />
              <Heading level={4} weight="bold">📚 Dạng mẫu ({conjLesson.vocab.length} mục)</Heading>
              <VocabList items={conjLesson.vocab} verbTint />
            </VStack>
          </Card>
          <ConjugationGuide guide={conjugationGuides[conjLesson.id]} />
          <Button variant="primary" size="lg" label="Bắt đầu làm 25 câu →" onClick={() => startQuiz(conjLesson)} />
        </VStack>
      )}

      {(section === 'all' || section === 'basic') && (
        <VStack gap={2}>
          <Heading level={4} weight="bold">{section === 'basic' ? 'Các bài cơ bản' : 'Tất cả các bài'}</Heading>
          <Text type="supporting">Số câu trên mỗi thẻ là số câu trong ngân hàng của bài đó; mỗi lần làm bài lấy ngẫu nhiên 25 câu, mỗi câu 1 điểm.</Text>
          {shownLessons.map((lesson, i) => {
            const best = progress[lesson.id]?.best || 0
            const done = best >= 70
            const isConj = conjugationGroups.some((g) => g.id === lesson.id)
            return (
              <ClickableCard key={lesson.id} label={lesson.title} variant={isConj ? 'purple' : 'blue'} onClick={() => openLesson(lesson)}>
                <HStack gap={2}>
                  <Text weight="bold">{i + 1}.</Text>
                  <VStack gap={1}>
                    <Heading level={4} weight="bold">{lesson.title}</Heading>
                    <Text type="supporting">{lesson.description}</Text>
                    <HStack gap={2} wrap="wrap">
                      <Badge variant="neutral" label={`${lesson.questions.length} câu`} />
                      {isConj
                        ? <Badge variant="purple" label="Chia động từ" />
                        : <Badge variant="blue" label="Bài cơ bản" />}
                      {best > 0 && <Badge variant={done ? 'success' : 'neutral'} label={`Cao nhất: ${best}%`} />}
                    </HStack>
                  </VStack>
                </HStack>
              </ClickableCard>
            )
          })}
        </VStack>
      )}
      <Text type="supporting">Tiến độ lưu trên trình duyệt này (localStorage). Đạt từ 70% được tính là hoàn thành bài. Không cần tài khoản, không cần mạng sau khi tải trang.</Text>
    </Page>
  )
}
