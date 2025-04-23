import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserAnswer } from "../store/listQuestionSlice";
import { QuestionTemplateProps } from "../interface/question";
import React from "react";
import { selectAnsweredQuestions } from "../store/quizQuestionSlice";
import { clickButton } from "../helper/sounds";
import ImageFromUrl from "../helper/imageFromUrl";

const MultipleChoiceQuestion = ({
  questionItem,
  question,
  selectedQuestion,
  questionId,
  handleQuestionChange,
  questions,
}: QuestionTemplateProps) => {
  const questionChoices = question.choices;
  const questionText =
    question.texts !== null &&
    question.texts !== undefined &&
    question.texts.length > 0
      ? question.texts.map((text, index) => text)
      : question.texts;
  const questionsExplanation = questionItem.explanation.texts;
  const questionsExplanationImages = questionItem.explanation.images;

  const dispatch = useDispatch();
  const getGridCols = () => {
    if (questionChoices.length >= 5) return "grid-cols-3"; // 3 trên, 2 dưới
    if (questionChoices.length === 4) return "grid-cols-2"; // 2 trên, 2 dưới
    return "grid-cols-3"; // 3 trong một hàng
  };
  const audio = new Audio(clickButton);
  const answeredQuestions = useSelector(selectAnsweredQuestions);
  const [showExplation, setShowExplation] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(() => {
    const storedAnswers = localStorage.getItem("userAnswers");

    if (storedAnswers) {
      try {
        const parsedAnswers = JSON.parse(storedAnswers);
        return parsedAnswers[selectedQuestion]?.answer;
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }

    return null; // Trả về mảng rỗng nếu không có dữ liệu hợp lệ
  });

  const handleSelect = (index) => {
    audio.play();
    if (window.location.pathname === "/bai_kiem_tra_thuc_hanh") {
      if (selectedIndex === index) {
        saveAnswer(-1);
      } else {
        saveAnswer(index);
      }
    }
    setSelectedIndex((prevIndex) => (prevIndex === index ? null : index));

    const answer = questionChoices.map((item) => false);
    answer[index] = true;

    dispatch(
      setUserAnswer({
        id:
          window.location.pathname === "/bai_kiem_tra_thuc_hanh"
            ? questionItem.questionId
            : questionItem._id,
        answer: index,
        questionIndex: selectedQuestion,
        template: "MultipleChoice",
        userChoice: answer,
      })
    );
  };

  const saveAnswer = (index) => {
    var questionState = {
      index: selectedQuestion,
      state: {
        selected: Number(index),
      },
    };
    let answer = questionChoices.map((item) => false);
    answer[index] = true;
    if (index !== -1) {
      answer[index] = true;
    } else {
      answer = null;
    }

    let newAnswer = {
      questionId: questionId,
      answer: answer,
      questionIndex: selectedQuestion,
      selected: index,
    };

    // setSelected(selected);
    let result = [...answeredQuestions];
    if (result.length === 0) {
      result.push(newAnswer);
    } else {
      let flag = true;
      for (let question = 0; question < answeredQuestions.length; question++) {
        if (answeredQuestions[question].questionId === newAnswer.questionId) {
          flag = true;
          break;
        } else {
          flag = false;
        }
      }
      if (!flag) {
        result.push(newAnswer);
      } else {
        result = answeredQuestions.map((question) =>
          question.questionId === questionId ? newAnswer : question
        );
      }
    }

    var questionsAnswered = result;

    const submit = { submit: false, questions: [newAnswer] };
    var questionAnswered = { questionIndex: selectedQuestion, status: true };

    if (index === -1) {
      questionAnswered.status = false;
    }

    const value = {
      questionState,
      questionAnswered,
      questionsAnswered,
      submit,
    };

    localStorage.setItem("questionStateExams", JSON.stringify(value));
  };

  const handleNextQuestion = () => {
    audio.play();
    handleQuestionChange(selectedQuestion + 1);
    setShowExplation(false);
  };

  const showSolutions = JSON.parse(
    localStorage.getItem("showSolutions") as any
  );

  return (
    <>
      {questionText !== null &&
        questionText !== undefined &&
        questionText.length > 0 && (
          <div className="select-none">{questionText}</div>
        )}

      <div className="flex flex-col gap-8 justify-center items-center">
        <div className={`grid ${getGridCols()} gap-8 w-full`}>
          {questionChoices.map((choice, index) => {
            const isSelected = index === selectedIndex;

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={showSolutions}
                className={`max-w-[40rem] h-auto cursor-pointer p-3 text-lg font-bold rounded-2xl relative transition-all duration-300 ease-in-out
              ${
                isSelected
                  ? showSolutions
                    ? question.solutions[selectedIndex]
                      ? "bg-green-500 text-white shadow-[0px_4px_0px_#1B5E20] scale-105 border border-white" // Đáp án đúng -> Xanh
                      : "bg-red-500 text-white shadow-[0px_4px_0px_#8B0000] scale-105 border border-white" // Đáp án sai -> Đỏ
                    : "bg-green-700 text-white shadow-[0px_4px_0px_#1B5E20] scale-105 border border-white" // Khi chọn trước khi xem đáp án
                  : "bg-white text-green-900 shadow-[2px_2px_0px_#1B5E20] border border-green"
              }
              hover:from-green-400 hover:to-green-600 hover:shadow-[1px_1px_0px_#1B5E20]
              active:shadow-none active:translate-y-[2px] active:translate-x-[2px]`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {showSolutions && (
          <div className="flex flex-col gap-6 justify-center items-center">
            <p
              className={`text-xl uppercase font-bold px-6 py-3 rounded-lg transition-all duration-300 ease-in-out
            ${
              question.solutions[selectedIndex] === true
                ? "bg-gradient-to-r from-green-400 to-green-600 text-white/90 border-2 border-green-700 shadow-lg ring-2 ring-green-300 drop-shadow-xl"
                : "bg-gradient-to-r from-red-400 to-red-600 text-white/90 border-2 border-red-700 shadow-lg ring-2 ring-red-300 drop-shadow-xl"
            }
          `}
            >
              {question.solutions[selectedIndex] === true
                ? "✅ Đúng rồi giỏi lắm!"
                : "Sai rồi!"}
            </p>

            {question.solutions[selectedIndex] === true ? (
              <></>
            ) : (
              <>
                <p className="text-yellow-500 text-2xl font-semibold tracking-widest">
                  ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨
                </p>

                <div className="w-full max-w-[40rem] flex flex-col justify-center items-center bg-white p-4 rounded-lg shadow-md border border-gray-300">
                  <p className="text-lg font-bold text-gray-800 mb-2">
                    🎯 Đáp án đúng:
                  </p>
                  {questionChoices.map((choice, index) =>
                    question.solutions[index] ? ( // Chỉ hiển thị nếu đúng (true)
                      <button
                        key={index}
                        disabled={JSON.parse(showSolutions)}
                        className={`max-w-[40rem] h-auto cursor-pointer p-3 text-lg font-bold rounded-2xl relative transition-all duration-300 ease-in-out
                      bg-green-500 text-white shadow-[0px_4px_0px_#1B5E20] scale-105 border border-white
                      hover:from-green-400 hover:to-green-600 hover:shadow-[1px_1px_0px_#1B5E20]
                      active:shadow-none active:translate-y-[2px] active:translate-x-[2px]`}
                      >
                        {choice}
                      </button>
                    ) : null
                  )}
                </div>

                {!showExplation ? (
                  <button
                    onClick={() => setShowExplation(true)}
                    className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 hover:from-blue-600 hover:to-purple-600"
                  >
                    <span className="relative z-10">🚨 Xem phao cứu trợ</span>
                  </button>
                ) : (
                  <>
                    {(questionsExplanation?.length > 0 ||
                      questionsExplanationImages?.length > 0) && (
                      <div className="space-y-3 bg-blue-50 border border-blue-200 p-5 rounded-xl shadow-sm">
                        <p className="text-center text-blue-700 uppercase font-semibold text-lg tracking-wider">
                          🛟 Phao Cứu Trợ
                        </p>

                        {(() => {
                          const items = [];
                          const maxLength = Math.max(
                            questionsExplanation?.length || 0,
                            questionsExplanationImages?.length || 0
                          );

                          for (let i = 0; i < maxLength; i++) {
                            if (questionsExplanation?.[i]) {
                              items.push({
                                type: "text",
                                content: questionsExplanation[i],
                              });
                            }
                            if (questionsExplanationImages?.[i]) {
                              items.push({
                                type: "image",
                                content: questionsExplanationImages[i],
                              });
                            }
                          }

                          return items.map((item, index) =>
                            item.type === "text" ? (
                              <p
                                key={index}
                                className="text-gray-800 text-base leading-relaxed text-justify"
                              >
                                {item.content}
                              </p>
                            ) : (
                              <ImageFromUrl
                                key={index}
                                objectId={item.content}
                                className="max-w-full h-auto mx-auto rounded-md"
                                style={undefined}
                                setImgWidth={undefined}
                                handleSetIsLoading={undefined}
                                onClick={undefined}
                              />
                            )
                          );
                        })()}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="w-full max-w-[60rem] bottom-[-5rem] absolute left-1/2 transform -translate-x-1/2 flex flex-row justify-between items-center h-auto">
        <button
          onClick={() => {
            audio.play();
            handleQuestionChange(selectedQuestion - 1);
            setShowExplation(false);
          }}
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
          selectedIndex != null ? (
            <button
              onClick={() => handleNextQuestion()}
              className="px-6 cursor-pointer py-3 text-lg font-bold rounded-full transition-all duration-300 
             bg-gradient-to-b from-white to-green-300 text-green-900 shadow-md 
             hover:from-green-200 hover:to-green-500 hover:shadow-lg 
             active:shadow-none active:translate-y-1 border border-green-700"
            >
              Câu sau
            </button>
          ) : (
            <button
              onClick={() => {
                audio.play();
                handleQuestionChange(selectedQuestion + 1);
                setShowExplation(false);
              }}
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

export default MultipleChoiceQuestion;
