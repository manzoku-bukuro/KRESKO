import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import vortaro from "../data/vortaro.json";
import esuken4 from "../data/esuken4.json";

interface Word {
  esperanto: string;
  japanese: string;
}

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
      japanese: `${w.意味}${w["意味続き"] ? " / " + w["意味続き"] : ""}`,
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

  // クイズ開始/リセット
  const startQuiz = () => {
    const shuffled = [...slice].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setIndex(0);
    setShow(false);
  };

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
        // 10問終わったら同じカテゴリ&範囲で再スタート
        startQuiz();
      }
    }
  };

  

  return (
    <div className="quiz-card">
      <h2>{category}</h2>
      <h3>問題 {index + 1} / {questions.length}</h3>
      <p className="esperanto-word">{questions[index]?.esperanto}</p>
      <div className="answer-area">
        {show && <p className="japanese-word">{questions[index]?.japanese}</p>}
      </div>
      <button onClick={handleClick}>
        {show ? "次の問題へ" : "回答を表示"}
      </button>
      <button className="back-button" onClick={() => navigate(`/range/${category}`)}>
        範囲選択に戻る
      </button>
    </div>
  );
}

export default Quiz;