import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import interrogativeQuestionsData from "../data/interrogative-questions.json";
import { updatePageMeta, seoData } from "../utils/seo";
import { AnswerResult } from "../components/AnswerResult";
import { WordList } from "../components/WordList";
import { ModeToggle, type QuizMode } from "../components/ModeToggle";

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
  const [finished, setFinished] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);

  // モード切り替え用の状態
  const [quizMode, setQuizMode] = useState<QuizMode>('multiple-choice');
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
          <WordList
            title="学習した問題一覧"
            words={shuffledQuestions.map((question) => ({
              primary: question.sentence.replace('_____', question.correctAnswer),
              secondary: question.translation
            }))}
          />

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
          <ModeToggle
            currentMode={quizMode}
            onModeChange={setQuizMode}
          />
        </div>

        {/* Quiz Content */}
        <div className="quiz-content">
          <p className="esperanto-word">{currentQuestion.sentence}</p>
          <p className="quiz-instruction">（{currentQuestion.translation}）</p>

          {/* 従来モード：回答表示部分 */}
          {quizMode === 'traditional' && (
            <AnswerResult
              variant="traditional"
              isVisible={showAnswer}
              wordDisplay={{
                primary: `正解: ${currentQuestion.correctAnswer}`,
                extra: currentQuestion.explanation
              }}
            />
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
            <AnswerResult
              variant="choice"
              resultType={selectedAnswer === currentQuestion.correctAnswer ? 'correct' : 'wrong'}
              isVisible={showResult}
              message={selectedAnswer === currentQuestion.correctAnswer ? '🎉 正解です！' : '❌ 不正解です'}
              wordDisplay={{
                extra: currentQuestion.explanation
              }}
              onNext={nextQuestion}
              nextButtonText={isLastQuestion ? "🎉 完了！" : "➡️ 次の問題へ"}
            />
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