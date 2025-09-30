import type { ExplanationViewProps } from './Explanation.types'

export const ExplanationView = ({
  interrogatives,
  onNavigateToBasic,
  onNavigateToAdvanced,
  onNavigateToMenu,
}: ExplanationViewProps) => {
  return (
    <div className="app-container">
      <div className="card">
        <h1>❓ 疑問詞について</h1>
        <h2>エスペラントの9つの疑問詞</h2>

        <div
          style={{
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: '#f0f8ff',
            borderRadius: '8px',
            border: '2px solid #e6f3ff',
          }}
        >
          <p>
            <strong>📚 疑問詞とは？</strong>
          </p>
          <p>
            エスペラントには9つの疑問詞があり、すべて「ki-」で始まります。これらを覚えることで、様々な質問ができるようになります！
          </p>
        </div>

        <div className="interrogative-list">
          {interrogatives.map((item, index) => (
            <div
              key={index}
              className="interrogative-item"
              style={{
                margin: '1rem 0',
                padding: '1.5rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#fafafa',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: '0', color: '#2563eb', fontSize: '1.4rem' }}>{item.word}</h3>
                <span
                  style={{
                    marginLeft: '1rem',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#dc2626',
                  }}
                >
                  = {item.meaning}
                </span>
              </div>

              <p style={{ margin: '0.5rem 0', color: '#4b5563' }}>{item.description}</p>

              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ margin: '0.5rem 0', fontSize: '1rem', color: '#374151' }}>
                  📝 例文
                </h4>
                {item.examples.map((example, exIndex) => (
                  <div
                    key={exIndex}
                    style={{
                      margin: '0.5rem 0',
                      padding: '0.5rem',
                      backgroundColor: '#ffffff',
                      borderRadius: '4px',
                    }}
                  >
                    <div style={{ fontWeight: 'bold', color: '#1f2937' }}>{example.esperanto}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{example.japanese}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#fef7cd',
            borderRadius: '8px',
            border: '2px solid #fde047',
          }}
        >
          <p>
            <strong>💡 覚え方のコツ</strong>
          </p>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>すべて「ki-」で始まることを覚える</li>
            <li>英語の5W1H（Who, What, When, Where, Why, How）と対応させて覚える</li>
            <li>例文を声に出して読んで覚える</li>
            <li>日常会話で使ってみる</li>
          </ul>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginTop: '2rem',
            flexWrap: 'wrap',
          }}
        >
          <button className="btn btn-primary btn-large" onClick={onNavigateToBasic}>
            📖 基本学習をスタート
          </button>
          <button className="btn btn-secondary btn-large" onClick={onNavigateToAdvanced}>
            🎯 応用問題をスタート
          </button>
          <button className="btn btn-accent" onClick={onNavigateToMenu}>
            ← メニューに戻る
          </button>
        </div>
      </div>
    </div>
  )
}