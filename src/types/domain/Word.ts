/**
 * 単語の基本型定義
 */
export interface Word {
  /** エスペラント語 */
  esperanto: string
  /** 日本語訳 */
  japanese: string
  /** 追加情報（オプション） */
  extra?: string
}

/**
 * カテゴリ識別子
 */
export type CategoryId = 'drill' | 'esuken4' | 'interrogative'

/**
 * カテゴリメタデータ
 */
export interface CategoryMetadata {
  id: CategoryId
  name: string
  emoji: string
  totalWords: number
}
