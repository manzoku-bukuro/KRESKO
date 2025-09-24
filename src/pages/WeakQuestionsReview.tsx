import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getWeakQuestions, removeWeakQuestion, type WeakQuestion } from '../utils/firestore';

const WeakQuestionsReview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allWeakQuestions, setAllWeakQuestions] = useState<WeakQuestion[]>([]);
  const [reviewQuestions, setReviewQuestions] = useState<WeakQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  // クイズ状態
  const [quizMode, setQuizMode] = useState<'traditional' | 'multiple-choice'>('traditional');
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [choices, setChoices] = useState<string[]>([]);
  const [correctedQuestions, setCorrectedQuestions] = useState<WeakQuestion[]>([]);

  // 苦手問題を取得してランダムに10問選択
  useEffect(() => {
    const fetchWeakQuestions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const questions = await getWeakQuestions();
        setAllWeakQuestions(questions);

        if (questions.length === 0) {
          setLoading(false);
          return;
        }

        // ランダムに最大10問選択
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(10, questions.length));
        setReviewQuestions(selected);

        // 初期は4択モードに設定
        console.log('初期クイズモード: multiple-choice');
        setQuizMode('multiple-choice');
      } catch (error) {
        console.error('苦手問題の取得に失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeakQuestions();
  }, [user]);

  // 選択肢を生成（4択モード用）
  useEffect(() => {
    if (quizMode === 'multiple-choice' && reviewQuestions.length > 0 && allWeakQuestions.length > 0 && currentIndex < reviewQuestions.length) {
      console.log('useEffect: 選択肢生成を開始');
      generateChoices();
    }
  }, [currentIndex, quizMode, reviewQuestions, allWeakQuestions]);

  const generateChoices = () => {
    const currentQuestion = reviewQuestions[currentIndex];
    console.log('generateChoices: 現在の問題:', currentQuestion);
    console.log('generateChoices: 全苦手問題数:', allWeakQuestions.length);

    // 他の問題から3つの選択肢を選ぶ
    const otherQuestions = allWeakQuestions.filter(q => q.japanese !== currentQuestion.japanese);
    console.log('generateChoices: 他の問題数:', otherQuestions.length);

    let wrongChoices: string[] = [];

    if (otherQuestions.length >= 3) {
      // 十分な選択肢がある場合
      wrongChoices = otherQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(q => q.japanese);
    } else {
      // 苦手問題が少ない場合は、既存の問題を使用
      wrongChoices = otherQuestions.map(q => q.japanese);

      // 足りない分はダミー選択肢を追加
      const dummyChoices = ['約束', '希望', '勇気', '友情', '真実', '平和', '美しさ', '知識', '感謝', '愛情'];

      while (wrongChoices.length < 3) {
        const dummyChoice = dummyChoices[Math.floor(Math.random() * dummyChoices.length)];
        if (!wrongChoices.includes(dummyChoice) && dummyChoice !== currentQuestion.japanese) {
          wrongChoices.push(dummyChoice);
        }
      }
    }

    // 正解と間違い選択肢をシャッフル
    const allChoices = [currentQuestion.japanese, ...wrongChoices]
      .sort(() => Math.random() - 0.5);

    console.log('generateChoices: 生成された選択肢:', allChoices);
    console.log('generateChoices: 正解:', currentQuestion.japanese);
    setChoices(allChoices);
  };

  // ログインしていない場合
  if (!user) {
    return (
      <div className="app-container">
        <div className="card">
          <h1>🔐 ログインが必要です</h1>
          <p>苦手問題復習を利用するには、ログインまたは新規登録をしてください。</p>
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

  // ローディング中
  if (loading) {
    return (
      <div className="app-container">
        <div className="card">
          <h1>📚 苦手問題復習</h1>
          <p>問題を準備中...</p>
        </div>
      </div>
    );
  }

  // 苦手問題がない場合
  if (allWeakQuestions.length === 0) {
    return (
      <div className="app-container">
        <div className="card">
          <h1>📚 苦手問題復習</h1>
          <div className="empty-state">
            <p>🎉 素晴らしい！</p>
            <p>復習する苦手問題がありません。</p>
            <p>まずはクイズで問題を間違えてから利用してください。</p>
          </div>
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

  // 完了画面
  if (finished) {
    return (
      <div className="app-container">
        <div className="card quiz-completion">
          <h1>🎉 復習完了！</h1>
          <h3>苦手問題復習が完了しました！</h3>
          <p>お疲れ様でした。{reviewQuestions.length}問を復習しました。</p>

          {/* 理解できた問題一覧 */}
          {correctedQuestions.length > 0 && (
            <div className="word-review">
              <h4>✅ 理解できた問題一覧 ({correctedQuestions.length}問)</h4>
              <div className="word-grid">
                {correctedQuestions.map((question, index) => (
                  <div key={index} className="word-item">
                    <div className="word-esperanto">{question.esperanto}</div>
                    <div className="word-japanese">{question.japanese}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: "2rem" }}>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
              style={{ marginRight: "1rem", marginBottom: "0.5rem" }}
            >
              🔄 もう一度復習
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/weak-questions')}
            >
              📚 苦手問題一覧に戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (reviewQuestions.length === 0 || currentIndex >= reviewQuestions.length) {
    setFinished(true);
    return null;
  }

  const currentQuestion = reviewQuestions[currentIndex];
  const isLastQuestion = currentIndex === reviewQuestions.length - 1;

  // デバッグ用ログ
  console.log('Render: currentIndex:', currentIndex);
  console.log('Render: quizMode:', quizMode);
  console.log('Render: choices:', choices);
  console.log('Render: showAnswer:', showAnswer);
  console.log('Render: selectedAnswer:', selectedAnswer);

  // 4択モードの選択肢クリック
  const handleChoiceClick = (choice: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(choice);
    setShowResult(true);
    setShowAnswer(true);
  };

  // 次の問題へ
  const nextQuestion = () => {
    if (currentIndex < reviewQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
      setShowResult(false);
      setChoices([]); // 選択肢をリセット
    } else {
      setFinished(true);
    }
  };

  // 従来モードのクリック処理
  const handleClick = () => {
    if (!showAnswer) {
      setShowAnswer(true);
    } else {
      nextQuestion();
    }
  };

  // 理解できた問題を削除
  const handleUnderstood = async () => {
    try {
      await removeWeakQuestion(currentQuestion.esperanto);
      setCorrectedQuestions(prev => [...prev, currentQuestion]);
      nextQuestion();
    } catch (error) {
      console.error('苦手問題の削除に失敗:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="card quiz-container">
        {/* Progress Bar */}
        <div className="quiz-progress">
          <div className="quiz-progress-bar" style={{ width: `${((currentIndex + 1) / reviewQuestions.length) * 100}%` }}></div>
        </div>

        {/* Header */}
        <div className="quiz-header">
          <h2>📚 苦手問題復習</h2>
          <p className="quiz-counter">
            問題 {currentIndex + 1} / {reviewQuestions.length}
          </p>

          {/* Mode Toggle */}
          <div className="quiz-mode-toggle">
            <button
              className={`btn btn-small ${quizMode === 'traditional' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setQuizMode('traditional');
                setShowAnswer(false);
                setSelectedAnswer(null);
                setShowResult(false);
              }}
            >
              👁️ 表示形式
            </button>
            <button
              className={`btn btn-small ${quizMode === 'multiple-choice' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setQuizMode('multiple-choice');
                setShowAnswer(false);
                setSelectedAnswer(null);
                setShowResult(false);
              }}
            >
              ✅ 4択形式
            </button>
          </div>
        </div>

        {/* Quiz Content */}
        <div className="quiz-content">
          {/* 出題単語 */}
          <p className="esperanto-word">{currentQuestion.esperanto}</p>

          {/* 従来モード：指示文と回答表示部分 */}
          {quizMode === 'traditional' && (
            <>
              <p className="quiz-instruction">この単語の意味は？</p>
              <div className="answer-area">
                {showAnswer && (
                  <>
                    <p className="japanese-word">{currentQuestion.japanese}</p>
                    {currentQuestion.extra && (
                      <p className="japanese-extra">{currentQuestion.extra}</p>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {/* 4択モード：選択肢 */}
          {quizMode === 'multiple-choice' && (
            <div className="multiple-choice-area">
              <p className="quiz-instruction">この単語の意味を選んでください</p>
              {choices.length === 0 && (
                <p>選択肢を生成中...</p>
              )}
              {choices.map((choice, idx) => {
                const isSelected = selectedAnswer === choice;
                const isCorrect = choice === currentQuestion.japanese;
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
                    disabled={showResult}
                  >
                    {choice}
                  </button>
                );
              })}

              {/* 4択モード結果表示 */}
              {showResult && (
                <div className={`choice-result ${selectedAnswer === currentQuestion.japanese ? 'correct' : 'wrong'}`}>
                  {/* 解説表示 */}
                  {currentQuestion.extra && (
                    <div className="choice-extra-meaning">
                      {currentQuestion.extra}
                    </div>
                  )}

                  {/* 理解できたボタン（ログイン時のみ） */}
                  <div style={{ marginBottom: "1rem" }}>
                    <button
                      className="btn btn-small btn-success"
                      onClick={handleUnderstood}
                    >
                      ✅ 理解できた（苦手問題から削除）
                    </button>
                  </div>

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
        </div>

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

            {/* 理解できたボタン（答え表示後のみ） */}
            {showAnswer && (
              <button
                className="btn btn-success btn-large btn-full"
                onClick={handleUnderstood}
                style={{ marginBottom: "1rem" }}
              >
                ✅ 理解できた（苦手問題から削除）
              </button>
            )}
          </div>
        )}

        {/* 戻るボタン - 両モード共通 */}
        <button
          className="btn btn-accent btn-small"
          onClick={() => navigate('/weak-questions')}
        >
          ← 苦手問題一覧に戻る
        </button>
      </div>
    </div>
  );
};

export default WeakQuestionsReview;