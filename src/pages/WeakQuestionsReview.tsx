import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getWeakQuestions, removeWeakQuestion, type WeakQuestion } from '../utils/firestore';
import { UnifiedQuiz } from '../components/UnifiedQuiz';
import type { QuizQuestion } from '../hooks';

const WeakQuestionsReview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allWeakQuestions, setAllWeakQuestions] = useState<WeakQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setCorrectedQuestions] = useState<WeakQuestion[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  // 苦手問題を取得してランダムに10問選択
  useEffect(() => {
    const fetchWeakQuestions = async () => {
      if (!user) {
        setError("ログインが必要です");
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

        // WeakQuestion を QuizQuestion 形式に変換
        const convertedQuestions: QuizQuestion[] = selected.map(q => ({
          esperanto: q.esperanto,
          japanese: q.japanese,
          extra: q.extra
        }));

        setQuizQuestions(convertedQuestions);
      } catch (error) {
        console.error('苦手問題の取得に失敗:', error);
        setError("苦手問題の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchWeakQuestions();
  }, [user]);

  // 理解できた問題を削除
  const handleUnderstood = async (currentQuestion: QuizQuestion) => {
    try {
      await removeWeakQuestion(currentQuestion.esperanto);
      const weakQuestion: WeakQuestion = {
        esperanto: currentQuestion.esperanto,
        japanese: currentQuestion.japanese,
        extra: currentQuestion.extra,
        addedAt: new Date(),
        incorrectCount: 1
      };
      setCorrectedQuestions(prev => [...prev, weakQuestion]);
    } catch (error) {
      console.error('苦手問題の削除に失敗:', error);
    }
  };

  // 苦手問題がない場合の表示
  if (!loading && !error && allWeakQuestions.length === 0) {
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

  return (
    <UnifiedQuiz
      questions={quizQuestions}
      metadata={{
        title: "📚 苦手問題復習",
        subtitle: "間違えた問題を復習しましょう",
        backButtonText: "← 苦手問題一覧に戻る",
        backButtonPath: "/weak-questions"
      }}
      loading={loading}
      loadingConfig={{
        message: "問題を準備中...",
        showSpinner: true
      }}
      error={error || undefined}
      errorConfig={{
        title: "エラー",
        message: error || "",
        onAction: () => navigate('/'),
        actionLabel: "🏠 ホームに戻る"
      }}
      engineConfig={{
        initialMode: 'multiple-choice',
        maxQuestions: 10,
        shuffleQuestions: false, // 既にランダムに選択済み
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
      }}
      completionConfig={{
        title: "復習完了！",
        subtitle: "苦手問題復習が完了しました！",
        showWordList: true,
        wordListTitle: "学習した問題一覧",
        onRestart: () => window.location.reload(),
        restartButtonText: "🔄 もう一度復習"
      }}
      customActions={[
        {
          id: "understood-traditional",
          label: "✅ 理解できた（苦手問題から削除）",
          variant: "success",
          condition: "traditional-only",
          position: "after-result",
          onClick: handleUnderstood
        },
        {
          id: "understood-choice",
          label: "✅ 理解できた（苦手問題から削除）",
          variant: "success",
          condition: "choice-only",
          position: "after-result",
          onClick: handleUnderstood
        }
      ]}
      onQuizComplete={() => {
        // 完了時の処理（必要に応じて追加）
      }}
      onQuizExit={() => navigate('/weak-questions')}
    />
  );
};

export default WeakQuestionsReview;