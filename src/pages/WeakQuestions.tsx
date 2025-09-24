import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getWeakQuestions, removeWeakQuestion, type WeakQuestion } from '../utils/firestore';

const WeakQuestions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [weakQuestions, setWeakQuestions] = useState<WeakQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAnswer, setShowAnswer] = useState<{[key: string]: boolean}>({});

  // 苦手問題を取得
  useEffect(() => {
    const fetchWeakQuestions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const questions = await getWeakQuestions();
        setWeakQuestions(questions);
      } catch (error) {
        console.error('苦手問題の取得に失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeakQuestions();
  }, [user]);

  // 理解できた問題を削除
  const handleRemoveQuestion = async (esperanto: string, category: string) => {
    try {
      await removeWeakQuestion(esperanto, category);
      setWeakQuestions(prev =>
        prev.filter(q => !(q.esperanto === esperanto && q.category === category))
      );
    } catch (error) {
      console.error('苦手問題の削除に失敗:', error);
    }
  };

  // 回答の表示/非表示を切り替え
  const toggleAnswer = (questionKey: string) => {
    setShowAnswer(prev => ({
      ...prev,
      [questionKey]: !prev[questionKey]
    }));
  };

  // ログインしていない場合
  if (!user) {
    return (
      <div className="app-container">
        <div className="card">
          <h1>🔐 ログインが必要です</h1>
          <p>苦手問題を確認するには、ログインまたは新規登録をしてください。</p>
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
          <h1>📚 苦手問題</h1>
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  // フィルタリング
  const filteredQuestions = selectedCategory === 'all'
    ? weakQuestions
    : weakQuestions.filter(q => q.category === selectedCategory);

  // カテゴリー一覧を取得
  const categories = ['all', ...Array.from(new Set(weakQuestions.map(q => q.category)))];

  // 苦手問題がない場合
  if (weakQuestions.length === 0) {
    return (
      <div className="app-container">
        <div className="card">
          <h1>📚 苦手問題</h1>
          <div className="empty-state">
            <p>🎉 素晴らしい！</p>
            <p>現在、苦手問題はありません。</p>
            <p>クイズで間違えた問題が自動的にここに保存されます。</p>
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
    <div className="app-container">
      <div className="card">
        <h1>📚 苦手問題</h1>
        <p className="subtitle">間違えた問題を復習しましょう（{weakQuestions.length}問）</p>

        {/* カテゴリーフィルター */}
        <div className="category-filter" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            📂 カテゴリー：
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
            style={{
              padding: '0.5rem',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              width: '200px'
            }}
          >
            <option value="all">すべて ({weakQuestions.length})</option>
            {categories.filter(cat => cat !== 'all').map(category => {
              const count = weakQuestions.filter(q => q.category === category).length;
              const displayName = category === 'esuken4' ? 'エス検4級' : category;
              return (
                <option key={category} value={category}>
                  {displayName} ({count})
                </option>
              );
            })}
          </select>
        </div>

        {/* 苦手問題リスト */}
        <div className="weak-questions-list">
          {filteredQuestions.map((question, index) => {
            const questionKey = `${question.esperanto}-${question.category}`;
            const isAnswerVisible = showAnswer[questionKey] || false;

            return (
              <div key={questionKey} className="weak-question-item">
                <div className="question-header">
                  <span className="question-number">#{index + 1}</span>
                  <span className="category-badge">
                    {question.category === 'esuken4' ? 'エス検4級' : question.category}
                  </span>
                  <span className="incorrect-count">
                    ❌ {question.incorrectCount}回
                  </span>
                </div>

                <div className="question-content">
                  <p className="esperanto-word">{question.esperanto}</p>

                  {isAnswerVisible && (
                    <div className="answer-content">
                      <p className="japanese-word">{question.japanese}</p>
                      {question.extra && (
                        <p className="japanese-extra">{question.extra}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="question-actions">
                  <button
                    className={`btn btn-small ${isAnswerVisible ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => toggleAnswer(questionKey)}
                  >
                    {isAnswerVisible ? '👁️ 答えを隠す' : '👁️ 答えを表示'}
                  </button>

                  {isAnswerVisible && (
                    <button
                      className="btn btn-small btn-success"
                      onClick={() => handleRemoveQuestion(question.esperanto, question.category)}
                    >
                      ✅ 理解できた
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* フィルター結果が空の場合 */}
        {filteredQuestions.length === 0 && selectedCategory !== 'all' && (
          <div className="empty-filter">
            <p>選択したカテゴリーに苦手問題はありません。</p>
          </div>
        )}

        {/* ボタン */}
        <div style={{ marginTop: '2rem' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            🏠 ホームに戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeakQuestions;