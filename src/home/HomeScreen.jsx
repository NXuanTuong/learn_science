import React from "react";
import MainScreen from "./components/MainScreen";
import NavBar from "./components/NavBar";

const HomeScreen = () => {
  return (
    <>
      <div className="bg-[#b2c4a9]">
        <div className="w-full h-screen bg-[#b2c4a9]">
          <div className="w-full bg-[#b2c4a9] flex justify-center items-center flex-col overflow-auto py-12">
            <NavBar />
            <MainScreen />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeScreen;
