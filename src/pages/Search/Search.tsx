import { useSearch } from './hooks/useSearch'
import { SearchView } from './Search.view'

export const Search = () => {
  const props = useSearch()
  return <SearchView {...props} />
}
