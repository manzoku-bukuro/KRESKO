import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import vortaro from "../data/vortaro.json";
import esuken4 from "../data/esuken4.json";
import { useAuth } from "../contexts/AuthContext";
import { saveWeakQuestion } from "../utils/firestore";
import { AnswerResult } from "../components/AnswerResult";
import { WordList } from "../components/WordList";
import { ModeToggle, type QuizMode } from "../components/ModeToggle";

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

  // 状態管理
  const [questions, setQuestions] = useState<Word[]>([]);
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [finished, setFinished] = useState(false);

  // 4択モード用状態
  const [quizMode, setQuizMode] = useState<QuizMode>('traditional');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState<number[]>([]);

  // 4択の選択肢を生成
  const generateChoices = (correctAnswer: string, allWords: Word[]): string[] => {
    // 正解以外の単語から3つをランダムに選択
    const otherWords = allWords.filter(word => word.japanese !== correctAnswer);
    const wrongChoices = [...otherWords]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(word => word.japanese);

    // 正解と間違いをシャッフル
    const allChoices = [correctAnswer, ...wrongChoices];
    return allChoices.sort(() => 0.5 - Math.random());
  };

  // 4択モード用の選択肢を更新
  const updateChoicesForCurrentQuestion = () => {
    if (quizMode === 'multiple-choice' && questions.length > 0) {
      const currentQuestion = questions[index];
      const newChoices = generateChoices(currentQuestion.japanese, words);
      setChoices(newChoices);
    }
  };

  // クイズ開始/リセット処理
  const startQuiz = () => {
    const shuffled = [...slice].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setIndex(0);
    setShow(false);
    setFinished(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setIncorrectQuestions([]);
  };

  // 初期化
  useEffect(() => {
    startQuiz();
  }, [category, rangeStart, rangeSize]);

  // 選択肢を更新（インデックス変更時、モード変更時）
  useEffect(() => {
    updateChoicesForCurrentQuestion();
  }, [index, quizMode, questions]);

  // 従来モードで苦手問題をマーク
  const markAsWeak = async () => {
    if (!user) {
      console.log('markAsWeak: ユーザーがログインしていません');
      return;
    }

    const question = questions[index];
    console.log('markAsWeak: 手動で苦手問題に登録:', question);

    try {
      await saveWeakQuestion({
        esperanto: question.esperanto,
        japanese: question.japanese,
        extra: question.extra
      });

      // 苦手リストに追加（重複チェック）
      if (!incorrectQuestions.includes(index)) {
        setIncorrectQuestions(prev => [...prev, index]);
        console.log('markAsWeak: 苦手リストに追加完了');
      }
    } catch (error) {
      console.error('markAsWeak: 苦手問題の保存に失敗:', error);
    }
  };

  // 従来モードのクリック処理
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

  // 4択モードの選択肢クリック処理
  const handleChoiceClick = (choice: string) => {
    if (selectedAnswer) return; // 既に選択済みの場合は無効

    setSelectedAnswer(choice);
    const isCorrect = choice === questions[index].japanese;
    setShowResult(true);

    console.log('handleChoiceClick: 選択された答え:', choice);
    console.log('handleChoiceClick: 正解:', questions[index].japanese);
    console.log('handleChoiceClick: 正解かどうか:', isCorrect);

    // 間違えた場合は記録
    if (!isCorrect) {
      setIncorrectQuestions(prev => {
        const newIncorrect = [...prev, index];
        console.log('handleChoiceClick: 間違いリストに追加:', index, 'リスト:', newIncorrect);
        return newIncorrect;
      });
    }
  };

  // 苦手問題を保存
  const saveIncorrectQuestions = async () => {
    if (!user) {
      console.log('saveIncorrectQuestions: ユーザーがログインしていません');
      return;
    }

    if (incorrectQuestions.length === 0) {
      console.log('saveIncorrectQuestions: 間違えた問題がありません');
      return;
    }

    console.log('saveIncorrectQuestions: 間違えた問題数:', incorrectQuestions.length);
    console.log('saveIncorrectQuestions: 間違えた問題インデックス:', incorrectQuestions);

    try {
      // 間違えた問題をFirestoreに保存
      for (const questionIndex of incorrectQuestions) {
        const question = questions[questionIndex];
        console.log('saveIncorrectQuestions: 保存中の問題:', question);

        await saveWeakQuestion({
          esperanto: question.esperanto,
          japanese: question.japanese,
          extra: question.extra
        });
      }

      console.log('saveIncorrectQuestions: 全ての保存処理が完了');
    } catch (error) {
      console.error('saveIncorrectQuestions: 苦手問題の保存に失敗:', error);
    }
  };

  // 4択モードで次の問題へ進む
  const handleNextQuestion = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setFinished(true);
      // クイズ終了時に苦手問題を保存
      saveIncorrectQuestions();
    }
  };

  const isLastQuestion = index === questions.length - 1;

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

  const progress = ((index + 1) / questions.length) * 100;

  return (
    <div className="app-container">
      <div className="card quiz-container">
        {/* Progress Bar */}
        <div className="quiz-progress">
          <div className="quiz-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Header */}
        <div className="quiz-header">
          <h2>{getCategoryEmoji(category!)} {getCategoryName(category!)}</h2>
          <p className="quiz-counter">
            問題 {index + 1} / {questions.length} ({rangeStart} - {Math.min(Number(rangeStart) + Number(rangeSize) - 1, words.length)})
          </p>

          {/* Mode Toggle */}
          <ModeToggle
            currentMode={quizMode}
            onModeChange={setQuizMode}
          />
        </div>

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
            <div className="multiple-choice-area">
              {choices.map((choice, idx) => {
                const isSelected = selectedAnswer === choice;
                const isCorrect = choice === questions[index]?.japanese;
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
                    key={idx}
                    className={buttonClass}
                    onClick={() => handleChoiceClick(choice)}
                    disabled={!!selectedAnswer}
                  >
                    {choice}
                  </button>
                );
              })}

              {/* 結果表示 */}
              <AnswerResult
                variant="choice"
                resultType={selectedAnswer === questions[index]?.japanese ? 'correct' : 'wrong'}
                isVisible={showResult}
                message={selectedAnswer === questions[index]?.japanese ? '🎉 正解です！' : '❌ 不正解です'}
                wordDisplay={{
                  extra: questions[index]?.extra
                }}
                onNext={handleNextQuestion}
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
              onClick={handleClick}
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