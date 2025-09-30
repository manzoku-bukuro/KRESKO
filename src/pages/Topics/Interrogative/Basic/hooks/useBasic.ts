import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { updatePageMeta, seoData } from '../../../../../utils/seo'
import { interrogativeWords } from '../../shared/data/interrogativeWords'
import type { QuizQuestion } from '../../../../../hooks'

export const useBasic = () => {
  const navigate = useNavigate()

  useEffect(() => {
    updatePageMeta(seoData.interrogativeBasic.title, seoData.interrogativeBasic.description)
  }, [])

  // InterrogativeWord を QuizQuestion 形式に変換
  const interrogativeQuestions: QuizQuestion[] = useMemo(
    () =>
      interrogativeWords.map(word => ({
        esperanto: word.word,
        japanese: word.meaning,
      })),
    []
  )

  const handleNavigateToMenu = () => {
    navigate('/interrogative-menu')
  }

  // 選択肢のプール生成
  const generateChoicePool = () => interrogativeWords.map(w => w.meaning)

  return {
    interrogativeQuestions,
    onNavigateToMenu: handleNavigateToMenu,
    generateChoicePool,
  }
}