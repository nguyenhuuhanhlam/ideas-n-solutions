// Sinh file API tĩnh cho các form từ src/samples.js (nguồn duy nhất).
// Chạy tự động trước mỗi lần build nhờ script "prebuild" trong package.json,
// nên file trong public/forms/ luôn khớp với form trong code.
// Ghi đè biến môi trường SURVEYJS_DEMO_BASE_URL khi cần base URL khác.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SAMPLES } from '../src/samples.js'

const BASE_URL =
  process.env.SURVEYJS_DEMO_BASE_URL ||
  'https://nguyenhuuhanhlam.github.io/ideas-n-solutions/surveyjs-demo'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, '..', 'public', 'forms')
mkdirSync(outDir, { recursive: true })

const countFields = (json) =>
  (json.pages || []).reduce((n, p) => n + (p.elements ? p.elements.length : 0), 0)

const list = Object.entries(SAMPLES).map(([id, { json }]) => ({
  id,
  title: json.title,
  description: json.description || '',
  fields: countFields(json),
  pages: (json.pages || []).length,
  fillUrl: `${BASE_URL}?form=${id}`,
  jsonUrl: `${BASE_URL}/forms/${id}.json`,
  embedUrl: `${BASE_URL}?form=${id}&embed=1`,
}))

for (const [id, { json }] of Object.entries(SAMPLES)) {
  writeFileSync(join(outDir, `${id}.json`), JSON.stringify(json, null, 2) + '\n')
}
writeFileSync(
  join(outDir, 'index.json'),
  JSON.stringify({ forms: list, listUrl: `${BASE_URL}/forms/index.json` }, null, 2) + '\n',
)
console.log(`generate-form-api: wrote ${list.length} forms to public/forms/`)
