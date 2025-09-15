import { useState } from "react";
import { useNavigate } from "react-router-dom";
import words from "../data/esuken4.json";

interface EsukenWord {
  vorto: string;
  意味: string;
  "意味続き"?: string;
}

interface Word {
  esperanto: string;
  japanese: string;
}

function Esuken4() {
  const navigate = useNavigate();

  // 正規化して { esperanto, japanese } に統一
  const normalized: Word[] = (words as EsukenWord[]).map((w) => ({
    esperanto: w.vorto,
    japanese: w.意味 + (w["意味続き"] ? " / " + w["意味続き"] : ""),
  }));

  // シャッフルして10問ランダム
  const shuffled = [...normalized].sort(() => 0.5 - Math.random());
  const questions: Word[] = shuffled.slice(0, 10);

  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);

  const handleClick = () => {
    if (!show) {
      setShow(true);
    } else {
      if (index < questions.length - 1) {
        setIndex(index + 1);
        setShow(false);
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="quiz-card">
      <h2>エス検4級</h2>
      <h3>問題 {index + 1} / {questions.length}</h3>
      <p className="esperanto-word">{questions[index]?.esperanto}</p>
      <div className="answer-area">
        {show && <p className="japanese-word">{questions[index]?.japanese}</p>}
      </div>
      <button onClick={handleClick}>
        {show ? "次の問題へ" : "回答を表示"}
      </button>
      <button className="back-button" onClick={() => navigate("/")}>
        ← Topに戻る
      </button>
    </div>
  );
}

export default Esuken4;