import instance from "./instance";

const userUrl = "/user/auth";
const accountUrl = "/user/account";

export const signin = (account) => {
  return instance.post(`${userUrl}/token`, account);
};

export const register = (account) => {
  return instance.post(`${accountUrl}/register`, account);
};
