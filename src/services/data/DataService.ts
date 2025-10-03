import type { Word, CategoryId, CategoryMetadata } from '../../types/domain'

/**
 * データソースインターフェース
 * 各カテゴリのデータソースが実装する共通インターフェース
 */
export interface IDataSource {
  /**
   * カテゴリIDを取得
   */
  getCategoryId(): CategoryId

  /**
   * カテゴリメタデータを取得
   */
  getMetadata(): CategoryMetadata

  /**
   * 全単語を取得
   */
  getAllWords(): Word[]

  /**
   * 指定範囲の単語を取得
   * @param start 開始インデックス（0始まり）
   * @param size 取得する単語数
   */
  getWordsByRange(start: number, size: number): Word[]

  /**
   * 単語数を取得
   */
  getTotalWords(): number
}

/**
 * データサービス
 * カテゴリに応じた適切なデータソースを提供する
 */
export class DataService {
  private dataSources = new Map<CategoryId, IDataSource>()

  /**
   * データソースを登録
   */
  registerDataSource(dataSource: IDataSource): void {
    this.dataSources.set(dataSource.getCategoryId(), dataSource)
  }

  /**
   * データソースを取得
   * @throws {Error} データソースが見つからない場合
   */
  getDataSource(categoryId: CategoryId): IDataSource {
    const dataSource = this.dataSources.get(categoryId)
    if (!dataSource) {
      throw new Error(`データソースが見つかりません: ${categoryId}`)
    }
    return dataSource
  }

  /**
   * 全カテゴリのメタデータを取得
   */
  getAllCategories(): CategoryMetadata[] {
    return Array.from(this.dataSources.values()).map(ds => ds.getMetadata())
  }

  /**
   * 指定カテゴリの全単語を取得
   */
  getAllWords(categoryId: CategoryId): Word[] {
    return this.getDataSource(categoryId).getAllWords()
  }

  /**
   * 指定カテゴリの範囲の単語を取得
   */
  getWordsByRange(categoryId: CategoryId, start: number, size: number): Word[] {
    return this.getDataSource(categoryId).getWordsByRange(start, size)
  }

  /**
   * 指定カテゴリの単語数を取得
   */
  getTotalWords(categoryId: CategoryId): number {
    return this.getDataSource(categoryId).getTotalWords()
  }
}
