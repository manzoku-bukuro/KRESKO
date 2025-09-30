import { AnswerResultView } from './AnswerResult.view'
import { useAnswerResult } from './hooks/useAnswerResult'
import type { AnswerResultProps } from './AnswerResult.types'

export const AnswerResult = (props: AnswerResultProps) => {
  const { state, actions } = useAnswerResult({
    onNext: props.onNext,
    isVisible: props.isVisible
  })

  return (
    <AnswerResultView
      props={props}
      state={state}
      actions={actions}
    />
  )
}