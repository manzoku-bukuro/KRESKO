import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { getWeakQuestions } from '../../../utils/firestore'
import { updatePageMeta, seoData } from '../../../utils/seo'

export const useTop = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [weakQuestionsCount, setWeakQuestionsCount] = useState<number>(0)

  // SEO meta tags
  useEffect(() => {
    updatePageMeta(seoData.home.title, seoData.home.description)
  }, [])

  // Fetch weak questions count
  useEffect(() => {
    const fetchWeakQuestionsCount = async () => {
      if (user) {
        try {
          const weakQuestions = await getWeakQuestions()
          setWeakQuestionsCount(weakQuestions.length)
        } catch (error) {
          console.error('苦手問題数の取得に失敗:', error)
        }
      } else {
        setWeakQuestionsCount(0)
      }
    }

    fetchWeakQuestionsCount()
  }, [user])

  const handleNavigateToExam = () => navigate('/range/esuken4')
  const handleNavigateToInterrogative = () => navigate('/interrogative-menu')
  const handleNavigateToNumberGame = () => navigate('/number-game')
  const handleNavigateToWeakQuestions = () => navigate('/weak-questions')

  return {
    weakQuestionsCount,
    isAuthenticated: !!user,
    onNavigateToExam: handleNavigateToExam,
    onNavigateToInterrogative: handleNavigateToInterrogative,
    onNavigateToNumberGame: handleNavigateToNumberGame,
    onNavigateToWeakQuestions: handleNavigateToWeakQuestions,
  }
}