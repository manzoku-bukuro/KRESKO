import { useNavigate } from "react-router-dom";

interface InterrogativeInfo {
  word: string;
  meaning: string;
  description: string;
  examples: { esperanto: string; japanese: string }[];
}

const interrogatives: InterrogativeInfo[] = [
  {
    word: "kio",
    meaning: "何",
    description: "物事や事柄を尋ねる時に使います。英語のwhatに相当します。",
    examples: [
      { esperanto: "Kio estas tio?", japanese: "それは何ですか？" },
      { esperanto: "Kion vi faras?", japanese: "何をしていますか？（対格）" }
    ]
  },
  {
    word: "kiu",
    meaning: "だれ・どれ",
    description: "人や物を特定する時に使います。英語のwho/whichに相当します。",
    examples: [
      { esperanto: "Kiu vi estas?", japanese: "あなたはだれですか？" },
      { esperanto: "Kiu libro estas via?", japanese: "どの本があなたのですか？" }
    ]
  },
  {
    word: "kia",
    meaning: "どんな",
    description: "性質や状態を尋ねる時に使います。形容詞的な疑問詞です。",
    examples: [
      { esperanto: "Kia estas via kato?", japanese: "あなたの猫はどんなですか？" },
      { esperanto: "Kia koloro?", japanese: "どんな色ですか？" }
    ]
  },
  {
    word: "kies",
    meaning: "だれの",
    description: "所有を尋ねる時に使います。英語のwhoseに相当します。",
    examples: [
      { esperanto: "Kies estas tiu libro?", japanese: "この本はだれのですか？" },
      { esperanto: "Kies domo tio estas?", japanese: "それはだれの家ですか？" }
    ]
  },
  {
    word: "kie",
    meaning: "どこで・どこに",
    description: "場所を尋ねる時に使います。英語のwhereに相当します。",
    examples: [
      { esperanto: "Kie vi loĝas?", japanese: "どこに住んでいますか？" },
      { esperanto: "Kie estas la libro?", japanese: "本はどこにありますか？" }
    ]
  },
  {
    word: "kiel",
    meaning: "どのように・どうやって",
    description: "方法や手段、状態を尋ねる時に使います。英語のhowに相当します。",
    examples: [
      { esperanto: "Kiel vi fartas?", japanese: "お元気ですか？" },
      { esperanto: "Kiel vi venis?", japanese: "どうやって来ましたか？" }
    ]
  },
  {
    word: "kial",
    meaning: "なぜ",
    description: "理由を尋ねる時に使います。英語のwhyに相当します。",
    examples: [
      { esperanto: "Kial vi ploras?", japanese: "なぜ泣いているのですか？" },
      { esperanto: "Kial vi ne venis?", japanese: "なぜ来なかったのですか？" }
    ]
  },
  {
    word: "kiam",
    meaning: "いつ",
    description: "時間を尋ねる時に使います。英語のwhenに相当します。",
    examples: [
      { esperanto: "Kiam vi venos?", japanese: "いつ来ますか？" },
      { esperanto: "Kiam vi naskiĝis?", japanese: "いつ生まれましたか？" }
    ]
  },
  {
    word: "kiom",
    meaning: "どれくらい・いくら",
    description: "数量や値段を尋ねる時に使います。英語のhow much/how manyに相当します。",
    examples: [
      { esperanto: "Kiom kostas tio?", japanese: "それはいくらしますか？" },
      { esperanto: "Kiom da tempo?", japanese: "どれくらいの時間？" }
    ]
  }
];

function InterrogativeExplanation() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="card">
        <h1>❓ 疑問詞について</h1>
        <h2>エスペラントの9つの疑問詞</h2>

        <div style={{ marginBottom: "2rem", padding: "1rem", backgroundColor: "#f0f8ff", borderRadius: "8px", border: "2px solid #e6f3ff" }}>
          <p><strong>📚 疑問詞とは？</strong></p>
          <p>エスペラントには9つの疑問詞があり、すべて「ki-」で始まります。これらを覚えることで、様々な質問ができるようになります！</p>
        </div>

        <div className="interrogative-list">
          {interrogatives.map((item, index) => (
            <div key={index} className="interrogative-item" style={{
              margin: "1rem 0",
              padding: "1.5rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#fafafa"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                <h3 style={{ margin: "0", color: "#2563eb", fontSize: "1.4rem" }}>{item.word}</h3>
                <span style={{ marginLeft: "1rem", fontSize: "1.2rem", fontWeight: "bold", color: "#dc2626" }}>
                  = {item.meaning}
                </span>
              </div>

              <p style={{ margin: "0.5rem 0", color: "#4b5563" }}>{item.description}</p>

              <div style={{ marginTop: "1rem" }}>
                <h4 style={{ margin: "0.5rem 0", fontSize: "1rem", color: "#374151" }}>📝 例文</h4>
                {item.examples.map((example, exIndex) => (
                  <div key={exIndex} style={{ margin: "0.5rem 0", padding: "0.5rem", backgroundColor: "#ffffff", borderRadius: "4px" }}>
                    <div style={{ fontWeight: "bold", color: "#1f2937" }}>{example.esperanto}</div>
                    <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>{example.japanese}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#fef7cd", borderRadius: "8px", border: "2px solid #fde047" }}>
          <p><strong>💡 覚え方のコツ</strong></p>
          <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
            <li>すべて「ki-」で始まることを覚える</li>
            <li>英語の5W1H（Who, What, When, Where, Why, How）と対応させて覚える</li>
            <li>例文を声に出して読んで覚える</li>
            <li>日常会話で使ってみる</li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap" }}>
          <button
            className="btn btn-primary btn-large"
            onClick={() => navigate("/interrogative-basic")}
          >
            📖 基本学習をスタート
          </button>
          <button
            className="btn btn-secondary btn-large"
            onClick={() => navigate("/interrogative-advanced")}
          >
            🎯 応用問題をスタート
          </button>
          <button
            className="btn btn-accent"
            onClick={() => navigate("/interrogative-menu")}
          >
            ← メニューに戻る
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterrogativeExplanation;