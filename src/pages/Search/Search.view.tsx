import { Search as SearchIcon, ChevronRight } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import type { SearchViewProps } from './Search.types'

export const SearchView = ({
  searchMode,
  searchQuery,
  results,
  isSearching,
  onSearchModeChange,
  onSearchQueryChange,
  onResultClick,
  onNavigateToTop,
}: SearchViewProps) => {
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
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <SearchIcon style={{ width: '1.5rem', height: '1.5rem' }} />
            <span>単語検索</span>
          </h1>

          {/* 検索モード切り替え */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <button
              onClick={() => onSearchModeChange('japanese')}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                backgroundColor: searchMode === 'japanese' ? 'var(--color-primary)' : 'var(--color-surface)',
                color: searchMode === 'japanese' ? 'white' : 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              日本語で検索
            </button>
            <button
              onClick={() => onSearchModeChange('esperanto')}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                backgroundColor: searchMode === 'esperanto' ? 'var(--color-primary)' : 'var(--color-surface)',
                color: searchMode === 'esperanto' ? 'white' : 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              エスペラント語で検索
            </button>
          </div>

          {/* 検索ボックス */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder={
                searchMode === 'japanese'
                  ? '日本語を入力...'
                  : 'エスペラント語を入力...'
              }
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                paddingLeft: '2.5rem',
                fontSize: '0.875rem',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                outline: 'none',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
              }}
            />
            <SearchIcon
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1rem',
                height: '1rem',
                color: 'var(--color-muted)',
              }}
            />
          </div>
        </div>

        {/* 検索結果 */}
        {searchQuery.trim() && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>
              {isSearching ? '検索中...' : `${results.length}件の結果`}
            </p>

            {results.length > 0 ? (
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                }}
              >
                {results.map((result, idx) => (
                  <button
                    key={result.index}
                    onClick={() => onResultClick(result.index)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      backgroundColor: 'var(--color-surface)',
                      border: 'none',
                      borderBottom: idx === results.length - 1 ? 'none' : '1px solid var(--color-border)',
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
                        {result.index}
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
                          {result.esperanto}
                        </div>
                        <div
                          style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-muted)',
                          }}
                        >
                          {result.japanese}
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
            ) : (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--color-border)',
                }}
              >
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
                  該当する単語が見つかりませんでした
                </p>
              </div>
            )}
          </div>
        )}

        {!searchQuery.trim() && (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: 'var(--color-surface)',
              borderRadius: '0.75rem',
              border: '1px solid var(--color-border)',
            }}
          >
            <SearchIcon
              style={{
                width: '3rem',
                height: '3rem',
                color: 'var(--color-muted)',
                margin: '0 auto 1rem',
              }}
            />
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
              {searchMode === 'japanese'
                ? '日本語で単語を検索してください'
                : 'エスペラント語で単語を検索してください'}
            </p>
          </div>
        )}

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
            marginTop: '1rem',
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
