import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { submitAnswerPractice } from "../../config/quiz";
import { clearQuestion } from "../../store/listQuestionSlice";
import {
  getQuizInformations,
  selectAnsweredQuestions,
  setQuestionAnswered,
  setQuestionsAnswered,
  setQuestionState,
} from "../../store/quizQuestionSlice";
import ScorePopup from "./ScorePopup";

const PracticeQuestionRight = ({
  questions,
  selectedIndex,
  handleQuestionChange,
  setIsLoadingShowSolution,
  quizInformation,
}) => {
  const dispatch = useDispatch();
  const cookie = new Cookies();
  const token = cookie.get("signin_user");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupSubmitAllPractice, setIsPopupSubmitAllPractice] =
    useState(false);

  const [isShowPopupCancel, setIsShowPopupCancel] = useState(false);

  const [isPopupCaculationScore, setIsPopupCaculationScore] = useState(false);
  const navigate = useNavigate();
  var answeredQuestion = useSelector(selectAnsweredQuestions);

  const handleCloseQuestions = () => {
    if (!JSON.parse(localStorage.getItem("showSolutions"))) {
      if (window.location.pathname === "/bai_kiem_tra_thuc_hanh") {
        setIsShowPopupCancel(true);
        // localStorage.removeItem("questionStateExams");
      } else {
        setIsPopupOpen(true);
      }
    } else {
      localStorage.removeItem("newPracticeId");
      localStorage.removeItem("questionStateExams");
      navigate("/trang_hoc_chinh/luyen_tap_thuc_hanh");
    }
  };

  const handleConfirmExit = () => {
    if (window.location.pathname === "/bai_kiem_tra_thuc_hanh") {
      localStorage.removeItem("newPracticeId");
      localStorage.removeItem("questionStateExams");
    } else {
      dispatch(clearQuestion());
    }
    setIsShowPopupCancel(false);
    setIsPopupOpen(false);
    navigate("/trang_hoc_chinh/luyen_tap_thuc_hanh");
  };

  const handleCancelExit = () => {
    setIsPopupOpen(false);
  };

  const showPopupSubmitAllPractice = () => {
    setIsPopupSubmitAllPractice(true);
  };

  const handleCancelSubmitAll = () => {
    setIsPopupSubmitAllPractice(false);
  };

  const handleSubmitAll = async () => {
    if (window.location.pathname === "/bai_kiem_tra_thuc_hanh") {
      const result = JSON.parse(localStorage.getItem("questionStateExams"));

      if (result) {
        if (result.questionState) {
          dispatch(setQuestionState(result.questionState));
        }

        if (result.questionAnswered) {
          dispatch(setQuestionAnswered(result.questionAnswered));
        }

        if (result.questionsAnswered) {
          dispatch(setQuestionsAnswered(result.questionsAnswered));
        }

        answeredQuestion = result.questionsAnswered;
      } else {
        answeredQuestion = questions.map((question) => ({
          questionId: question.questionId,
          questionIndex: question.questionIndex,
          answer: question.answer,
        }));
      }

      var payload = {
        submit: true,
        questions: answeredQuestion,
      };

      try {
        await submitAnswerPractice(
          localStorage.getItem("newPracticeId"),
          payload,
          token
        );

        // Đợi submitAnswerPractice hoàn thành rồi mới gọi getQuizQuestions
        dispatch(
          getQuizInformations({
            quizId: "67cbd500a8a69a4dd320b14b",
            token,
          })
        );
      } catch (error) {
        console.log(error);
      }
    }
    setIsPopupSubmitAllPractice(false);
    setIsPopupCaculationScore(true);
  };

  const storedAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];

  const answeredQuestions = storedAnswers.filter(
    (ans) =>
      typeof ans.answer === "number" ||
      (Array.isArray(ans.answer) && ans.answer.length > 0)
  ).length;

  const totalQuestions = questions.length;
  const unansweredQuestions = totalQuestions - answeredQuestions;

  const showSolutions = JSON.parse(localStorage.getItem("showSolutions"));

  const userAnswers = JSON.parse(localStorage.getItem("userAnswers"));

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("showSolutions")) &&
      window.location.pathname === "/bai_kiem_tra_thuc_hanh"
    ) {
      dispatch(
        getQuizInformations({
          quizId: "67cbd500a8a69a4dd320b14b",
          token,
        })
      );
    }
  }, []);

  return (
    <>
      {isShowPopupCancel && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-[1100] transition-opacity duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-2xl text-center w-120 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Bạn sẽ bỏ lỡ trả lời những câu còn lại ?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={showPopupSubmitAllPractice}
                className="cursor-pointer px-5 py-2.5 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 active:bg-red-700 transition-all"
              >
                Nộp toàn bộ
              </button>
              <button
                onClick={handleConfirmExit}
                className="cursor-pointer px-5 py-2.5 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 active:bg-gray-500 transition-all"
              >
                Thoát và không làm câu còn lại
              </button>
            </div>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-[1100] transition-opacity duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-2xl text-center w-90 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Bạn có chắc chắn muốn thoát?
            </h2>
            <p className="text-gray-600 mb-6">
              Tiến trình của bạn có thể bị mất.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmExit}
                className="cursor-pointer px-5 py-2.5 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 active:bg-red-700 transition-all"
              >
                Đồng ý
              </button>
              <button
                onClick={handleCancelExit}
                className="cursor-pointer px-5 py-2.5 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 active:bg-gray-500 transition-all"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {isPopupSubmitAllPractice && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-[1100] transition-opacity duration-300">
          <div className="flex flex-col justify-center items-center gap-10 jus bg-white p-6 rounded-2xl shadow-2xl text-center w-3/4 animate-fadeIn">
            <div className="flex flex-col gap-4 justify-center items-center">
              <p className="font-bold text-3xl uppercase text-green-600 drop-shadow-[0_0_8px_rgba(72,187,120,0.8)]">
                Nộp bài
              </p>

              <p className="leading-none font-bold text-xl text-green-900">
                {localStorage.getItem("practiceName")}
              </p>
            </div>
            <div className="flex flex-col gap-5">
              {" "}
              <div className="flex flex-row justify-center items-center gap-20">
                {" "}
                <div className="flex flex-col gap-4 justify-center items-center w-[45rem]">
                  <div className="flex flex-row gap-2 justify-center items-center">
                    <div className="flex flex-row justify-center items-center gap-2">
                      <span className="bg-gray-200 w-3 h-3 border-white shadow-[4px_4px_10px_rgba(0,0,0,0.2)]"></span>
                      <p className="text-xs">Chưa làm</p>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2">
                      <span className="bg-gradient-to-r w-3 h-3 from-yellow-400 to-yellow-500 text-white shadow-[0_4px_15px_rgba(234,179,8,0.4)]"></span>
                      <p className="text-xs">Đã làm</p>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-wrap justify-center items-center">
                    {questions.map((item, index) => {
                      const storedAnswers =
                        JSON.parse(localStorage.getItem("userAnswers")) || [];
                      const userAnswer = storedAnswers.find(
                        (ans) => ans.questionIndex === index
                      );

                      const hasValidAnswer =
                        userAnswer &&
                        (typeof userAnswer.answer === "number" ||
                          (Array.isArray(userAnswer.answer) &&
                            userAnswer.answer.length > 0));

                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setIsPopupSubmitAllPractice(false);
                            handleQuestionChange(index);
                          }}
                          className={`px-4 h-[2.7rem] cursor-pointer border-1 font-semibold rounded-xl transition-all duration-300
                  ${
                    hasValidAnswer
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-[0_4px_15px_rgba(234,179,8,0.4)] hover:shadow-[0_6px_20px_rgba(234,179,8,0.5)] active:shadow-[0_2px_10px_rgba(234,179,8,0.5)]"
                      : "bg-gray-200 text-gray-700 border-white shadow-[4px_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.3)] active:shadow-[2px_2px_6px_rgba(0,0,0,0.3)]"
                  }`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-start gap-3 p-4 bg-white border border-gray-300 shadow-md rounded-xl w-2/4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Thống kê câu hỏi
                  </h3>

                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-list text-blue-500"></i>
                    <p className="text-base text-gray-700">
                      Tổng số câu hỏi:{" "}
                      <span className="font-semibold text-gray-900">
                        {totalQuestions}
                      </span>{" "}
                      câu
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-check-circle text-green-500"></i>
                    <p className="text-base text-gray-700">
                      Số câu đã làm:{" "}
                      <span className="font-semibold text-green-700">
                        {answeredQuestions}
                      </span>{" "}
                      / {totalQuestions} câu
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-circle-xmark text-red-500"></i>
                    <p className="text-base text-gray-700">
                      Số câu chưa làm:{" "}
                      <span className="font-semibold text-red-700">
                        {unansweredQuestions}
                      </span>{" "}
                      / {totalQuestions} câu
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={handleSubmitAll}
                  className="cursor-pointer px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 
                  bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md 
                  hover:from-green-600 hover:to-teal-600 hover:shadow-lg 
                  active:shadow-none active:translate-y-1 border border-green-700 flex items-center gap-2 uppercase"
                >
                  🌿 Xác nhận nộp bài
                </button>

                <button
                  onClick={handleCancelSubmitAll}
                  className="cursor-pointer px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 
                  bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md 
                  hover:from-gray-500 hover:to-gray-600 hover:shadow-lg 
                  active:shadow-none active:translate-y-1 border border-gray-600 flex items-center gap-2 uppercase"
                >
                  🦉 Chưa nộp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isPopupCaculationScore && (
        <ScorePopup
          handleQuestionChange={handleQuestionChange}
          setIsLoadingShowSolution={setIsLoadingShowSolution}
          isPopupCaculationScore={isPopupCaculationScore}
          setIsPopupCaculationScore={setIsPopupCaculationScore}
          questions={questions}
        />
      )}

      <div className="fixed right-0 flex flex-col w-75 h-screen justify-center items-center z-[1000]">
        <div className="flex flex-col p-[2.5rem_1.5rem_1.5rem] rounded-[2.5rem_2.5rem_1.5rem_1.5rem] border border-[1.5px] border-[#0A2A66] shadow-[0.3rem_0.3rem_0rem_#1B5E20] w-64 gap-[1rem] relative justify-between bg-[#fafbfc]">
          <div
            onClick={handleCloseQuestions}
            className="flex flex-row justify-center items-center cursor-pointer py-2 text-lg font-bold rounded-xl transition-all duration-300 
             bg-gradient-to-b from-white to-green-300 text-green-900 shadow-md gap-2
             hover:from-green-200 hover:to-green-500 hover:shadow-lg 
             active:shadow-none active:translate-y-1 border border-green-700 absolute z-1 top-[-1.5rem] left-0 right-0 m-auto w-27"
          >
            <i className="fa-solid fa-xmark"></i>
            <p className="text-xs uppercase">Quay lại</p>
          </div>

          <p className="leading-none font-bold text-xl text-green-900">
            {localStorage.getItem("practiceName")}
          </p>

          <div className="flex gap-4 flex-wrap justify-center items-center">
            {questions.map((item, index) => {
              const storedAnswers =
                JSON.parse(localStorage.getItem("userAnswers")) || [];
              const userAnswer = storedAnswers.find(
                (ans) => ans.questionIndex === index
              );

              const hasValidAnswer =
                userAnswer &&
                (userAnswer?.answer?.length > 0 ||
                  (userAnswer?.answer !== null &&
                    userAnswer?.userChoice?.length > 0));

              return (
                <button
                  key={index}
                  onClick={() => handleQuestionChange(index)}
                  className={`px-4 h-[2.7rem] min-w-[3.2rem] cursor-pointer border-2 font-semibold rounded-xl transition-all duration-300
    ${
      showSolutions
        ? questions[index].question.solutions?.toString() ===
          userAnswers[index].userChoice?.toString()
          ? "bg-gradient-to-r from-green-400 to-green-600 text-white border-green-700 shadow-[0_4px_15px_rgba(34,197,94,0.5)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.7)] ring-2 ring-green-300 drop-shadow-xl scale-105"
          : "bg-gradient-to-r from-red-400 to-red-600 text-white border-red-700 shadow-[0_4px_15px_rgba(239,68,68,0.5)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.7)] ring-2 ring-red-300 drop-shadow-xl scale-105"
        : hasValidAnswer
        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-yellow-600 shadow-[0_4px_15px_rgba(234,179,8,0.5)] hover:shadow-[0_6px_20px_rgba(234,179,8,0.7)] ring-2 ring-yellow-300 drop-shadow-xl scale-105"
        : selectedIndex === index
        ? "bg-green-500 text-white border-green-700 shadow-[0_4px_15px_rgba(34,197,94,0.5)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.7)] ring-2 ring-green-300 drop-shadow-xl scale-105"
        : "bg-gray-200 text-gray-700 border-white shadow-[4px_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.3)] active:shadow-[2px_2px_6px_rgba(0,0,0,0.3)]"
    }
    ${selectedIndex === index ? "ring-2 ring-white" : ""}
  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="flex flex-row gap-2 justify-center items-center">
            {showSolutions ? (
              <>
                <div className="flex flex-row justify-center items-center gap-2">
                  <span className="bg-gradient-to-r from-green-400 to-green-600 w-3 h-3 border-white shadow-[4px_4px_10px_rgba(0,0,0,0.2)]"></span>
                  <p className="text-xs">Đúng</p>
                </div>
                <div className="flex flex-row justify-center items-center gap-2">
                  <span className="bg-gradient-to-r from-red-400 to-red-600 w-3 h-3 text-white shadow-[0_4px_15px_rgba(234,179,8,0.4)]"></span>
                  <p className="text-xs">Sai</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-row justify-center items-center gap-2">
                  <span className="bg-gray-200 w-3 h-3 border-white shadow-[4px_4px_10px_rgba(0,0,0,0.2)]"></span>
                  <p className="text-xs">Chưa làm</p>
                </div>
                <div className="flex flex-row justify-center items-center gap-2">
                  <span className="bg-gradient-to-r w-3 h-3 from-yellow-400 to-yellow-500 text-white shadow-[0_4px_15px_rgba(234,179,8,0.4)]"></span>
                  <p className="text-xs">Đã làm</p>
                </div>
                <div className="flex flex-row justify-center items-center gap-2">
                  <span className="bg-green-500 text-white w-3 h-3 shadow-[0_4px_15px_rgba(34,197,94,0.4)]"></span>
                  <p className="text-xs">Hiện tại</p>
                </div>
              </>
            )}
          </div>
        </div>
        {localStorage.getItem("showSolutions") && (
          <div
            className="px-2 z-100 w-64 py-4 text-base font-bold rounded-xl transition-all duration-300 
      bg-gradient-to-r from-green-400 to-teal-600 text-white shadow-lg ring-2 ring-teal-300 
      hover:from-green-500 hover:to-teal-700 hover:shadow-xl 
      active:shadow-none active:translate-y-1 border border-green-800 uppercase 
      flex justify-center items-center gap-3"
          >
            🌱 Điểm luyện thi:{" "}
            <span className="text-2xl font-extrabold text-yellow-200">
              {window.location.pathname === "/bai_kiem_tra_thuc_hanh"
                ? quizInformation?.correctAnswersLP
                : JSON.parse(localStorage.getItem("scorePractice") || 0)}{" "}
              /{questions.length}
            </span>
          </div>
        )}

        <button
          onClick={
            showSolutions ? handleConfirmExit : showPopupSubmitAllPractice
          }
          className="px-6 w-64 z-10 cursor-pointer py-5 text-lg font-bold rounded-xl transition-all duration-300 
             bg-gradient-to-b from-white to-orange-300 text-orange-900 shadow-md 
             hover:from-orange-200 hover:to-orange-500 hover:shadow-lg 
             active:shadow-none active:translate-y-1 border border-orange-700 uppercase"
        >
          {localStorage.getItem("showSolutions") ? "Đã xem xong" : "Nộp bài"}
        </button>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    quizInformation: state.quiz.quizInformation,
  };
}

export default connect(mapStateToProps)(PracticeQuestionRight);
