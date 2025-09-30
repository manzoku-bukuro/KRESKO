import { useRangeSelect } from './hooks/useRangeSelect'
import { RangeSelectView } from './RangeSelect.view'

export const RangeSelect = () => {
  const props = useRangeSelect()
  return <RangeSelectView {...props} />
}