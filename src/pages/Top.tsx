import { useNavigate } from "react-router-dom";

function Top() {
  const navigate = useNavigate();

  return (
    <div className="group-selection-card">
      <h1>KRESKO</h1>
      <h2>カテゴリを選択</h2>
      <button onClick={() => navigate("/range/drill")}>ドリル式</button>
      <button onClick={() => navigate("/range/esuken4")}>エス検4級</button>
    </div>
  );
}

export default Top;