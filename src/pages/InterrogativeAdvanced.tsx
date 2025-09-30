import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import interrogativeQuestionsData from "../data/interrogative-questions.json";
import { updatePageMeta, seoData } from "../utils/seo";
import { AnswerResult } from "../components/AnswerResult";
import { WordList } from "../components/WordList";
import { QuizHeader } from "../components/QuizHeader";
import { ChoiceButtons } from "../components/ChoiceButtons";
import { useQuizEngine, type QuizQuestion } from "../hooks";

interface InterrogativeQuestion {
  sentence: string;
  blanks: string[];
  correctAnswer: string;
  translation: string;
  explanation?: string;
}


function InterrogativeAdvanced() {
  const navigate = useNavigate();

  // InterrogativeQuestion を QuizQuestion 形式に変換
  const quizQuestions: QuizQuestion[] = (interrogativeQuestionsData as InterrogativeQuestion[]).map(q => ({
    esperanto: q.sentence,
    japanese: q.correctAnswer,
    extra: q.explanation,
    // カスタムプロパティ
    translation: q.translation,
    blanks: q.blanks
  }));

  // useQuizEngine フックを使用
  const { state, actions } = useQuizEngine({
    initialMode: 'multiple-choice',
    maxQuestions: 5,
    shuffleQuestions: true,
    enableIncorrectTracking: false,
    choiceGeneration: {
      choiceCount: 4,
      generateFromPool: (questions) => {
        // 選択肢は各問題の blanks から生成
        return questions.flatMap(q => (q as any).blanks || []);
      }
    }
  });

  const {
    questions,
    currentIndex,
    finished,
    quizMode,
    showAnswer,
    selectedAnswer,
    showResult,
    choices
  } = state;

  useEffect(() => {
    updatePageMeta(seoData.interrogativeAdvanced.title, seoData.interrogativeAdvanced.description);
    actions.initializeQuiz(quizQuestions);
  }, [actions, quizQuestions]);

  const handleChoice = (choice: string) => {
    actions.handleChoiceClick(choice);
  };

  const nextQuestion = () => {
    actions.nextQuestion();
  };

  if (questions.length === 0) {
    return <div>読み込み中...</div>;
  }

  const currentQuestion = questions[currentIndex];

  // 結果表示画面
  if (finished) {
    return (
      <div className="app-container">
        <div className="card quiz-completion">
          <h1>🎉 完了！</h1>
          <h3>応用問題が完了しました！</h3>
          <p>お疲れ様でした。{questions.length}問の疑問詞問題を学習しました。</p>

          {/* 学習した問題一覧 */}
          <WordList
            title="学習した問題一覧"
            words={questions.map((question) => ({
              primary: question.esperanto.replace('_____', question.japanese),
              secondary: (question as any).translation
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
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="app-container">
      <div className="card quiz-container">
        {/* Progress Bar */}
        <div className="quiz-progress">
          <div className="quiz-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Header */}
        <QuizHeader
          title="❓ 疑問詞 - 応用問題"
          currentQuestion={currentIndex + 1}
          totalQuestions={questions.length}
          subtitle="日本語文の穴埋めで疑問詞を選択する実践問題"
          showModeToggle={true}
          modeToggleProps={{
            currentMode: quizMode,
            onModeChange: actions.setQuizMode
          }}
        />

        {/* Quiz Content */}
        <div className="quiz-content">
          <p className="esperanto-word">{currentQuestion.esperanto}</p>
          <p className="quiz-instruction">（{(currentQuestion as any).translation}）</p>

          {/* 従来モード：回答表示部分 */}
          {quizMode === 'traditional' && (
            <AnswerResult
              variant="traditional"
              isVisible={showAnswer}
              wordDisplay={{
                primary: `正解: ${currentQuestion.japanese}`,
                extra: currentQuestion.extra
              }}
            />
          )}
        </div>

        {/* 4択モード：選択肢 */}
        {quizMode === 'multiple-choice' && (
          <div>
            <ChoiceButtons
              choices={choices}
              selectedAnswer={selectedAnswer}
              correctAnswer={currentQuestion.japanese}
              showResult={showResult}
              onChoiceClick={handleChoice}
              instruction="適切な疑問詞を選んでください"
            />

            {/* 結果表示 */}
            <AnswerResult
              variant="choice"
              resultType={selectedAnswer === currentQuestion.japanese ? 'correct' : 'wrong'}
              isVisible={showResult}
              message={selectedAnswer === currentQuestion.japanese ? '🎉 正解です！' : '❌ 不正解です'}
              wordDisplay={{
                extra: currentQuestion.extra
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
              onClick={actions.handleTraditionalClick}
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