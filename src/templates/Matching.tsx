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
  const colors = [
    "#FF8C00", // Orange
    "#6A5ACD", // Slate Blue
    "#FF69B4", // Hot Pink
    "#20B2AA", // Light Sea Green
    "#FFD700", // Gold
  ];

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

  const handleSelectLeft = (index) => {
    let existSelect = selectedIndices.findIndex(
      (item) => item[0] === index + 1
    );
    let currentSelect = selectedIndices.findIndex(
      (item) => item[0] === -1 && item[1] !== -1
    );

    if (existSelect !== -1) {
      let rightIndex = selectedIndices[existSelect][1];
      let lastCurrentSelect = selectedIndices.findLastIndex(
        (item) => item[0] !== -1 && item[1] === -1
      );
      let lastCurrentSelectRight =
        lastCurrentSelect === -1 ? -1 : selectedIndices[lastCurrentSelect][1];

      setSelectedIndices((prevIndices) => {
        const newIndices = prevIndices.map((item, i) =>
          i === existSelect
            ? [-1, -1]
            : i === lastCurrentSelect
            ? [index + 1, lastCurrentSelectRight]
            : item
        );

        dispatch(
          setUserAnswer({
            id:
              window.location.pathname === "/bai_kiem_tra_thuc_hanh"
                ? questionItem.questionId
                : questionItem._id,
            answer: newIndices,
            questionIndex: selectedQuestion,
            template: "MultipleResponse",
            userChoice: newIndices
              .filter((pair) => pair[0] !== -1 && pair[1] !== -1)
              .map((pair) => pair[1]), // Chỉ lấy cột phải từ cặp hợp lệ
          })
        );

        saveAnswer(
          newIndices
            .filter((pair) => pair[0] !== -1 && pair[1] !== -1)
            .map((pair) => pair[1]),
          questionItem.questionId
        );

        return newIndices;
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
        const newIndices = prevIndices.map((item, i) =>
          i === saveIndex ? [index + 1, rightIndex] : item
        );

        dispatch(
          setUserAnswer({
            id:
              window.location.pathname === "/bai_kiem_tra_thuc_hanh"
                ? questionItem.questionId
                : questionItem._id,
            answer: newIndices,
            questionIndex: selectedQuestion,
            template: "MultipleResponse",
            userChoice: newIndices
              .filter((pair) => pair[0] !== -1 && pair[1] !== -1)
              .map((pair) => pair[1]), // Chỉ lấy cột phải từ cặp hợp lệ
          })
        );

        saveAnswer(
          newIndices
            .filter((pair) => pair[0] !== -1 && pair[1] !== -1)
            .map((pair) => pair[1]),
          questionItem.questionId
        );

        return newIndices;
      });
    }
  };

  const handleSelectRight = (index) => {
    let existSelect = selectedIndices.findIndex(
      (item) => item[1] === index + 1
    );
    let currentSelect = selectedIndices.findIndex(
      (item) => item[1] === -1 && item[0] !== -1
    );

    if (existSelect !== -1) {
      let leftIndex = selectedIndices[existSelect][0];
      let lastCurrentSelect = selectedIndices.findLastIndex(
        (item) => item[0] !== -1 && item[1] === -1
      );
      let lastCurrentSelectLeft =
        lastCurrentSelect === -1 ? -1 : selectedIndices[lastCurrentSelect][0];

      setSelectedIndices((prevIndices) => {
        const newIndices = prevIndices.map((item, i) =>
          i === existSelect
            ? [-1, -1]
            : i === lastCurrentSelect
            ? [lastCurrentSelectLeft, index + 1]
            : item
        );

        dispatch(
          setUserAnswer({
            id:
              window.location.pathname === "/bai_kiem_tra_thuc_hanh"
                ? questionItem.questionId
                : questionItem._id,
            answer: newIndices,
            questionIndex: selectedQuestion,
            template: "MultipleResponse",
            userChoice: newIndices
              .filter((pair) => pair[0] !== -1 && pair[1] !== -1)
              .map((pair) => pair[1]), // Chỉ lấy cột phải từ cặp hợp lệ
          })
        );

        saveAnswer(
          newIndices
            .filter((pair) => pair[0] !== -1 && pair[1] !== -1)
            .map((pair) => pair[1]),
          questionItem.questionId
        );

        return newIndices;
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
        const newIndices = prevIndices.map((item, i) =>
          i === saveIndex ? [leftIndex, index + 1] : item
        );

        dispatch(
          setUserAnswer({
            id:
              window.location.pathname === "/bai_kiem_tra_thuc_hanh"
                ? questionItem.questionId
                : questionItem._id,
            answer: newIndices,
            questionIndex: selectedQuestion,
            template: "MultipleResponse",
            userChoice: newIndices
              .filter((pair) => pair[0] !== -1 && pair[1] !== -1)
              .map((pair) => pair[1]), // Chỉ lấy cột phải từ cặp hợp lệ
          })
        );

        saveAnswer(
          newIndices
            .filter((pair) => pair[0] !== -1 && pair[1] !== -1)
            .map((pair) => pair[1]),
          questionItem.questionId
        );

        return newIndices;
      });
    }
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

  const selectedValues = selectedIndices
    .filter((pair) => pair[0] !== -1 && pair[1] !== -1)
    .map((pair) => pair[1]);

  const isAllCorrect =
    JSON.stringify(selectedValues) === JSON.stringify(question.solutions);

  const getColorForIndex = (index: number) => colors[index % colors.length];

  return (
    <>
      <div className="flex flex-col gap-8 justify-center items-center">
        <div className="grid grid-cols-2 gap-20">
          <div className="grid grid-cols-1 gap-4 place-items-center w-full">
            {questionTargets.map((choice, index) => {
              const pairIndex = selectedIndices.findIndex(
                (item) => item[0] === index + 1
              );
              const isSelected = pairIndex !== -1;
              const selectedValue = isSelected
                ? selectedIndices[pairIndex][1]
                : null;
              const correctAnswer = question.solutions[index];
              const isCorrect = selectedValue === correctAnswer;

              // Giữ màu nếu đã chọn trước đó, nếu không thì hiển thị đáp án đúng khi showSolutions bật
              const backgroundColor = isSelected
                ? getColorForIndex(pairIndex) // Giữ màu nếu đã chọn
                : showSolutions
                ? "white" // Màu nhạt hiển thị khi có đáp án (màu xanh nhạt)
                : "white"; // Mặc định trắng khi chưa chọn và chưa hiển thị đáp án

              return (
                <button
                  key={index}
                  onClick={() => handleSelectLeft(index)}
                  disabled={JSON.parse(showSolutions)}
                  style={{
                    backgroundColor,
                    color: isSelected ? "white" : "#2E7D32",
                    outlineColor: showSolutions
                      ? isCorrect
                        ? "#1B5E20" // Viền xanh nếu đúng
                        : "#B71C1C" // Viền đỏ nếu sai
                      : "#4CAF50",
                  }}
                  className={`min-w-[150px] px-6 py-3 text-lg font-bold rounded-lg transition-all duration-200 ease-in-out
          flex items-center justify-center text-center whitespace-normal break-words relative
          ${
            showSolutions
              ? isCorrect
                ? "outline-2 outline-green-700"
                : "outline-2 outline-red-700"
              : "outline outline-green-500"
          }
          hover:brightness-110 hover:shadow-md active:scale-95 active:shadow-none`}
                >
                  {choice}

                  {/* Nếu showSolutions bật, luôn hiển thị icon đúng/sai */}
                  {showSolutions && (
                    <span className="absolute right-2 top-2 text-lg">
                      {isCorrect ? "✅" : "❌"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-4 place-items-center w-full">
            {questionChoices.map((choice, index) => {
              const pairIndex = selectedIndices.findIndex(
                (item) => item[1] === index + 1
              );
              const isSelected = pairIndex !== -1;
              const selectedValue = isSelected
                ? selectedIndices[pairIndex][0]
                : null;
              const correctAnswer = question.solutions[index];
              const isCorrect = selectedValue === correctAnswer;

              const backgroundColor = isSelected
                ? getColorForIndex(pairIndex) // Giữ màu nếu đã chọn
                : showSolutions
                ? "white"
                : "white";

              return (
                <button
                  key={index}
                  onClick={() => handleSelectRight(index)}
                  disabled={showSolutions}
                  style={{
                    backgroundColor,
                    color: isSelected ? "white" : "#2E7D32",
                    outlineColor: showSolutions
                      ? isCorrect
                        ? "#1B5E20" // Viền xanh nếu đúng
                        : "#B71C1C" // Viền đỏ nếu sai
                      : "#4CAF50",
                  }}
                  className={`min-w-[150px] cursor-pointer px-6 py-3 text-lg font-bold rounded-lg transition-all duration-200 ease-in-out
          flex items-center justify-center text-center whitespace-normal break-words relative
          ${
            showSolutions
              ? isCorrect
                ? "outline-2 outline-green-700"
                : "outline-2 outline-red-700"
              : "outline outline-green-500"
          }
          hover:brightness-110 hover:shadow-md active:scale-95 active:shadow-none`}
                >
                  {choice}

                  {/* Nếu showSolutions bật, luôn hiển thị icon đúng/sai */}
                  {showSolutions && (
                    <span className="absolute right-2 top-2 text-lg">
                      {isCorrect ? "✅" : "❌"}
                    </span>
                  )}
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

              <div className="grid grid-cols-2 gap-20">
                {/* Cột trái - Giữ màu đã chọn và check đúng sai */}
                <div className="grid grid-cols-1 gap-4 place-items-center w-full">
                  {questionTargets.map((choice, index) => {
                    const pairIndex = selectedIndices.findIndex(
                      (item) => item[0] === index + 1
                    );
                    const isSelected = pairIndex !== -1;

                    // Giữ nguyên màu background nếu đã nối trước đó
                    const backgroundColor = isSelected
                      ? getColorForIndex(pairIndex) // Nếu đã chọn thì giữ màu của lần chọn
                      : getColorForIndex(index); // Nếu chưa chọn thì lấy màu mặc định theo index

                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectLeft(index)}
                        disabled={JSON.parse(showSolutions)}
                        className={`min-w-[150px] px-6 py-3 text-white text-lg font-bold rounded-lg transition-all duration-200 ease-in-out
            flex items-center justify-center text-center whitespace-normal break-words
            border-2 border-green-700 
            hover:brightness-110 hover:shadow-md active:scale-95 active:shadow-none relative`}
                        style={{ backgroundColor }}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>

                {/* Cột phải - Hiển thị đúng đáp án theo solutions */}
                <div className="grid grid-cols-1 gap-4 place-items-center w-full">
                  {questionChoices.map((choice, index) => {
                    const correctTargetIndex = question.solutions.indexOf(
                      index + 1
                    ); // Tìm vị trí đúng của câu trả lời này
                    const isSelected = selectedIndices.some(
                      (item) => item[1] === index + 1
                    );
                    const backgroundColor =
                      correctTargetIndex !== -1
                        ? getColorForIndex(correctTargetIndex)
                        : "white";

                    return (
                      <button
                        key={index}
                        className={`min-w-[150px] px-6 py-3 text-white text-lg font-bold rounded-lg transition-all duration-200 ease-in-out
            flex items-center justify-center text-center whitespace-normal break-words
            border-2 border-green-700 
            hover:brightness-110 hover:shadow-md active:scale-95 active:shadow-none relative`}
                        style={{ backgroundColor }}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              </div>
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
