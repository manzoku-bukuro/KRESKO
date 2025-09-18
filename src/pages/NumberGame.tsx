import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Card {
  value: number;
  word: string;
}

const esperantoNumbers: Record<number, string> = {
  1: 'unu', 2: 'du', 3: 'tri', 4: 'kvar', 5: 'kvin',
  6: 'ses', 7: 'sep', 8: 'ok', 9: 'naŭ', 10: 'dek',
  100: 'cent', 1000: 'mil'
};

function NumberGame() {
  const navigate = useNavigate();
  const [targetNumber, setTargetNumber] = useState(2521);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [result, setResult] = useState<{ show: boolean; correct: boolean; message: string }>({
    show: false,
    correct: false,
    message: ''
  });

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 9000) + 1000; // 1000-9999の範囲
  };

  const numberToEsperanto = (num: number): number[] => {
    const parts: number[] = [];

    // 千の位
    if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      if (thousands > 1) {
        parts.push(thousands); // 2, 3, 4... など
      }
      parts.push(1000); // mil
      num %= 1000;
    }

    // 百の位
    if (num >= 100) {
      const hundreds = Math.floor(num / 100);
      if (hundreds === 1) {
        parts.push(100); // cent
      } else {
        parts.push(hundreds); // 2, 3, 4... など
        parts.push(100); // cent
      }
      num %= 100;
    }

    // 十の位
    if (num >= 20) {
      const tens = Math.floor(num / 10);
      parts.push(tens); // 2, 3, 4... など
      parts.push(10); // dek
      num %= 10;
    } else if (num >= 10) {
      parts.push(10); // dek (10-19の場合)
      num %= 10;
    }

    // 一の位
    if (num > 0) {
      parts.push(num);
    }

    return parts;
  };

  const createCards = () => {
    const cardData: Card[] = [
      {value: 1, word: 'unu'}, {value: 2, word: 'du'}, {value: 3, word: 'tri'},
      {value: 4, word: 'kvar'}, {value: 5, word: 'kvin'}, {value: 6, word: 'ses'},
      {value: 7, word: 'sep'}, {value: 8, word: 'ok'}, {value: 9, word: 'naŭ'},
      {value: 10, word: 'dek'}, {value: 100, word: 'cent'}, {value: 1000, word: 'mil'}
    ];

    // カードをシャッフル
    const shuffledCards = [...cardData].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
  };

  const selectCard = (value: number, word: string) => {
    setSelectedCards(prev => [...prev, { value, word }]);
    // 結果が表示されている場合は非表示にして再挑戦可能にする
    if (result.show) {
      setResult({ show: false, correct: false, message: '' });
    }
  };

  const removeCard = (index: number) => {
    setSelectedCards(prev => prev.filter((_, i) => i !== index));
    // 結果が表示されている場合は非表示にして再挑戦可能にする
    if (result.show) {
      setResult({ show: false, correct: false, message: '' });
    }
  };

  const clearSelection = () => {
    setSelectedCards([]);
    setResult({ show: false, correct: false, message: '' });
  };

  const checkAnswer = () => {
    const correctAnswer = numberToEsperanto(targetNumber);
    const userAnswer = selectedCards.map(card => card.value);

    // 順番も含めて正確に一致するかチェック
    const isCorrect = JSON.stringify(correctAnswer) === JSON.stringify(userAnswer);

    if (isCorrect) {
      setResult({
        show: true,
        correct: true,
        message: '🎉 正解です！素晴らしい！'
      });
    } else {
      const correctWords = correctAnswer.map(val => esperantoNumbers[val]);
      setResult({
        show: true,
        correct: false,
        message: `正解は: ${correctWords.join(' ')}`
      });
    }
  };

  const newGame = () => {
    const newNumber = generateRandomNumber();
    setTargetNumber(newNumber);
    clearSelection();
    createCards();
  };

  useEffect(() => {
    createCards();
  }, []);

  return (
    <div className="app-container">
      <div className="card number-game-container">
        <h1>🔢 数字当てゲーム</h1>
        <h2>エスペラント語で表現してください</h2>

        {/* Target Number */}
        <div className="target-number">
          {targetNumber}
        </div>

        {/* Selected Cards */}
        <div className="selected-cards-area">
          <h3>選択したカード:</h3>
          <div className="selected-cards">
            {selectedCards.map((card, index) => (
              <span
                key={index}
                className="selected-card-chip"
                onClick={() => removeCard(index)}
              >
                {card.word}
              </span>
            ))}
            {selectedCards.length === 0 && (
              <p className="empty-selection">カードを選択してください</p>
            )}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="number-cards-grid">
          {cards.map((card, index) => (
            <button
              key={index}
              className="btn number-card"
              onClick={() => selectCard(card.value, card.word)}
            >
              {card.word}
            </button>
          ))}
        </div>

        {/* Result */}
        {result.show && (
          <div className={`game-result ${result.correct ? 'correct' : 'wrong'}`}>
            {result.message}
          </div>
        )}


        {/* Action Buttons */}
        <div className="game-actions">
          {!result.show && (
            <button
              className="btn btn-primary btn-large"
              onClick={checkAnswer}
              disabled={selectedCards.length === 0}
            >
              📝 答えをチェック
            </button>
          )}

          <button
            className="btn btn-secondary"
            onClick={clearSelection}
            disabled={selectedCards.length === 0 && !result.show}
          >
            🗑️ 選択をクリア
          </button>

          <button
            className="btn btn-accent"
            onClick={newGame}
          >
            🎲 新しい問題
          </button>
        </div>

        <button
          className="btn btn-secondary btn-small"
          onClick={() => navigate("/")}
        >
          ← トップに戻る
        </button>
      </div>
    </div>
  );
}

export default NumberGame;