import instance from "./instance";

const unitUrl = "/user/unit";

export const getGradeUnit = (unitId, token) => {
  return instance.get(`${unitUrl}/get-grade-units/${unitId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAnUnit = (gradeId, token) => {
  return instance.get(`${unitUrl}/get-an-unit/${gradeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


