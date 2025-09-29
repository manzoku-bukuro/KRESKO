import { ModeToggleView } from './ModeToggle.View'
import { useModeToggle } from './hooks/useModeToggle'
import type { ModeToggleProps } from './ModeToggle.types'

export const ModeToggle = (props: ModeToggleProps) => {
  const { state, actions } = useModeToggle({
    currentMode: props.currentMode,
    onModeChange: props.onModeChange
  })

  return (
    <ModeToggleView
      props={props}
      state={state}
      actions={actions}
    />
  )
}