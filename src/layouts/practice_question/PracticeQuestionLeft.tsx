import React from "react";
import QPrompt1_1 from "../../templates/contents/QPrompt1_1";
import MultipleChoiceQuestion from "../../templates/MutilpleChoice";
import MultipleResponseQuestion from "../../templates/MutilpleResponse";
import FlyDrag from "../../templates/FlyDrag";
import Matching from "../../templates/Matching";
import GapfillInline from "../../templates/GapfillInline";
import Gapfill from "../../templates/GapFill";

const PracticeQuestionLeft = ({
  question,
  selectedQuestion,
  handleQuestionChange,
  questions,
}) => {
  const promptTemplate = question?.template.prompt;
  const questionTemplate = question?.template.question;

  const TemplateComponent = () => {
    switch (promptTemplate) {
      case "QPrompt1_1":
        return (
          <QPrompt1_1
            data={question}
            isLast={true}
            order={selectedQuestion + 1}
          />
        );
      default:
        return <div></div>;
    }
  };

  const TemplateQuestion = () => {
    switch (questionTemplate) {
      case "MultipleChoice":
        return (
          <MultipleChoiceQuestion
            questionItem={question}
            question={question.question}
            selectedQuestion={selectedQuestion}
            questionId={question.questionId}
            handleQuestionChange={handleQuestionChange}
            questions={questions}
          />
        );
      case "MultipleResponse":
        return (
          <MultipleResponseQuestion
            questionItem={question}
            question={question.question}
            selectedQuestion={selectedQuestion}
            questionId={question.questionId}
            handleQuestionChange={handleQuestionChange}
            questions={questions}
          />
        );
      case "FlyDrag":
        return (
          <FlyDrag
            questionItem={question}
            question={question.question}
            selectedQuestion={selectedQuestion}
            handleQuestionChange={handleQuestionChange}
            questionId={question.questionId}
            questions={questions}
          />
        );
      case "Matching":
        return (
          <Matching
            questionItem={question}
            question={question.question}
            selectedQuestion={selectedQuestion}
            questionId={question.questionId}
            handleQuestionChange={handleQuestionChange}
            questions={questions}
          />
        );
      case "GapFill":
        return (
          <Gapfill
            questionItem={question}
            question={question.question}
            selectedQuestion={selectedQuestion}
            questionId={question.questionId}
            handleQuestionChange={handleQuestionChange}
            questions={questions}
          />
        );
      case "GapFillInline":
        return (
          <GapfillInline
            questionItem={question}
            question={question.question}
            selectedQuestion={selectedQuestion}
            questionId={question.questionId}
            handleQuestionChange={handleQuestionChange}
            questions={questions}
          />
        );
      default:
        return <div></div>;
    }
  };
  return (
    <>
      {localStorage.getItem("showSolutions") ? (
        <div className="w-full max-w-[60rem] rounded-xl flex flex-col bg-white shadow-[0.3rem_0.3rem_0rem_#d66a6e] relative">
          <div className="border border-[#f4bcb6]/50 shadow-lg rounded-t-xl bg-gradient-to-b from-white to-[#fce0dd] text-[#b3484c] p-6 text-center font-bold text-xl">
            <TemplateComponent />
          </div>

          <div className="border-x border-[#f4bcb6]/50 drop-shadow-lg rounded-b-xl bg-gradient-to-b from-[#fce0dd] to-[#f4bcb6] ">
            <div className="px-6 py-8 w-full">
              <div className="flex flex-wrap flex-row justify-center items-center w-full">
                <TemplateQuestion />
              </div>
            </div>

            {/* <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-[90%] h-2 bg-[#f4bcb6]/50 blur-md"></div> */}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[60rem] rounded-xl flex flex-col bg-white shadow-[0.3rem_0.3rem_0rem_#1B5E20] relative">
          <div className="border border-green-600/50 shadow-lg rounded-t-xl bg-gradient-to-b from-white to-green-100 text-green-900 p-6 text-center font-bold text-xl">
            <TemplateComponent />
          </div>

          <div className="border-x border-green-700/50 drop-shadow-lg rounded-b-xl bg-gradient-to-b from-green-100 to-green-300 ">
            <div className="px-6 py-8">
              <div className="flex flex-row justify-center items-center">
                <TemplateQuestion />
              </div>
            </div>

            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-[90%] h-2 bg-green-400/50 blur-md"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default PracticeQuestionLeft;
