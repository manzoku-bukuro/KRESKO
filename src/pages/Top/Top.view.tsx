import { Footer } from '../../components/Footer'
import { AuthButton } from '../../components/AuthButton'
import type { TopViewProps } from './Top.types'

export const TopView = ({
  weakQuestionsCount,
  isAuthenticated,
  onNavigateToExam,
  onNavigateToInterrogative,
  onNavigateToNumberGame,
  onNavigateToWeakQuestions,
}: TopViewProps) => {
  return (
    <>
      <div className="app-container">
        <div className="card category-selection">
          <div className="header-with-auth">
            <div>
              <h1>MEMORU</h1>
              <h2>カテゴリを選択</h2>
            </div>
            <AuthButton />
          </div>
          <div className="category-buttons">
            <button
              className="btn btn-primary btn-large btn-full"
              onClick={onNavigateToExam}
            >
              🏆 エス検4級
            </button>
            <button
              className="btn btn-secondary btn-large btn-full"
              onClick={onNavigateToInterrogative}
            >
              ❓ 疑問詞
            </button>
            <button
              className="btn btn-accent btn-large btn-full"
              onClick={onNavigateToNumberGame}
            >
              🔢 数字当てゲーム
            </button>

            {isAuthenticated && (
              <button
                className="btn btn-outline btn-large btn-full"
                onClick={onNavigateToWeakQuestions}
                style={{
                  marginTop: '1rem',
                  borderTop: '1px solid #e0e0e0',
                  paddingTop: '1rem'
                }}
              >
                📚 苦手問題を復習
                {weakQuestionsCount > 0 && (
                  <span className="badge" style={{
                    marginLeft: '0.5rem',
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {weakQuestionsCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}