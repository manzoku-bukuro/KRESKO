import { updatePageTitle, updatePageDescription, updatePageMeta, seoData } from '../seo'
import { vi } from 'vitest'

// Mock document object
Object.defineProperty(window, 'document', {
  value: {
    title: '',
    querySelector: vi.fn()
  },
  writable: true
})

describe('SEO utilities', () => {
  beforeEach(() => {
    document.title = ''
    vi.clearAllMocks()
  })

  describe('updatePageTitle', () => {
    it('sets the document title with app name suffix', () => {
      updatePageTitle('テストページ')
      expect(document.title).toBe('テストページ | MEMORU - エスペラント語学習アプリ')
    })
  })

  describe('updatePageDescription', () => {
    it('updates meta description when element exists', () => {
      const mockMetaElement = {
        setAttribute: vi.fn()
      } as unknown as Element
      const querySelectorSpy = vi.spyOn(document, 'querySelector')
      querySelectorSpy.mockReturnValue(mockMetaElement)

      updatePageDescription('テスト説明文')

      expect(querySelectorSpy).toHaveBeenCalledWith('meta[name="description"]')
      expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('content', 'テスト説明文')
    })

    it('does nothing when meta description element does not exist', () => {
      const querySelectorSpy = vi.spyOn(document, 'querySelector')
      querySelectorSpy.mockReturnValue(null)

      expect(() => updatePageDescription('テスト説明文')).not.toThrow()
      expect(querySelectorSpy).toHaveBeenCalledWith('meta[name="description"]')
    })
  })

  describe('updatePageMeta', () => {
    it('updates both title and description', () => {
      const mockMetaElement = {
        setAttribute: vi.fn()
      } as unknown as Element
      const querySelectorSpy = vi.spyOn(document, 'querySelector')
      querySelectorSpy.mockReturnValue(mockMetaElement)

      updatePageMeta('テストタイトル', 'テスト説明文')

      expect(document.title).toBe('テストタイトル | MEMORU - エスペラント語学習アプリ')
      expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('content', 'テスト説明文')
    })
  })

  describe('seoData', () => {
    it('contains all required page data', () => {
      expect(seoData.home).toHaveProperty('title')
      expect(seoData.home).toHaveProperty('description')
      expect(seoData.interrogativeBasic).toHaveProperty('title')
      expect(seoData.interrogativeBasic).toHaveProperty('description')
      expect(seoData.numberGame).toHaveProperty('title')
      expect(seoData.numberGame).toHaveProperty('description')
    })

    it('has meaningful content for each page', () => {
      expect(seoData.home.title).toBe('エスペラント語学習')
      expect(seoData.home.description).toContain('MEMORU')
      expect(seoData.numberGame.title).toBe('エスペラント数字ゲーム')
    })
  })
})