import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getListQuestions } from "../config/practice";

const initialState = {
  listQuestions: [],
  answeredQuestions: [],
};

export const getLessonQuestion = createAsyncThunk(
  "listQuestions/getLessonQuestion",
  async ({ lessonId, token,value }, thunkAPI) => {
    try {
      const { data } = await getListQuestions(lessonId, token);
      let result = []
      if (value == 1) {
        result = data.result.filter((item)=> item?.type == 1)
      }else if (value == 2) {
        result = data.result.filter((item)=> item?.type == 2)
      }else{
        result = data.result.filter((item)=> item?.type == 3)
      }

      return result;
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

    clearQuestion: (state) => {
      state.listQuestions = [];
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

export const {
  setQuestionFinished,
  setUserAnswer,
  addUserAnswer,
  clearQuestion,
} = listQuestions.actions;

export const selectQuestions = (state) => state.listQuestions.question;

export const selectStatus = (state) => state.listQuestions.status;

export default listQuestions.reducer;
