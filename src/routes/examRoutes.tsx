import { Route } from 'react-router-dom'
import RangeSelect from '@/pages/Exam/RangeSelect'
import WordList from '@/pages/Exam/WordList'
import Quiz from '@/pages/Exam/Quiz'

/**
 * 試験・学習関連のルート
 * - 範囲選択（drill用）
 * - 単語リスト（esuken4用 - abceed風）
 * - クイズ実行（クエリパラメータで開始位置を指定: ?start=50）
 */
export const examRoutes = (
  <>
    <Route path="/range/drill" element={<RangeSelect />} />
    <Route path="/wordlist/:category" element={<WordList />} />
    <Route path="/quiz/:category" element={<Quiz />} />
  </>
)
