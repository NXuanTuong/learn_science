import React from "react";
import { useNavigate } from "react-router-dom";

const grades = [
  { label: "Khối 4", image: "/images/plants.png" },
  { label: "Khối 5", image: "/images/animals.png" },
];

const ChooseGradesMainScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-[url('/public/images/background_choice_grade.jpg')] flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-4xl flex justify-start mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-white font-semibold bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow transition-all"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Quay lại
        </button>
      </div>

      <h1 className="text-4xl font-bold text-green-900 uppercase mb-10 font-[Exo_2]">
        Chọn khối lớp học
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-xl">
        {grades.map((grade, index) => (
          <button
            onClick={() => {
              localStorage.setItem("grade", grade.label);
              navigate(-1);
            }}
            key={index}
            className={`${
              localStorage.getItem("grade") === grade.label
                ? "border-4 border-green-500 scale-105 shadow-2xl"
                : ""
            } bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer border-2 border-green-300 hover:border-green-500 text-lg font-semibold text-green-800`}
          >
            {grade.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChooseGradesMainScreen;
