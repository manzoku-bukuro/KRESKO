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

  if (finished) {
    return (
      <div className="quiz-card">
        <h2>{category}</h2>
        <h3>この範囲の学習が完了しました！</h3>
        <button onClick={startQuiz}>同じ範囲をもう一度</button>
        <button onClick={handleNextRange}>次の範囲へ進む</button>
        <button className="back-button" onClick={() => navigate(`/range/${category}`)}>
          範囲選択に戻る
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-card">
      <h2>{category}</h2>
      <h3>問題 {index + 1} / {questions.length}</h3>

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

      {/* 回答/次へボタン */}
      <button onClick={handleClick}>
        {show ? "次の問題へ" : "回答を表示"}
      </button>

      <button
        className="back-button"
        onClick={() => navigate(`/range/${category}`)}
      >
        範囲選択に戻る
      </button>
    </div>
  );
}

export default Quiz;