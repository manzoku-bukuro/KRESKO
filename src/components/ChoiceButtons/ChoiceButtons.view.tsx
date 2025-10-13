import type { ChoiceButtonsProps, ChoiceButtonsState, ChoiceButtonsActions } from './ChoiceButtons.types'

interface ChoiceButtonsViewProps {
  props: ChoiceButtonsProps
  state: ChoiceButtonsState
  actions: ChoiceButtonsActions
}

export const ChoiceButtonsView = ({ props, actions }: ChoiceButtonsViewProps) => {
  const {
    choices,
    selectedAnswer,
    correctAnswer,
    showResult,
    instruction = '',
    loadingMessage = '選択肢を生成中...',
    className = ''
  } = props
  const { handleChoiceClick } = actions

  return (
    <div className={`multiple-choice-area ${className}`}>
      {instruction && (
        <p className="quiz-instruction">
          {instruction}
        </p>
      )}

      {choices.length === 0 && (
        <p className="text-center text-gray-500">
          {loadingMessage}
        </p>
      )}

      {choices.map((choice, idx) => {
        const isSelected = selectedAnswer === choice
        const isCorrect = choice === correctAnswer
        let buttonClass = "btn choice-btn"

        if (showResult && isSelected) {
          buttonClass += isCorrect ? " choice-correct" : " choice-wrong"
        } else if (showResult && isCorrect) {
          buttonClass += " choice-correct"
        } else if (isSelected) {
          buttonClass += " btn-primary"
        } else {
          buttonClass += " btn-secondary"
        }

        return (
          <button
            key={idx}
            className={buttonClass}
            onClick={() => handleChoiceClick(choice)}
            disabled={!!selectedAnswer}
          >
            {choice}
          </button>
        )
      })}
    </div>
  )
}