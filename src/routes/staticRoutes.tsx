import { Route } from 'react-router-dom'
import Top from '../pages/Top'
import NumberGame from '../pages/NumberGame'
import PrivacyPolicy from '../pages/PrivacyPolicy'

/**
 * 静的ページのルート
 * - トップページ
 * - 数字ゲーム
 * - プライバシーポリシー
 */
export const staticRoutes = (
  <>
    <Route path="/" element={<Top />} />
    <Route path="/number-game" element={<NumberGame />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
  </>
)
