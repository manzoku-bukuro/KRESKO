import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../contexts/AuthContext'
import { getWeakQuestions, removeWeakQuestion, type WeakQuestion } from '../../../../utils/firestore'

export const useList = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [weakQuestions, setWeakQuestions] = useState<WeakQuestion[]>([])
  const [loading, setLoading] = useState(true)

  // 苦手問題を取得
  useEffect(() => {
    const fetchWeakQuestions = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const questions = await getWeakQuestions()
        setWeakQuestions(questions)
      } catch (error) {
        console.error('苦手問題の取得に失敗:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeakQuestions()
  }, [user])

  // 理解できた問題を削除
  const handleRemoveQuestion = async (esperanto: string) => {
    try {
      await removeWeakQuestion(esperanto)
      setWeakQuestions(prev =>
        prev.filter(q => q.esperanto !== esperanto)
      )
    } catch (error) {
      console.error('苦手問題の削除に失敗:', error)
    }
  }

  const handleNavigateToReview = () => {
    navigate('/weak-questions-review')
  }

  const handleNavigateToTop = () => {
    navigate('/')
  }

  return {
    user,
    loading,
    weakQuestions,
    onRemoveQuestion: handleRemoveQuestion,
    onNavigateToReview: handleNavigateToReview,
    onNavigateToTop: handleNavigateToTop,
  }
}