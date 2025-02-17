import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import HomeScreen from "./home/HomeScreen";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route index element={<HomeScreen />} />
      </Routes>
    </>
  );
}

export default App;
