import { useState, useEffect } from 'react';
import './index.css';
// vortaro.jsonファイルをインポート
import vocabulary from './data/vortaro.json';

// 単語の型を定義（TypeScriptの恩恵）
interface Word {
  esperanto: string;
  japanese: string;
}

// 出題数
const QUIZ_COUNT = 10;

function App() {
  // ステートを管理
  const [questions, setQuestions] = useState<Word[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  // 回答が表示されているかどうかのステート
  const [isAnswerShown, setIsAnswerShown] = useState(false);

  // クイズの開始（シャッフルして10問選ぶ）
  const startQuiz = () => {
    const shuffled = [...vocabulary].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, QUIZ_COUNT));
    setCurrentQuestionIndex(0);
    setIsQuizFinished(false);
    setIsAnswerShown(false);
  };

  // アプリがマウントされたときにクイズを開始
  useEffect(() => {
    startQuiz();
  }, []);

  // 「回答を表示」ボタンのクリックハンドラ
  const showAnswer = () => {
    setIsAnswerShown(true);
  };

  // 「次の問題へ」ボタンのクリックハンドラ
  const nextQuestion = () => {
    // 最後の問題かどうかをチェック
    if (currentQuestionIndex < QUIZ_COUNT - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswerShown(false); // 次の問題のために回答表示をリセット
    } else {
      setIsQuizFinished(true); // 全問終了
    }
  };

  // JSXのレンダリング
  return (
    <div className="app-container">
      <h1>KRESKO</h1>
      {!isQuizFinished ? (
        <div className="quiz-card">
          <h2>問題 {currentQuestionIndex + 1} / {QUIZ_COUNT}</h2>
          <p className="esperanto-word">{questions[currentQuestionIndex]?.esperanto}</p>

          {!isAnswerShown ? (
            // 回答がまだ表示されていなければ「回答を表示」ボタンを表示
            <button onClick={showAnswer}>回答を表示</button>
          ) : (
            // 回答が表示されていれば、日本語訳と「次の問題へ」ボタンを表示
            <div>
              <p className="japanese-word">{questions[currentQuestionIndex]?.japanese}</p>
              <button onClick={nextQuestion}>次の問題へ</button>
            </div>
          )}
        </div>
      ) : (
        <div className="result-card">
          <h2>クイズ終了！</h2>
          <p>お疲れ様でした！</p>
          <button onClick={startQuiz}>もう一度挑戦する</button>
        </div>
      )}
    </div>
  );
}

export default App;