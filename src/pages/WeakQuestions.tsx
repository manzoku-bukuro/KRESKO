import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getWeakQuestions, removeWeakQuestion, type WeakQuestion } from '../utils/firestore';

const WeakQuestions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [weakQuestions, setWeakQuestions] = useState<WeakQuestion[]>([]);
  const [loading, setLoading] = useState(true);

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
  const handleRemoveQuestion = async (esperanto: string) => {
    try {
      await removeWeakQuestion(esperanto);
      setWeakQuestions(prev =>
        prev.filter(q => q.esperanto !== esperanto)
      );
    } catch (error) {
      console.error('苦手問題の削除に失敗:', error);
    }
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

        {/* 苦手問題リスト */}
        <div className="weak-questions-list">
          {weakQuestions.map((question, index) => (
            <div key={question.esperanto} className="weak-question-item">
              <div className="question-header">
                <span className="question-number">#{index + 1}</span>
                <span className="incorrect-count">
                  ❌ {question.incorrectCount}回
                </span>
              </div>

              <div className="question-content">
                <p className="esperanto-word">{question.esperanto}</p>
                <div className="answer-content">
                  <p className="japanese-word">{question.japanese}</p>
                  {question.extra && (
                    <p className="japanese-extra">{question.extra}</p>
                  )}
                </div>
              </div>

              <div className="question-actions">
                <button
                  className="btn btn-small btn-success"
                  onClick={() => handleRemoveQuestion(question.esperanto)}
                >
                  ✅ 理解できた
                </button>
              </div>
            </div>
          ))}
        </div>


        {/* ボタン */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {weakQuestions.length >= 1 && (
            <button
              className="btn btn-primary"
              onClick={() => navigate('/weak-questions-review')}
            >
              🎯 復習クイズ（ランダム10問）
            </button>
          )}
          <button
            className="btn btn-secondary"
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