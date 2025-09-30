import { WordListView } from './WordList.view'
import { useWordList } from './hooks/useWordList'
import type { WordListProps } from './WordList.types'

export const WordList = (props: WordListProps) => {
  const { state, actions } = useWordList(props)

  return (
    <WordListView
      props={props}
      state={state}
      actions={actions}
    />
  )
}