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

  return (
    <div className="group-selection-card">
      <h2>範囲を選択 ({category})</h2>
      <h3>10個ずつ</h3>
      {makeOptions(10).map((o, idx) => (
        <button key={idx} onClick={() => navigate(`/quiz/${category}/${o.start}/${o.size}`)}>
          {o.start} - {Math.min(o.start + o.size - 1, total)}
        </button>
      ))}
      <h3>100個ずつ</h3>
      {makeOptions(100).map((o, idx) => (
        <button key={idx} onClick={() => navigate(`/quiz/${category}/${o.start}/${o.size}`)}>
          {o.start} - {Math.min(o.start + o.size - 1, total)}
        </button>
      ))}
      <button onClick={() => navigate(`/quiz/${category}/1/${total}`)}>全部 ({total})</button>
      <button onClick={() => navigate("/")}>カテゴリに戻る</button>
    </div>
  );
}

export default RangeSelect;