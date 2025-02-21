import React from "react";
import { Outlet } from "react-router-dom";
import MenuTopBar from "./components/MenuTopBar";

const StudyMainScreen = () => {
  return (
    <>
      <div className="min-h-screen relative bg-cover bg-fixed bg-center bg-no-repeat bg-[url('/public/images/background_page_1.png')]">
        {/* <div className="min-h-screen relative bg-[#b2c4a9]"> */}
        <div className="w-full flex justify-center items-center flex-col gap-[2rem] ">
          <div className="w-full flex justify-center items-center flex-col pt-8">
            <MenuTopBar />
          </div>

          <Outlet />
        </div>

        <img
          className="w-1/7 fixed bottom-0 left-1/90"
          src="/images/rabbit_one.png"
          alt=""
        />

        <img
          className="w-1/8 fixed bottom-0 right-1/90"
          src="/images/rabbit_three.png"
          alt=""
        />
      </div>
    </>
  );
};

export default StudyMainScreen;
