import { useExplanation } from './hooks/useExplanation'
import { ExplanationView } from './Explanation.view'

export const Explanation = () => {
  const props = useExplanation()
  return <ExplanationView {...props} />
}