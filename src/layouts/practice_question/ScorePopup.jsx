import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

const ScorePopup = ({
  isPopupCaculationScore,
  questions,
  setIsPopupCaculationScore,
  setIsLoadingShowSolution,
  handleQuestionChange,
}) => {
  const [isLoadingScore, setIsLoadingScore] = useState(true);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    if (isPopupCaculationScore) {
      setIsLoadingScore(true);

      setTimeout(() => {
        calculateScore();
        setIsLoadingScore(false);
      }, 2000);
    }
  }, [isPopupCaculationScore]);

  const calculateScore = () => {
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

    setCorrectCount(correct);
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
                    width: `${(correctCount / questions.length) * 100}%`,
                  }}
                ></div>
              </div>

              {/* Số câu đúng */}
              <p className="text-lg mt-3 text-gray-700 font-medium">
                <span className="text-3xl font-extrabold text-green-600">
                  {correctCount}
                </span>{" "}
                /{" "}
                <span className="text-xl font-semibold">
                  {questions.length}
                </span>{" "}
                câu
              </p>

              {/* Nút hành động */}
              <div className="flex justify-center gap-6 mt-6">
                {/* Nút xem lời giải (Lấy cảm hứng từ màu cây cỏ, khoa học sinh học) */}
                <button
                  onClick={() => {
                    localStorage.setItem("showSolutions", "true");
                    setIsLoadingShowSolution(true);
                    setIsPopupCaculationScore(false);
                    handleQuestionChange(0);
                    localStorage.setItem("scorePractice", correctCount);
                    localStorage.setItem("maxScore", questions.length);
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
    </>
  );
};

export default ScorePopup;
