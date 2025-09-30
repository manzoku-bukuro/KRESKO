import { describe, it, expect } from 'vitest'
import { interrogativeWords } from './interrogativeWords'

describe('interrogativeWords data', () => {
  it('has 9 words', () => {
    expect(interrogativeWords).toHaveLength(9)
  })

  it('all words start with "ki"', () => {
    interrogativeWords.forEach(item => {
      expect(item.word.startsWith('ki')).toBe(true)
    })
  })

  it('all words have required fields', () => {
    interrogativeWords.forEach(item => {
      expect(item).toHaveProperty('word')
      expect(item).toHaveProperty('meaning')
      expect(item.word).toBeTruthy()
      expect(item.meaning).toBeTruthy()
    })
  })
})