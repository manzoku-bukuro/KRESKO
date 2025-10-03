import { useUnifiedQuiz } from './hooks/useUnifiedQuiz'
import { UnifiedQuizView } from './UnifiedQuiz.view'
import type { UnifiedQuizProps } from './UnifiedQuiz.types'

export const UnifiedQuiz = (props: UnifiedQuizProps) => {
  const hookState = useUnifiedQuiz(props)

  return (
    <UnifiedQuizView
      // Props from parent
      metadata={props.metadata}
      completionConfig={props.completionConfig}
      loading={props.loading}
      loadingConfig={props.loadingConfig}
      error={props.error}
      errorConfig={props.errorConfig}

      // State and actions from hook
      {...hookState}
    />
  )
}
