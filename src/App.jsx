import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import RegistrationScreen from "./auth/registration/RegistrationScreen";
import SignInScreen from "./auth/sign-in/SignInScreen";
import HomeScreen from "./home/HomeScreen";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<HomeScreen />} />
        <Route path="/dang_ky" element={<RegistrationScreen />} />
        <Route path="/dang_nhap" element={<SignInScreen />} />
      </Routes>
    </>
  );
}

export default App;
