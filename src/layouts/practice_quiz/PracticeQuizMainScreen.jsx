import React, { useState } from "react";
import { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import {
  getQuizQuestions,
  setQuestionAnswered,
  setQuestionsAnswered,
  setQuestionState,
  submitAnswers,
} from "../../store/quizQuestionSlice";
import PracticeQuestionLeft from "../practice_question/PracticeQuestionLeft";
import PracticeQuestionRight from "../practice_question/PracticeQuestionRight";

const PracticeQuizMainScreen = ({ quizInformation, questions }) => {
  const dispatch = useDispatch();
  const cookie = new Cookies();
  const token = cookie.get("signin_user");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [isLoadingShowSolution, setIsLoadingShowSolution] = useState(
    localStorage.getItem("showSolutions") === "true"
  );

  const handleQuestionChange = (val) => {
    if (
      window.location.pathname === "/bai_kiem_tra_thuc_hanh" &&
      !JSON.parse(localStorage.getItem("showSolutions"))
    ) {
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

        const submit = result.submit;
        dispatch(
          submitAnswers({
            practiceQuizId: localStorage.getItem("newPracticeId"),
            submit,
            token,
          })
        );
      } else {
        var answeredQuestions = questions.map((question) => ({
          questionId: question.questionId,
          questionIndex: question.questionIndex,
          answer: question.answer?.length > 0 ? question.answer : [],
        }));
        dispatch(setQuestionsAnswered(answeredQuestions));
      }

      localStorage.removeItem("questionStateExams");
    }
    setSelectedQuestion(val);
  };

  useEffect(() => {
    if (questions && questions.length > 0) {
      const storedAnswers = localStorage.getItem("userAnswers");

      if (!storedAnswers) {
        const initialAnswers = questions.map((question, index) => ({
          id: question.questionId,
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

  useEffect(() => {
    if (questions === null || questions === undefined) {
      setIsLoading(true);
    }

    const timeoutId = setTimeout(() => {
      dispatch(
        getQuizQuestions({
          newIdPractice: localStorage.getItem("newPracticeId"),
          token,
        })
      ).finally(() => {
        setIsLoading(false);
      });
    }, 4000);

    return () => clearTimeout(timeoutId); // Cleanup timeout nếu component bị unmount trước khi chạy
  }, [dispatch, token]);

  useEffect(() => {
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
    <>
      <div
        className={`relative flex min-h-screen bg-cover bg-center bg-no-repeat ${
          localStorage.getItem("showSolutions")
            ? "bg-[url('/public/images/background_solu_quiz.png')]"
            : "bg-[url('/public/images/background_quiz.png')]"
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
    </>
  );
};

function mapStateToProps(state) {
  return {
    questions: state.quiz.questions,
    quizInformation: state.quiz.quizInformation,
  };
}

export default connect(mapStateToProps)(PracticeQuizMainScreen);
