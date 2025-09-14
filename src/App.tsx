import { useState, useEffect } from 'react';
import './index.css';
import vocabulary from './data/vortaro.json';

interface Word {
  esperanto: string;
  japanese: string;
}

const ALL_WORDS_COUNT = vocabulary.length;

function App() {
  const [questions, setQuestions] = useState<Word[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [isAnswerShown, setIsAnswerShown] = useState(false);
  const [groupSize, setGroupSize] = useState<number | null>(null);
  const [groupStart, setGroupStart] = useState<number | null>(null);

  // 範囲選択肢を生成するヘルパー関数
  const generateGroupOptions = () => {
    if (!groupSize) return [];
    const options = [];
    for (let i = 0; i < ALL_WORDS_COUNT; i += groupSize) {
      const start = i + 1;
      const end = Math.min(i + groupSize, ALL_WORDS_COUNT);
      options.push({ start, end });
    }
    return options;
  };

  // クイズの開始ロジック
  const startQuiz = () => {
    let selectedWords = [...vocabulary];

    if (groupStart !== null && groupSize !== null) {
      const startIndex = groupStart - 1;
      selectedWords = selectedWords.slice(startIndex, startIndex + groupSize);
    }

    // シャッフルして10問だけ抽出
    const shuffled = selectedWords.sort(() => 0.5 - Math.random());
    const limited = shuffled.slice(0, 10);

    setQuestions(limited);
    setCurrentQuestionIndex(0);
    setIsQuizFinished(false);
    setIsAnswerShown(false);
  };

  // groupStart変更時にクイズ開始
  useEffect(() => {
    if (groupStart !== null && groupSize !== null) {
      startQuiz();
    }
  }, [groupStart, groupSize]);

  const handleButtonClick = () => {
    if (!isAnswerShown) {
      setIsAnswerShown(true);
    } else {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnswerShown(false);
      } else {
        setIsQuizFinished(true);
      }
    }
  };

  return (
    <div className="app-container">
      <h1>KRESKO</h1>

      {groupSize === null ? (
        <div className="group-selection-card">
          <h2>学習範囲の選択</h2>
          <button onClick={() => setGroupSize(10)}>10個ずつ</button>
          <button onClick={() => setGroupSize(100)}>100個ずつ</button>
          <button
            onClick={() => {
              setGroupSize(ALL_WORDS_COUNT);
              setGroupStart(1); // 全部の場合は1から開始
            }}
          >
            全部 ({ALL_WORDS_COUNT}個)
          </button>
        </div>
      ) : groupStart === null ? (
        <div className="group-selection-card">
          <h2>範囲を選択</h2>
          {generateGroupOptions().map((option, index) => (
            <button key={index} onClick={() => setGroupStart(option.start)}>
              {option.start} - {option.end}
            </button>
          ))}
          <button onClick={() => setGroupSize(null)}>戻る</button>
        </div>
      ) : !isQuizFinished ? (
        <div className="quiz-card">
          <h2>問題 {currentQuestionIndex + 1} / {questions.length}</h2>
          <p className="esperanto-word">{questions[currentQuestionIndex]?.esperanto}</p>

          <div className="answer-area">
            {isAnswerShown && (
              <p className="japanese-word">
                {questions[currentQuestionIndex]?.japanese}
              </p>
            )}
          </div>

          {/* ボタン1つで切り替え式 */}
          <button onClick={handleButtonClick}>
            {isAnswerShown ? "次の問題へ" : "回答を表示"}
          </button>

          <button
            className="back-button"
            onClick={() => {
              setGroupSize(null);
              setGroupStart(null);
            }}
          >
            範囲選択に戻る
          </button>
        </div>
      ) : (
        <div className="result-card">
          <h2>学習終了！</h2>
          <p>選択された範囲の学習が完了しました。</p>
          <button
            onClick={() => {
              setGroupSize(null);
              setGroupStart(null);
            }}
          >
            もう一度挑戦する
          </button>
        </div>
      )}
    </div>
  );
}

export default App;