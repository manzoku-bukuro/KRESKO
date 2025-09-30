import { describe, it, expect } from 'vitest'
import { interrogatives } from './interrogatives'

describe('interrogatives data', () => {
  it('has 9 interrogatives', () => {
    expect(interrogatives).toHaveLength(9)
  })

  it('all interrogatives start with "ki"', () => {
    interrogatives.forEach(item => {
      expect(item.word.startsWith('ki')).toBe(true)
    })
  })

  it('all interrogatives have required fields', () => {
    interrogatives.forEach(item => {
      expect(item).toHaveProperty('word')
      expect(item).toHaveProperty('meaning')
      expect(item).toHaveProperty('description')
      expect(item).toHaveProperty('examples')
      expect(item.examples.length).toBeGreaterThan(0)
    })
  })

  it('all examples have esperanto and japanese fields', () => {
    interrogatives.forEach(item => {
      item.examples.forEach(example => {
        expect(example).toHaveProperty('esperanto')
        expect(example).toHaveProperty('japanese')
        expect(example.esperanto).toBeTruthy()
        expect(example.japanese).toBeTruthy()
      })
    })
  })

  it('includes all expected interrogatives', () => {
    const words = interrogatives.map(i => i.word)
    expect(words).toContain('kio')
    expect(words).toContain('kiu')
    expect(words).toContain('kia')
    expect(words).toContain('kies')
    expect(words).toContain('kie')
    expect(words).toContain('kiel')
    expect(words).toContain('kial')
    expect(words).toContain('kiam')
    expect(words).toContain('kiom')
  })
})