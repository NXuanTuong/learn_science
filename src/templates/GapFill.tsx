import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { clickButton } from "../helper/sounds";
import { QuestionTemplateProps } from "../interface/question";
import { setUserAnswer } from "../store/listQuestionSlice";

const Gapfill = ({
  questionItem,
  question,
  selectedQuestion,
  questionId,
  handleQuestionChange,
  questions,
}: QuestionTemplateProps) => {
  const questionTexts = question.texts; // ["Cây", "cao", "nhất", "là"] → text phần đầu và sau chỗ trống
  const questionChoices = question.choices;
  const questionSolutions = question.solutions;
  const questionsExplanation = questionItem.explanation.texts;
  const dispatch = useDispatch();
  const [showExplation, setShowExplation] = useState(false);
  const audio = new Audio(clickButton);

  const [answers, setAnswers] = useState<string[]>(() => {
    const storedAnswers = localStorage.getItem("userAnswers");

    if (storedAnswers) {
      try {
        const parsedAnswers = JSON.parse(storedAnswers);
        return parsedAnswers[selectedQuestion]?.answer || [];
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
    return Array(questionTexts.length - 1).fill("");
  });

  const handleAnswerChange = (value: string, index: number) => {
    const updated = [...answers];
    updated[index] = value.toLowerCase();

    dispatch(
      setUserAnswer({
        id:
          window.location.pathname === "/bai_kiem_tra_thuc_hanh"
            ? questionItem.questionId
            : questionItem._id,
        answer: updated,
        questionIndex: selectedQuestion,
        template: "GapFill",
        userChoice: updated,
      })
    );

    if (window.location.pathname === "/bai_kiem_tra_thuc_hanh") {
      saveAnswer(updated, questionItem.questionId);
    }

    setAnswers(updated);
  };

  const saveAnswer = (answer: Object, questionId: String) => {
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
    JSON.stringify(
      JSON.parse(localStorage.getItem("userAnswers"))[selectedQuestion]
        ?.userChoice
    ) === JSON.stringify(question.solutions);

  return (
    <>
      <div className="flex flex-col gap-8 justify-center items-center w-full">
        {questionChoices && questionChoices.length > 0 && (
          <div className="w-full max-w-4xl mx-auto px-4">
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${questionChoices.length}`}
            >
              {questionChoices.map((choice, index) => (
                <div className="flex flex-row justify-center items-center gap-6">
                  <p className="w-fit px-2 py-1 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-md shadow-sm">
                    {choice !== "" ? choice : index + 1}
                  </p>

                  <input
                    type="text"
                    placeholder="Điền đáp án tương ứng"
                    disabled={
                      localStorage.getItem("showSolutions") ? true : false
                    }
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(e.target.value, index)}
                    maxLength={50}
                    className={`select-none text-center text-xl font-semibold mt-1 px-2 py-2 rounded-lg border-2 border-green-700 hover:border-green-800 focus:outline-none border-white focus:ring-2 focus:ring-white shadow-sm bg-green-600 text-white placeholder-white/60
 transition-all duration-200 ${
   answers[index] && answers[index].length > 0 ? "" : "w-60"
 }`}
                    style={
                      answers[index] && answers[index].length > 0
                        ? { width: `${answers[index].length + 5}ch` }
                        : {}
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation buttons như cũ */}
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

            {isAllCorrect ? (
              <></>
            ) : (
              <>
                <p className="text-yellow-500 text-2xl font-semibold tracking-widest">
                  ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨
                </p>

                <div className="w-full  flex flex-col justify-center items-center bg-white p-4 rounded-lg shadow-md border border-gray-300">
                  <p className="text-lg font-bold text-gray-800 mb-2">
                    🎯 Đáp án đúng:
                  </p>
                  <div className="flex flex-row flex-wrap gap-4 p-4 bg-gradient-to-r from-green-200 to-blue-200 rounded-xl shadow-lg justify-center items-center">
                    {questionSolutions.map((text: any, index: any) => (
                      <Fragment
                        key={index}
                        // className="text-center flex flex-row items-center gap-4"
                      >
                        <p className="w-fit px-2 py-1 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-md shadow-sm">
                          {index + 1}
                        </p>

                        <input
                          type="text"
                          placeholder="Điền đáp án tương ứng"
                          disabled={true}
                          value={questionSolutions[index]}
                          maxLength={50}
                          className={`select-none text-center text-xl font-semibold text-green-900 mt-1 px-2 py-2 rounded-lg border-2 border-gray-400 hover:border-gray-600 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300 shadow-sm text-gray-800 placeholder-gray-400 transition-all duration-200 ${
                            questionSolutions[index] &&
                            questionSolutions[index].length > 0
                              ? ""
                              : "w-60"
                          }`}
                          style={
                            questionSolutions[index] &&
                            questionSolutions[index].length > 0
                              ? {
                                  width: `${
                                    questionSolutions[index].length + 5
                                  }ch`,
                                }
                              : {}
                          }
                        />
                      </Fragment>
                    ))}
                  </div>
                </div>

                {!showExplation ? (
                  <button
                    onClick={() => setShowExplation(true)}
                    className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 hover:from-blue-600 hover:to-purple-600"
                  >
                    <span className="relative z-10">🚨 Xem phao cứu trợ</span>
                  </button>
                ) : (
                  <div className="space-y-3 bg-blue-50 border border-blue-200 p-5 rounded-xl shadow-sm">
                    <p className="text-center text-blue-700 uppercase font-semibold text-lg tracking-wider">
                      🛟 Phao Cứu Sinh
                    </p>
                    {questionsExplanation.map((line, index) => (
                      <p
                        key={index}
                        className="text-gray-800 text-base leading-relaxed"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div
        className={`w-full max-w-[60rem] absolute left-1/2 bottom-[-5rem] transform -translate-x-1/2 flex flex-row justify-between items-center h-auto`}
      >
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

        {questions.length - 1 !== selectedQuestion &&
          (answers.some((ans) => ans && ans.trim() !== "") ? (
            <button
              onClick={() => {
                audio.play();
                handleQuestionChange(selectedQuestion + 1);
                setShowExplation(false);
              }}
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
          ))}
      </div>
    </>
  );
};

export default Gapfill;
