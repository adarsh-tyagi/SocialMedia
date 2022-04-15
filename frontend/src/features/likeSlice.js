import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../url";

// actions for like reducer

// toggle like button
export const toggleLike = createAsyncThunk(
  "like/toggleLike",
  async (postId) => {
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
      throw error.response.data.message;
    }
  }
);

// get post likes
export const postLikes = createAsyncThunk("like/postLikes", async (postId) => {
  try {
    const socialmediatoken = localStorage.getItem("socialmediatoken");
    const config = { headers: { Authorization: socialmediatoken } };
    const { data } = await axios.get(
      `${BACKEND_URL}/like/post/${postId}`,
      config
    );
    return data;
  } catch (error) {
    throw error.response.data.message;
  }
});

// get user's liked posts
export const likedPost = createAsyncThunk("like/likedPost", async () => {
  try {
    const socialmediatoken = localStorage.getItem("socialmediatoken");
    const config = { headers: { Authorization: socialmediatoken } };
    const { data } = await axios.get(`${BACKEND_URL}/like/me`, config);
    return data;
  } catch (error) {
    throw error.response.data.message;
  }
});

export const likeSlice = createSlice({
  name: "like",
  initialState: {
    loading: true,
    postLikes: [],
    userLikes: [],
    likeCount: null,
    message: null,
    error: false,
    currentPostId: null
  },
  reducers: {
    clearLikeError: (state) => {
      state.error = null;
    },
    clearLikeMessage: (state) => {
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
      state.postLikes = action.payload.allLikes;
      state.likeCount = action.payload.allLikes.length;
      state.currentPostId = action.payload.postId
    },
    [toggleLike.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [postLikes.pending]: (state, action) => {
      state.loading = true;
    },
    [postLikes.fulfilled]: (state, action) => {
      state.loading = false;
      state.postLikes = action.payload.likes;
      state.likeCount = action.payload.likes.length;
      state.currentPostId = action.payload.postId;
    },
    [postLikes.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
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
      state.error = action.error.message;
    },
  },
});

export const { clearLikeError, clearLikeMessage } = likeSlice.actions;
export default likeSlice.reducer;
