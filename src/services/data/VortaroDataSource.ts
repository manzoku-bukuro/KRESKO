import type { Word, CategoryId, CategoryMetadata } from '../../types/domain'
import type { IDataSource } from './DataService'
import vortaroData from '../../data/vortaro.json'

/**
 * vortaro.json用のデータソース
 */
export class VortaroDataSource implements IDataSource {
  private words: Word[]

  constructor() {
    // JSONデータを正規化
    this.words = vortaroData.map(item => ({
      esperanto: item.esperanto,
      japanese: item.japanese,
    }))
  }

  getCategoryId(): CategoryId {
    return 'drill'
  }

  getMetadata(): CategoryMetadata {
    return {
      id: 'drill',
      name: 'ドリル式',
      emoji: '📚',
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
