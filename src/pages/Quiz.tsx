import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import vortaro from "../data/vortaro.json";
import esuken4 from "../data/esuken4.json";

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
  const [quizMode, setQuizMode] = useState<'traditional' | 'multiple-choice'>('traditional');
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

    // 間違えた場合は記録
    if (!isCorrect) {
      setIncorrectQuestions(prev => [...prev, index]);
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
          <div className="word-review">
            <h4>📖 学習した単語一覧 ({questions.length}語)</h4>
            <div className="word-grid">
              {questions.map((word, idx) => {
                const wasIncorrect = incorrectQuestions.includes(idx);
                return (
                  <div key={idx} className={`word-item ${wasIncorrect ? 'word-item-incorrect' : ''}`}>
                    <div className="word-esperanto">{word.esperanto}</div>
                    <div className="word-japanese">{word.japanese}</div>
                    {word.extra && <div className="word-extra">{word.extra}</div>}
                    {wasIncorrect && <div className="incorrect-marker">❌ 間違い</div>}
                  </div>
                );
              })}
            </div>
          </div>

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
          {/* 出題単語 */}
          <p className="esperanto-word">{questions[index]?.esperanto}</p>

          {/* 従来モード：回答表示部分 */}
          {quizMode === 'traditional' && (
            <div className="answer-area">
              {show && (
                <>
                  <p className="japanese-word">{questions[index]?.japanese}</p>
                  {questions[index]?.extra && (
                    <p className="japanese-extra">{questions[index]?.extra}</p>
                  )}
                </>
              )}
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
              {showResult && (
                <div className={`choice-result ${selectedAnswer === questions[index]?.japanese ? 'correct' : 'wrong'}`}>
                  {/* 正解の意味続きを表示 */}
                  {questions[index]?.extra && (
                    <div className="choice-extra-meaning">
                      {questions[index]?.extra}
                    </div>
                  )}

                  {/* 次へボタン */}
                  <div className="choice-result-button">
                    <button
                      className="btn btn-primary btn-large"
                      onClick={handleNextQuestion}
                    >
                      {isLastQuestion ? "🎉 完了！" : "➡️ 次の問題へ"}
                    </button>
                  </div>
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