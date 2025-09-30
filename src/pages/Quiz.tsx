import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import vortaro from "../data/vortaro.json";
import esuken4 from "../data/esuken4.json";
import { useAuth } from "../contexts/AuthContext";
import { saveWeakQuestion } from "../utils/firestore";
import { AnswerResult } from "../components/AnswerResult";
import { WordList } from "../components/WordList";
import { QuizHeader } from "../components/QuizHeader";
import { ChoiceButtons } from "../components/ChoiceButtons";
import { useQuizEngine, type QuizQuestion } from "../hooks";

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
  const { user } = useAuth();

  const [dataError, setDataError] = useState<string | null>(null);

  // ドリル式へのアクセスをブロック
  useEffect(() => {
    if (category === "drill") {
      navigate("/", { replace: true });
      return;
    }
  }, [category, navigate]);

  const words = normalizeWords(category!);
  const start = Number(rangeStart) - 1;
  const size = Number(rangeSize);

  // データの整合性チェック
  useEffect(() => {
    if (!category || !rangeStart || !rangeSize) {
      setDataError("クイズパラメータが正しくありません");
      return;
    }

    if (words.length === 0) {
      setDataError("単語データの読み込みに失敗しました");
      return;
    }

    if (start < 0 || start >= words.length) {
      setDataError("指定された範囲が無効です");
      return;
    }

    setDataError(null);
  }, [category, rangeStart, rangeSize, words, start]);

  const slice = words.slice(start, start + size);

  // useQuizEngine フックを使用
  const { state, actions } = useQuizEngine({
    initialMode: 'traditional',
    maxQuestions: 10,
    shuffleQuestions: true,
    enableIncorrectTracking: true,
    choiceGeneration: {
      choiceCount: 4,
      generateCustomChoices: (currentQuestion: QuizQuestion) => {
        // Quiz用のカスタム選択肢生成（全単語データから選択）
        const otherWords = words.filter(word => word.japanese !== currentQuestion.japanese);
        const wrongChoices = [...otherWords]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(word => word.japanese);

        return [currentQuestion.japanese, ...wrongChoices].sort(() => 0.5 - Math.random());
      }
    },
    onIncorrectAnswer: async (question: QuizQuestion) => {
      if (user) {
        try {
          await saveWeakQuestion({
            esperanto: question.esperanto,
            japanese: question.japanese,
            extra: question.extra
          });
        } catch (error) {
          console.error('苦手問題の保存に失敗:', error);
        }
      }
    }
  });

  const {
    questions,
    currentIndex: index,
    finished,
    quizMode,
    showAnswer: show,
    selectedAnswer,
    choices,
    showResult,
    incorrectQuestions,
    progress,
    isLastQuestion
  } = state;

  // クイズ開始/リセット処理
  const startQuiz = () => {
    const shuffled = [...slice].sort(() => 0.5 - Math.random());
    actions.initializeQuiz(shuffled);
  };

  // 初期化
  useEffect(() => {
    startQuiz();
  }, [category, rangeStart, rangeSize]);


  // 従来モードで苦手問題をマーク
  const markAsWeak = () => {
    actions.markAsIncorrect();
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

  // エラー表示
  if (dataError) {
    return (
      <div className="app-container">
        <div className="card error-card">
          <h1>⚠️ エラー</h1>
          <p>{dataError}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            🏠 ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="app-container">
        <div className="card quiz-completion">
          <h1>🎉 完了！</h1>
          <h3>この範囲の学習が完了しました！</h3>
          <p>お疲れ様でした。{questions.length}問の単語を学習しました。</p>

          {/* 学習した単語一覧 */}
          <WordList
            title="学習した単語一覧"
            words={questions.map((word, idx) => ({
              primary: word.esperanto,
              secondary: word.japanese,
              extra: word.extra,
              isIncorrect: incorrectQuestions.includes(idx),
              incorrectLabel: "❌ 間違い"
            }))}
          />

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


  return (
    <div className="app-container">
      <div className="card quiz-container">
        {/* Progress Bar */}
        <div className="quiz-progress">
          <div className="quiz-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Header */}
        <QuizHeader
          title={`${getCategoryEmoji(category!)} ${getCategoryName(category!)}`}
          currentQuestion={index + 1}
          totalQuestions={questions.length}
          subtitle={`範囲: ${rangeStart} - ${Math.min(Number(rangeStart) + Number(rangeSize) - 1, words.length)}`}
          showModeToggle={true}
          modeToggleProps={{
            currentMode: quizMode,
            onModeChange: actions.setQuizMode
          }}
        />

        {/* Quiz Content */}
        <div className="quiz-content">
          {/* 出題単語 */}
          <p className="esperanto-word">{questions[index]?.esperanto}</p>

          {/* 従来モード：回答表示部分 */}
          {quizMode === 'traditional' && (
            <AnswerResult
              variant="traditional"
              isVisible={show}
              wordDisplay={{
                primary: questions[index]?.esperanto,
                secondary: questions[index]?.japanese,
                extra: questions[index]?.extra
              }}
            />
          )}

          {/* 苦手登録ボタン (従来モード専用) */}
          {quizMode === 'traditional' && show && user && (
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <button
                className={`btn btn-small ${incorrectQuestions.includes(index) ? 'btn-danger' : 'btn-outline'}`}
                onClick={markAsWeak}
                disabled={incorrectQuestions.includes(index)}
              >
                {incorrectQuestions.includes(index) ? '💾 苦手登録済み' : '💾 苦手に登録'}
              </button>
            </div>
          )}

          {/* 4択モード：選択肢 */}
          {quizMode === 'multiple-choice' && (
            <div>
              <ChoiceButtons
                choices={choices}
                selectedAnswer={selectedAnswer}
                correctAnswer={questions[index]?.japanese}
                showResult={showResult}
                onChoiceClick={actions.handleChoiceClick}
                instruction="この単語の意味を選んでください"
              />

              {/* 結果表示 */}
              <AnswerResult
                variant="choice"
                resultType={selectedAnswer === questions[index]?.japanese ? 'correct' : 'wrong'}
                isVisible={showResult}
                message={selectedAnswer === questions[index]?.japanese ? '🎉 正解です！' : '❌ 不正解です'}
                wordDisplay={{
                  extra: questions[index]?.extra
                }}
                onNext={actions.nextQuestion}
                nextButtonText={isLastQuestion ? "🎉 完了！" : "➡️ 次の問題へ"}
              />

              {/* 苦手登録ボタン（選択モード専用） */}
              {showResult && user && (
                <div style={{ marginBottom: "1rem", textAlign: "center" }}>
                  <button
                    className={`btn btn-small ${incorrectQuestions.includes(index) ? 'btn-danger' : 'btn-outline'}`}
                    onClick={markAsWeak}
                    disabled={incorrectQuestions.includes(index)}
                  >
                    {incorrectQuestions.includes(index) ? '💾 苦手登録済み' : '💾 苦手に登録'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons - 従来モードのみ */}
        {quizMode === 'traditional' && (
          <div style={{ marginTop: "auto" }}>
            <button
              className="btn btn-primary btn-large btn-full"
              onClick={actions.handleTraditionalClick}
              style={{ marginBottom: "1rem" }}
            >
              {!show
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
          onClick={() => navigate(`/range/${category}`)}
        >
          ← 範囲選択に戻る
        </button>
      </div>
    </div>
  );
}

export default Quiz;