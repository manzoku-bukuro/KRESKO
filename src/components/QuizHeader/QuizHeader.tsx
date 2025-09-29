import { QuizHeaderView } from './QuizHeader.View'
import { useQuizHeader } from './hooks/useQuizHeader'
import type { QuizHeaderProps } from './QuizHeader.types'

export const QuizHeader = (props: QuizHeaderProps) => {
  const { state, actions } = useQuizHeader(props)

  return (
    <QuizHeaderView
      props={props}
      state={state}
      actions={actions}
    />
  )
}