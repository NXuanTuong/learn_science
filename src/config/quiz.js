import instance from "./instance";

const quizUrl = "/user/quiz";
const practiceQuizUrl = "/user/practice-quiz";

export const getQuizInformation = (quizId, token) => {
  return instance.get(`${quizUrl}/get-quiz-information/${quizId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createNewPracticeQuiz = (quizInforId, token) => {
  return instance.post(
    `${practiceQuizUrl}/create-new-practice-quiz/${quizInforId}`,
    [],
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getPracticeQuiz = (newIdPractice, token) => {
  return instance.get(
    `${practiceQuizUrl}/get-practice-quiz-question/${newIdPractice}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const submitAnswerPractice = (practiceQuizId, answer, token) => {
  return instance.post(
    `${practiceQuizUrl}/submit-answer-practice/${practiceQuizId}`,
    answer,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
