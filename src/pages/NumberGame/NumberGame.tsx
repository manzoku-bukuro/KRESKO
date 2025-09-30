import { useNumberGame } from './hooks/useNumberGame'
import { NumberGameView } from './NumberGame.view'

export const NumberGame = () => {
  const props = useNumberGame()
  return <NumberGameView {...props} />
}