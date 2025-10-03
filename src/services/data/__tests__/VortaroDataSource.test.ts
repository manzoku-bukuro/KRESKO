import { describe, it, expect } from 'vitest'
import { VortaroDataSource } from '../VortaroDataSource'

describe('VortaroDataSource', () => {
  const dataSource = new VortaroDataSource()

  it('正しいカテゴリIDを返す', () => {
    expect(dataSource.getCategoryId()).toBe('drill')
  })

  it('メタデータを返す', () => {
    const metadata = dataSource.getMetadata()
    expect(metadata.id).toBe('drill')
    expect(metadata.name).toBe('ドリル式')
    expect(metadata.emoji).toBe('📚')
    expect(metadata.totalWords).toBeGreaterThan(0)
  })

  it('全単語を取得できる', () => {
    const words = dataSource.getAllWords()
    expect(words.length).toBeGreaterThan(0)
    expect(words[0]).toHaveProperty('esperanto')
    expect(words[0]).toHaveProperty('japanese')
  })

  it('範囲指定で単語を取得できる', () => {
    const words = dataSource.getWordsByRange(0, 5)
    expect(words.length).toBe(5)
  })

  it('範囲外の場合は空配列を返す', () => {
    const words = dataSource.getWordsByRange(-1, 5)
    expect(words).toEqual([])

    const words2 = dataSource.getWordsByRange(9999, 5)
    expect(words2).toEqual([])
  })

  it('単語数を取得できる', () => {
    const total = dataSource.getTotalWords()
    expect(total).toBeGreaterThan(0)
    expect(total).toBe(dataSource.getAllWords().length)
  })
})
