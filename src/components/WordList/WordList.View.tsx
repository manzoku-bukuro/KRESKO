import type { WordListProps, WordListState, WordListActions } from './WordList.types'

interface WordListViewProps {
  props: WordListProps
  state: WordListState
  actions: WordListActions
}

export const WordListView = ({ props }: WordListViewProps) => {
  const { title, words, className = '' } = props

  return (
    <div className={`word-review ${className}`}>
      <h4 className="text-lg font-semibold text-text mb-md flex items-center gap-2">
        📖 {title} ({words.length}{title.includes('語') ? '' : title.includes('問') ? '' : '項目'})
      </h4>

      <div className="grid gap-md grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {words.map((word, idx) => (
          <div
            key={idx}
            className={`
              bg-surface-hover border border-border rounded-md p-md
              transition-all duration-fast
              hover:bg-white hover:border-primary hover:-translate-y-0.5 hover:shadow-soft
              ${word.isIncorrect ? 'bg-red-50 border-danger hover:bg-red-100 hover:border-danger' : ''}
            `}
          >
            {/* メインテキスト */}
            <div className={`
              font-bold text-center mb-xs text-lg
              ${word.isIncorrect ? 'text-danger' : 'text-primary'}
            `}>
              {word.primary}
            </div>

            {/* サブテキスト */}
            <div className="text-text font-medium text-center leading-relaxed">
              {word.secondary}
            </div>

            {/* 追加情報 */}
            {word.extra && (
              <div className="text-sm text-muted text-center leading-normal mt-xs pt-xs border-t border-border">
                {word.extra}
              </div>
            )}

            {/* 間違いマーカー */}
            {word.isIncorrect && (
              <div className="text-xs text-danger font-bold text-center mt-xs pt-xs border-t border-danger">
                {word.incorrectLabel || '❌ 間違い'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}