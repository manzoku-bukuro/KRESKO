import { Route } from 'react-router-dom'
import InterrogativeMenu from '@/pages/Topics/Interrogative/Menu'
import InterrogativeExplanation from '@/pages/Topics/Interrogative/Explanation'
import InterrogativeBasic from '@/pages/Topics/Interrogative/Basic'
import InterrogativeAdvanced from '@/pages/Topics/Interrogative/Advanced'

/**
 * トピック学習関連のルート
 * - 疑問詞メニュー
 * - 疑問詞解説
 * - 疑問詞基礎練習
 * - 疑問詞応用練習
 */
export const topicsRoutes = (
  <>
    <Route path="/interrogative-menu" element={<InterrogativeMenu />} />
    <Route path="/interrogative-explanation" element={<InterrogativeExplanation />} />
    <Route path="/interrogative-basic" element={<InterrogativeBasic />} />
    <Route path="/interrogative-advanced" element={<InterrogativeAdvanced />} />
  </>
)
