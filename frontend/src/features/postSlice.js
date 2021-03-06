import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../url";

// actions for post reducer

// get home page posts
export const homePosts = createAsyncThunk("post/homePosts", async (page) => {
  try {
    const socialmediatoken = localStorage.getItem("socialmediatoken");
    const config = { headers: { Authorization: socialmediatoken } };
    const { data } = await axios.get(
      `${BACKEND_URL}/post/home?page=${page}`,
      config
    );
    return data;
  } catch (error) {
    throw error.response.data.message;
  }
});

// create post
export const createPost = createAsyncThunk(
  "post/createPost",
  async (postdata) => {
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
      throw error.response.data.message;
    }
  }
);

// delete post
export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.delete(
        `${BACKEND_URL}/post/delete/${postId}`,
        config
      );
      return data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

// get post details
export const postDetail = createAsyncThunk(
  "post/postDetail",
  async (postId) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.get(
        `${BACKEND_URL}/post/detail/${postId}`,
        config
      );
      return data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

// get another user's posts
export const userPosts = createAsyncThunk("post/userPosts", async (userId) => {
  try {
    const socialmediatoken = localStorage.getItem("socialmediatoken");
    const config = { headers: { Authorization: socialmediatoken } };
    const { data } = await axios.get(
      `${BACKEND_URL}/post/user/${userId}`,
      config
    );
    return data;
  } catch (error) {
    throw error.response.data.message;
  }
});

// get own posts
export const ownPosts = createAsyncThunk("post/ownPosts", async () => {
  try {
    const socialmediatoken = localStorage.getItem("socialmediatoken");
    const config = { headers: { Authorization: socialmediatoken } };
    const { data } = await axios.get(`${BACKEND_URL}/post/me`, config);
    return data;
  } catch (error) {
    throw error.response.data.message;
  }
});

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
    userDetail: null,
    otherUserFollowers: null,
    otherUserFollowings: null,
  },
  reducers: {
    clearPostError: (state) => {
      state.error = null;
    },
    clearPostMessage: (state) => {
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
      state.error = action.error.message;
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
      state.error = action.error.message;
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
      state.error = action.error.message;
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
      state.error = action.error.message;
    },

    [userPosts.pending]: (state, action) => {
      state.loading = true;
    },
    [userPosts.fulfilled]: (state, action) => {
      state.loading = false;
      state.othersPosts = action.payload.posts;
      state.userDetail = action.payload.userDetail;
      state.otherUserFollowers = action.payload.followers;
      state.otherUserFollowings = action.payload.followings;
    },
    [userPosts.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
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
      state.error = action.error.message;
    },
  },
});

export const { clearPostError, clearPostMessage } = postSlice.actions;
export default postSlice.reducer;
