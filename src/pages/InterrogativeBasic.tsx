import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updatePageMeta, seoData } from "../utils/seo";
import { UnifiedQuiz } from "../components/UnifiedQuiz";
import type { QuizQuestion } from "../hooks";

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

  useEffect(() => {
    updatePageMeta(seoData.interrogativeBasic.title, seoData.interrogativeBasic.description);
  }, []);

  return (
    <UnifiedQuiz
      questions={interrogativeQuestions}
      metadata={{
        title: "❓ 疑問詞 - 基本学習",
        subtitle: "疑問詞の意味を覚える練習問題",
        backButtonText: "← メニューに戻る",
        backButtonPath: "/interrogative-menu"
      }}
      engineConfig={{
        initialMode: 'multiple-choice',
        shuffleQuestions: true,
        enableIncorrectTracking: false,
        choiceGeneration: {
          choiceCount: 4,
          generateFromPool: () => interrogativeWords.map(w => w.meaning)
        }
      }}
      completionConfig={{
        title: "完了！",
        subtitle: "基本学習が完了しました！",
        showWordList: true,
        wordListTitle: "学習した疑問詞一覧",
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

export default InterrogativeBasic;