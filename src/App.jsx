import { Route, Routes } from "react-router-dom";
import RegistrationScreen from "./layouts/auth/registration/RegistrationScreen";
import SignInScreen from "./layouts/auth/sign-in/SignInScreen";
import HomeScreen from "./layouts/home/HomeScreen";
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
      </Routes>
    </>
  );
}

export default App;
