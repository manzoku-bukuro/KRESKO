import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updatePageMeta, seoData } from "../utils/seo";
import { AnswerResult } from "../components/AnswerResult";
import { WordList } from "../components/WordList";
import { QuizHeader } from "../components/QuizHeader";
import { ChoiceButtons } from "../components/ChoiceButtons";
import { useQuizEngine, type QuizQuestion } from "../hooks";

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

  // InterrogativeWord を QuizQuestion 形式に変換
  const interrogativeQuestions: QuizQuestion[] = interrogativeWords.map(word => ({
    esperanto: word.word,
    japanese: word.meaning
  }));

  // useQuizEngine フックを使用
  const { state, actions } = useQuizEngine({
    initialMode: 'multiple-choice',
    shuffleQuestions: true,
    enableIncorrectTracking: false,
    choiceGeneration: {
      choiceCount: 4,
      generateFromPool: () => interrogativeWords.map(w => w.meaning)
    }
  });

  const {
    questions,
    currentIndex,
    finished,
    showAnswer,
    selectedAnswer,
    choices,
    showResult
  } = state;

  useEffect(() => {
    updatePageMeta(seoData.interrogativeBasic.title, seoData.interrogativeBasic.description);
    actions.initializeQuiz(interrogativeQuestions);
  }, [actions, interrogativeQuestions]);

  const handleChoice = (choice: string) => {
    actions.handleChoiceClick(choice);
  };

  const nextQuestion = () => {
    actions.nextQuestion();
  };

  if (questions.length === 0) {
    return <div>読み込み中...</div>;
  }

  const currentWord = questions[currentIndex];

  // 結果表示画面
  if (finished) {
    return (
      <div className="app-container">
        <div className="card quiz-completion">
          <h1>🎉 完了！</h1>
          <h3>基本学習が完了しました！</h3>
          <p>お疲れ様でした。{questions.length}問の疑問詞を学習しました。</p>

          {/* 学習した疑問詞一覧 */}
          <WordList
            title="学習した疑問詞一覧"
            words={questions.map((word) => ({
              primary: word.esperanto,
              secondary: word.japanese
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

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="app-container">
      <div className="card quiz-container">
        {/* Progress Bar */}
        <div className="quiz-progress">
          <div className="quiz-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Header */}
        <QuizHeader
          title="❓ 疑問詞 - 基本学習"
          currentQuestion={currentIndex + 1}
          totalQuestions={questions.length}
          subtitle="疑問詞の意味を覚える練習問題"
        />

        {/* Quiz Content */}
        <div className="quiz-content">
          <p className="esperanto-word">{currentWord.esperanto}</p>
          <p className="quiz-instruction">この疑問詞の意味は？</p>
        </div>

        {/* Multiple Choice */}
        <ChoiceButtons
          choices={choices}
          selectedAnswer={selectedAnswer}
          correctAnswer={currentWord.japanese}
          showResult={showResult}
          onChoiceClick={handleChoice}
          instruction="この疑問詞の意味を選んでください"
        />

        {/* 結果表示 */}
        <AnswerResult
          variant="choice"
          resultType={selectedAnswer === currentWord.japanese ? 'correct' : 'wrong'}
          isVisible={showResult}
          message={selectedAnswer === currentWord.japanese ? '🎉 正解です！' : '❌ 不正解です'}
          onNext={nextQuestion}
          nextButtonText={currentIndex < questions.length - 1 ? "➡️ 次の問題へ" : "🎉 完了！"}
        />

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