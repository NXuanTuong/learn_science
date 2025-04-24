import { connect, useDispatch } from "react-redux";
import "./practice.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import {
  clearState,
  createNewPractice,
  getQuizInformations,
} from "../../store/quizQuestionSlice";
import { clickButton } from "../../helper/sounds";
import { getAnUnits } from "../../store/lessonSlice";

const PracticeExercises = ({ quizInformation, quiz, listUnit, listAnUnit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookie = new Cookies();
  const token = cookie.get("signin_user");
  const audio = new Audio(clickButton);

  const [showListUnit, setShowListUnit] = useState(false);
  const [selectDifficulty, setSelectDifficulty] = useState(false);
  const [lessonId, setLessonId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const videoRef = useRef(null);

  const handleGetListQuestions = async (id, title) => {
    try {
      localStorage.setItem("practiceName", title);
      localStorage.setItem("lessonId", id);
      // localStorage.removeItem("userAnswers");
      setLessonId(id);
      setSelectDifficulty(true);
    } catch (error) {
      console.log("Lỗi API:", error);
    }
  };

  const handleSelectDifficulty = async (value) => {
    audio.play();
    localStorage.setItem("type", value);
    localStorage.setItem("selectDifficulty", true);
    try {
      localStorage.removeItem("userAnswers");
      navigate(
        "/cau_hoi_luyen_tap?id=" +
          (lessonId ? lessonId : localStorage.getItem("lessonId")) +
          "&value=" +
          value +
          "&isRedo=" +
          false
      );
    } catch (error) {
      console.log("Lỗi API:", error);
    }
  };

  const handleCreatePracticeQuiz = (quizInformationId, name) => {
    dispatch(
      createNewPractice({
        quizInforId: quizInformationId,
        token,
      })
    );

    localStorage.setItem("practiceName", `Về đích - ${name}`);

    navigate("/bai_kiem_tra_thuc_hanh?page=VeDich");
  };

  const showListAnUnit = (gradeId) => {
    localStorage.setItem("showListUnit", true);
    setShowListUnit(true);
    dispatch(
      getAnUnits({
        gradeId,
        token,
      })
    );
  };

  const navEntries = performance.getEntriesByType("navigation");
  const isReload = navEntries.length > 0 && navEntries[0].type === "reload";

  useEffect(() => {
    if (location.pathname !== "/cau_hoi_luyen_tap") {
      localStorage.removeItem("practiceName");
      localStorage.removeItem("userAnswers");
      localStorage.removeItem("showSolutions");
      localStorage.removeItem("questionStateExams");
    }

    if (localStorage.getItem("showListUnit")) {
      setShowListUnit(true);
    } else {
      setShowListUnit(false);
    }

    if (localStorage.getItem("selectDifficulty")) {
      setSelectDifficulty(true);
    }

    dispatch(clearState());

    if (listAnUnit?.quizId || localStorage.getItem("quizId")) {
      dispatch(
        getQuizInformations({
          quizId: listAnUnit?.quizId
            ? listAnUnit?.quizId
            : localStorage.getItem("quizId"),
          token,
        })
      );
    }

    if (isReload) {
      localStorage.removeItem("showListUnit");
      setShowListUnit(false);
    }
  }, [isReload]);

  useEffect(() => {
    const isViewed = localStorage.getItem("video_popup_viewed");
    if (!isViewed) {
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem("video_popup_viewed", "true");
    // Optional: stop video
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <>
      <div className="flex flex-row justify-center items-center gap-6 w-full relative">
        {!showListUnit && !selectDifficulty && (
          <>
            {listUnit?.length > 0 &&
              listUnit?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="relative w-[20rem] h-[22rem] cursor-pointer rounded-3xl border border-[#007f5f] bg-[#eaf7e3] shadow-xl transition-all duration-300 hover:shadow-2xl hover:ring-2 hover:ring-[#007f5f] hover:-translate-y-2"
                  >
                    <div className="flex flex-col items-center gap-5 w-full h-full ">
                      <div className="w-full h-[12rem] overflow-hidden rounded-t-3xl border border-[#007f5f]">
                        <img
                          className="object-cover w-full h-full"
                          src={
                            item.image === ""
                              ? item?.name === "Năng lượng"
                                ? "/images/backgroundUnitNăngLượng.jpg"
                                : "/images/background_questions.png"
                              : item.image
                          }
                          alt="plant-quiz"
                        />
                      </div>

                      <p className="font-bold text-2xl text-[#007f5f] text-center tracking-wide">
                        {item?.name}
                      </p>

                      <button
                        onClick={() => {
                          showListAnUnit(item._id);
                          localStorage.setItem("lessonName", item.name);
                          localStorage.setItem("quizId", listAnUnit.quizId);

                          const queryParams = new URLSearchParams({
                            lessonName: item.name,
                          });

                          // Điều hướng kèm query
                          navigate(
                            `/trang_hoc_chinh/luyen_tap_thuc_hanh?${queryParams.toString()}`
                          );
                        }}
                        className="cursor-pointer z-10 w-[10rem] h-[3rem] rounded-full bg-[#007f5f] text-white uppercase text-lg font-bold leading-none shadow-lg shadow-[#004a37] transition-all duration-300 ease-in-out transform hover:scale-100 hover:bg-[#005a40] hover:shadow-xl hover:shadow-[#005a40] hover:-translate-y-1"
                      >
                        Xem Ngay
                      </button>
                    </div>
                  </div>
                );
              })}
          </>
        )}

        {selectDifficulty && (
          <>
            <>
              {showPopup && (
                <div className="fixed inset-0 backdrop-blur-sm z-[1100] transition-opacity duration-300 flex justify-center items-center">
                  <div className="bg-white p-4 rounded-lg w-5/4 max-w-4xl relative">
                    {/* Nút đóng popup */}
                    <button
                      onClick={handleClose}
                      className="absolute cursor-pointer top-2 right-2 z-[1200] text-red-600 text-xl font-bold"
                    >
                      ✖
                    </button>

                    {/* Video */}
                    <video
                      ref={videoRef}
                      controls
                      autoPlay
                      width="100%"
                      className="rounded-xl shadow-lg"
                    >
                      <source
                        src="/videos/Nội dung đoạn văn bản của bạn.mp4"
                        type="video/mp4"
                      />
                      Trình duyệt của bạn không hỗ trợ video.
                    </video>
                  </div>
                </div>
              )}
            </>

            <span
              onClick={() => {
                setSelectDifficulty(false);
                localStorage.removeItem("selectDifficulty");
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
            <div className="relative flex flex-col gap-8 px-6 py-7 items-center justify-center w-[20rem] rounded-[2rem] bg-white/10 backdrop-blur-2xl border border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03]">
              {/* Light blobs for dreamy effect */}

              {/* Title */}
              <h2 className="text-2xl font-extrabold text-green-800 drop-shadow-md text-center">
                🧠 Chọn độ khó
              </h2>

              {/* Buttons */}
              <div className="flex flex-col gap-5 w-full items-center">
                <button
                  onClick={() => handleSelectDifficulty(1)}
                  className="cursor-pointer w-full px-4 py-3 rounded-xl bg-green-100 hover:bg-green-200 text-[#005f3c] font-semibold flex items-center gap-2 justify-center transition"
                >
                  🚀 Khởi động
                </button>

                <button
                  onClick={() => handleSelectDifficulty(2)}
                  className="cursor-pointer w-full px-4 py-3 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold flex items-center gap-2 justify-center transition"
                >
                  ⚡ Tăng tốc
                </button>

                <button
                  onClick={() => handleSelectDifficulty(3)}
                  className="cursor-pointer w-full px-4 py-3 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 font-semibold flex items-center gap-2 justify-center transition"
                >
                  🏁 Về đích
                </button>
              </div>
            </div>
          </>
        )}

        {showListUnit && !selectDifficulty && (
          <>
            <span
              onClick={() => {
                localStorage.removeItem("showListUnit");
                setShowListUnit(false);
                localStorage.removeItem("lessonName");
                navigate("/trang_hoc_chinh/luyen_tap_thuc_hanh");
              }}
              className="absolute z-50 top-[20px] left-[50px] cursor-pointer flex items-center gap-2 px-3 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:bg-green-700 hover:scale-105 animate-bounce"
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
              Quay lại trang chủ
            </span>

            {listAnUnit.lessons?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="relative w-[20rem] h-[27rem] cursor-pointer rounded-3xl border border-[#007f5f] bg-[#eaf7e3] shadow-xl transition-all duration-300 hover:shadow-2xl hover:ring-2 hover:ring-[#007f5f] hover:-translate-y-2"
                >
                  <div className="flex flex-col justify-center items-center gap-5 w-full h-full p-5">
                    <div className="w-full h-[12rem] overflow-hidden rounded-xl border border-[#007f5f]">
                      <img
                        className="object-cover w-full h-full"
                        src={
                          item.image === ""
                            ? item?.title === "Âm thanh"
                              ? "/images/background2.jpg"
                              : "/images/background_questions.png"
                            : item.image
                        }
                        alt="plant-quiz"
                      />
                    </div>

                    <p className="font-bold text-2xl text-[#007f5f] text-center tracking-wide">
                      {item.title}
                    </p>

                    <button
                      onClick={() =>
                        handleGetListQuestions(item.id, item.title)
                      }
                      className="cursor-pointer z-10 w-[10rem] h-[3rem] rounded-full bg-[#007f5f] text-white uppercase text-lg font-bold leading-none shadow-lg shadow-[#004a37] transition-all duration-300 ease-in-out transform hover:scale-100 hover:bg-[#005a40] hover:shadow-xl hover:shadow-[#005a40] hover:-translate-y-1"
                    >
                      Làm Ngay
                    </button>
                  </div>
                </div>
              );
            })}

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
                    src={
                      localStorage.getItem("lessonName") === "Năng lượng"
                        ? "/images/background3.jpg"
                        : "/images/background_questions.png"
                    }
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
                    handleCreatePracticeQuiz(listAnUnit.quizId, listAnUnit.name)
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
    listUnit: state.lesson.listUnit,
    listAnUnit: state.lesson.listAnUnit,
  };
}

export default connect(mapStateToProps)(PracticeExercises);
