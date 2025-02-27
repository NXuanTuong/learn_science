import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getListQuestions } from "../config/practice";

const initialState = {
  listQuestions: [],
  maxScore: 0,
  currentScore: 0,
  answeredQuestions: [],
};

export const getLessonQuestion = createAsyncThunk(
  "listQuestions/getLessonQuestion",
  async ({ lessonId, token }, thunkAPI) => {
    try {
      const { data } = await getListQuestions(lessonId, token);

      return data.result;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response?.data?.errorMessage);
    }
  }
);

export const listQuestions = createSlice({
  name: "listQuestions",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },

    setQuestionFinished: (state, action) => {
      state.questions[action.payload].isFinished = true;
    },

    addUserAnswer: (state, action) => {
      const { index, answer } = action.payload;
      if (state.listQuestions[index]) {
        state.listQuestions[index].userAnswers.push(answer);
      }
    },

    setUserAnswer: (state, action) => {
      const { id, answer, questionIndex, template, userChoice } =
        action.payload;

      let savedAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];

      const existingIndex = savedAnswers.findIndex((item) => item.id === id);

      if (existingIndex !== -1) {
        if (savedAnswers[existingIndex].answer === answer) {
          savedAnswers[existingIndex].answer = null;
        } else {
          savedAnswers[existingIndex].answer = answer;
        }

        savedAnswers[existingIndex].userChoice =
          answer !== null || answer.length > 0 ? userChoice : null;
      } else {
        savedAnswers.push({ id, answer, questionIndex, template, userChoice });
      }

      localStorage.setItem("userAnswers", JSON.stringify(savedAnswers));
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getLessonQuestion.pending, (state) => {
        state.status = "loading";
      })

      .addCase(getLessonQuestion.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.maxScore = action.payload.length;
        state.currentScore = 0;
        // ✅ Khởi tạo listQuestions với mảng userAnswers trống
        state.listQuestions = action.payload.map((question, index) => ({
          ...question,
          userAnswers: [],
          isLast: index === action.payload.length - 1,
        }));
      })

      .addCase(getLessonQuestion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setQuestionFinished, setUserAnswer, addUserAnswer } =
  listQuestions.actions;

export const selectQuestions = (state) => state.listQuestions.question;

export const selectStatus = (state) => state.listQuestions.status;

export default listQuestions.reducer;
