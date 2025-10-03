import { Route } from 'react-router-dom'
import WeakQuestions from '../pages/SavedQuestions/List'
import WeakQuestionsReview from '../pages/SavedQuestions/Review'

/**
 * ユーザーデータ関連のルート
 * - 苦手問題一覧
 * - 苦手問題復習
 */
export const userRoutes = (
  <>
    <Route path="/weak-questions" element={<WeakQuestions />} />
    <Route path="/weak-questions-review" element={<WeakQuestionsReview />} />
  </>
)
