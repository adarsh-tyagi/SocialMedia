import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../url";

// actions for comment reducer

// create comment
export const createComment = createAsyncThunk(
  "comment/createComment",
  async (commentdata, { rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.post(
        `${BACKEND_URL}/create`,
        commentdata,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// delete comment
export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.delete(
        `${BACKEND_URL}/delete`,
        commentId,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// get post comments
export const postComments = createAsyncThunk(
  "comment/postComments",
  async (postId, { rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.get(`${BACKEND_URL}/post/${postId}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const commentSlice = createSlice({
  name: "comment",
  initialState: {
    loading: true,
    message: null,
    error: null,
    comments: [],
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: {
    [createComment.pending]: (state, action) => {
      state.loading = true;
    },
    [createComment.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    [createComment.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [deleteComment.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteComment.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    [deleteComment.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [postComments.pending]: (state, action) => {
      state.loading = true;
    },
    [postComments.fulfilled]: (state, action) => {
      state.loading = false;
      state.postComments = action.payload.comments;
    },
    [postComments.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

export const { clearError, clearMessage } = commentSlice.actions;
export default commentSlice.reducer;
