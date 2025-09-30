import { AnswerResult } from '../../components/AnswerResult'
import type { NumberGameViewProps } from './NumberGame.types'

export const NumberGameView = ({
  targetNumber,
  selectedCards,
  cards,
  result,
  onSelectCard,
  onRemoveCard,
  onClearSelection,
  onCheckAnswer,
  onNewGame,
  onNavigateToTop,
}: NumberGameViewProps) => {
  return (
    <div className="app-container">
      <div className="card number-game-container">
        <h1>🔢 数字当てゲーム</h1>
        <h2>エスペラント語で表現してください</h2>

        {/* Target Number */}
        <div className="target-number">{targetNumber}</div>

        {/* Selected Cards */}
        <div className="selected-cards-area">
          <h3>選択したカード:</h3>
          <div className="selected-cards">
            {selectedCards.map((card, index) => (
              <span
                key={index}
                className="selected-card-chip"
                onClick={() => onRemoveCard(index)}
              >
                {card.word}
              </span>
            ))}
            {selectedCards.length === 0 && (
              <p className="empty-selection">カードを選択してください</p>
            )}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="number-cards-grid">
          {cards.map((card, index) => (
            <button
              key={index}
              className="btn number-card"
              onClick={() => onSelectCard(card.value, card.word)}
            >
              {card.word}
            </button>
          ))}
        </div>

        {/* Result */}
        <AnswerResult
          variant="game"
          resultType={result.correct ? 'correct' : 'wrong'}
          isVisible={result.show}
          message={result.message}
        />

        {/* Action Buttons */}
        <div className="game-actions">
          {!result.show && (
            <button
              className="btn btn-primary btn-large"
              onClick={onCheckAnswer}
              disabled={selectedCards.length === 0}
            >
              📝 答えをチェック
            </button>
          )}

          <button
            className="btn btn-secondary"
            onClick={onClearSelection}
            disabled={selectedCards.length === 0 && !result.show}
          >
            🗑️ 選択をクリア
          </button>

          <button className="btn btn-accent" onClick={onNewGame}>
            🎲 新しい問題
          </button>
        </div>

        <button
          className="btn btn-secondary btn-small"
          onClick={onNavigateToTop}
        >
          ← トップに戻る
        </button>
      </div>
    </div>
  )
}