import { useList } from './hooks/useList'
import { ListView } from './List.view'

export const List = () => {
  const props = useList()
  return <ListView {...props} />
}