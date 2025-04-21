import { configureStore } from "@reduxjs/toolkit";
import lessonSlice from "./lessonSlice";
import listQuestionSlice from "./listQuestionSlice";
import quizQuestionSlice from "./quizQuestionSlice";

export const store = configureStore({
  reducer: {
    questions: listQuestionSlice,
    quiz: quizQuestionSlice,
    lesson: lessonSlice,
  },
});
