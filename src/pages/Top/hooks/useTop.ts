import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { getWeakQuestions } from '../../../utils/firestore'
import { updatePageMeta, seoData } from '../../../utils/seo'

export const useTop = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [weakQuestionsCount, setWeakQuestionsCount] = useState<number>(0)
  const [showAuthModal, setShowAuthModal] = useState(false)

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

  const handleNavigateToExam = () => navigate('/wordlist/esuken4')
  const handleNavigateToInterrogative = () => navigate('/interrogative-menu')
  const handleNavigateToNumberGame = () => navigate('/number-game')
  const handleNavigateToSearch = () => navigate('/search')
  const handleNavigateToWeakQuestions = () => {
    if (user) {
      navigate('/weak-questions')
    } else {
      setShowAuthModal(true)
    }
  }

  const handleCloseAuthModal = () => {
    setShowAuthModal(false)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    navigate('/weak-questions')
  }

  return {
    weakQuestionsCount,
    isAuthenticated: !!user,
    showAuthModal,
    onNavigateToExam: handleNavigateToExam,
    onNavigateToInterrogative: handleNavigateToInterrogative,
    onNavigateToNumberGame: handleNavigateToNumberGame,
    onNavigateToSearch: handleNavigateToSearch,
    onNavigateToWeakQuestions: handleNavigateToWeakQuestions,
    onCloseAuthModal: handleCloseAuthModal,
    onAuthSuccess: handleAuthSuccess,
  }
}