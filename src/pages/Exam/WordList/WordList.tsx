import { useWordList } from './hooks/useWordList'
import { WordListView } from './WordList.view'

export const WordList = () => {
  const props = useWordList()
  return <WordListView {...props} />
}
