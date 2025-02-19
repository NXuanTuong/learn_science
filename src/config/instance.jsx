import axios from "axios";

const instance = axios.create({
  baseURL: "https://learn-science-be.vercel.app/api",
  headers: {
    //  Authorization: `<Your Auth Token>`,
    "Content-Type": "application/json",
    timeout: 2000,
  },
});

export default instance;
