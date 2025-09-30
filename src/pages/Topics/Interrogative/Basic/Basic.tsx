import { UnifiedQuiz } from '../../../../components/UnifiedQuiz'
import { useBasic } from './hooks/useBasic'

export const Basic = () => {
  const { interrogativeQuestions, onNavigateToMenu, generateChoicePool } = useBasic()

  return (
    <UnifiedQuiz
      questions={interrogativeQuestions}
      metadata={{
        title: '❓ 疑問詞 - 基本学習',
        subtitle: '疑問詞の意味を覚える練習問題',
        backButtonText: '← メニューに戻る',
        backButtonPath: '/interrogative-menu',
      }}
      engineConfig={{
        initialMode: 'multiple-choice',
        shuffleQuestions: true,
        enableIncorrectTracking: false,
        choiceGeneration: {
          choiceCount: 4,
          generateFromPool: generateChoicePool,
        },
      }}
      completionConfig={{
        title: '完了！',
        subtitle: '基本学習が完了しました！',
        showWordList: true,
        wordListTitle: '学習した疑問詞一覧',
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