import { useCallback } from 'react'
import type { ModeToggleProps, ModeToggleState, ModeToggleActions } from '../ModeToggle.types'

export const useModeToggle = ({ currentMode, onModeChange }: Pick<ModeToggleProps, 'currentMode' | 'onModeChange'>) => {
  const handleTraditionalClick = useCallback(() => {
    if (currentMode !== 'traditional') {
      onModeChange('traditional')
    }
  }, [currentMode, onModeChange])

  const handleMultipleChoiceClick = useCallback(() => {
    if (currentMode !== 'multiple-choice') {
      onModeChange('multiple-choice')
    }
  }, [currentMode, onModeChange])

  const state: ModeToggleState = {}

  const actions: ModeToggleActions = {
    handleTraditionalClick,
    handleMultipleChoiceClick
  }

  return {
    state,
    actions
  }
}