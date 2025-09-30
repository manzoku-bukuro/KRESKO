import { describe, it, expect } from 'vitest'
import { normalizeWords, getCategoryEmoji, getCategoryName } from './normalizeWords'

describe('normalizeWords', () => {
  it('returns empty array for unknown category', () => {
    const result = normalizeWords('unknown')
    expect(result).toEqual([])
  })

  it('normalizes drill category data', () => {
    const result = normalizeWords('drill')
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toHaveProperty('esperanto')
    expect(result[0]).toHaveProperty('japanese')
  })

  it('normalizes esuken4 category data', () => {
    const result = normalizeWords('esuken4')
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toHaveProperty('esperanto')
    expect(result[0]).toHaveProperty('japanese')
    expect(result[0]).toHaveProperty('extra')
  })
})

describe('getCategoryEmoji', () => {
  it('returns correct emoji for drill', () => {
    expect(getCategoryEmoji('drill')).toBe('📚')
  })

  it('returns correct emoji for esuken4', () => {
    expect(getCategoryEmoji('esuken4')).toBe('🏆')
  })

  it('returns default emoji for unknown category', () => {
    expect(getCategoryEmoji('unknown')).toBe('📖')
  })
})

describe('getCategoryName', () => {
  it('returns correct name for drill', () => {
    expect(getCategoryName('drill')).toBe('ドリル式')
  })

  it('returns correct name for esuken4', () => {
    expect(getCategoryName('esuken4')).toBe('エス検4級')
  })

  it('returns category as-is for unknown category', () => {
    expect(getCategoryName('unknown')).toBe('unknown')
  })
})