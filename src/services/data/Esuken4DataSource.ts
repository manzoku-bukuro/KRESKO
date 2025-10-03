import type { Word, CategoryId, CategoryMetadata } from '../../types/domain'
import type { IDataSource } from './DataService'
import esuken4Data from '../../data/esuken4.json'

/**
 * esuken4.json用のデータソース
 */
export class Esuken4DataSource implements IDataSource {
  private words: Word[]

  constructor() {
    // JSONデータを正規化
    this.words = esuken4Data.map(item => {
      const japanese = item['意味続き']
        ? `${item['意味']}（${item['意味続き']}）`
        : item['意味']

      return {
        esperanto: item.vorto,
        japanese,
        extra: item['意味続き'] || undefined,
      }
    })
  }

  getCategoryId(): CategoryId {
    return 'esuken4'
  }

  getMetadata(): CategoryMetadata {
    return {
      id: 'esuken4',
      name: 'エス検4級',
      emoji: '🎓',
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
