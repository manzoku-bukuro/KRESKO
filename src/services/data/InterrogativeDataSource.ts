import type { Word, CategoryId, CategoryMetadata } from '../../types/domain'
import type { IDataSource } from './DataService'
import interrogativeData from '../../data/interrogative-questions.json'

/**
 * interrogative-questions.json用のデータソース
 * 疑問詞問題は特殊形式だが、Word型に変換して扱う
 */
export class InterrogativeDataSource implements IDataSource {
  private words: Word[]

  constructor() {
    // 疑問詞データをWord型に変換
    // 正解の疑問詞を"エスペラント語"、翻訳を"日本語訳"とする
    this.words = interrogativeData.map(item => ({
      esperanto: item.correctAnswer,
      japanese: item.translation,
      extra: item.explanation,
    }))
  }

  getCategoryId(): CategoryId {
    return 'interrogative'
  }

  getMetadata(): CategoryMetadata {
    return {
      id: 'interrogative',
      name: '疑問詞',
      emoji: '❓',
      totalWords: this.words.length,
    }
  }

  getAllWords(): Word[] {
    return [...this.words]
  }

  getWordsByRange(start: number, size: number): Word[] {
    if (start < 0 || start >= this.words.length) {
      return []
    }
    return this.words.slice(start, start + size)
  }

  getTotalWords(): number {
    return this.words.length
  }
}
