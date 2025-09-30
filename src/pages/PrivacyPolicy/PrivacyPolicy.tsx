import { useCallback } from 'react'
import { PrivacyPolicyView } from './PrivacyPolicy.view'

export const PrivacyPolicy = () => {
  const handleBack = useCallback(() => {
    window.history.back()
  }, [])

  return <PrivacyPolicyView onBack={handleBack} />
}