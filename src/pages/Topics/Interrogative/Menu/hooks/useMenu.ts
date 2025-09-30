import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { updatePageMeta, seoData } from '../../../../../utils/seo'

export const useMenu = () => {
  const navigate = useNavigate()

  useEffect(() => {
    updatePageMeta(seoData.interrogativeMenu.title, seoData.interrogativeMenu.description)
  }, [])

  const handleNavigateToExplanation = () => {
    navigate('/interrogative-explanation')
  }

  const handleNavigateToBasic = () => {
    navigate('/interrogative-basic')
  }

  const handleNavigateToAdvanced = () => {
    navigate('/interrogative-advanced')
  }

  const handleNavigateToTop = () => {
    navigate('/')
  }

  return {
    onNavigateToExplanation: handleNavigateToExplanation,
    onNavigateToBasic: handleNavigateToBasic,
    onNavigateToAdvanced: handleNavigateToAdvanced,
    onNavigateToTop: handleNavigateToTop,
  }
}