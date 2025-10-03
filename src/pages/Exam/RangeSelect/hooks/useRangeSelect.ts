import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { updatePageMeta, seoData } from '../../../../utils/seo'
import { getDataService } from '../../../../services'
import type { CategoryId } from '../../../../types/domain'
import type { RangeOption } from '../RangeSelect.types'

export const useRangeSelect = () => {
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
    } catch (error) {
      return null
    }
  }, [dataService, category])

  // 単語数
  const total = useMemo(() => {
    try {
      return dataService.getTotalWords(category as CategoryId)
    } catch (error) {
      return 0
    }
  }, [dataService, category])

  // 範囲オプション生成
  const makeOptions = useMemo(() => {
    return (size: number): RangeOption[] => {
      const arr: RangeOption[] = []
      for (let i = 0; i < total; i += size) {
        arr.push({ start: i + 1, size })
      }
      return arr
    }
  }, [total])

  const rangeOptions10 = useMemo(() => makeOptions(10), [makeOptions])
  const rangeOptions100 = useMemo(() => makeOptions(100), [makeOptions])

  const handleSelectRange = (start: number, size: number) => {
    navigate(`/quiz/${category}/${start}/${size}`)
  }

  const handleNavigateToTop = () => {
    navigate('/')
  }

  return {
    category: category || '',
    total,
    rangeOptions10,
    rangeOptions100,
    categoryEmoji: metadata?.emoji || '📖',
    categoryName: metadata?.name || category || '',
    onSelectRange: handleSelectRange,
    onNavigateToTop: handleNavigateToTop,
  }
}