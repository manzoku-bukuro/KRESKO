import type { AnswerResultProps, AnswerResultState, AnswerResultActions } from './AnswerResult.types'

interface AnswerResultViewProps {
  props: AnswerResultProps
  state: AnswerResultState
  actions: AnswerResultActions
}

export const AnswerResultView = ({ props, state, actions }: AnswerResultViewProps) => {
  const { variant, resultType, isVisible, wordDisplay, message, nextButtonText = '次へ', className = '' } = props
  const { isAnimating } = state
  const { handleNext } = actions

  if (!isVisible) return null

  // Tailwindクラス定義
  const getVariantClasses = () => {
    const baseClasses = 'w-full text-center transition-all duration-300'

    switch (variant) {
      case 'traditional':
        return `${baseClasses} py-md`
      case 'choice':
        return `${baseClasses} p-lg rounded-lg text-lg font-bold mt-xs`
      case 'game':
        return `${baseClasses} p-lg rounded-lg my-xl font-bold text-xl`
      default:
        return baseClasses
    }
  }

  const getResultTypeClasses = () => {
    switch (resultType) {
      case 'correct':
        return variant === 'game'
          ? 'bg-gradient-to-br from-success to-green-500 text-white'
          : 'text-success'
      case 'wrong':
        return variant === 'game'
          ? 'bg-red-100 text-danger border-2 border-danger'
          : 'text-danger'
      case 'neutral':
      default:
        return 'text-text'
    }
  }

  const getAnimationClasses = () => {
    return isAnimating
      ? 'animate-fade-in animate-slide-up'
      : ''
  }

  const containerClasses = `${getVariantClasses()} ${getResultTypeClasses()} ${getAnimationClasses()} ${className}`

  // Traditional mode (単語表示)
  if (variant === 'traditional' && wordDisplay) {
    return (
      <div className="w-full">
        <div className={containerClasses}>
          {wordDisplay.primary && (
            <p className="text-2xl font-black text-slate-700 my-6 animate-slide-in">
              {wordDisplay.primary}
            </p>
          )}
          {wordDisplay.secondary && (
            <p className="text-xl font-medium text-success my-3 leading-relaxed animate-fade-in">
              {wordDisplay.secondary}
            </p>
          )}
          {wordDisplay.extra && (
            <p className="text-lg text-muted mt-1.5 leading-normal animate-fade-in">
              {wordDisplay.extra}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Choice mode (選択結果)
  if (variant === 'choice') {
    return (
      <div className={containerClasses}>
        {message && (
          <div className="mb-md">
            {message}
          </div>
        )}

        {wordDisplay?.extra && (
          <div className="text-base font-normal mt-sm opacity-90">
            {wordDisplay.extra}
          </div>
        )}

        {/* 次へボタン */}
        <div className="flex justify-center mt-0">
          <button
            onClick={handleNext}
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-xs px-md rounded-lg transition-all duration-fast min-w-35 text-sm"
          >
            {nextButtonText}
          </button>
        </div>
      </div>
    )
  }

  // Game mode (ゲーム結果)
  if (variant === 'game') {
    return (
      <div className={containerClasses}>
        {message}
      </div>
    )
  }

  return null
}