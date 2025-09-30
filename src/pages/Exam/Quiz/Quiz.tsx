import { UnifiedQuiz } from '../../../components/UnifiedQuiz'
import { useQuiz } from './hooks/useQuiz'
import type { QuizQuestion } from '../../../hooks'

export const Quiz = () => {
  const {
    category,
    rangeStart,
    rangeSize,
    words,
    dataError,
    quizQuestions,
    user,
    categoryEmoji,
    categoryName,
    markAsWeak,
    handleNextRange,
    handleNavigateToRange,
    handleNavigateToTop,
    generateCustomChoices,
  } = useQuiz()

  // エラー表示
  if (dataError) {
    return (
      <UnifiedQuiz
        questions={[]}
        metadata={{
          title: '⚠️ エラー',
          subtitle: dataError,
          backButtonText: '🏠 ホームに戻る',
          backButtonPath: '/',
        }}
        error={dataError}
        errorConfig={{
          title: 'エラー',
          message: dataError,
          onAction: handleNavigateToTop,
          actionLabel: '🏠 ホームに戻る',
        }}
        onQuizExit={handleNavigateToTop}
      />
    )
  }

  return (
    <UnifiedQuiz
      questions={quizQuestions}
      metadata={{
        title: `${categoryEmoji} ${categoryName}`,
        subtitle: `範囲: ${rangeStart} - ${Math.min(
          Number(rangeStart) + Number(rangeSize) - 1,
          words.length
        )}`,
        backButtonText: '← 範囲選択に戻る',
        backButtonPath: `/range/${category}`,
      }}
      engineConfig={{
        initialMode: 'traditional',
        maxQuestions: 10,
        shuffleQuestions: true,
        enableIncorrectTracking: true,
        choiceGeneration: {
          choiceCount: 4,
          generateCustomChoices,
        },
        onIncorrectAnswer: async (question: QuizQuestion) => {
          await markAsWeak(question)
        },
      }}
      completionConfig={{
        title: '完了！',
        subtitle: 'この範囲の学習が完了しました！',
        showWordList: true,
        wordListTitle: '学習した単語一覧',
        onRestart: () => window.location.reload(),
        restartButtonText: '🔄 同じ範囲をもう一度',
        additionalActions: [
          {
            label: '➡️ 次の範囲へ進む',
            variant: 'accent',
            onClick: handleNextRange,
          },
        ],
      }}
      customActions={[
        ...(user
          ? [
              {
                id: 'mark-weak',
                label: '💾 苦手に登録',
                variant: 'secondary' as const,
                condition: 'traditional-only' as const,
                position: 'after-result' as const,
                onClick: async (currentQuestion: QuizQuestion) => {
                  await markAsWeak(currentQuestion)
                },
              },
              {
                id: 'mark-weak-choice',
                label: '💾 苦手に登録',
                variant: 'secondary' as const,
                condition: 'choice-only' as const,
                position: 'after-result' as const,
                onClick: async (currentQuestion: QuizQuestion) => {
                  await markAsWeak(currentQuestion)
                },
              },
            ]
          : []),
      ]}
      onQuizExit={handleNavigateToRange}
    />
  )
}