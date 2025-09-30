import type { ListViewProps } from './List.types'

export const ListView = ({
  user,
  loading,
  weakQuestions,
  onRemoveQuestion,
  onNavigateToReview,
  onNavigateToTop,
}: ListViewProps) => {
  // ログインしていない場合
  if (!user) {
    return (
      <div className="app-container">
        <div className="card">
          <h1>🔐 ログインが必要です</h1>
          <p>苦手問題を確認するには、ログインまたは新規登録をしてください。</p>
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

  // ローディング中
  if (loading) {
    return (
      <div className="app-container">
        <div className="card">
          <h1>📚 苦手問題</h1>
          <p>読み込み中...</p>
        </div>
      </div>
    )
  }

  // 苦手問題がない場合
  if (weakQuestions.length === 0) {
    return (
      <div className="app-container">
        <div className="card">
          <h1>📚 苦手問題</h1>
          <div className="empty-state">
            <p>🎉 素晴らしい！</p>
            <p>現在、苦手問題はありません。</p>
            <p>クイズで間違えた問題が自動的にここに保存されます。</p>
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
    <div className="app-container">
      <div className="card">
        <h1>📚 苦手問題</h1>
        <p className="subtitle">間違えた問題を復習しましょう（{weakQuestions.length}問）</p>

        {/* 苦手問題リスト */}
        <div className="weak-questions-list">
          {weakQuestions.map((question, index) => (
            <div key={question.esperanto} className="weak-question-item">
              <div className="question-header">
                <span className="question-number">#{index + 1}</span>
                <span className="incorrect-count">
                  ❌ {question.incorrectCount}回
                </span>
              </div>

              <div className="question-content">
                <p className="esperanto-word">{question.esperanto}</p>
                <div className="answer-content">
                  <p className="japanese-word">{question.japanese}</p>
                  {question.extra && (
                    <p className="japanese-extra">{question.extra}</p>
                  )}
                </div>
              </div>

              <div className="question-actions">
                <button
                  className="btn btn-small btn-success"
                  onClick={() => onRemoveQuestion(question.esperanto)}
                >
                  ✅ 理解できた
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ボタン */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {weakQuestions.length >= 1 && (
            <button
              className="btn btn-primary"
              onClick={onNavigateToReview}
            >
              🎯 復習クイズ（ランダム10問）
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={onNavigateToTop}
          >
            🏠 ホームに戻る
          </button>
        </div>
      </div>
    </div>
  )
}