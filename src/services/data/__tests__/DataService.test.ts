import { describe, it, expect, beforeEach } from 'vitest'
import { DataService } from '../DataService'
import { VortaroDataSource } from '../VortaroDataSource'
import { Esuken4DataSource } from '../Esuken4DataSource'
import { getDataService, resetDataService } from '../DataServiceFactory'

describe('DataService', () => {
  let dataService: DataService

  beforeEach(() => {
    dataService = new DataService()
    dataService.registerDataSource(new VortaroDataSource())
    dataService.registerDataSource(new Esuken4DataSource())
  })

  it('データソースを登録できる', () => {
    expect(() => dataService.getDataSource('drill')).not.toThrow()
    expect(() => dataService.getDataSource('esuken4')).not.toThrow()
  })

  it('未登録のデータソースはエラーを投げる', () => {
    expect(() => dataService.getDataSource('interrogative')).toThrow(
      'データソースが見つかりません: interrogative'
    )
  })

  it('全カテゴリのメタデータを取得できる', () => {
    const categories = dataService.getAllCategories()
    expect(categories.length).toBe(2)
    expect(categories[0]).toHaveProperty('id')
    expect(categories[0]).toHaveProperty('name')
    expect(categories[0]).toHaveProperty('emoji')
  })

  it('カテゴリIDで全単語を取得できる', () => {
    const words = dataService.getAllWords('drill')
    expect(words.length).toBeGreaterThan(0)
  })

  it('カテゴリIDと範囲で単語を取得できる', () => {
    const words = dataService.getWordsByRange('esuken4', 0, 10)
    expect(words.length).toBe(10)
  })

  it('カテゴリIDで単語数を取得できる', () => {
    const total = dataService.getTotalWords('drill')
    expect(total).toBeGreaterThan(0)
  })
})

describe('DataServiceFactory', () => {
  beforeEach(() => {
    resetDataService()
  })

  it('シングルトンインスタンスを返す', () => {
    const service1 = getDataService()
    const service2 = getDataService()
    expect(service1).toBe(service2)
  })

  it('初回呼び出しで全データソースが登録される', () => {
    const service = getDataService()
    expect(() => service.getDataSource('drill')).not.toThrow()
    expect(() => service.getDataSource('esuken4')).not.toThrow()
    expect(() => service.getDataSource('interrogative')).not.toThrow()
  })

  it('resetDataService後は新しいインスタンスが作成される', () => {
    const service1 = getDataService()
    resetDataService()
    const service2 = getDataService()
    expect(service1).not.toBe(service2)
  })
})
