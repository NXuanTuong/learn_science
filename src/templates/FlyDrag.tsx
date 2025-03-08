import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserAnswer } from "../store/listQuestionSlice";
import { QuestionTemplateProps } from "../interface/question";
import React from "react";

const FlyDrag = ({
  question,
  selectedQuestion,
  handleQuestionChange,
  questions,
  questionItem,
}: QuestionTemplateProps) => {
  let questionChoices = question.choices;
  const questionTexts = question.texts;
  const questionSolutions = question.solutions;
  const dispatch = useDispatch();

  const [selectedIndices, setSelectedIndices] = useState(() => {
    const storedAnswers = localStorage.getItem("userAnswers");

    if (storedAnswers) {
      try {
        const parsedAnswers = JSON.parse(storedAnswers);
        return parsedAnswers[selectedQuestion]?.answer || [];
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }

    return []; // Trả về mảng rỗng nếu không có dữ liệu hợp lệ
  });

  const handleSelect = (index: number) => {
    if (selectedIndices.length == questionSolutions.length && selectedIndices.every((item) => item !== -1)) {
      return 
    }
    setSelectedIndices((prev) => {
      let updatedIndices = [...prev];

      const emptyIndex = updatedIndices.findIndex((i) => i === -1);
      if (emptyIndex !== -1) {
        updatedIndices[emptyIndex] = index;
      } else {
        updatedIndices.push(index);
      }

      dispatch(
        setUserAnswer({
          id:
            window.location.pathname === "/bai_kiem_tra_thuc_hanh"
              ? questionItem.questionId
              : questionItem._id,
          answer: updatedIndices,
          questionIndex: selectedQuestion,
          template: "MultipleResponse",
          userChoice: updatedIndices,
        })
      );

      if (window.location.pathname === "/bai_kiem_tra_thuc_hanh") {
        saveAnswer(updatedIndices, questionItem.questionId);
      }

      return updatedIndices;
    });
  };

  // Khi bấm vào choice trên câu hỏi để đưa về danh sách gốc
  const handleDeselect = (index: number) => {
    setSelectedIndices((prev) => {
      let updatedIndices = prev.map((i, idx) => (idx === index ? -1 : i));
      const allRemoved = updatedIndices.every((i) => i === -1); // Kiểm tra nếu chỉ toàn `-1`
      const finalAnswer = allRemoved ? [] : updatedIndices;

      dispatch(
        setUserAnswer({
          id:
            window.location.pathname === "/bai_kiem_tra_thuc_hanh"
              ? questionItem.questionId
              : questionItem._id,
          answer: finalAnswer,
          questionIndex: selectedQuestion,
          template: "MultipleResponse",
          userChoice: finalAnswer,
        })
      );

      if (window.location.pathname === "/bai_kiem_tra_thuc_hanh") {
        saveAnswer(finalAnswer, questionItem.questionId);
      }

      return finalAnswer ?? [];
    });
  };

  const saveAnswer = (answer, questionId) => {
    const submit = {
      submit: false,
      questions: [
        {
          answer: answer,
          questionId: questionId,
          questionIndex: selectedQuestion,
        },
      ],
    };

    const questionsAnswered = [
      {
        answer: answer,
        questionId: questionId,
        questionIndex: selectedQuestion,
      },
    ];

    const value = { questionsAnswered, submit };

    localStorage.setItem("questionStateExams", JSON.stringify(value));
  };

  const showSolutions = JSON.parse(
    localStorage.getItem("showSolutions") as string
  );

  const isAllCorrect =
    JSON.stringify(selectedIndices) === JSON.stringify(question.solutions);

  return (
    <>
      <div className="flex flex-col gap-8 justify-center items-center">
        {questionTexts && questionTexts?.length > 0 && (
          <div className="flex flex-row flex-wrap gap-4 p-4 bg-gradient-to-r from-green-200 to-blue-200 rounded-xl shadow-lg">
            {questionTexts.map((text: any, index: any) => (
              <Fragment
                key={index}
                // className=" flex flex-row  gap-4"
              >
                {/* Câu hỏi */}
                <span className="text-xl font-semibold text-green-900" style={{ whiteSpace: "nowrap" }}>{text}</span>

                {index < questionTexts.length - 1 && (
                  <>
                    {selectedIndices[index] !== undefined ? (
                      <div className="flex flex-col ">
                        {questionChoices[selectedIndices[index]] !==
                          undefined && (
                          <div
                            onClick={() => {
                              if (!showSolutions) {
                                handleDeselect(index);
                              }
                            }}
                            className={`${
                              showSolutions
                                ? questionSolutions[index] - 1 ===
                                  selectedIndices[index]
                                  ? "bg-green-600" // Đúng khi showSolutions bật
                                  : "bg-red-600" // Sai khi showSolutions bật
                                : "bg-green-600" // Mặc định xanh khi showSolutions tắt
                            } text-white px-4 py-2 rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer flex items-center gap-2`}
                          >
                            {questionChoices[selectedIndices[index]]}
                          </div>
                        )}

                        {/* Hiệu ứng đường kẻ */}
                        <div className="w-16 h-1 bg-green-700 mt-2 rounded-full transition-all duration-300"></div>
                      </div>
                    ) : (
                      <div className="w-16 h-1 bg-gray-300 mt-4 rounded-full"></div>
                    )}
                  </>
                )}
              </Fragment>
            ))}
          </div>
        )}
        <div className={`gap-4 grid grid-cols-4 `}>
          {questionChoices.map((choice: any, index: any) => {
            const isSelected = selectedIndices?.includes(index);

            const storedAnswers = localStorage.getItem("userAnswers");

            const parsedAnswers = JSON.parse(storedAnswers);

            return (
              <>
                {isSelected ? (
                  <div key={index}></div>
                ) : (
                  !selectedIndices.includes(index) && (
                    <button
                      key={index}
                      onClick={() => handleSelect(index)}
                      disabled={
                        JSON.parse(showSolutions) ||
                        (parsedAnswers[selectedQuestion]?.useChoice?.length ===
                          questionSolutions.length &&
                          !parsedAnswers[selectedQuestion]?.useChoice?.includes(
                            -1
                          ))
                      }
                      className={`w-[9rem] h-auto cursor-pointer p-3 text-lg font-bold rounded-lg transition-all duration-300 ease-in-out
                      ${
                        selectedIndices.includes(index) // Kiểm tra nếu index nằm trong danh sách lựa chọn
                          ? JSON.parse(showSolutions)
                            ? question.solutions[index] // Kiểm tra đúng/sai từ solutions
                              ? "bg-green-500 text-white shadow-[0px_4px_0px_#1B5E20] scale-105 border border-white" // Đúng -> Xanh
                              : "bg-red-500 text-white shadow-[0px_4px_0px_#8B0000] scale-105 border border-white" // Sai -> Đỏ
                            : "bg-green-700 text-white shadow-[0px_4px_0px_#1B5E20] scale-105 border border-white" // Khi chọn trước khi xem đáp án
                          : "bg-white text-green-900 shadow-[2px_2px_0px_#1B5E20] border border-green"
                      }
                      hover:from-green-400 hover:to-green-600 hover:shadow-[1px_1px_0px_#1B5E20]
                      active:shadow-none active:translate-y-[2px] active:translate-x-[2px]`}
                    >
                      {choice}
                    </button>
                  )
                )}
              </>
            );
          })}
        </div>
        {showSolutions && (
          <div className="flex flex-col gap-4 justify-center items-center">
            <p
              className={`text-xl uppercase font-bold px-6 py-3 rounded-lg transition-all duration-300 ease-in-out
            ${
              isAllCorrect
                ? "bg-gradient-to-r from-green-400 to-green-600 text-white/90 border-2 border-green-700 shadow-lg ring-2 ring-green-300 drop-shadow-xl"
                : "bg-gradient-to-r from-red-400 to-red-600 text-white/90 border-2 border-red-700 shadow-lg ring-2 ring-red-300 drop-shadow-xl"
            }
          `}
            >
              {isAllCorrect ? "✅ Đúng rồi!" : "Sai rồi!"}
            </p>

            <p className="text-yellow-500 text-2xl font-semibold tracking-widest">
              ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨
            </p>

            <div className="w-full  flex flex-col justify-center items-center bg-white p-4 rounded-lg shadow-md border border-gray-300">
              <p className="text-lg font-bold text-gray-800 mb-2">
                🎯 Đáp án đúng:
              </p>
              {questionTexts && questionTexts?.length > 0 && (
                <div className="flex flex-row flex-wrap gap-1 items-end p-4 bg-gradient-to-r from-green-200 to-blue-200 rounded-xl shadow-lg">
                  {questionTexts.map((text: any, index: any) => (
                    <Fragment
                      key={index}
                      // className="text-center flex flex-row items-center gap-4"
                    >
                      {/* Câu hỏi */}
                      <span className="text-xl font-semibold text-green-900" style={{whiteSpace:"nowrap"}}>
                        {text}
                      </span>

                      {index < questionTexts.length - 1 && (
                        <>
                          <span className="flex flex-col items-center">
                            {/* Lựa chọn được chọn */}

                            <div className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer flex items-center gap-2">
                              {questionChoices[questionSolutions[index] - 1]}
                            </div>

                            {/* Hiệu ứng đường kẻ */}
                            <div className="w-16 h-1 bg-green-700 mt-2 rounded-full transition-all duration-300"></div>
                          </span>
                        </>
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div
        className={`w-full max-w-[60rem] absolute left-1/2 bottom-[-5rem] transform -translate-x-1/2 flex flex-row justify-between items-center h-auto`}
      >
        <button
          onClick={() => handleQuestionChange(selectedQuestion - 1)}
          disabled={selectedQuestion === 0}
          className={`px-6 cursor-pointer py-3 text-lg font-bold rounded-full transition-all duration-300 
          ${
            selectedQuestion === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed shadow-none border-gray-500"
              : "bg-gradient-to-b from-white to-green-300 text-green-900 shadow-md border border-green-700 hover:from-green-200 hover:to-green-500 hover:shadow-lg active:shadow-none active:translate-y-1"
          }`}
        >
          Câu trước
        </button>

        {questions.length - 1 !== selectedQuestion ? (
          selectedIndices.length > 0 ? (
            <button
              onClick={() => handleQuestionChange(selectedQuestion + 1)}
              className="px-6 cursor-pointer py-3 text-lg font-bold rounded-full transition-all duration-300 
             bg-gradient-to-b from-white to-green-300 text-green-900 shadow-md 
             hover:from-green-200 hover:to-green-500 hover:shadow-lg 
             active:shadow-none active:translate-y-1 border border-green-700"
            >
              Câu sau
            </button>
          ) : (
            <button
              onClick={() => handleQuestionChange(selectedQuestion + 1)}
              className="px-6 py-3 cursor-pointer text-lg font-bold rounded-full transition-all duration-300 
             bg-gradient-to-b from-white to-orange-300 text-orange-900 shadow-md 
             hover:from-orange-200 hover:to-orange-500 hover:shadow-lg 
             active:shadow-none active:translate-y-1 border border-orange-700"
            >
              Bỏ qua
            </button>
          )
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default FlyDrag;
