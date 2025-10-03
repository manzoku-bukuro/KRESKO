import { UnifiedQuiz } from '../../../components/UnifiedQuiz'
import type { ReviewViewProps } from './Review.types'
import type { QuizQuestion } from '../../../hooks'

export const ReviewView = ({
  loading,
  error,
  allWeakQuestions,
  quizQuestions,
  onUnderstood,
  onNavigateToTop,
  onNavigateToList,
}: ReviewViewProps) => {
  // 苦手問題がない場合の表示
  if (!loading && !error && allWeakQuestions.length === 0) {
    return (
      <div className="app-container">
        <div className="card">
          <h1>📚 苦手問題復習</h1>
          <div className="empty-state">
            <p>🎉 素晴らしい！</p>
            <p>復習する苦手問題がありません。</p>
            <p>まずはクイズで問題を間違えてから利用してください。</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={onNavigateToTop}
          >
            🏠 ホームに戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <UnifiedQuiz
      questions={quizQuestions}
      metadata={{
        title: "📚 苦手問題復習",
        subtitle: "間違えた問題を復習しましょう",
        backButtonText: "← 苦手問題一覧に戻る",
        backButtonPath: "/weak-questions"
      }}
      loading={loading}
      loadingConfig={{
        message: "問題を準備中...",
        showSpinner: true
      }}
      error={error || undefined}
      errorConfig={{
        title: "エラー",
        message: error || "",
        onAction: onNavigateToTop,
        actionLabel: "🏠 ホームに戻る"
      }}
      engineConfig={{
        initialMode: 'multiple-choice',
        maxQuestions: 10,
        shuffleQuestions: false, // 既にランダムに選択済み
        enableIncorrectTracking: false,
        choiceGeneration: {
          choiceCount: 4,
          generateCustomChoices: (currentQuestion: QuizQuestion) => {
            // 他の苦手問題から選択肢を生成
            const otherQuestions = allWeakQuestions.filter(q => q.japanese !== currentQuestion.japanese)
            let wrongChoices: string[] = []

            if (otherQuestions.length >= 3) {
              wrongChoices = otherQuestions
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map(q => q.japanese)
            } else {
              wrongChoices = otherQuestions.map(q => q.japanese)
              const dummyChoices = ['約束', '希望', '勇気', '友情', '真実', '平和', '美しさ', '知識', '感謝', '愛情']

              while (wrongChoices.length < 3) {
                const dummyChoice = dummyChoices[Math.floor(Math.random() * dummyChoices.length)]
                if (!wrongChoices.includes(dummyChoice) && dummyChoice !== currentQuestion.japanese) {
                  wrongChoices.push(dummyChoice)
                }
              }
            }

            return [currentQuestion.japanese, ...wrongChoices].sort(() => Math.random() - 0.5)
          }
        }
      }}
      completionConfig={{
        title: "復習完了！",
        subtitle: "苦手問題復習が完了しました！",
        showWordList: true,
        wordListTitle: "学習した問題一覧",
        onRestart: () => window.location.reload(),
        restartButtonText: "🔄 もう一度復習"
      }}
      customActions={[
        {
          id: "understood-traditional",
          label: "✅ 理解できた（苦手問題から削除）",
          variant: "success",
          condition: "traditional-only",
          position: "after-result",
          onClick: onUnderstood
        },
        {
          id: "understood-choice",
          label: "✅ 理解できた（苦手問題から削除）",
          variant: "success",
          condition: "choice-only",
          position: "after-result",
          onClick: onUnderstood
        }
      ]}
      onQuizComplete={() => {
        // 完了時の処理（必要に応じて追加）
      }}
      onQuizExit={onNavigateToList}
    />
  )
}