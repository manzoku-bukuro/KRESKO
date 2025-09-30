import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import vortaro from "../data/vortaro.json";
import esuken4 from "../data/esuken4.json";
import { useAuth } from "../contexts/AuthContext";
import { saveWeakQuestion } from "../utils/firestore";
import { UnifiedQuiz } from "../components/UnifiedQuiz";
import type { QuizQuestion } from "../hooks";

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

  // クイズの質問データを準備
  const quizQuestions: QuizQuestion[] = slice.map(word => ({
    esperanto: word.esperanto,
    japanese: word.japanese,
    extra: word.extra
  }));

  // 苦手問題をマーク
  const markAsWeak = async (currentQuestion: QuizQuestion) => {
    if (user) {
      try {
        await saveWeakQuestion({
          esperanto: currentQuestion.esperanto,
          japanese: currentQuestion.japanese,
          extra: currentQuestion.extra
        });
      } catch (error) {
        console.error('苦手問題の保存に失敗:', error);
      }
    }
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
      <UnifiedQuiz
        questions={[]}
        metadata={{
          title: "⚠️ エラー",
          subtitle: dataError,
          backButtonText: "🏠 ホームに戻る",
          backButtonPath: "/"
        }}
        error={dataError}
        errorConfig={{
          title: "エラー",
          message: dataError,
          onAction: () => navigate('/'),
          actionLabel: "🏠 ホームに戻る"
        }}
        onQuizExit={() => navigate('/')}
      />
    );
  }

  return (
    <UnifiedQuiz
      questions={quizQuestions}
      metadata={{
        title: `${getCategoryEmoji(category!)} ${getCategoryName(category!)}`,
        subtitle: `範囲: ${rangeStart} - ${Math.min(Number(rangeStart) + Number(rangeSize) - 1, words.length)}`,
        backButtonText: "← 範囲選択に戻る",
        backButtonPath: `/range/${category}`
      }}
      engineConfig={{
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
          await markAsWeak(question);
        }
      }}
      completionConfig={{
        title: "完了！",
        subtitle: "この範囲の学習が完了しました！",
        showWordList: true,
        wordListTitle: "学習した単語一覧",
        onRestart: () => window.location.reload(),
        restartButtonText: "🔄 同じ範囲をもう一度",
        additionalActions: [
          {
            label: "➡️ 次の範囲へ進む",
            variant: "accent",
            onClick: handleNextRange
          }
        ]
      }}
      customActions={[
        ...(user ? [{
          id: "mark-weak",
          label: "💾 苦手に登録",
          variant: "secondary" as const,
          condition: "traditional-only" as const,
          position: "after-result" as const,
          onClick: async (currentQuestion: QuizQuestion) => {
            await markAsWeak(currentQuestion);
          }
        }, {
          id: "mark-weak-choice",
          label: "💾 苦手に登録",
          variant: "secondary" as const,
          condition: "choice-only" as const,
          position: "after-result" as const,
          onClick: async (currentQuestion: QuizQuestion) => {
            await markAsWeak(currentQuestion);
          }
        }] : [])
      ]}
      onQuizExit={() => navigate(`/range/${category}`)}
    />
  );
}

export default Quiz;