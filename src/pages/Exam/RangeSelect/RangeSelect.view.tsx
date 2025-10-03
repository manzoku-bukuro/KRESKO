import type { RangeSelectViewProps } from './RangeSelect.types'

export const RangeSelectView = ({
  total,
  rangeOptions10,
  rangeOptions100,
  categoryEmoji,
  categoryName,
  onSelectRange,
  onNavigateToTop,
}: RangeSelectViewProps) => {
  return (
    <div className="app-container">
      <div className="card range-selection">
        <h1>{categoryEmoji} {categoryName}</h1>
        <h2>範囲を選択 (全{total}語)</h2>

        <div className="range-section">
          <h3>📝 10個ずつ</h3>
          <div className="range-grid">
            {rangeOptions10.map((option, idx) => (
              <button
                key={idx}
                className="btn btn-secondary"
                onClick={() => onSelectRange(option.start, option.size)}
              >
                {option.start} - {Math.min(option.start + option.size - 1, total)}
              </button>
            ))}
          </div>
        </div>

        <div className="range-section">
          <h3>📋 100個ずつ</h3>
          <div className="range-grid">
            {rangeOptions100.map((option, idx) => (
              <button
                key={idx}
                className="btn btn-secondary"
                onClick={() => onSelectRange(option.start, option.size)}
              >
                {option.start} - {Math.min(option.start + option.size - 1, total)}
              </button>
            ))}
          </div>
        </div>

        <div className="range-section">
          <button
            className="btn btn-primary btn-large btn-full"
            onClick={() => onSelectRange(1, total)}
          >
            🎯 全部チャレンジ ({total}語)
          </button>
        </div>

        <button
          className="btn btn-accent"
          onClick={onNavigateToTop}
        >
          ← カテゴリに戻る
        </button>
      </div>
    </div>
  )
}