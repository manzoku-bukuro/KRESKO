import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { AuthButton } from "../components/AuthButton";
import { updatePageMeta, seoData } from "../utils/seo";
import { useAuth } from "../contexts/AuthContext";
import { getWeakQuestions } from "../utils/firestore";

function Top() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [weakQuestionsCount, setWeakQuestionsCount] = useState<number>(0);

  useEffect(() => {
    updatePageMeta(seoData.home.title, seoData.home.description);
  }, []);

  // 苦手問題数を取得
  useEffect(() => {
    const fetchWeakQuestionsCount = async () => {
      if (user) {
        try {
          const weakQuestions = await getWeakQuestions();
          setWeakQuestionsCount(weakQuestions.length);
        } catch (error) {
          console.error('苦手問題数の取得に失敗:', error);
        }
      } else {
        setWeakQuestionsCount(0);
      }
    };

    fetchWeakQuestionsCount();
  }, [user]);

  return (
    <>
      <div className="app-container">
        <div className="card category-selection">
          <div className="header-with-auth">
            <div>
              <h1>MEMORU</h1>
              <h2>カテゴリを選択</h2>
            </div>
            <AuthButton />
          </div>
          <div className="category-buttons">
            <button
              className="btn btn-primary btn-large btn-full"
              onClick={() => navigate("/range/esuken4")}
            >
              🏆 エス検4級
            </button>
            <button
              className="btn btn-secondary btn-large btn-full"
              onClick={() => navigate("/interrogative-menu")}
            >
              ❓ 疑問詞
            </button>
            <button
              className="btn btn-accent btn-large btn-full"
              onClick={() => navigate("/number-game")}
            >
              🔢 数字当てゲーム
            </button>

            {user && (
              <button
                className="btn btn-outline btn-large btn-full"
                onClick={() => navigate("/weak-questions")}
                style={{
                  marginTop: '1rem',
                  borderTop: '1px solid #e0e0e0',
                  paddingTop: '1rem'
                }}
              >
                📚 苦手問題を復習
                {weakQuestionsCount > 0 && (
                  <span className="badge" style={{
                    marginLeft: '0.5rem',
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {weakQuestionsCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Top;