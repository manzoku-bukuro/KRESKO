import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { updatePageMeta, seoData } from '../../../../../utils/seo'
import interrogativeQuestionsData from '../../shared/data/interrogative-questions.json'
import type { QuizQuestion } from '../../../../../hooks'
import type { InterrogativeQuestion } from '../Advanced.types'

export const useAdvanced = () => {
  const navigate = useNavigate()

  useEffect(() => {
    updatePageMeta(seoData.interrogativeAdvanced.title, seoData.interrogativeAdvanced.description)
  }, [])

  // InterrogativeQuestion を QuizQuestion 形式に変換
  const quizQuestions: QuizQuestion[] = useMemo(
    () =>
      (interrogativeQuestionsData as InterrogativeQuestion[]).map(q => ({
        esperanto: q.sentence,
        japanese: q.correctAnswer,
        extra: q.explanation,
        // カスタムプロパティ
        translation: q.translation,
        blanks: q.blanks,
      })),
    []
  )

  const handleNavigateToMenu = () => {
    navigate('/interrogative-menu')
  }

  // 選択肢プール生成（全質問の blanks を使用）
  const generateChoicePool = (questions: QuizQuestion[]) => {
    return questions.flatMap(q => q.blanks || [])
  }

  return {
    quizQuestions,
    onNavigateToMenu: handleNavigateToMenu,
    generateChoicePool,
  }
}