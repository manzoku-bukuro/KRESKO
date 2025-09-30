import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Top from "./pages/Top";
import RangeSelect from "./pages/Exam/RangeSelect";
import Quiz from "./pages/Exam/Quiz";
import NumberGame from "./pages/NumberGame";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import InterrogativeMenu from "./pages/Topics/Interrogative/Menu";
import InterrogativeExplanation from "./pages/Topics/Interrogative/Explanation";
import InterrogativeBasic from "./pages/Topics/Interrogative/Basic";
import InterrogativeAdvanced from "./pages/Topics/Interrogative/Advanced";
import WeakQuestions from "./pages/SavedQuestions/List";
import WeakQuestionsReview from "./pages/SavedQuestions/Review";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/range/:category" element={<RangeSelect />} />
        <Route path="/quiz/:category/:rangeStart/:rangeSize" element={<Quiz />} />
        <Route path="/number-game" element={<NumberGame />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/interrogative-menu" element={<InterrogativeMenu />} />
        <Route path="/interrogative-explanation" element={<InterrogativeExplanation />} />
        <Route path="/interrogative-basic" element={<InterrogativeBasic />} />
        <Route path="/interrogative-advanced" element={<InterrogativeAdvanced />} />
        <Route path="/weak-questions" element={<WeakQuestions />} />
        <Route path="/weak-questions-review" element={<WeakQuestionsReview />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;