import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../url";

// actions for notifications reducer

export const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    loading: true,
    message: null,
    error: null,
    notifications: [],
    notification: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: {},
});

export const {} = notificationSlice.actions;
export default notificationSlice.reducer;
