import instance from "./instance";

const achievementUrl = "/user/user-achievement";

export const getAchievement = (token) => {
  return instance.get(`${achievementUrl}/get-all-achievement`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addAchievement = (token, difficulty) => {
  return instance.post(`${achievementUrl}/add-new-achievement`, difficulty, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
