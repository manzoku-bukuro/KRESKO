import type { WordListProps, WordListState, WordListActions } from '../WordList.types'

export const useWordList = (_props: WordListProps) => {
  const state: WordListState = {}

  const actions: WordListActions = {}

  return {
    state,
    actions
  }
}