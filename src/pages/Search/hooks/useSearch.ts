import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDataService } from '@/services'
import { updatePageMeta } from '@/utils/seo'
import type { SearchMode, SearchResult } from '../Search.types'

export const useSearch = () => {
  const navigate = useNavigate()
  const [searchMode, setSearchMode] = useState<SearchMode>('japanese')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const dataService = useMemo(() => getDataService(), [])

  // SEO meta tags
  useEffect(() => {
    updatePageMeta('単語検索 - MEMORU', 'エスペラント語の単語を検索できます')
  }, [])

  // esuken4の全単語を取得
  const allWords = useMemo(() => {
    try {
      return dataService.getAllWords('esuken4')
    } catch (error) {
      console.error('単語の取得に失敗:', error)
      return []
    }
  }, [dataService])

  // 検索結果をフィルタリング
  const results = useMemo((): SearchResult[] => {
    if (!searchQuery.trim()) {
      return []
    }

    setIsSearching(true)
    const query = searchQuery.toLowerCase().trim()

    const filtered = allWords
      .map((word, index) => ({
        index: index + 1,
        esperanto: word.esperanto,
        japanese: word.japanese,
        extra: word.extra,
      }))
      .filter((word) => {
        if (searchMode === 'japanese') {
          return word.japanese.toLowerCase().includes(query)
        } else {
          return word.esperanto.toLowerCase().includes(query)
        }
      })

    setIsSearching(false)
    return filtered
  }, [allWords, searchQuery, searchMode])

  const handleSearchModeChange = (mode: SearchMode) => {
    setSearchMode(mode)
    setSearchQuery('')
  }

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleResultClick = (index: number) => {
    // 検索結果をクリックしたら、その単語から10問出題
    navigate(`/quiz/esuken4?start=${index}`)
  }

  const handleNavigateToTop = () => {
    navigate('/')
  }

  return {
    searchMode,
    searchQuery,
    results,
    isSearching,
    onSearchModeChange: handleSearchModeChange,
    onSearchQueryChange: handleSearchQueryChange,
    onResultClick: handleResultClick,
    onNavigateToTop: handleNavigateToTop,
  }
}
