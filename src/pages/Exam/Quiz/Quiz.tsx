import { QuizView } from './Quiz.view'
import { useQuiz } from './hooks/useQuiz'

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

  return (
    <QuizView
      dataError={dataError}
      quizQuestions={quizQuestions}
      categoryEmoji={categoryEmoji}
      categoryName={categoryName}
      rangeStart={rangeStart}
      rangeSize={rangeSize}
      category={category}
      wordsLength={words.length}
      isAuthenticated={!!user}
      onMarkAsWeak={markAsWeak}
      onNextRange={handleNextRange}
      onNavigateToRange={handleNavigateToRange}
      onNavigateToTop={handleNavigateToTop}
      onGenerateCustomChoices={generateCustomChoices}
    />
  )
}