import type { QuizHeaderProps, QuizHeaderState, QuizHeaderActions } from '../QuizHeader.types'

export const useQuizHeader = (_props: QuizHeaderProps) => {
  const state: QuizHeaderState = {}

  const actions: QuizHeaderActions = {}

  return {
    state,
    actions
  }
}