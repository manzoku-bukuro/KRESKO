import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { updatePageMeta, seoData } from '@/utils/seo'
import { getDataService } from '@/services'
import type { CategoryId } from '@/types/domain'
import type { WordListItem } from '../WordList.types'

export const useWordList = () => {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()

  const dataService = useMemo(() => getDataService(), [])

  // SEO meta tags
  useEffect(() => {
    if (category === 'drill') {
      navigate('/', { replace: true })
    } else if (category === 'esuken4') {
      updatePageMeta(seoData.esuken4.title, seoData.esuken4.description)
    }
  }, [category, navigate])

  // メタデータとカテゴリ情報を取得
  const metadata = useMemo(() => {
    try {
      return dataService.getDataSource(category as CategoryId).getMetadata()
    } catch {
      return null
    }
  }, [dataService, category])

  // 全単語を取得してリスト形式に変換
  const words = useMemo((): WordListItem[] => {
    try {
      if (!category) {
        console.error('カテゴリが指定されていません')
        return []
      }
      const allWords = dataService.getAllWords(category as CategoryId)
      return allWords.map((word, index: number) => ({
        index: index + 1,
        esperanto: word.esperanto,
        japanese: word.japanese,
      }))
    } catch (error) {
      console.error('単語の取得に失敗:', error)
      return []
    }
  }, [dataService, category])

  const handleWordClick = (index: number) => {
    // クリックした単語の位置から10問出題（クエリパラメータで開始位置を指定）
    navigate(`/quiz/${category}?start=${index}`)
  }

  const handleNavigateToTop = () => {
    navigate('/')
  }

  return {
    categoryName: metadata?.name || category || '',
    categoryEmoji: metadata?.emoji || '📖',
    words,
    onWordClick: handleWordClick,
    onNavigateToTop: handleNavigateToTop,
  }
}
