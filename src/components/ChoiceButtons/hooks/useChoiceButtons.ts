import { useCallback } from 'react'
import type { ChoiceButtonsProps, ChoiceButtonsState, ChoiceButtonsActions } from '../ChoiceButtons.types'

export const useChoiceButtons = ({ onChoiceClick }: Pick<ChoiceButtonsProps, 'onChoiceClick'>) => {
  const handleChoiceClick = useCallback((choice: string) => {
    onChoiceClick(choice)
  }, [onChoiceClick])

  const state: ChoiceButtonsState = {}

  const actions: ChoiceButtonsActions = {
    handleChoiceClick
  }

  return {
    state,
    actions
  }
}