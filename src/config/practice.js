import instance from "./instance";

const questionUrl = "/user/question";

export const getListQuestions = (lessonId, token, type, isRedo) => {
  return instance.get(
    `${questionUrl}/get-list-questions/${lessonId}?type=${type}&isRedo=${isRedo}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
