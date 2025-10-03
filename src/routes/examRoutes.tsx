import { Route } from 'react-router-dom'
import RangeSelect from '@/pages/Exam/RangeSelect'
import Quiz from '@/pages/Exam/Quiz'

/**
 * 試験・学習関連のルート
 * - 範囲選択
 * - クイズ実行
 */
export const examRoutes = (
  <>
    <Route path="/range/:category" element={<RangeSelect />} />
    <Route path="/quiz/:category/:rangeStart/:rangeSize" element={<Quiz />} />
  </>
)
