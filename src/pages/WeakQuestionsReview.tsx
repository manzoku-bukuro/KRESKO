import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getWeakQuestions, removeWeakQuestion, type WeakQuestion } from '../utils/firestore';
import { WordList } from '../components/WordList';
import { QuizHeader } from '../components/QuizHeader';
import { ChoiceButtons } from '../components/ChoiceButtons';
import { useQuizEngine, type QuizQuestion } from '../hooks';

const WeakQuestionsReview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allWeakQuestions, setAllWeakQuestions] = useState<WeakQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [correctedQuestions, setCorrectedQuestions] = useState<WeakQuestion[]>([]);

  // useQuizEngine フックを使用
  const { state, actions } = useQuizEngine({
    initialMode: 'traditional',
    maxQuestions: 10,
    shuffleQuestions: true,
    enableIncorrectTracking: false,
    choiceGeneration: {
      choiceCount: 4,
      generateCustomChoices: (currentQuestion: QuizQuestion) => {
        // 他の苦手問題から選択肢を生成
        const otherQuestions = allWeakQuestions.filter(q => q.japanese !== currentQuestion.japanese);
        let wrongChoices: string[] = [];

        if (otherQuestions.length >= 3) {
          wrongChoices = otherQuestions
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(q => q.japanese);
        } else {
          wrongChoices = otherQuestions.map(q => q.japanese);
          const dummyChoices = ['約束', '希望', '勇気', '友情', '真実', '平和', '美しさ', '知識', '感謝', '愛情'];

          while (wrongChoices.length < 3) {
            const dummyChoice = dummyChoices[Math.floor(Math.random() * dummyChoices.length)];
            if (!wrongChoices.includes(dummyChoice) && dummyChoice !== currentQuestion.japanese) {
              wrongChoices.push(dummyChoice);
            }
          }
        }

        return [currentQuestion.japanese, ...wrongChoices].sort(() => Math.random() - 0.5);
      }
    }
  });

  const {
    questions: reviewQuestions,
    currentIndex,
    finished,
    quizMode,
    showAnswer,
    selectedAnswer,
    showResult,
    choices
  } = state;

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

        // ランダムに最大10問選択してQuizEngineに初期化
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(10, questions.length));

        // WeakQuestion を QuizQuestion 形式に変換
        const quizQuestions: QuizQuestion[] = selected.map(q => ({
          esperanto: q.esperanto,
          japanese: q.japanese,
          extra: q.extra
        }));

        actions.initializeQuiz(quizQuestions, { initialMode: 'multiple-choice' });
      } catch (error) {
        console.error('苦手問題の取得に失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeakQuestions();
  }, [user, actions]);

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
            <WordList
              title="理解できた問題一覧"
              words={correctedQuestions.map((question) => ({
                primary: question.esperanto,
                secondary: question.japanese
              }))}
            />
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
    actions.handleChoiceClick(choice);
  };

  // 次の問題へ
  const nextQuestion = () => {
    actions.nextQuestion();
  };

  // 理解できた問題を削除
  const handleUnderstood = async () => {
    try {
      await removeWeakQuestion(currentQuestion.esperanto);
      // QuizQuestion を WeakQuestion として扱う（型を明示的にキャスト）
      const weakQuestion: WeakQuestion = {
        esperanto: currentQuestion.esperanto,
        japanese: currentQuestion.japanese,
        extra: currentQuestion.extra,
        addedAt: new Date(),
        incorrectCount: 1
      };
      setCorrectedQuestions(prev => [...prev, weakQuestion]);
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
        <QuizHeader
          title="📚 苦手問題復習"
          currentQuestion={currentIndex + 1}
          totalQuestions={reviewQuestions.length}
          subtitle="間違えた問題を復習しましょう"
          showModeToggle={true}
          modeToggleProps={{
            currentMode: quizMode,
            onModeChange: actions.setQuizMode
          }}
        />

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
            <div>
              <ChoiceButtons
                choices={choices}
                selectedAnswer={selectedAnswer}
                correctAnswer={currentQuestion.japanese}
                showResult={showResult}
                onChoiceClick={handleChoiceClick}
                instruction="この単語の意味を選んでください"
                loadingMessage="選択肢を生成中..."
              />

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