import React, { useState, useEffect, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { addAchievement } from "../../config/achievement";
import { sound3, sound4 } from "../../helper/sounds";

const ScorePopup = ({
  isPopupCaculationScore,
  questions,
  setIsPopupCaculationScore,
  setIsLoadingShowSolution,
  handleQuestionChange,
  quizInformation,
  setIsRedo,
  setIsLoading,
  setSelectedQuestion,
}) => {
  const [isLoadingScore, setIsLoadingScore] = useState(true);
  const [correctCount, setCorrectCount] = useState(0);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [gold, setGold] = useState(true);
  const cookie = new Cookies();
  const token = cookie.get("signin_user");
  const [searchParams] = useSearchParams();

  const updateIsRedo = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const isRedo = searchParams.get("isRedo") === "true";
    searchParams.set("isRedo", (!isRedo).toString());

    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };
  const audioRef3 = useRef(null); // tạo ref cho audio
  const audioRef4 = useRef(null); // tạo ref cho audio

  useEffect(() => {
    if (!audioRef3.current) {
      audioRef3.current = new Audio(sound3);
    }

    if (!audioRef4.current) {
      audioRef4.current = new Audio(sound4);
    }

    if (isPopupCaculationScore) {
      setIsLoadingScore(true);

      setTimeout(() => {
        calculateScore();
        setIsLoadingScore(false);
      }, 2000);
    }
  }, [isPopupCaculationScore, audioRef3, audioRef4]);

  // useEffect(() => {
  //   if (
  //     !isLoadingScore &&
  //     isPopupCaculationScore &&
  //     window.location.pathname !== "/bai_kiem_tra_thuc_hanh"
  //   ) {
  //     const timeout = setTimeout(() => {
  //       setShowRewardPopup(true); // chỉ hiện reward popup
  //       // KHÔNG setIsPopupCaculationScore(false) nữa
  //     }, 2000); // hoặc 10000 nếu bạn muốn

  //     return () => clearTimeout(timeout);
  //   }
  // }, [isLoadingScore, isPopupCaculationScore]);

  const calculateScore = async () => {
    const storedAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];

    let correct = 0;

    storedAnswers.forEach(({ id, userChoice }) => {
      const question = questions.find((q) => q._id === id);

      if (
        question &&
        Array.isArray(question.question.solutions) &&
        Array.isArray(userChoice)
      ) {
        const isCorrect =
          JSON.stringify(userChoice) ===
          JSON.stringify(question.question.solutions);

        if (isCorrect) {
          correct++;
        }
      }
    });

    const percentage = (correct / questions.length) * 100;

    if (percentage >= 80) {
      setGold(true);
      if (window.location.pathname !== "/bai_kiem_tra_thuc_hanh") {
        let value = searchParams.get("value");
        let id = searchParams.get("id");
        let lessonId2 = "67cbccf76cd5f0e7bbc47987";
        const { data } = await addAchievement(token, {
          itemId: id ?? lessonId2,
          difficulty: Number(value),
          type: 1,
        });
        setTimeout(() => {
          setShowRewardPopup(data.result);
          if (data.result === true) {
            audioRef3.current?.play();
          }
        }, 1200); // hoặc 10000 nếu bạn muốn
      }
    } else {
      setGold(false);
      if (window.location.pathname !== "/bai_kiem_tra_thuc_hanh") {
        setTimeout(() => {
          setShowRewardPopup(true);
          audioRef4.current?.play();
          // KHÔNG setIsPopupCaculationScore(false) nữa
        }, 1200); // hoặc 10000 nếu bạn muốn
      }
    }

    setCorrectCount(correct);
  };

  const stopAudio1 = () => {
    if (audioRef3.current) {
      audioRef3.current.pause();
      audioRef3.current.currentTime = 0;
    }
  };

  const stopAudio2 = () => {
    if (audioRef4.current) {
      audioRef4.current.pause();
      audioRef4.current.currentTime = 0;
    }
  };

  const renderRewardContent = () => {
    if (gold) {
      return (
        <>
          {localStorage.getItem("type") === "1" ? (
            <img src="/images/trung_dong.png" alt="" />
          ) : localStorage.getItem("type") === "2" ? (
            <img src="/images/trung_bac.png" alt="" />
          ) : (
            <img src="/images/trung_vang.png" alt="" />
          )}
        </>
      );
    } else {
      return (
        <>
          <img src="/images/trung_0.png" alt="" />
        </>
      );
    }
  };

  return (
    <>
      {isPopupCaculationScore && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-[1100] transition-opacity duration-300">
          {isLoadingScore ? (
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                <p className="mt-3 text-lg font-semibold text-blue-600">
                  Đang tính toán...
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl shadow-xl text-center w-96 border border-gray-300 relative">
              {/* Icon chúc mừng */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <p className="text-2xl">🎉</p>
              </div>

              {/* Tiêu đề */}
              <p className="text-2xl uppercase font-bold bg-gradient-to-r from-blue-500 to-green-600 text-transparent bg-clip-text mt-4">
                Kết quả bài làm
              </p>

              {/* Thanh tiến trình */}
              <div className="relative w-full bg-gray-200 rounded-full h-4 mt-6 overflow-hidden">
                <div
                  className="h-4 bg-gradient-to-r from-orange-400 to-yellow-500 transition-all rounded-full"
                  style={{
                    width: `${
                      (window.location.pathname === "/bai_kiem_tra_thuc_hanh"
                        ? quizInformation.correctAnswersLP
                        : correctCount / questions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>

              {/* Số câu đúng */}
              <p className="text-lg mt-3 text-gray-700 font-medium">
                <span className="text-3xl font-extrabold text-green-600">
                  {window.location.pathname === "/bai_kiem_tra_thuc_hanh"
                    ? quizInformation.correctAnswersLP
                    : correctCount}
                </span>{" "}
                /{" "}
                <span className="text-xl font-semibold">
                  {questions.length}
                </span>{" "}
                câu
              </p>

              <div className="flex justify-center gap-6 mt-6">
                <button
                  onClick={() => {
                    localStorage.setItem("showSolutions", "true");
                    setIsLoadingShowSolution(true);
                    setIsPopupCaculationScore(false);
                    handleQuestionChange(0);
                    localStorage.setItem("scorePractice", correctCount);
                    localStorage.setItem("maxScore", questions.length);
                    stopAudio1();
                    stopAudio2();
                  }}
                  className="cursor-pointer px-6 py-3 bg-gradient-to-r
                  from-green-500 to-green-700 text-white font-medium rounded-lg
                  shadow-lg hover:opacity-90 transition-all transform
                  hover:scale-105 active:scale-95" // onClick=
                >
                  {" "}
                  📖 Xem lời giải
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showRewardPopup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-[1101] transition-opacity duration-300">
          <div className="bg-white p-6 rounded-3xl shadow-xl text-center w-[53rem] relative">
            {renderRewardContent()}
            <div className="flex justify-center gap-4 mt-4">
              {/* Nút xem lời giải (Lấy cảm hứng từ màu cây cỏ, khoa học sinh học) */}
              <button
                onClick={() => {
                  localStorage.setItem("showSolutions", "true");
                  setIsLoadingShowSolution(true);
                  setIsPopupCaculationScore(false);
                  handleQuestionChange(0);
                  localStorage.setItem("scorePractice", correctCount);
                  localStorage.setItem("maxScore", questions.length);
                  stopAudio1();
                  stopAudio2();
                }}
                className="cursor-pointer px-6 py-3 bg-gradient-to-r
                  from-green-500 to-green-700 text-lg text-white font-medium rounded-lg
                  shadow-lg hover:opacity-90 transition-all transform
                  hover:scale-105 active:scale-95" // onClick=
              >
                {" "}
                📖 Xem lời giải
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function mapStateToProps(state) {
  return {
    quizInformation: state.quiz.quizInformation,
  };
}

export default connect(mapStateToProps)(ScorePopup);
