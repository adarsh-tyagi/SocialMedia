import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../url";

// actions for follow reducer

export const followSlice = createSlice({
  name: "follow",
  initialState: {
    loading: true,
    message: null,
    error: null,
    followersList: [],
    followingList: [],
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

export const {} = followSlice.actions;
export default followSlice.reducer;
