import React, { useState } from "react";
import { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { getGradeUnit } from "../../config/unit";
import { getLesson } from "../../store/lessonSlice";
import MenuTopBar from "./components/MenuTopBar";

const StudyMainScreen = ({ listUnit }) => {
  const cookie = new Cookies();
  const token = cookie.get("signin_user");
  const dispath = useDispatch();
  const navigate = useNavigate();
  const [video, setVideo] = useState();
  useEffect(() => {
    async function getUnit() {
      dispath(
        getLesson({
          lessonId: "67b4a51e89de4c93cd4ac3e1",
          token,
        })
      );
    }

    getUnit();
  }, []);

  // /public/images/background1.jpg
  return (
    <>
      <div
        className={`min-h-screen relative bg-cover bg-fixed bg-center bg-no-repeat ${
          localStorage.getItem("lessonName") !== null
            ? localStorage.getItem("lessonName") === "Năng lượng"
              ? "bg-[url('/public/images/backgroundUnitNăngLượng.jpg')]"
              : "bg-[url('/public/images/background_page_1.png')]"
            : "bg-[url('/public/images/background1.jpg')]"
        }`}
      >
        {/* <div className="min-h-screen relative bg-[#b2c4a9]"> */}
        <div className="pt-10 pl-10">
          <button
            onClick={() => navigate("/chon_khoi")}
            className="fixed z-100 cursor-pointer px-6 py-2 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110"
          >
            {localStorage.getItem("grade")
              ? localStorage.getItem("grade")
              : "Chọn khối"}
          </button>
        </div>

        <div className="w-full flex items-center flex-col gap-[2rem]">
          <div className="w-full flex justify-center items-center flex-col pt-8">
            <MenuTopBar />
          </div>

          <div className="pb-8 w-full flex justify-center items-center">
            <Outlet />
          </div>
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

function mapStateToProps(state) {
  return {
    listUnit: state.lesson.listUnit,
  };
}

export default connect(mapStateToProps)(StudyMainScreen);
