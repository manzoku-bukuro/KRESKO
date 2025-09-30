import { useTop } from './hooks/useTop'
import { TopView } from './Top.view'

export const Top = () => {
  const props = useTop()
  return <TopView {...props} />
}