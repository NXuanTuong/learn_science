import { Route, Routes } from "react-router-dom";
import AchievementScreen from "./layouts/achievement/AchievementScreen";
import RegistrationScreen from "./layouts/auth/registration/RegistrationScreen";
import SignInScreen from "./layouts/auth/sign-in/SignInScreen";
import ChooseGradesMainScreen from "./layouts/choice_grade/ChoiceGradesMainScreen";
import HomeScreen from "./layouts/home/HomeScreen";
import PracticeQuestionMainScreen from "./layouts/practice_question/PracticeQuestionMainScreen";
import PracticeQuizMainScreen from "./layouts/practice_quiz/PracticeQuizMainScreen";
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
          <Route path="thanh_tich" element={<AchievementScreen />} />
        </Route>

        <Route path="/chon_khoi" element={<ChooseGradesMainScreen />} />

        <Route
          path="/cau_hoi_luyen_tap"
          element={<PracticeQuestionMainScreen />}
        />
        <Route
          path="/bai_kiem_tra_thuc_hanh"
          element={<PracticeQuizMainScreen />}
        />
      </Routes>
    </>
  );
}

export default App;
