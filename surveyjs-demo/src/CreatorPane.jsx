import { useEffect, useMemo } from 'react'
import { SurveyCreatorModel } from 'survey-creator-core'
import { SurveyCreatorComponent } from 'survey-creator-react'
import 'survey-creator-core/survey-creator-core.css'

// Tách riêng để Vite lazy-load: Creator nặng (~2MB), chỉ tải khi mở tab Tạo form.
export default function CreatorPane({ json, sampleKey, onSave }) {
  const creator = useMemo(() => {
    const c = new SurveyCreatorModel({
      showLogicTab: true,
      showTranslationEditor: false,
      showThemeTab: true,
      isAutoSave: true,
    })
    c.saveSurveyFunc = (saveNo, callback) => {
      onSave(c.JSON)
      callback(saveNo, true)
    }
    return c
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Chỉ đồng bộ khi đổi mẫu. Không đồng bộ theo từng lần save,
  // nếu không Creator sẽ bị nạp lại JSON và mất vị trí đang sửa.
  useEffect(() => {
    creator.JSON = json
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleKey])

  return <SurveyCreatorComponent creator={creator} />
}
