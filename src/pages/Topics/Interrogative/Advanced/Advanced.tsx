import { UnifiedQuiz } from '../../../../components/UnifiedQuiz'
import { useAdvanced } from './hooks/useAdvanced'

export const Advanced = () => {
  const { quizQuestions, onNavigateToMenu, generateChoicePool } = useAdvanced()

  return (
    <UnifiedQuiz
      questions={quizQuestions}
      metadata={{
        title: '❓ 疑問詞 - 応用問題',
        subtitle: '日本語文の穴埋めで疑問詞を選択する実践問題',
        backButtonText: '← メニューに戻る',
        backButtonPath: '/interrogative-menu',
      }}
      engineConfig={{
        initialMode: 'multiple-choice',
        maxQuestions: 5,
        shuffleQuestions: true,
        enableIncorrectTracking: false,
        choiceGeneration: {
          choiceCount: 4,
          generateFromPool: generateChoicePool,
        },
      }}
      completionConfig={{
        title: '完了！',
        subtitle: '応用問題が完了しました！',
        showWordList: true,
        wordListTitle: '学習した問題一覧',
        additionalActions: [
          {
            label: '📋 メニューに戻る',
            variant: 'secondary',
            onClick: onNavigateToMenu,
          },
        ],
      }}
      onQuizExit={onNavigateToMenu}
    />
  )
}