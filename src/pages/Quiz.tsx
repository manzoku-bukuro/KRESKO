import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import vortaro from "../data/vortaro.json";
import esuken4 from "../data/esuken4.json";

interface Word {
  esperanto: string;
  japanese: string; // 主な意味
  extra?: string;   // 意味続き（エス研のみ）
}

// JSON → 共通形式に変換
const normalizeWords = (category: string): Word[] => {
  if (category === "drill") {
    return (vortaro as any[]).map(w => ({
      esperanto: w.esperanto,
      japanese: w.japanese,
    }));
  }

  if (category === "esuken4") {
    return (esuken4 as any[]).map(w => ({
      esperanto: w.vorto,
      japanese: w.意味,
      extra: w["意味続き"] ?? "",
    }));
  }

  return [];
};

function Quiz() {
  const { category, rangeStart, rangeSize } = useParams();
  const navigate = useNavigate();

  const words = normalizeWords(category!);
  const start = Number(rangeStart) - 1;
  const size = Number(rangeSize);

  const slice = words.slice(start, start + size);

  // 状態管理
  const [questions, setQuestions] = useState<Word[]>([]);
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [finished, setFinished] = useState(false);

  // クイズ開始/リセット処理
  const startQuiz = () => {
    const shuffled = [...slice].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setIndex(0);
    setShow(false);
    setFinished(false);
  };

  // 初期化
  useEffect(() => {
    startQuiz();
  }, [category, rangeStart, rangeSize]);

  const handleClick = () => {
    if (!show) {
      setShow(true);
    } else {
      if (index < questions.length - 1) {
        setIndex(index + 1);
        setShow(false);
      } else {
        // 終了
        setFinished(true);
      }
    }
  };

  const isLastQuestion = index === questions.length - 1;

  // 次の範囲へ進む処理
  const handleNextRange = () => {
    const nextStart = start + size + 1;
    if (nextStart <= words.length) {
      navigate(`/quiz/${category}/${nextStart}/${size}`);
    } else {
      // 末尾を超えたら範囲選択に戻る
      navigate(`/range/${category}`);
    }
  };

  const getCategoryEmoji = (cat: string) => {
    if (cat === "drill") return "📚";
    if (cat === "esuken4") return "🏆";
    return "📖";
  };

  const getCategoryName = (cat: string) => {
    if (cat === "drill") return "ドリル式";
    if (cat === "esuken4") return "エス検4級";
    return cat;
  };

  if (finished) {
    return (
      <div className="app-container">
        <div className="card quiz-completion">
          <h1>🎉 完了！</h1>
          <h3>この範囲の学習が完了しました！</h3>
          <p>お疲れ様でした。{questions.length}問の単語を学習しました。</p>

          {/* 学習した単語一覧 */}
          <div className="word-review">
            <h4>📖 学習した単語一覧 ({questions.length}語)</h4>
            <div className="word-grid">
              {questions.map((word, idx) => (
                <div key={idx} className="word-item">
                  <div className="word-esperanto">{word.esperanto}</div>
                  <div className="word-japanese">{word.japanese}</div>
                  {word.extra && <div className="word-extra">{word.extra}</div>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <button
              className="btn btn-primary btn-large btn-full"
              onClick={startQuiz}
              style={{ marginBottom: "1rem" }}
            >
              🔄 同じ範囲をもう一度
            </button>
            <button
              className="btn btn-accent btn-large btn-full"
              onClick={handleNextRange}
              style={{ marginBottom: "1rem" }}
            >
              ➡️ 次の範囲へ進む
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/range/${category}`)}
            >
              📋 範囲選択に戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((index + 1) / questions.length) * 100;

  return (
    <div className="app-container">
      <div className="card quiz-container">
        {/* Progress Bar */}
        <div className="quiz-progress">
          <div className="quiz-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Header */}
        <div className="quiz-header">
          <h2>{getCategoryEmoji(category!)} {getCategoryName(category!)}</h2>
          <p className="quiz-counter">
            問題 {index + 1} / {questions.length} ({rangeStart} - {Math.min(Number(rangeStart) + Number(rangeSize) - 1, words.length)})
          </p>
        </div>

        {/* Quiz Content */}
        <div className="quiz-content">
          {/* 出題単語 */}
          <p className="esperanto-word">{questions[index]?.esperanto}</p>

          {/* 回答表示部分 */}
          <div className="answer-area">
            {show && (
              <>
                <p className="japanese-word">{questions[index]?.japanese}</p>
                {questions[index]?.extra && (
                  <p className="japanese-extra">{questions[index]?.extra}</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: "auto" }}>
          <button
            className="btn btn-primary btn-large btn-full"
            onClick={handleClick}
            style={{ marginBottom: "1rem" }}
          >
            {!show
              ? "👁️ 回答を表示"
              : isLastQuestion
                ? "🎉 完了！"
                : "➡️ 次の問題へ"
            }
          </button>

          <button
            className="btn btn-accent btn-small"
            onClick={() => navigate(`/range/${category}`)}
          >
            ← 範囲選択に戻る
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;