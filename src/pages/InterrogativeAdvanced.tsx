import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import interrogativeQuestionsData from "../data/interrogative-questions.json";
import { updatePageMeta, seoData } from "../utils/seo";

interface QuizQuestion {
  sentence: string;
  blanks: string[];
  correctAnswer: string;
  translation: string;
  explanation?: string;
}


function InterrogativeAdvanced() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [incorrectQuestions, setIncorrectQuestions] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);

  // モード切り替え用の状態
  const [quizMode, setQuizMode] = useState<'traditional' | 'multiple-choice'>('multiple-choice');
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    updatePageMeta(seoData.interrogativeAdvanced.title, seoData.interrogativeAdvanced.description);
    const shuffled = [...interrogativeQuestionsData].sort(() => Math.random() - 0.5).slice(0, 5);
    setShuffledQuestions(shuffled);
  }, []);

  const handleChoice = (choice: string) => {
    if (showAnswer) return;

    setSelectedAnswer(choice);
    setShowAnswer(true);
    setShowResult(true);

    const currentQuestion = shuffledQuestions[currentIndex];
    if (choice !== currentQuestion.correctAnswer) {
      setIncorrectQuestions([...incorrectQuestions, currentIndex]);
    }
  };

  const handleClick = () => {
    if (quizMode === 'traditional') {
      if (!showAnswer) {
        setShowAnswer(true);
      } else {
        handleNextQuestion();
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  const nextQuestion = () => {
    handleNextQuestion();
  };

  if (shuffledQuestions.length === 0) {
    return <div>読み込み中...</div>;
  }

  const currentQuestion = shuffledQuestions[currentIndex];

  // 結果表示画面
  if (finished) {
    return (
      <div className="app-container">
        <div className="card quiz-completion">
          <h1>🎉 完了！</h1>
          <h3>応用問題が完了しました！</h3>
          <p>お疲れ様でした。{shuffledQuestions.length}問の疑問詞問題を学習しました。</p>

          {/* 学習した問題一覧 */}
          <div className="word-review">
            <h4>📖 学習した問題一覧 ({shuffledQuestions.length}問)</h4>
            <div className="word-grid">
              {shuffledQuestions.map((question, idx) => {
                const wasIncorrect = incorrectQuestions.includes(idx);
                return (
                  <div key={idx} className={`word-item ${wasIncorrect ? 'word-item-incorrect' : ''}`}>
                    <div className="word-esperanto">{question.sentence.replace('_____', question.correctAnswer)}</div>
                    <div className="word-japanese">{question.translation}</div>
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
  const isLastQuestion = currentIndex === shuffledQuestions.length - 1;

  return (
    <div className="app-container">
      <div className="card quiz-container">
        {/* Progress Bar */}
        <div className="quiz-progress">
          <div className="quiz-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Header */}
        <div className="quiz-header">
          <h2>❓ 疑問詞 - 応用問題</h2>
          <p className="quiz-counter">
            問題 {currentIndex + 1} / {shuffledQuestions.length}
          </p>

          {/* Mode Toggle */}
          <div className="quiz-mode-toggle">
            <button
              className={`btn btn-small ${quizMode === 'traditional' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setQuizMode('traditional')}
            >
              👁️ 表示形式
            </button>
            <button
              className={`btn btn-small ${quizMode === 'multiple-choice' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setQuizMode('multiple-choice')}
            >
              ✅ 4択形式
            </button>
          </div>
        </div>

        {/* Quiz Content */}
        <div className="quiz-content">
          <p className="esperanto-word">{currentQuestion.sentence}</p>
          <p className="quiz-instruction">（{currentQuestion.translation}）</p>

          {/* 従来モード：回答表示部分 */}
          {quizMode === 'traditional' && (
            <div className="answer-area">
              {showAnswer && (
                <>
                  <p className="japanese-word">正解: {currentQuestion.correctAnswer}</p>
                  {currentQuestion.explanation && (
                    <p className="japanese-extra">{currentQuestion.explanation}</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* 4択モード：選択肢 */}
        {quizMode === 'multiple-choice' && (
          <div className="multiple-choice-area">
            <p className="quiz-instruction">適切な疑問詞を選んでください</p>
            {currentQuestion.blanks.map((choice, index) => {
              const isSelected = selectedAnswer === choice;
              const isCorrect = choice === currentQuestion.correctAnswer;
              let buttonClass = "btn choice-btn";

              if (showResult && isSelected) {
                buttonClass += isCorrect ? " choice-correct" : " choice-wrong";
              } else if (showResult && isCorrect) {
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
            {showResult && (
              <div className={`choice-result ${selectedAnswer === currentQuestion.correctAnswer ? 'correct' : 'wrong'}`}>
                {/* 解説表示 */}
                {currentQuestion.explanation && (
                  <div className="choice-extra-meaning">
                    {currentQuestion.explanation}
                  </div>
                )}

                <div className="choice-result-button">
                  <button
                    className="btn btn-primary btn-large"
                    onClick={nextQuestion}
                  >
                    {isLastQuestion ? "🎉 完了！" : "➡️ 次の問題へ"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons - 従来モードのみ */}
        {quizMode === 'traditional' && (
          <div style={{ marginTop: "auto" }}>
            <button
              className="btn btn-primary btn-large btn-full"
              onClick={handleClick}
              style={{ marginBottom: "1rem" }}
            >
              {!showAnswer
                ? "👁️ 回答を表示"
                : isLastQuestion
                  ? "🎉 完了！"
                  : "➡️ 次の問題へ"
              }
            </button>
          </div>
        )}

        {/* 戻るボタン - 両モード共通 */}
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

export default InterrogativeAdvanced;