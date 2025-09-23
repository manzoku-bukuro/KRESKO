import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function Top() {
  const navigate = useNavigate();

  return (
    <>
      <div className="app-container">
        <div className="card category-selection">
          <h1>MEMORU</h1>
          <h2>カテゴリを選択</h2>
          <div className="category-buttons">
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