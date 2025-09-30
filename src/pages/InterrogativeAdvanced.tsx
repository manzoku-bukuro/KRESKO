import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import interrogativeQuestionsData from "../data/interrogative-questions.json";
import { updatePageMeta, seoData } from "../utils/seo";
import { UnifiedQuiz } from "../components/UnifiedQuiz";
import type { QuizQuestion } from "../hooks";

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

  useEffect(() => {
    updatePageMeta(seoData.interrogativeAdvanced.title, seoData.interrogativeAdvanced.description);
  }, []);

  return (
    <UnifiedQuiz
      questions={quizQuestions}
      metadata={{
        title: "❓ 疑問詞 - 応用問題",
        subtitle: "日本語文の穴埋めで疑問詞を選択する実践問題",
        backButtonText: "← メニューに戻る",
        backButtonPath: "/interrogative-menu"
      }}
      engineConfig={{
        initialMode: 'multiple-choice',
        maxQuestions: 5,
        shuffleQuestions: true,
        enableIncorrectTracking: false,
        choiceGeneration: {
          choiceCount: 4,
          generateFromPool: (questions) => {
            // 選択肢は各問題の blanks から生成
            return questions.flatMap(q => q.blanks || []);
          }
        }
      }}
      completionConfig={{
        title: "完了！",
        subtitle: "応用問題が完了しました！",
        showWordList: true,
        wordListTitle: "学習した問題一覧",
        additionalActions: [
          {
            label: "📋 メニューに戻る",
            variant: "secondary",
            onClick: () => navigate("/interrogative-menu")
          }
        ]
      }}
      onQuizExit={() => navigate("/interrogative-menu")}
    />
  );
}

export default InterrogativeAdvanced;