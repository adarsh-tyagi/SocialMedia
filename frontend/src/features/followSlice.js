import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../url";

// actions for follow reducer

// follow user
export const followUser = createAsyncThunk(
  "follow/followUser",
  async (followingId, { rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.post(
        `${BACKEND_URL}/follow/followother`,
        followingId,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// unfollow user
export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async (followingId, { rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.post(
        `${BACKEND_URL}/follow/unfollowother`,
        followingId,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// get own followers
export const getMyFollowers = createAsyncThunk(
  "follow/getMyFollowers",
  async ({ rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.get(`${BACKEND_URL}/myfollowers`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// get own followings
export const getMyFollowing = createAsyncThunk(
  "follow/getMyFollowing",
  async ({ rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.get(`${BACKEND_URL}/myfollowing`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

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
  extraReducers: {
    [followUser.pending]: (state, action) => {
      state.loading = true;
    },
    [followUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    [followUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [unfollowUser.pending]: (state, action) => {
      state.loading = true;
    },
    [unfollowUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    [unfollowUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [getMyFollowers.pending]: (state, action) => {
      state.loading = true;
    },
    [getMyFollowers.fulfilled]: (state, action) => {
      state.loading = false;
      state.followersList = action.payload.followersList;
    },
    [getMyFollowers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [getMyFollowing.pending]: (state, action) => {
      state.loading = true;
    },
    [getMyFollowing.fulfilled]: (state, action) => {
      state.loading = false;
      state.followingList = action.payload.followingList;
    },
    [getMyFollowing.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

export const { clearError, clearMessage } = followSlice.actions;
export default followSlice.reducer;
