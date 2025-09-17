import { Routes, Route } from "react-router-dom";
import Top from "./pages/Top";
import RangeSelect from "./pages/RangeSelect";
import Quiz from "./pages/Quiz";
import NumberGame from "./pages/NumberGame";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Top />} />
      <Route path="/range/:category" element={<RangeSelect />} />
      <Route path="/quiz/:category/:rangeStart/:rangeSize" element={<Quiz />} />
      <Route path="/number-game" element={<NumberGame />} />
    </Routes>
  );
}

export default App;