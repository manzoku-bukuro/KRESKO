import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { updatePageMeta, seoData } from '../../../../../utils/seo'
import { interrogatives } from '../data/interrogatives'

export const useExplanation = () => {
  const navigate = useNavigate()

  useEffect(() => {
    updatePageMeta(
      seoData.interrogativeExplanation.title,
      seoData.interrogativeExplanation.description
    )
  }, [])

  const handleNavigateToBasic = () => {
    navigate('/interrogative-basic')
  }

  const handleNavigateToAdvanced = () => {
    navigate('/interrogative-advanced')
  }

  const handleNavigateToMenu = () => {
    navigate('/interrogative-menu')
  }

  return {
    interrogatives,
    onNavigateToBasic: handleNavigateToBasic,
    onNavigateToAdvanced: handleNavigateToAdvanced,
    onNavigateToMenu: handleNavigateToMenu,
  }
}