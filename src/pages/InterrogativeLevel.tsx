import { useNavigate } from "react-router-dom";

function InterrogativeLevel() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="card range-selection">
        <h1>❓ 疑問詞</h1>
        <h2>学習レベルを選択</h2>

        <div className="range-section">
          <h3>📖 基本学習</h3>
          <p>疑問詞の意味を覚える</p>
          <button
            className="btn btn-primary btn-large btn-full"
            onClick={() => navigate("/interrogative-basic")}
          >
            基本学習をスタート
          </button>
        </div>

        <div className="range-section">
          <h3>🎯 応用問題</h3>
          <p>日本語文の穴埋めで疑問詞を選択</p>
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

export default InterrogativeLevel;