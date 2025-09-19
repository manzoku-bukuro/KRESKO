import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";

function Top() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showDrill = searchParams.get('custom') === 'drill';

  return (
    <>
      <div className="app-container">
        <div className="card category-selection">
          <h1>KRESKO</h1>
          <h2>カテゴリを選択</h2>
          <div className="category-buttons">
            {showDrill && (
              <button
                className="btn btn-primary btn-large btn-full"
                onClick={() => navigate("/range/drill")}
              >
                📚 ドリル式
              </button>
            )}
            <button
              className="btn btn-primary btn-large btn-full"
              onClick={() => navigate("/range/esuken4")}
            >
              🏆 エス検4級
            </button>
            <button
              className="btn btn-accent btn-large btn-full"
              onClick={() => navigate("/number-game")}
            >
              🔢 数字当てゲーム
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Top;