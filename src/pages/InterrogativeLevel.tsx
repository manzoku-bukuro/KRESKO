import { useNavigate } from "react-router-dom";

function InterrogativeMenu() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="card range-selection">
        <h1>❓ 疑問詞学習</h1>
        <h2>学習方法を選択してください</h2>

        <div className="range-section">
          <h3>📚 疑問詞について</h3>
          <p>初学者向け：9つの疑問詞の意味と使い方を学ぶ</p>
          <button
            className="btn btn-accent btn-large btn-full"
            onClick={() => navigate("/interrogative-explanation")}
          >
            疑問詞の説明を読む
          </button>
        </div>

        <div className="range-section">
          <h3>📖 基本学習</h3>
          <p>疑問詞の意味を覚える練習問題</p>
          <button
            className="btn btn-primary btn-large btn-full"
            onClick={() => navigate("/interrogative-basic")}
          >
            基本学習をスタート
          </button>
        </div>

        <div className="range-section">
          <h3>🎯 応用問題</h3>
          <p>日本語文の穴埋めで疑問詞を選択する実践問題</p>
          <button
            className="btn btn-secondary btn-large btn-full"
            onClick={() => navigate("/interrogative-advanced")}
          >
            応用問題をスタート
          </button>
        </div>

        <button
          className="btn btn-accent"
          onClick={() => navigate("/")}
        >
          ← カテゴリに戻る
        </button>
      </div>
    </div>
  );
}

export default InterrogativeMenu;