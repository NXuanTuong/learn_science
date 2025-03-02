import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserAnswer } from "../store/listQuestionSlice";
import { QuestionTemplateProps } from "../interface/question";
import React from "react";

const Matching = ({
  question,
  selectedQuestion,
  handleQuestionChange,
  questions,
  questionItem,
}: QuestionTemplateProps) => {
  const questionChoices = question.choices;
  const questionTargets = question.targets;
  const dispatch = useDispatch();
  const initialSelectedIndices = questionTargets.map((_, index) => [-1, -1]);

  const getGridCols = () => {
    if (questionChoices.length === 5) return "grid-cols-3"; // 3 trên, 2 dưới
    if (questionChoices.length === 4) return "grid-cols-2"; // 2 trên, 2 dưới
    return "grid-cols-3"; // 3 trong một hàng
  };

  const [selectedIndices, setSelectedIndices] = useState(() => {
    const storedAnswers = localStorage.getItem("userAnswers");

    if (storedAnswers) {
      try {
        const parsedAnswers = JSON.parse(storedAnswers);
        return (
          parsedAnswers[selectedQuestion]?.answer || initialSelectedIndices
        );
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }

    return initialSelectedIndices; // Trả về mảng rỗng nếu không có dữ liệu hợp lệ
  });

  // mỗi item trong mảng select có dạng [leftIndex, rightIndex]
  // target => left, choice => right

  const handleSelectLeft = (index) => {
    let existSelect = selectedIndices.findIndex((item) => item[0] === index);
    let currentSelect = selectedIndices.findIndex(
      (item) => item[0] == -1 && item[1] !== -1
    );

    if (existSelect !== -1) {
      let rightIndex = selectedIndices[existSelect][1];
      let lastCurrentSelect = selectedIndices.findLastIndex(
        (item) => item[0] !== -1 && item[1] === -1
      );
      let lastCurrentSelectRight = lastCurrentSelect === -1 ? -1 : selectedIndices[lastCurrentSelect][1];
      setSelectedIndices((prevIndices) => {
        return prevIndices.map((item, i) =>
          i === existSelect
            ? [-1, -1]
            : i === lastCurrentSelect
            ? [index, lastCurrentSelectRight]
            : item
        );
      });
    } else {
      let lastPairComplete = selectedIndices.findLastIndex(
        (item) => item[0] !== -1 && item[1] !== -1
      );
      currentSelect = selectedIndices.findIndex(
        (item) => item[0] !== -1 && item[1] === -1
      );

      let firstLeftEmptyIndex = selectedIndices.findIndex(
        (item) => item[0] === -1
      );
      let saveIndex =
        lastPairComplete === -1
          ? currentSelect === -1
            ? firstLeftEmptyIndex
            : currentSelect
          : firstLeftEmptyIndex;
      let rightIndex = selectedIndices[saveIndex][1];
      setSelectedIndices((prevIndices) => {
        return prevIndices.map((item, i) =>
          i === saveIndex ? [index, rightIndex] : item
        );
      });
    }
    // handleSelect(index);
  };
  const handleSelectRight = (index) => {
    let existSelect = selectedIndices.findIndex((item) => item[1] === index);
    let currentSelect = selectedIndices.findIndex(
      (item) => item[1] === -1 && item[0] !== -1
    );

    if (existSelect !== -1) {
      let leftIndex = selectedIndices[existSelect][0];
      let lastCurrentSelect = selectedIndices.findLastIndex(
        (item) => item[0] !== -1 && item[1] === -1
      );
      let lastCurrentSelectLeft = lastCurrentSelect === -1 ? -1 : selectedIndices[lastCurrentSelect][0];
      setSelectedIndices((prevIndices) => {
        return prevIndices.map((item, i) =>
          i === existSelect
            ? [-1, -1]
            : i === lastCurrentSelect
            ? [lastCurrentSelectLeft, index]
            : item
        );
      });
    } else {
      let lastPairComplete = selectedIndices.findLastIndex(
        (item) => item[0] !== -1 && item[1] !== -1
      );
      currentSelect = selectedIndices.findIndex(
        (item) => item[0] === -1 && item[1] !== -1
      );
      let firstRightEmptyIndex = selectedIndices.findIndex(
        (item) => item[1] === -1
      );
      let saveIndex =
        lastPairComplete === -1
          ? currentSelect === -1
            ? firstRightEmptyIndex
            : currentSelect
          : firstRightEmptyIndex;
      let leftIndex = selectedIndices[saveIndex][0];
      setSelectedIndices((prevIndices) => {
        return prevIndices.map((item, i) =>
          i === saveIndex ? [leftIndex, index] : item
        );
      });
    }
  };

  const handleSelect = (index) => {
    setSelectedIndices((prevIndices) => {
      const updatedIndices = prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index) // Bỏ chọn nếu đã chọn trước đó
        : [...prevIndices, index]; // Thêm vào danh sách nếu chưa chọn

      // Tạo một mảng Boolean với độ dài của questionChoices
      const answer = questionChoices.map((_, i) => updatedIndices.includes(i));

      dispatch(
        setUserAnswer({
          id: questionItem._id,
          answer: updatedIndices,
          questionIndex: selectedQuestion,
          template: "MultipleResponse",
          userChoice: answer,
        })
      );

      return updatedIndices; // Cập nhật state
    });
  };

  const showSolutions = JSON.parse(
    localStorage.getItem("showSolutions") as string
  );

  const convertSelectToAnswer = (selected: any[]) => {
    const targetIndex = selected.map((item) => item[0]);
    const result = new Array(questionTargets.length).fill(-1);
    targetIndex.forEach((item) => {
      result[item] = item;
    });
    const answer= new Array(questionTargets.length).fill(-1);
    for (let i = 0; i < result.length; i++) {
      let item = result[i];
      selected.forEach((select) => {
        if (select[0] === item) {
          answer[i] = select[1] !== -1 ? select[1] + 1: -1;
        }
      });
      
    }

    return answer;
  };

  // Kiểm tra nếu tất cả các lựa chọn đều đúng
  const isAllCorrect =
    selectedIndices.length > 0 &&
    selectedIndices.every((index) => question.solutions[index]);
  return (
    <>
      <div className="flex flex-col gap-8 justify-center items-center">
        <div className="grid grid-cols-2 gap-4">
          <div className={`grid grid-row-1 gap-8`}>
            {questionTargets.map((choice, index) => {
              let left = selectedIndices.findIndex((item) => item[0] === index);
              left = left === -1 ? -1 : selectedIndices[left][0];
              const isSelected = left === index;
              return (
                <button
                  key={index}
                  onClick={() => handleSelectLeft(index)}
                  disabled={JSON.parse(showSolutions)}
                  className={`w-[9rem] h-[3.5rem] cursor-pointer p-3 text-lg font-bold rounded-full transition-all duration-300 ease-in-out
              ${
                isSelected // Kiểm tra nếu index nằm trong danh sách lựa chọn
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
          <div className={`grid grid-row-1 gap-8`}>
            {questionChoices.map((choice, index) => {
              let right = selectedIndices.findIndex(
                (item) => item[1] === index
              );
              right = right === -1 ? -1 : selectedIndices[right][1];
              const isSelected = right === index;

              return (
                <button
                  key={index}
                  onClick={() => handleSelectRight(index)}
                  disabled={JSON.parse(showSolutions)}
                  className={`w-[9rem] h-[3.5rem] cursor-pointer p-3 text-lg font-bold rounded-full transition-all duration-300 ease-in-out
              ${
                isSelected // Kiểm tra nếu index nằm trong danh sách lựa chọn
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

            <div className="w-full max-w-[40rem] flex flex-col justify-center items-center bg-white p-4 rounded-lg shadow-md border border-gray-300">
              <p className="text-lg font-bold text-gray-800 mb-2">
                🎯 Đáp án đúng:
              </p>
              {questionChoices.map((choice, index) =>
                question.solutions[index] ? ( // Chỉ hiển thị nếu đúng (true)
                  <button
                    key={index}
                    disabled={JSON.parse(showSolutions)}
                    className={`w-[9rem] h-[3.5rem] cursor-pointer p-3 text-lg font-bold rounded-full relative transition-all duration-300 ease-in-out
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
        )}
      </div>

      <div
        className={`w-full max-w-[60rem] absolute left-1/2 bottom-[-5rem] transform -translate-x-1/2 flex flex-row justify-between items-center h-[3.5rem]`}
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

export default Matching;
