import { Routes } from 'react-router-dom'
import { staticRoutes } from './staticRoutes'
import { examRoutes } from './examRoutes'
import { topicsRoutes } from './topicsRoutes'
import { userRoutes } from './userRoutes'

/**
 * アプリケーション全体のルート定義
 *
 * 各モジュールからルートをインポートし、統合して提供する
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {staticRoutes}
      {examRoutes}
      {topicsRoutes}
      {userRoutes}
    </Routes>
  )
}
