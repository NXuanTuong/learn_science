import instance from "./instance";

const questionUrl = "/user/question";

export const getListQuestions = (lessonId, token) => {
  return instance.get(`${questionUrl}/get-list-questions/${lessonId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
