import React, { use, useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { getLessonQuestion } from "../../store/listQuestionSlice";
import PracticeQuestionLeft from "./PracticeQuestionLeft";
import PracticeQuestionRight from "./PracticeQuestionRight";
import { useSearchParams } from "react-router-dom";

const PracticeQuestionMainScreen = ({ questions }) => {
  const dispatch = useDispatch();
  const cookie = new Cookies();
  const token = cookie.get("signin_user");

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingShowSolution, setIsLoadingShowSolution] = useState(
    localStorage.getItem("showSolutions") === "true"
  );
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [searchParams] = useSearchParams();


  useEffect(() => {
    if (questions === null || questions === undefined) {
      setIsLoading(true);
    }
    let id = searchParams.get("id");
    let lessonId2="67cbccf76cd5f0e7bbc47987"
    dispatch(
      getLessonQuestion({
        lessonId: id ?? lessonId2,
        token,
      })
    ).finally(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
    });
  }, [dispatch, token]);

  useEffect(() => {
    if (questions && questions.length > 0) {
      const storedAnswers = localStorage.getItem("userAnswers");

      if (!storedAnswers) {
        const initialAnswers = questions.map((question, index) => ({
          id: question._id,
          answer:
            question.template?.question === "MultipleResponse" ? [] : null,
          questionIndex: index,
          userChoice: null,
        }));

        if (initialAnswers.length > 0) {
          localStorage.setItem("userAnswers", JSON.stringify(initialAnswers));
        }
      }
    }
  }, [questions]);

  const handleQuestionChange = (val) => {
    setSelectedQuestion(val);
  };

  useEffect(() => {
    if (localStorage.getItem("showSolutions")) {
      localStorage.removeItem("questionStateExams");
    }

    setTimeout(() => {
      setIsLoadingShowSolution(false);
    }, 3000);
  }, [isLoadingShowSolution]);

  if (isLoading || isLoadingShowSolution) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#b2c4a9] z-[1050]">
        <div className="absolute inset-0 bg-[#b2c4a9]"></div>

        <div className="relative flex flex-col items-center justify-end text-center w-full z-[1100] gap-10 bg-cover bg-center">
          <img
            src="/images/rabbit_four.png"
            alt="Loading..."
            className="w-[20rem] h-[20rem] animate-bounce"
          />

          <p className="text-xl uppercase flex gap-2">
            {"Đang tải dữ liệu ...".split("").map((char, index) => (
              <span
                key={index}
                className="inline-block animate-wave"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex min-h-screen bg-cover bg-center bg-no-repeat ${
        localStorage.getItem("showSolutions")
          ? "bg-[url('/public/images/background_solutions.png')]"
          : "bg-[url('/public/images/background_questions.png')]"
      } w-full flex flex-row justify-center items-center`}
    >
      {questions && (
        <div className="min-h-screen px-10 pt-20 pb-40 mr-[18.75rem] w-[calc(100%-18.75rem)] flex flex-col justify-center items-center">
          <PracticeQuestionLeft
            question={questions[selectedQuestion]}
            selectedQuestion={selectedQuestion}
            handleQuestionChange={handleQuestionChange}
            questions={questions}
          />
        </div>
      )}

      <PracticeQuestionRight
        setIsLoadingShowSolution={setIsLoadingShowSolution}
        questions={questions}
        selectedIndex={selectedQuestion}
        handleQuestionChange={handleQuestionChange}
      />
    </div>
  );
};

function mapStateToProps(state) {
  return {
    questions: state.questions.listQuestions,
  };
}

export default connect(mapStateToProps)(PracticeQuestionMainScreen);
