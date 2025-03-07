import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import {
  createNewPracticeQuiz,
  getPracticeQuiz,
  getQuizInformation,
  submitAnswerPractice,
} from "../config/quiz";

const initialState = {
  questions: null,
  seenQuestions: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  skippedQuestions: 0,
  status: "idle",
  error: null,
  quizInformation: null,
  createNewPractice: null,
  answeredQuestions: [],
  newPracticeId: null,
};

export const getQuizInformations = createAsyncThunk(
  "quizQuestion/getQuizInformations",
  async ({ quizId, token }, thunkAPI) => {
    try {
      const { data } = await getQuizInformation(quizId, token);

      return data.result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.errorMessage);
    }
  }
);

export const createNewPractice = createAsyncThunk(
  "quizQuestion/createNewPractice",
  async ({ quizInforId, token }, thunkAPI) => {
    try {
      const { data } = await createNewPracticeQuiz(quizInforId, token);
      localStorage.setItem("newPracticeId", data.result);
      return data.result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.errorMessage);
    }
  }
);

export const getQuizQuestions = createAsyncThunk(
  "quizQuestion/getQuizQuestions",
  async ({ newIdPractice, token }, thunkAPI) => {
    try {
      const { data } = await getPracticeQuiz(newIdPractice, token);

      return data.result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.errorMessage);
    }
  }
);

export const submitAnswers = createAsyncThunk(
  "quizQuestion/submitAnswers",
  async ({ practiceQuizId, submit, token }, thunkAPI) => {
    try {
      const { result } = await submitAnswerPractice(
        practiceQuizId,
        submit,
        token
      );
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.errorMessage);
    }
  }
);

export const quizQuestion = createSlice({
  name: "quizQuestion",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },

    setQuestionVisible: (state, action) => {
      if (state.questions[action.payload - 1].isLast) {
        return;
      } else {
        state.questions[action.payload].visible = true;
      }
    },

    setQuestionState: (state, action) => {
      state.questions[action.payload.index].question.state =
        action.payload.state;
    },

    setQuestionsAnswered: (state, action) => {
      state.answeredQuestions = action.payload;

      for (var i = 0; i < action.payload.length; i++) {
        if (action.payload[i]) {
          state.questions[action.payload[i].questionIndex].answer =
            action.payload[i].answer;
        }
      }
    },

    clearQuizState: (state) => {
      state.quizInformation = null;
    },

    clearState: (state) => {
      state.questions = null;
      state.createNewPractice = null;
      state.answeredQuestions = [];
      state.newPracticeId = null;
    },

    setQuestionAnswered: (state, action) => {
      state.questions[action.payload.questionIndex].isAnswered =
        action.payload.status;
    },

    setSeenQuestions: (state, action) => {
      state.seenQuestions = action.payload;
    },

    setQuestionFinished: (state, action) => {
      state.questions[action.payload].isFinished = true;
    },

    setSkippedQuestions: (state, action) => {
      state.skippedQuestions = action.payload + state.skippedQuestions;
    },

    setCorrectAnswer: (state, action) => {
      state.correctAnswers = action.payload + state.correctAnswers;
    },

    setWrongAnswer: (state, action) => {
      state.wrongAnswers = action.payload + state.wrongAnswers;
    },

    setQuizInformation: (state, action) => {
      state.getQuizInformation = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getQuizQuestions.fulfilled, (state, action) => {
        state.questions = action.payload.records
          ? action.payload.records
          : action.payload.questions;
        state.correctAnswers = action.payload.correctAnswers;
        state.wrongAnswers = action.payload.wrongAnswers;
        state.skippedQuestions = action.payload.skippedQuestions;
        state.seenQuestions =
          action.payload.seenQuestions === 0 ? 1 : action.payload.seenQuestions;
        state.questions[state.questions.length - 1].isLast = true;
        state.questions[0].visible = true;
        state.questions.forEach((question, index) => {
          question.questionIndex = index;
          if (question.question.showSolution) {
            question.isCorrect =
              question?.answer !== null &&
              question?.answer?.length > 0 &&
              question.answer.every(
                (item, index) => item === question.question.solutions[index]
              );
          } else {
            question.isAnswered =
              question?.answer !== null && question?.answer?.length > 0;
          }
        });
        state.questions
          .filter((question, index) => index < state.seenQuestions)
          .forEach((question) => {
            question.done = true;
            question.visible = true;
          });
      })
      .addCase(getQuizQuestions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getQuizInformations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.quizInformation = action.payload;
      })
      .addCase(createNewPractice.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.newPracticeId = action.payload;
      })
      .addCase(submitAnswers.fulfilled, (state, action) => {
        state.status = "succeeded";
      });
  },
});

export const {
  setStatus,
  setQuestionVisible,
  setQuestionState,
  setSeenQuestions,
  setCorrectAnswer,
  setSkippedQuestions,
  setWrongAnswer,
  setQuestionFinished,
  setQuizInformation,
  setQuestionsAnswered,
  clearState,
  clearQuizState,
  setQuestionAnswered,
} = quizQuestion.actions;

export const selectQuestions = (state) => state.quiz.questions;
export const selectAnsweredQuestions = (state) => state.quiz.answeredQuestions;

export const selectStatus = (state) => state.quiz.status;

export default quizQuestion.reducer;
