import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface InterrogativeWord {
  word: string;
  meaning: string;
}

const interrogativeWords: InterrogativeWord[] = [
  { word: "kio", meaning: "何" },
  { word: "kiu", meaning: "だれ・どれ" },
  { word: "kia", meaning: "どんな" },
  { word: "kies", meaning: "だれの" },
  { word: "kie", meaning: "どこで" },
  { word: "kiel", meaning: "どのように" },
  { word: "kial", meaning: "なぜ" },
  { word: "kiam", meaning: "いつ" },
  { word: "kiom", meaning: "どれくらい" }
];

function InterrogativeBasic() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [incorrectQuestions, setIncorrectQuestions] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<InterrogativeWord[]>([]);
  const [choices, setChoices] = useState<string[]>([]);

  useEffect(() => {
    const shuffled = [...interrogativeWords].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      generateChoices();
    }
  }, [currentIndex, shuffledQuestions]);

  const generateChoices = () => {
    if (shuffledQuestions.length === 0) return;

    const currentWord = shuffledQuestions[currentIndex];
    const otherMeanings = interrogativeWords
      .filter(w => w.word !== currentWord.word)
      .map(w => w.meaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allChoices = [currentWord.meaning, ...otherMeanings]
      .sort(() => Math.random() - 0.5);

    setChoices(allChoices);
  };

  const handleChoice = (choice: string) => {
    if (showAnswer) return;

    setSelectedAnswer(choice);
    setShowAnswer(true);

    const currentWord = shuffledQuestions[currentIndex];
    if (choice !== currentWord.meaning) {
      setIncorrectQuestions([...incorrectQuestions, currentIndex]);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    } else {
      setFinished(true);
    }
  };

  if (shuffledQuestions.length === 0) {
    return <div>読み込み中...</div>;
  }

  const currentWord = shuffledQuestions[currentIndex];

  // 結果表示画面
  if (finished) {
    return (
      <div className="app-container">
        <div className="card quiz-completion">
          <h1>🎉 完了！</h1>
          <h3>基本学習が完了しました！</h3>
          <p>お疲れ様でした。{shuffledQuestions.length}問の疑問詞を学習しました。</p>

          {/* 学習した疑問詞一覧 */}
          <div className="word-review">
            <h4>📖 学習した疑問詞一覧 ({shuffledQuestions.length}語)</h4>
            <div className="word-grid">
              {shuffledQuestions.map((word, idx) => {
                const wasIncorrect = incorrectQuestions.includes(idx);
                return (
                  <div key={idx} className={`word-item ${wasIncorrect ? 'word-item-incorrect' : ''}`}>
                    <div className="word-esperanto">{word.word}</div>
                    <div className="word-japanese">{word.meaning}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/interrogative-menu")}
            >
              📋 メニューに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / shuffledQuestions.length) * 100;

  return (
    <div className="app-container">
      <div className="card quiz-container">
        {/* Progress Bar */}
        <div className="quiz-progress">
          <div className="quiz-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Header */}
        <div className="quiz-header">
          <h2>❓ 疑問詞 - 基本学習</h2>
          <p className="quiz-counter">
            問題 {currentIndex + 1} / {shuffledQuestions.length}
          </p>
        </div>

        {/* Quiz Content */}
        <div className="quiz-content">
          <p className="esperanto-word">{currentWord.word}</p>
          <p className="quiz-instruction">この疑問詞の意味は？</p>
        </div>

        {/* Multiple Choice */}
        <div className="multiple-choice-area">
          {choices.map((choice, index) => {
            const isSelected = selectedAnswer === choice;
            const isCorrect = choice === currentWord.meaning;
            let buttonClass = "btn choice-btn";

            if (showAnswer && isSelected) {
              buttonClass += isCorrect ? " choice-correct" : " choice-wrong";
            } else if (showAnswer && isCorrect) {
              buttonClass += " choice-correct";
            } else if (isSelected) {
              buttonClass += " btn-primary";
            } else {
              buttonClass += " btn-secondary";
            }

            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => handleChoice(choice)}
                disabled={!!selectedAnswer}
              >
                {choice}
              </button>
            );
          })}

          {/* 結果表示 */}
          {showAnswer && (
            <div className={`choice-result ${selectedAnswer === currentWord.meaning ? 'correct' : 'wrong'}`}>
              <div className="choice-result-button">
                <button
                  className="btn btn-primary btn-large"
                  onClick={nextQuestion}
                >
                  {currentIndex < shuffledQuestions.length - 1 ? "➡️ 次の問題へ" : "🎉 完了！"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 戻るボタン */}
        <button
          className="btn btn-accent btn-small"
          onClick={() => navigate("/interrogative-menu")}
        >
          ← メニューに戻る
        </button>
      </div>
    </div>
  );
}

export default InterrogativeBasic;