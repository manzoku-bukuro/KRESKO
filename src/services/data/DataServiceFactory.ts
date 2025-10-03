import { DataService } from './DataService'
import { VortaroDataSource } from './VortaroDataSource'
import { Esuken4DataSource } from './Esuken4DataSource'
import { InterrogativeDataSource } from './InterrogativeDataSource'

/**
 * グローバルデータサービスインスタンス
 * アプリケーション全体で共有されるシングルトン
 */
let globalDataService: DataService | null = null

/**
 * データサービスを初期化して取得
 * 初回呼び出し時にすべてのデータソースを登録
 */
export function getDataService(): DataService {
  if (!globalDataService) {
    globalDataService = new DataService()

    // すべてのデータソースを登録
    globalDataService.registerDataSource(new VortaroDataSource())
    globalDataService.registerDataSource(new Esuken4DataSource())
    globalDataService.registerDataSource(new InterrogativeDataSource())
  }

  return globalDataService
}

/**
 * データサービスをリセット（テスト用）
 */
export function resetDataService(): void {
  globalDataService = null
}
