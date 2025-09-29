import { useState, useCallback, useEffect } from 'react'
import type { AnswerResultProps, AnswerResultState, AnswerResultActions } from '../AnswerResult.types'

export const useAnswerResult = ({ onNext, isVisible }: Pick<AnswerResultProps, 'onNext' | 'isVisible'>) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 600)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  const handleNext = useCallback(() => {
    onNext?.()
  }, [onNext])

  const state: AnswerResultState = {
    isAnimating
  }

  const actions: AnswerResultActions = {
    handleNext
  }

  return {
    state,
    actions
  }
}