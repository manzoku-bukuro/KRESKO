import { ChevronRight } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import type { WordListViewProps } from './WordList.types'

export const WordListView = ({
  categoryName,
  categoryEmoji,
  words,
  onWordClick,
  onNavigateToTop,
}: WordListViewProps) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', backgroundColor: 'var(--color-background)' }}>
      <Header />

      <main style={{ margin: '0 auto', width: '100%', maxWidth: '375px', flex: 1, padding: '1rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--color-text)',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>{categoryEmoji}</span>
            <span>{categoryName}</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '0.25rem' }}>
            単語リスト（タップで10問クイズ開始）
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
            全{words.length}語
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '0.75rem',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
            marginBottom: '1rem',
          }}
        >
          {words.map((word, idx) => (
            <button
              key={word.index}
              onClick={() => onWordClick(word.index)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                backgroundColor: 'var(--color-surface)',
                border: 'none',
                borderBottom: idx === words.length - 1 ? 'none' : '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                textAlign: 'left',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--color-muted)',
                    minWidth: '2.5rem',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  {word.index}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {word.esperanto}
                  </div>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-muted)',
                    }}
                  >
                    {word.japanese}
                  </div>
                </div>
              </div>
              <ChevronRight
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  color: 'var(--color-muted)',
                  flexShrink: 0,
                }}
              />
            </button>
          ))}
        </div>

        <button
          onClick={onNavigateToTop}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface)'
          }}
        >
          ← トップに戻る
        </button>
      </main>

      <Footer />
    </div>
  )
}
