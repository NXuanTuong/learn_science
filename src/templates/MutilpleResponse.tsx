import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserAnswer } from "../store/listQuestionSlice";
import { QuestionTemplateProps } from "../interface/question";
import React from "react";
import { selectAnsweredQuestions } from "../store/quizQuestionSlice";

const MultipleResponseQuestion = ({
  question,
  selectedQuestion,
  handleQuestionChange,
  questionId,
  questions,
  questionItem,
}: QuestionTemplateProps) => {
  const questionChoices = question.choices;
  const dispatch = useDispatch();

  const getGridCols = () => {
    if (questionChoices.length >= 6) return "grid-cols-4"; // 3 trên, 2 dưới
    if (questionChoices.length === 5) return "grid-cols-3"; // 3 trên, 2 dưới
    if (questionChoices.length === 4) return "grid-cols-2"; // 2 trên, 2 dưới
    return "grid-cols-3"; // 3 trong một hàng
  };

  const answeredQuestions = useSelector(selectAnsweredQuestions);

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

  const handleSelect = (index) => {
    if (window.location.pathname === "/bai_kiem_tra_thuc_hanh") {
      if (selectedIndices.includes(index)) {
        saveAnswer(selectedIndices.filter((item) => item !== index));
      } else {
        saveAnswer([...selectedIndices, index]);
      }
    }

    setSelectedIndices((prevIndices) => {
      const updatedIndices = prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index) // Bỏ chọn nếu đã chọn trước đó
        : [...prevIndices, index]; // Thêm vào danh sách nếu chưa chọn

      // Tạo một mảng Boolean với độ dài của questionChoices
      const answer = questionChoices.map((_, i) => updatedIndices.includes(i));

      dispatch(
        setUserAnswer({
          id:
            window.location.pathname === "/bai_kiem_tra_thuc_hanh"
              ? questionItem.questionId
              : questionItem._id,
          answer: updatedIndices,
          questionIndex: selectedQuestion,
          template: "MultipleResponse",
          userChoice: answer,
        })
      );

      return updatedIndices; // Cập nhật state
    });
  };

  const saveAnswer = (index) => {
    let questionState = {
      index: selectedQuestion,
      state: {
        selected: index,
      },
    };
    let answer = questionChoices.map((item) => false);
    index.map((item) => (answer[item] = true));

    if (index.length > 0) {
      index.map((item) => (answer[item] = true));
    } else {
      answer = null;
    }

    var newAnswer = {
      questionId: questionId,
      answer: answer,
      questionIndex: selectedQuestion,
      selected: index,
    };
    // setSelected(selected);
    var result = [...answeredQuestions];
    if (result.length === 0) {
      result.push(newAnswer);
    } else {
      var flag = true;
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

    if (index.length === 0) {
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

  const showSolutions = JSON.parse(
    localStorage.getItem("showSolutions") as any
  );

  // Kiểm tra nếu tất cả các lựa chọn đều đúng
  const isAllCorrect =
    selectedIndices.length > 0 &&
    selectedIndices.every((index) => question.solutions[index]);

  return (
    <>
      <div className="flex flex-col gap-8 justify-center items-center">
        <div className={`grid ${getGridCols()} gap-8`}>
          {questionChoices.map((choice, index) => {
            const isSelected = selectedIndices?.includes(index);

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={JSON.parse(showSolutions)}
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

            <div className="w-full flex flex-col justify-center items-center bg-white p-4 rounded-lg shadow-md border border-gray-300">
              <p className="text-lg font-bold text-gray-800 mb-2">
                🎯 Đáp án đúng:
              </p>
              <div className="flex flex-row gap-5">
                {questionChoices.map((choice, index) =>
                  question.solutions[index] ? ( // Chỉ hiển thị nếu đúng (true)
                    <button
                      key={index}
                      disabled={JSON.parse(showSolutions)}
                      className={`w-[9rem] h-auto cursor-pointer p-3 text-lg font-bold rounded-lg relative transition-all duration-300 ease-in-out
                      bg-green-500 text-white shadow-[0px_4px_0px_#1B5E20] scale-105 border border-white
                      hover:from-green-400 hover:to-green-600 hover:shadow-[1px_1px_0px_#1B5E20]
                      active:shadow-none active:translate-y-[2px] active:translate-x-[2px]`}
                    >
                      {choice}
                    </button>
                  ) : null
                )}
              </div>
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

export default MultipleResponseQuestion;
