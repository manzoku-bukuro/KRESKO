import { describe, it, expect } from 'vitest'
import { Esuken4DataSource } from '../Esuken4DataSource'

describe('Esuken4DataSource', () => {
  const dataSource = new Esuken4DataSource()

  it('正しいカテゴリIDを返す', () => {
    expect(dataSource.getCategoryId()).toBe('esuken4')
  })

  it('メタデータを返す', () => {
    const metadata = dataSource.getMetadata()
    expect(metadata.id).toBe('esuken4')
    expect(metadata.name).toBe('エス検4級')
    expect(metadata.emoji).toBe('🎓')
    expect(metadata.totalWords).toBeGreaterThan(0)
  })

  it('全単語を取得できる', () => {
    const words = dataSource.getAllWords()
    expect(words.length).toBeGreaterThan(0)
    expect(words[0]).toHaveProperty('esperanto')
    expect(words[0]).toHaveProperty('japanese')
  })

  it('意味続きがある場合は統合される', () => {
    const words = dataSource.getAllWords()
    // 最初の単語は "意味続き" があるはず
    const firstWord = words[0]
    expect(firstWord.japanese).toContain('（')
    expect(firstWord.extra).toBeDefined()
  })

  it('範囲指定で単語を取得できる', () => {
    const words = dataSource.getWordsByRange(0, 5)
    expect(words.length).toBe(5)
  })

  it('範囲外の場合は空配列を返す', () => {
    const words = dataSource.getWordsByRange(-1, 5)
    expect(words).toEqual([])
  })

  it('単語数を取得できる', () => {
    const total = dataSource.getTotalWords()
    expect(total).toBeGreaterThan(0)
    expect(total).toBe(dataSource.getAllWords().length)
  })
})
