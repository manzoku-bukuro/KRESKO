import { Routes, Route } from "react-router-dom";
import Top from "./pages/Top";
import RangeSelect from "./pages/RangeSelect";
import Quiz from "./pages/Quiz";
import NumberGame from "./pages/NumberGame";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import InterrogativeLevel from "./pages/InterrogativeLevel";
import InterrogativeBasic from "./pages/InterrogativeBasic";
import InterrogativeAdvanced from "./pages/InterrogativeAdvanced";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Top />} />
      <Route path="/range/:category" element={<RangeSelect />} />
      <Route path="/quiz/:category/:rangeStart/:rangeSize" element={<Quiz />} />
      <Route path="/number-game" element={<NumberGame />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/interrogative-level" element={<InterrogativeLevel />} />
      <Route path="/interrogative-basic" element={<InterrogativeBasic />} />
      <Route path="/interrogative-advanced" element={<InterrogativeAdvanced />} />
    </Routes>
  );
}

export default App;