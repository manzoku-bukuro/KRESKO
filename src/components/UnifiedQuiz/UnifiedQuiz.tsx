import { useEffect, useMemo, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizEngine } from '../../hooks'
import { QuizHeader } from '../QuizHeader'
import { ChoiceButtons } from '../ChoiceButtons'
import { AnswerResult } from '../AnswerResult'
import { WordList } from '../WordList'
import type { UnifiedQuizProps, QuizResults } from './UnifiedQuiz.types'

export const UnifiedQuiz = ({
  questions,
  metadata,
  engineConfig = {},
  completionConfig = {},
  customActions = [],
  loading = false,
  loadingConfig = {},
  error,
  errorConfig = { message: error || '' },
  onQuizComplete,
  onQuizExit
}: UnifiedQuizProps) => {
  const navigate = useNavigate()
  const initializedRef = useRef(false)

  // useQuizEngine with provided config
  const { state, actions } = useQuizEngine({
    initialMode: 'traditional',
    maxQuestions: 10,
    shuffleQuestions: true,
    enableIncorrectTracking: true,
    ...engineConfig
  })

  const {
    questions: activeQuestions,
    currentIndex,
    finished,
    quizMode,
    showAnswer,
    selectedAnswer,
    showResult,
    choices,
    incorrectQuestions,
    correctQuestions,
    progress,
    isLastQuestion
  } = state

  // Initialize quiz when questions are provided (once per mount)
  useEffect(() => {
    if (questions.length > 0 && !initializedRef.current) {
      actions.initializeQuiz(questions)
      initializedRef.current = true
    }
  }, [questions, actions])

  // Calculate results
  const results: QuizResults = useMemo(() => ({
    totalQuestions: activeQuestions.length,
    correctAnswers: correctQuestions.length,
    incorrectAnswers: incorrectQuestions.length,
    completedQuestions: activeQuestions,
    incorrectQuestions: incorrectQuestions.map(index => activeQuestions[index]).filter(Boolean)
  }), [activeQuestions, correctQuestions, incorrectQuestions])

  // Notify parent when quiz completes
  useEffect(() => {
    if (finished && onQuizComplete) {
      onQuizComplete(results)
    }
  }, [finished, results, onQuizComplete])

  // Handle back navigation
  const handleBack = () => {
    if (onQuizExit) {
      onQuizExit()
    } else if (metadata.backButtonPath) {
      navigate(metadata.backButtonPath)
    } else {
      navigate(-1)
    }
  }

  // Current question (always accessed, even for error/loading states)
  const currentQuestion = activeQuestions[currentIndex]

  // Memoize wordDisplay objects to prevent unnecessary re-renders
  const traditionalWordDisplay = useMemo(() => ({
    primary: currentQuestion?.esperanto || '',
    secondary: currentQuestion?.japanese || '',
    extra: currentQuestion?.extra
  }), [currentQuestion])

  const choiceWordDisplay = useMemo(() => ({
    extra: currentQuestion?.extra
  }), [currentQuestion])

  // Filter custom actions by condition
  const getFilteredActions = useCallback((condition: string) => {
    return customActions.filter(action =>
      !action.condition || action.condition === 'always' || action.condition === condition
    )
  }, [customActions])

  // Error state
  if (error) {
    return (
      <div className="app-container">
        <div className="card error-card">
          <h1>⚠️ {errorConfig.title || 'エラー'}</h1>
          <p>{error}</p>
          {errorConfig.onAction && (
            <button
              className="btn btn-primary"
              onClick={errorConfig.onAction}
            >
              {errorConfig.actionLabel || 'リトライ'}
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={handleBack}
          >
            戻る
          </button>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading || activeQuestions.length === 0) {
    return (
      <div className="app-container">
        <div className="card">
          <h1>{metadata.title}</h1>
          <p>{loadingConfig.message || '読み込み中...'}</p>
          {loadingConfig.showSpinner && (
            <div className="loading-spinner">⏳</div>
          )}
        </div>
      </div>
    )
  }

  // Completion state
  if (finished) {
    return (
      <div className="app-container">
        <div className="card quiz-completion">
          <h1>🎉 {completionConfig.title || '完了！'}</h1>
          <h3>{completionConfig.subtitle || 'クイズが完了しました！'}</h3>
          <p>お疲れ様でした。{results.totalQuestions}問を学習しました。</p>

          {/* Results summary */}
          <div className="quiz-results-summary">
            <p>正解: {results.correctAnswers}問</p>
            <p>不正解: {results.incorrectAnswers}問</p>
          </div>

          {/* Word list */}
          {completionConfig.showWordList && (
            <WordList
              title={completionConfig.wordListTitle || '学習した単語一覧'}
              words={results.completedQuestions.map((question) => ({
                primary: question.esperanto,
                secondary: question.japanese,
                extra: question.extra,
                isIncorrect: results.incorrectQuestions.some(q => q.esperanto === question.esperanto),
                incorrectLabel: '❌ 間違い'
              }))}
            />
          )}

          {/* Action buttons */}
          <div style={{ marginTop: '2rem' }}>
            {completionConfig.onRestart && (
              <button
                className="btn btn-primary btn-large btn-full"
                onClick={completionConfig.onRestart}
                style={{ marginBottom: '1rem' }}
              >
                {completionConfig.restartButtonText || '🔄 もう一度'}
              </button>
            )}

            {completionConfig.additionalActions?.map((action, index) => (
              <button
                key={index}
                className={`btn btn-${action.variant || 'secondary'} btn-large btn-full`}
                onClick={action.onClick}
                style={{ marginBottom: '1rem' }}
              >
                {action.icon && `${action.icon} `}{action.label}
              </button>
            ))}

            <button
              className="btn btn-secondary"
              onClick={handleBack}
            >
              {metadata.backButtonText || '← 戻る'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="card quiz-container">
        {/* Progress Bar */}
        <div className="quiz-progress">
          <div className="quiz-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Header */}
        <QuizHeader
          title={metadata.title}
          currentQuestion={currentIndex + 1}
          totalQuestions={activeQuestions.length}
          subtitle={metadata.subtitle}
          showModeToggle={true}
          modeToggleProps={{
            currentMode: quizMode,
            onModeChange: actions.setQuizMode
          }}
        />

        {/* Quiz Content */}
        <div className="quiz-content">
          <p className="esperanto-word">{currentQuestion.esperanto}</p>

          {/* Custom actions before result */}
          {getFilteredActions('before-result').map((action) => (
            <button
              key={action.id}
              className={`btn btn-${action.variant || 'secondary'} btn-small`}
              onClick={() => action.onClick(currentQuestion, currentIndex)}
              style={{ margin: '0.5rem' }}
            >
              {action.icon && `${action.icon} `}{action.label}
            </button>
          ))}

          {/* Traditional mode */}
          {quizMode === 'traditional' && (
            <>
              <p className="quiz-instruction">
                {metadata.subtitle.includes('疑問詞') ? 'この疑問詞の意味は？' : 'この単語の意味は？'}
              </p>

              <AnswerResult
                variant="traditional"
                isVisible={showAnswer}
                wordDisplay={traditionalWordDisplay}
              />

              {/* Custom actions for traditional mode */}
              {showAnswer && getFilteredActions('traditional-only').map((action) => (
                <div key={action.id} style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <button
                    className={`btn btn-${action.variant || 'secondary'} btn-small`}
                    onClick={() => action.onClick(currentQuestion, currentIndex)}
                  >
                    {action.icon && `${action.icon} `}{action.label}
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Multiple choice mode */}
          {quizMode === 'multiple-choice' && (
            <div>
              <ChoiceButtons
                choices={choices}
                selectedAnswer={selectedAnswer}
                correctAnswer={currentQuestion.japanese}
                showResult={showResult}
                onChoiceClick={actions.handleChoiceClick}
                instruction={metadata.subtitle.includes('疑問詞')
                  ? 'この疑問詞の意味を選んでください'
                  : 'この単語の意味を選んでください'
                }
              />

              {/* Result display */}
              <AnswerResult
                variant="choice"
                resultType={selectedAnswer === currentQuestion.japanese ? 'correct' : 'wrong'}
                isVisible={showResult}
                message={selectedAnswer === currentQuestion.japanese ? '🎉 正解です！' : '❌ 不正解です'}
                wordDisplay={choiceWordDisplay}
                onNext={actions.nextQuestion}
                nextButtonText={isLastQuestion ? '🎉 完了！' : '➡️ 次の問題へ'}
              />

              {/* Custom actions for choice mode */}
              {showResult && getFilteredActions('choice-only').map((action) => (
                <div key={action.id} style={{ marginBottom: '1rem', textAlign: 'center' }}>
                  <button
                    className={`btn btn-${action.variant || 'secondary'} btn-small`}
                    onClick={() => action.onClick(currentQuestion, currentIndex)}
                  >
                    {action.icon && `${action.icon} `}{action.label}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Custom actions after result */}
          {getFilteredActions('after-result').map((action) => (
            <button
              key={action.id}
              className={`btn btn-${action.variant || 'secondary'} btn-small`}
              onClick={() => action.onClick(currentQuestion, currentIndex)}
              style={{ margin: '0.5rem' }}
            >
              {action.icon && `${action.icon} `}{action.label}
            </button>
          ))}
        </div>

        {/* Action Buttons - Traditional mode only */}
        {quizMode === 'traditional' && (
          <div style={{ marginTop: 'auto' }}>
            <button
              className="btn btn-primary btn-large btn-full"
              onClick={actions.handleTraditionalClick}
              style={{ marginBottom: '1rem' }}
            >
              {!showAnswer
                ? '👁️ 回答を表示'
                : isLastQuestion
                  ? '🎉 完了！'
                  : '➡️ 次の問題へ'
              }
            </button>
          </div>
        )}

        {/* Bottom custom actions */}
        <div className="quiz-bottom-actions">
          {getFilteredActions('bottom').map((action) => (
            <button
              key={action.id}
              className={`btn btn-${action.variant || 'secondary'} btn-small`}
              onClick={() => action.onClick(currentQuestion, currentIndex)}
              style={{ margin: '0.25rem' }}
            >
              {action.icon && `${action.icon} `}{action.label}
            </button>
          ))}
        </div>

        {/* Back button */}
        <button
          className="btn btn-accent btn-small"
          onClick={handleBack}
        >
          {metadata.backButtonText || '← 戻る'}
        </button>
      </div>
    </div>
  )
}