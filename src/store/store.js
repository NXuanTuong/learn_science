import { configureStore } from "@reduxjs/toolkit";
import listQuestionSlice from "./listQuestionSlice";
import quizQuestionSlice from "./quizQuestionSlice";

export const store = configureStore({
  reducer: {
    questions: listQuestionSlice,
    quiz: quizQuestionSlice,
  },
});
