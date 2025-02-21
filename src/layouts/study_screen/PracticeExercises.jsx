import React from "react";
import "./practice.css";

const PracticeExercises = () => {
  return (
    <>
      <div className="flex flex-row justify-center items-center gap-[2rem]">
        <div
          className={
            "px-[2rem] w-[18.75rem] h-[22.5rem] cursor-pointer rounded-xl bg-[#fafbfc] flex flex-col justify-center items-center gap-[1.75rem] border border-[#004a37] rounded-xl shadow-[2px_4px_0_0_#004a37] transition-all duration-300 hover:drop-shadow-[4px_4px_0px_#004a37] hover:-translate-y-1"
          }
        >
          <div className="h-[9.75rem] ">
            <img
              className="object-cover w-full h-full rounded-xl"
              src="/images/background_register.png"
              alt=""
            />
          </div>

          <p className="font-bold text-xl text-[#004a37]">
            Bài Tập về Khoa Học, Thực Vật, Động Vật...
          </p>

          <div className="flex flex-row justify-between items-center w-full">
            <span className="flex justify-center items-center w-[5.125rem] h-[2rem] rounded-xl bg-[#004a37]">
              <p className="text-white uppercase text-xs font-bold">Chưa làm</p>
            </span>

            <progress
              className="progress-custom"
              value={50}
              max="100"
            ></progress>
          </div>
        </div>
        <div
          className={
            "px-[2rem] w-[18.75rem] h-[22.5rem] cursor-pointer rounded-xl bg-[#fafbfc] flex flex-col justify-center items-center gap-[1.75rem] border border-[#004a37] rounded-xl shadow-[2px_4px_0_0_#004a37] transition-all duration-300 hover:drop-shadow-[4px_4px_0px_#004a37] hover:-translate-y-1"
          }
        >
          <div className="h-[9.75rem] ">
            <img
              className="object-cover w-full h-full rounded-xl"
              src="/images/background_signin.png"
              alt=""
            />
          </div>

          <p className="font-bold text-xl text-[#004a37]">
            Bài Tập về Khoa Học, Thực Vật, Động Vật...
          </p>

          <div className="flex flex-row justify-between items-center w-full">
            <span className="flex justify-center items-center w-[5.125rem] h-[2rem] rounded-xl bg-[#004a37]">
              <p className="text-white uppercase text-xs font-bold">Chưa làm</p>
            </span>

            <progress
              className="progress-custom"
              value={50}
              max="100"
            ></progress>
          </div>
        </div>
      </div>
    </>
  );
};

export default PracticeExercises;
