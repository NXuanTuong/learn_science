import { Route, Routes } from "react-router-dom";
import RegistrationScreen from "./layouts/auth/registration/RegistrationScreen";
import SignInScreen from "./layouts/auth/sign-in/SignInScreen";
import HomeScreen from "./layouts/home/HomeScreen";
import PracticeQuestionMainScreen from "./layouts/practice_question/PracticeQuestionMainScreen";
import PracticeExercises from "./layouts/study_screen/PracticeExercises";
import ScientificDiscovery from "./layouts/study_screen/ScientificDiscovery";
import StudyMainScreen from "./layouts/study_screen/StudyMainScreen";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<HomeScreen />} />
        <Route path="/dang_ky" element={<RegistrationScreen />} />
        <Route path="/dang_nhap" element={<SignInScreen />} />
        <Route path="/trang_hoc_chinh" element={<StudyMainScreen />}>
          <Route index element={<ScientificDiscovery />} />
          <Route path="luyen_tap_thuc_hanh" element={<PracticeExercises />} />
        </Route>
        <Route
          path="/cau_hoi_luyen_tap"
          element={<PracticeQuestionMainScreen />}
        />
      </Routes>
    </>
  );
}

export default App;
