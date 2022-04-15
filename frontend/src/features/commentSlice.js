import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../url";

// actions for comment reducer

// create comment
export const createComment = createAsyncThunk(
  "comment/createComment",
  async (commentdata) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.post(
        `${BACKEND_URL}/comment/create`,
        commentdata,
        config
      );
      return data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

// delete comment
export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (postId) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.delete(
        `${BACKEND_URL}/comment/delete/${postId}`,
        config
      );
      return data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

// get post comments
export const postComments = createAsyncThunk(
  "comment/postComments",
  async (postId) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.get(
        `${BACKEND_URL}/comment/post/${postId}`,
        config
      );
      return data;
    } catch (error) {
      throw error.response.data.message;
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
    commentCount: null,
    currentPostId: null
  },
  reducers: {
    clearCommentError: (state) => {
      state.error = null;
    },
    clearCommentMessage: (state) => {
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
      state.comments = action.payload.allComments;
      state.commentCount = action.payload.allComments.length;
      state.currentPostId = action.payload.postId;
    },
    [createComment.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [deleteComment.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteComment.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.comments = action.payload.allComments;
      state.commentCount = action.payload.allComments.length;
      state.currentPostId = action.payload.postId;
    },
    [deleteComment.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [postComments.pending]: (state, action) => {
      state.loading = true;
    },
    [postComments.fulfilled]: (state, action) => {
      state.loading = false;
      state.comments = action.payload.comments;
      state.commentCount = action.payload.comments.length;
    },
    [postComments.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
  },
});

export const { clearCommentError, clearCommentMessage } = commentSlice.actions;
export default commentSlice.reducer;
