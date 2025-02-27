import { connect, useDispatch } from "react-redux";
import { getLessonQuestion } from "../../store/listQuestionSlice";
import Cookies from "universal-cookie";
import "./practice.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PracticeExercises = () => {
  const navigate = useNavigate();

  const handleGetListQuestions = async () => {
    try {
      localStorage.setItem(
        "practiceName",
        "Bài Tập về Khoa Học, Thực Vật, Động Vật..."
      );
      navigate("/cau_hoi_luyen_tap");
    } catch (error) {
      console.log("Lỗi API:", error);
    }
  };

  useEffect(() => {
    if (location.pathname !== "/cau_hoi_luyen_tap") {
      localStorage.clear();
    }
  }, [location.pathname]);

  return (
    <>
      <div className="flex flex-row justify-center items-center gap-[2rem]">
        <div
          className={
            "w-[17.75rem] h-[25.5rem] cursor-pointer rounded-xl bg-[#fafbfc] flex flex-col justify-center items-center gap-[1rem] border border-[#004a37] rounded-xl shadow-[2px_4px_0_0_#004a37] transition-all duration-300 hover:drop-shadow-[4px_4px_10px_#004a37] hover:-translate-y-1"
          }
        >
          <div className="flex flex-col justify-center items-center gap-[1.25rem]">
            <div className="w-full h-[11.75rem] ">
              <img
                className="object-cover w-full h-full rounded-xl"
                src="/images/background_register.png"
                alt=""
              />
            </div>

            <p className="px-[1.5rem] font-bold text-xl text-[#004a37]">
              Bài Tập về Khoa Học, Thực Vật, Động Vật...
            </p>

            <button
              onClick={handleGetListQuestions}
              className="cursor-pointer w-[9rem] h-[2.5rem] rounded-full bg-[#ff6379] text-white uppercase text-[0.9rem] font-bold leading-none transition-all duration-300 ease-in-out transform hover:bg-[#006a4e] hover:scale-105 hover:opacity-90"
            >
              Làm Ngay
            </button>
          </div>

          <div className="flex flex-row justify-between items-center w-full px-[1rem] bg-[#004a37] rounded-b-md h-full">
            <span className="flex justify-center items-center w-[6.125rem]">
              <p className="text-white uppercase text-base font-bold leading-none">
                Kết quả lần trước
              </p>
            </span>

            <span className="flex justify-center items-center w-[5.125rem] h-[2rem]">
              <p className="text-white uppercase text-base font-bold">
                <span className="text-4xl">0</span> /10
              </p>
            </span>
          </div>
        </div>
        <div
          className={
            "w-[17.75rem] h-[25.5rem] cursor-pointer rounded-xl bg-[#fafbfc] flex flex-col justify-center items-center gap-[1rem] border border-[#004a37] rounded-xl shadow-[2px_4px_0_0_#004a37] transition-all duration-300 hover:drop-shadow-[4px_4px_10px_#004a37] hover:-translate-y-1"
          }
        >
          <div className="flex flex-col justify-center items-center gap-[1.25rem]">
            <div className="w-full h-[11.75rem] ">
              <img
                className="object-cover w-full h-full rounded-xl"
                src="/images/background_register.png"
                alt=""
              />
            </div>

            <p className="px-[1.5rem] font-bold text-xl text-[#004a37]">
              Bài Tập về Khoa Học, Thực Vật, Động Vật...
            </p>

            <button className="cursor-pointer w-[9rem] h-[2.5rem] rounded-full bg-[#ff6379] text-white uppercase text-[0.9rem] font-bold leading-none transition-all duration-300 ease-in-out transform hover:bg-[#006a4e] hover:scale-105 hover:opacity-90">
              Làm Ngay
            </button>
          </div>

          <div className="flex flex-row justify-between items-center w-full px-[1rem] bg-[#004a37] rounded-b-md h-full">
            <span className="flex justify-center items-center w-[6.125rem]">
              <p className="text-white uppercase text-base font-bold leading-none">
                Kết quả lần trước
              </p>
            </span>

            <span className="flex justify-center items-center w-[5.125rem] h-[2rem]">
              <p className="text-white uppercase text-base font-bold">
                <span className="text-4xl">0</span> /10
              </p>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(PracticeExercises);
