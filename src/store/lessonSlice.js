import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAnUnit, getGradeUnit } from "../config/unit";

const initialState = {
  listUnit: [],
  listAnUnit: [],
};

export const getLesson = createAsyncThunk(
  "lesson/getLesson",
  async ({ lessonId, token }, thunkAPI) => {
    try {
      const { data } = await getGradeUnit(lessonId, token);

      return data.result;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response?.data?.errorMessage);
    }
  }
);

export const getAnUnits = createAsyncThunk(
  "lesson/getAnUnits",
  async ({ gradeId, token }, thunkAPI) => {
    try {
      const { data } = await getAnUnit(gradeId, token);

      return data.result;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response?.data?.errorMessage);
    }
  }
);

export const lesson = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getLesson.pending, (state) => {
        state.status = "loading";
      })

      .addCase(getLesson.fulfilled, (state, action) => {
        state.listUnit = action.payload;
        state.status = "succeeded";
      })

      .addCase(getLesson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getAnUnits.pending, (state) => {
        state.status = "loading";
      })

      .addCase(getAnUnits.fulfilled, (state, action) => {
        state.listAnUnit = action.payload;
        state.status = "succeeded";
      })

      .addCase(getAnUnits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setStatus } = lesson.actions;

export default lesson.reducer;
