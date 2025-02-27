import { configureStore } from "@reduxjs/toolkit";
import listQuestionSlice from "./listQuestionSlice";

export const store = configureStore({
  reducer: {
    questions: listQuestionSlice,
  },
});
