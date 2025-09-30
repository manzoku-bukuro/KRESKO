import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { updatePageMeta, seoData } from '../../../../utils/seo'
import vortaro from '../../../../data/vortaro.json'
import esuken4 from '../../../../data/esuken4.json'
import type { RangeOption } from '../RangeSelect.types'

export const useRangeSelect = () => {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()

  // SEO meta tags
  useEffect(() => {
    if (category === 'drill') {
      navigate('/', { replace: true })
    } else if (category === 'esuken4') {
      updatePageMeta(seoData.esuken4.title, seoData.esuken4.description)
    }
  }, [category, navigate])

  // 単語数
  const total = useMemo(() => {
    if (category === 'drill') return vortaro.length
    if (category === 'esuken4') return esuken4.length
    return 0
  }, [category])

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

  // カテゴリ情報
  const getCategoryEmoji = (cat: string) => {
    if (cat === 'drill') return '📚'
    if (cat === 'esuken4') return '🏆'
    return '📖'
  }

  const getCategoryName = (cat: string) => {
    if (cat === 'drill') return 'ドリル式'
    if (cat === 'esuken4') return 'エス検4級'
    return cat
  }

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
    categoryEmoji: getCategoryEmoji(category || ''),
    categoryName: getCategoryName(category || ''),
    onSelectRange: handleSelectRange,
    onNavigateToTop: handleNavigateToTop,
  }
}