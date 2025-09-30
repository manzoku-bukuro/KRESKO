import { ChoiceButtonsView } from './ChoiceButtons.view'
import { useChoiceButtons } from './hooks/useChoiceButtons'
import type { ChoiceButtonsProps } from './ChoiceButtons.types'

export const ChoiceButtons = (props: ChoiceButtonsProps) => {
  const { state, actions } = useChoiceButtons({
    onChoiceClick: props.onChoiceClick
  })

  return (
    <ChoiceButtonsView
      props={props}
      state={state}
      actions={actions}
    />
  )
}