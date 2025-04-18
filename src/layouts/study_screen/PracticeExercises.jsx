import { connect, useDispatch } from "react-redux";
import "./practice.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import {
  clearState,
  createNewPractice,
  getQuizInformations,
} from "../../store/quizQuestionSlice";
const difficulties = [
  { name: "Khởi động", value: 1 },
  { name: "Tăng tốc", value: 2 },
  { name: "Về đích", value: 3 },
];

const PracticeExercises = ({ quizInformation, quiz }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookie = new Cookies();
  const token = cookie.get("signin_user");

  const [showListUnit, setShowListUnit] = useState(false);
  const [selectDifficulty, setSelectDifficulty] = useState(false);
  const [lessonId, setLessonId] = useState("");

  const handleGetListQuestions = async (id) => {
    try {
      // localStorage.setItem(
      //   "practiceName",
      //   "Bài Tập về Khoa Học, Thực Vật, Động Vật..."
      // );
      // localStorage.removeItem("userAnswers");
      setLessonId(id);
      setSelectDifficulty(true);
    } catch (error) {
      console.log("Lỗi API:", error);
    }
  };
  const handleSelectDifficulty = async (value) => {
    try {
      localStorage.setItem(
        "practiceName",
        "Bài Tập về Khoa Học, Thực Vật, Động Vật..."
      );
      localStorage.removeItem("userAnswers");
      navigate("/cau_hoi_luyen_tap?id=" + lessonId + "&value=" + value);
    } catch (error) {
      console.log("Lỗi API:", error);
    }
  };

  const handleCreatePracticeQuiz = () => {
    dispatch(
      createNewPractice({
        quizInforId: quizInformation._id,
        token,
      })
    );

    localStorage.setItem("practiceName", "🌿 Thế Giới Thực Vật");

    navigate("/bai_kiem_tra_thuc_hanh");
  };

  useEffect(() => {
    if (location.pathname !== "/cau_hoi_luyen_tap") {
      localStorage.removeItem("practiceName");
      localStorage.removeItem("userAnswers");
      localStorage.removeItem("showSolutions");
      localStorage.removeItem("questionStateExams");
    }

    if (localStorage.getItem("showListUnit")) {
      setShowListUnit(true);
    }
    dispatch(clearState());

    dispatch(
      getQuizInformations({
        quizId: "67cbd500a8a69a4dd320b14b",
        token,
      })
    );
  }, []);

  return (
    <>
      <div className="flex flex-row justify-center items-center gap-6 w-full relative">
        {!showListUnit && !selectDifficulty && (
          <>
            <div className="relative w-[20rem] h-[22rem] cursor-pointer rounded-3xl border border-[#007f5f] bg-[#eaf7e3] shadow-xl transition-all duration-300 hover:shadow-2xl hover:ring-2 hover:ring-[#007f5f] hover:-translate-y-2">
              <div className="flex flex-col items-center gap-5 w-full h-full ">
                <div className="w-full h-[12rem] overflow-hidden rounded-t-3xl border border-[#007f5f]">
                  <img
                    className="object-cover w-full h-full"
                    src="/images/background_questions.png"
                    alt="plant-quiz"
                  />
                </div>

                <p className="font-bold text-2xl text-[#007f5f] text-center tracking-wide">
                  Thực Vật và Động Vật 4
                </p>

                <button
                  onClick={() => {
                    localStorage.setItem("showListUnit", true);
                    setShowListUnit(true);
                  }}
                  className="cursor-pointer z-10 w-[10rem] h-[3rem] rounded-full bg-[#007f5f] text-white uppercase text-lg font-bold leading-none shadow-lg shadow-[#004a37] transition-all duration-300 ease-in-out transform hover:scale-100 hover:bg-[#005a40] hover:shadow-xl hover:shadow-[#005a40] hover:-translate-y-1"
                >
                  Xem Ngay
                </button>
              </div>
            </div>

            {/* <div className="relative w-[20rem] h-[24rem] cursor-pointer rounded-3xl border border-[#007f5f] bg-[#eaf7e3] shadow-xl transition-all duration-300 hover:shadow-2xl hover:ring-2 hover:ring-[#007f5f] hover:-translate-y-2">
              <div className="flex flex-col items-center gap-5 w-full h-full ">
                <div className="w-full h-[12rem] overflow-hidden rounded-t-3xl border border-[#007f5f]">
                  <img
                    className="object-cover w-full h-full"
                    src="/images/background_questions.png"
                    alt="plant-quiz"
                  />
                </div>

                <p className="font-bold text-2xl text-[#007f5f] text-center tracking-wide">
                  🌿 Khoa Học Động Vật Chương II
                </p>

                <button
                  onClick={() => {
                    localStorage.setItem("showListUnit", true);
                    setShowListUnit(true);
                  }}
                  className="cursor-pointer z-10 w-[10rem] h-[3rem] rounded-full bg-[#007f5f] text-white uppercase text-lg font-bold leading-none shadow-lg shadow-[#004a37] transition-all duration-300 ease-in-out transform hover:scale-100 hover:bg-[#005a40] hover:shadow-xl hover:shadow-[#005a40] hover:-translate-y-1"
                >
                  Xem Ngay
                </button>
              </div>
            </div> */}
          </>
        )}
        {selectDifficulty && (
          <>
          <span
              onClick={() => {
                setSelectDifficulty(false);
                setLessonId("");
              }}
              className="absolute z-50 top-[20px] left-[150px] cursor-pointer flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:bg-green-700 hover:scale-105 animate-bounce"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Quay lại chọn bài giảng
            </span>
          <div className="flex flex-col gap-[2rem] p-[3rem] items-center justify-center relative w-[20rem] h-[27rem] cursor-pointer rounded-3xl border border-[#007f5f] bg-[#eaf7e3] shadow-xl transition-all duration-300 hover:shadow-2xl hover:ring-2 hover:ring-[#007f5f] hover:-translate-y-2">
            {difficulties.map((difficulty) => {
              return (
                <button
                  key={difficulty}
                  onClick={() => handleSelectDifficulty(difficulty.value)}
                  className="cursor-pointer z-10 w-[10rem] h-[3rem] rounded-full bg-[#007f5f] text-white uppercase text-lg font-bold leading-none shadow-lg shadow-[#004a37] transition-all duration-300 ease-in-out transform hover:scale-100 hover:bg-[#005a40] hover:shadow-xl hover:shadow-[#005a40] hover:-translate-y-1"
                >
                  <p>{difficulty.name}</p>
                </button>
              );
            })}
          </div>
          </>
        )}

        {showListUnit && !selectDifficulty && (
          <>
            <span
              onClick={() => {
                localStorage.removeItem("showListUnit");
                setShowListUnit(false);
              }}
              className="absolute z-50 top-[20px] left-[150px] cursor-pointer flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:bg-green-700 hover:scale-105 animate-bounce"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Quay lại chọn chương
            </span>

            <div className="relative w-[20rem] h-[27rem] cursor-pointer rounded-3xl border border-[#007f5f] bg-[#eaf7e3] shadow-xl transition-all duration-300 hover:shadow-2xl hover:ring-2 hover:ring-[#007f5f] hover:-translate-y-2">
              <div className="flex flex-col justify-center items-center gap-5 w-full h-full p-5">
                <div className="w-full h-[12rem] overflow-hidden rounded-xl border border-[#007f5f]">
                  <img
                    className="object-cover w-full h-full"
                    src="/images/background_questions.png"
                    alt="plant-quiz"
                  />
                </div>

                <p className="font-bold text-2xl text-[#007f5f] text-center tracking-wide">
                  Thực vật cần gì để sống
                </p>

                <button
                  onClick={() =>
                    handleGetListQuestions("67cbbe5e51bc86aaba6fa44a")
                  }
                  className="cursor-pointer z-10 w-[10rem] h-[3rem] rounded-full bg-[#007f5f] text-white uppercase text-lg font-bold leading-none shadow-lg shadow-[#004a37] transition-all duration-300 ease-in-out transform hover:scale-100 hover:bg-[#005a40] hover:shadow-xl hover:shadow-[#005a40] hover:-translate-y-1"
                >
                  Làm Ngay
                </button>
              </div>

              {/* <div className="absolute bottom-0 w-full px-4 py-3 bg-[#007f5f] text-white text-center rounded-b-3xl flex justify-between items-center">
                <p className="uppercase text-base font-bold">
                  Kết quả lần trước
                </p>
                <span className="bg-white text-[#007f5f] font-bold px-5 py-2 rounded-lg shadow-md text-lg">
                  {localStorage.getItem("scorePractice") ? (
                    <span>
                      {localStorage.getItem("scorePractice")}/
                      {localStorage.getItem("maxScore")}
                    </span>
                  ) : (
                    <span>-</span>
                  )}
                </span>
              </div> */}
            </div>
            <div className="relative w-[20rem] h-[27rem] cursor-pointer rounded-3xl border border-[#007f5f] bg-[#eaf7e3] shadow-xl transition-all duration-300 hover:shadow-2xl hover:ring-2 hover:ring-[#007f5f] hover:-translate-y-2">
              <div className="flex flex-col justify-center items-center gap-5 w-full h-full p-5">
                <div className="w-full h-[12rem] overflow-hidden rounded-xl border border-[#007f5f]">
                  <img
                    className="object-cover w-full h-full"
                    src="/images/background_questions.png"
                    alt="plant-quiz"
                  />
                </div>

                <p className="font-bold text-2xl text-[#007f5f] text-center tracking-wide">
                  Chăm sóc cây trồng, vật nuôi
                </p>

                <button
                  onClick={() =>
                    handleGetListQuestions("67cbccf76cd5f0e7bbc47987")
                  }
                  className="cursor-pointer z-10 w-[10rem] h-[3rem] rounded-full bg-[#007f5f] text-white uppercase text-lg font-bold leading-none shadow-lg shadow-[#004a37] transition-all duration-300 ease-in-out transform hover:scale-100 hover:bg-[#005a40] hover:shadow-xl hover:shadow-[#005a40] hover:-translate-y-1"
                >
                  Làm Ngay
                </button>
              </div>

              {/* <div className="absolute bottom-0 w-full px-4 py-3 bg-[#007f5f] text-white text-center rounded-b-3xl flex justify-between items-center">
                <p className="uppercase text-base font-bold">
                  Kết quả lần trước
                </p>
                <span className="bg-white text-[#007f5f] font-bold px-5 py-2 rounded-lg shadow-md text-lg">
                  {localStorage.getItem("scorePractice") ? (
                    <span>
                      {localStorage.getItem("scorePractice")}/
                      {localStorage.getItem("maxScore")}
                    </span>
                  ) : (
                    <span>-</span>
                  )}
                </span>
              </div> */}
            </div>
            <div
              className={`relative w-[20rem] h-[27rem] cursor-pointer rounded-3xl border border-[#007f5f] ${
                localStorage.getItem("scorePractice")
                  ? "bg-[#eaf7e3]"
                  : "bg-gray-400"
              } shadow-xl transition-all duration-300 hover:shadow-2xl hover:ring-2 hover:ring-[#007f5f] hover:-translate-y-2`}
            >
              <div className="flex flex-col justify-center items-center gap-5 w-full h-full p-5">
                <div className="w-full h-[12rem] overflow-hidden rounded-xl border border-[#007f5f]">
                  <img
                    className="object-cover w-full h-full"
                    src="/images/background_questions.png"
                    alt="plant-quiz"
                  />
                </div>

                <div className="flex flex-col justify-center items-center">
                  <p className="font-bold text-2xl text-[#007f5f] text-center">
                    🎯 Về đích
                  </p>

                  {localStorage.getItem("scorePractice") ? (
                    <></>
                  ) : (
                    <span className="text-xs tracking-widest font-bold text-white">
                      Học hết các bài trước để mở bài ...
                    </span>
                  )}
                </div>

                <button
                  onClick={() =>
                    localStorage.getItem("scorePractice") &&
                    handleCreatePracticeQuiz()
                  }
                  className={`cursor-pointer z-10 w-[10rem] h-[3rem] rounded-full text-white uppercase text-lg font-bold leading-none shadow-lg transition-all duration-300 ease-in-out transform ${
                    !localStorage.getItem("scorePractice")
                      ? "bg-gray-400 cursor-not-allowed border border-[#007f5f]"
                      : "bg-[#007f5f] shadow-[#004a37] hover:scale-100 hover:bg-[#005a40] hover:shadow-xl hover:shadow-[#005a40] hover:-translate-y-1"
                  }`}
                  disabled={!localStorage.getItem("scorePractice")}
                >
                  {!localStorage.getItem("scorePractice")
                    ? "🔒 Khóa"
                    : "Làm Ngay"}
                </button>
              </div>

              <div className="absolute bottom-0 w-full px-4 py-3 bg-[#007f5f] text-white text-center rounded-b-3xl flex justify-between items-center">
                <p className="uppercase text-base font-bold">
                  Kết quả lần trước
                </p>
                <span className="bg-white text-[#007f5f] font-bold px-5 py-2 rounded-lg shadow-md text-lg">
                  {quizInformation?.correctAnswersLP === null
                    ? 0
                    : quizInformation?.correctAnswersLP}
                  /
                  {quizInformation?.numberQuestionsLP === null
                    ? 0
                    : quizInformation?.numberQuestionsLP}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    score: state.questions.currentSocre,
    quizInformation: state.quiz.quizInformation,
    quiz: state.quiz,
  };
}

export default connect(mapStateToProps)(PracticeExercises);
