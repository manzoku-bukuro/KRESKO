import { useParams, useNavigate } from "react-router-dom";
import vortaro from "../data/vortaro.json";
import esuken4 from "../data/esuken4.json";

function RangeSelect() {
  const { category } = useParams();
  const navigate = useNavigate();

  // 単語数
  let total = 0;
  if (category === "drill") total = vortaro.length;
  if (category === "esuken4") total = esuken4.length;

  const makeOptions = (size: number) => {
    const arr = [];
    for (let i = 0; i < total; i += size) {
      arr.push({ start: i + 1, size });
    }
    return arr;
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

  return (
    <div className="app-container">
      <div className="card range-selection">
        <h1>{getCategoryEmoji(category!)} {getCategoryName(category!)}</h1>
        <h2>範囲を選択 (全{total}語)</h2>

        <div className="range-section">
          <h3>📝 10個ずつ</h3>
          <div className="range-grid">
            {makeOptions(10).map((o, idx) => (
              <button
                key={idx}
                className="btn btn-secondary"
                onClick={() => navigate(`/quiz/${category}/${o.start}/${o.size}`)}
              >
                {o.start} - {Math.min(o.start + o.size - 1, total)}
              </button>
            ))}
          </div>
        </div>

        <div className="range-section">
          <h3>📋 100個ずつ</h3>
          <div className="range-grid">
            {makeOptions(100).map((o, idx) => (
              <button
                key={idx}
                className="btn btn-secondary"
                onClick={() => navigate(`/quiz/${category}/${o.start}/${o.size}`)}
              >
                {o.start} - {Math.min(o.start + o.size - 1, total)}
              </button>
            ))}
          </div>
        </div>

        <div className="range-section">
          <button
            className="btn btn-primary btn-large btn-full"
            onClick={() => navigate(`/quiz/${category}/1/${total}`)}
          >
            🎯 全部チャレンジ ({total}語)
          </button>
        </div>

        <button
          className="btn btn-accent"
          onClick={() => navigate("/")}
        >
          ← カテゴリに戻る
        </button>
      </div>
    </div>
  );
}

export default RangeSelect;