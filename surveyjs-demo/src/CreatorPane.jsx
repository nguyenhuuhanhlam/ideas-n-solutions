import { useEffect, useMemo } from 'react'
import { SurveyCreator, SurveyCreatorComponent } from 'survey-creator-react'
import 'survey-creator-core/survey-creator-core.css'

// Tách riêng để Vite lazy-load: Creator nặng (~2MB), chỉ tải khi mở tab Tạo form.
export default function CreatorPane({ json, sampleKey, onSave }) {
  const creator = useMemo(() => {
    // QUAN TRỌNG: phải dùng SurveyCreator của survey-creator-react, KHÔNG dùng
    // SurveyCreatorModel của survey-creator-core. SurveyCreatorModel không có
    // createQuestionElement(), nên designer render câu hỏi sẽ lỗi
    // "e.createQuestionElement is not a function". SurveyCreator kế thừa
    // SurveyCreatorModel và bổ sung đúng method đó cho React.
    const c = new SurveyCreator({
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
