import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../url";

// actions for post reducer

// get home page posts
export const homePosts = createAsyncThunk(
  "post/homePosts",
  async (page, { rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.get(
        `${BACKEND_URL}/post/home?page=${page}`,
        config
      );
      return data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

// create post
export const createPost = createAsyncThunk(
  "post/createPost",
  async (postdata, { rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: socialmediatoken,
        },
      };
      const { data } = await axios.post(
        `${BACKEND_URL}/post/create`,
        postdata,
        config
      );
      return data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

// delete post
export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postdata, { rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.delete(
        `${BACKEND_URL}/post/delete`,
        postdata,
        config
      );
      return data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

// get post details
export const postDetail = createAsyncThunk(
  "post/postDetail",
  async (postId, { rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.get(
        `${BACKEND_URL}/post/detail/${postId}`,
        config
      );
      return data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

// get another user's posts
export const userPosts = createAsyncThunk(
  "post/userPosts",
  async (userId, { rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.get(
        `${BACKEND_URL}/post/user/${userId}`,
        config
      );
      return data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

// get own posts
export const ownPosts = createAsyncThunk(
  "post/ownPosts",
  async ({ rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.get(`${BACKEND_URL}/post/me`, config);
      return data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState: {
    loading: true,
    homePosts: [],
    numOfPosts: null,
    postPerPage: null,
    message: null,
    error: null,
    postDetail: null,
    ownPosts: [],
    othersPosts: [],
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
    [homePosts.pending]: (state, action) => {
      state.loading = true;
    },
    [homePosts.fulfilled]: (state, action) => {
      state.loading = false;
      state.homePosts = action.payload.homePosts;
      state.numOfPosts = action.payload.numOfPosts;
      state.postPerPage = action.payload.postPerPage;
    },
    [homePosts.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [createPost.pending]: (state, action) => {
      state.loading = true;
    },
    [createPost.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    [createPost.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [deletePost.pending]: (state, action) => {
      state.loading = true;
    },
    [deletePost.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    [deletePost.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [postDetail.pending]: (state, action) => {
      state.loading = true;
    },
    [postDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.postDetail = action.payload.post;
    },
    [postDetail.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [userPosts.pending]: (state, action) => {
      state.loading = true;
    },
    [userPosts.fulfilled]: (state, action) => {
      state.loading = false;
      state.othersPosts = action.payload.posts;
    },
    [userPosts.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [ownPosts.pending]: (state, action) => {
      state.loading = true;
    },
    [ownPosts.fulfilled]: (state, action) => {
      state.loading = false;
      state.ownPosts = action.payload.posts;
    },
    [ownPosts.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

export const { clearError, clearMessage } = postSlice.actions;
export default postSlice.reducer;
