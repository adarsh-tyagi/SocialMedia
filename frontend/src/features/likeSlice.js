import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../url";

// actions for like reducer

// toggle like button
export const toggleLike = createAsyncThunk(
  "like/toggleLike",
  async (postId, { rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.post(
        `${BACKEND_URL}/like/toggle`,
        { postId },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// get post likes
export const postLikes = createAsyncThunk(
  "like/postLikes",
  async (postId, { rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.get(
        `${BACKEND_URL}/like/post/${postId}`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// get user's liked posts
export const likedPost = createAsyncThunk(
  "like/likedPost",
  async ({ rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.get(`${BACKEND_URL}/like/me`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const likeSlice = createSlice({
  name: "like",
  initialState: {
    loading: true,
    postLikes: [],
    userLikes: [],
    message: null,
    error: false,
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
    [toggleLike.pending]: (state, action) => {
      state.loading = true;
    },
    [toggleLike.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    [toggleLike.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [postLikes.pending]: (state, action) => {
      state.loading = true;
    },
    [postLikes.fulfilled]: (state, action) => {
      state.loading = false;
      state.postLikes = action.payload.likes;
    },
    [postLikes.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [likedPost.pending]: (state, action) => {
      state.loading = true;
    },
    [likedPost.fulfilled]: (state, action) => {
      state.loading = false;
      state.userLikes = action.payload.likedPosts;
    },
    [likedPost.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

export const { clearError, clearMessage } = likeSlice.actions;
export default likeSlice.reducer;
