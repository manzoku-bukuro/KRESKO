import vortaro from '../../../../data/vortaro.json'
import esuken4 from '../../../../data/esuken4.json'
import type { Word } from '../../../../types'

// JSON → 共通形式に変換
export const normalizeWords = (category: string): Word[] => {
  if (category === 'drill') {
    return vortaro.map(w => ({
      esperanto: w.esperanto,
      japanese: w.japanese,
    }))
  }

  if (category === 'esuken4') {
    return esuken4.map(w => ({
      esperanto: w.vorto,
      japanese: w.意味,
      extra: w['意味続き'] ?? '',
    }))
  }

  return []
}

export const getCategoryEmoji = (cat: string) => {
  if (cat === 'drill') return '📚'
  if (cat === 'esuken4') return '🏆'
  return '📖'
}

export const getCategoryName = (cat: string) => {
  if (cat === 'drill') return 'ドリル式'
  if (cat === 'esuken4') return 'エス検4級'
  return cat
}