import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../contexts/AuthContext'
import { getWeakQuestions, removeWeakQuestion, type WeakQuestion } from '../../../../utils/firestore'
import type { QuizQuestion } from '../../../../hooks'

export const useReview = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [allWeakQuestions, setAllWeakQuestions] = useState<WeakQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [, setCorrectedQuestions] = useState<WeakQuestion[]>([])
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])

  // 苦手問題を取得してランダムに10問選択
  useEffect(() => {
    const fetchWeakQuestions = async () => {
      if (!user) {
        setError("ログインが必要です")
        setLoading(false)
        return
      }

      try {
        const questions = await getWeakQuestions()
        setAllWeakQuestions(questions)

        if (questions.length === 0) {
          setLoading(false)
          return
        }

        // ランダムに最大10問選択
        const shuffled = [...questions].sort(() => Math.random() - 0.5)
        const selected = shuffled.slice(0, Math.min(10, questions.length))

        // WeakQuestion を QuizQuestion 形式に変換
        const convertedQuestions: QuizQuestion[] = selected.map(q => ({
          esperanto: q.esperanto,
          japanese: q.japanese,
          extra: q.extra
        }))

        setQuizQuestions(convertedQuestions)
      } catch (error) {
        console.error('苦手問題の取得に失敗:', error)
        setError("苦手問題の取得に失敗しました")
      } finally {
        setLoading(false)
      }
    }

    fetchWeakQuestions()
  }, [user])

  // 理解できた問題を削除
  const handleUnderstood = async (currentQuestion: QuizQuestion) => {
    try {
      await removeWeakQuestion(currentQuestion.esperanto)
      const weakQuestion: WeakQuestion = {
        esperanto: currentQuestion.esperanto,
        japanese: currentQuestion.japanese,
        extra: currentQuestion.extra,
        addedAt: new Date(),
        incorrectCount: 1
      }
      setCorrectedQuestions(prev => [...prev, weakQuestion])
    } catch (error) {
      console.error('苦手問題の削除に失敗:', error)
    }
  }

  const handleNavigateToTop = () => {
    navigate('/')
  }

  const handleNavigateToList = () => {
    navigate('/weak-questions')
  }

  return {
    user,
    loading,
    error,
    allWeakQuestions,
    quizQuestions,
    onUnderstood: handleUnderstood,
    onNavigateToTop: handleNavigateToTop,
    onNavigateToList: handleNavigateToList,
  }
}