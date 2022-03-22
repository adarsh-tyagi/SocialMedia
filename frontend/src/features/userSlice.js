import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../url";

// action for user reducers

// register user
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userdata, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.post(
        `${BACKEND_URL}/user/register`,
        userdata,
        config
      );
      localStorage.setItem("socialmediatoken", data.token);
      return data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

// login user
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userdata, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        `${BACKEND_URL}/user/login`,
        userdata,
        config
      );
      localStorage.setItem("socialmediatoken", data.token);
      return data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

// load user
export const loadUser = createAsyncThunk(
  "user/loadUser",
  async ({ rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.get(`${BACKEND_URL}/user/me`, config);
      return data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

// logout user
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async ({ rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.get(`${BACKEND_URL}/user/logout`, config);
      localStorage.removeItem("socialmediatoken");
      return data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

// update user profile
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userdata, { rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: socialmediatoken,
        },
      };
      const { data } = await axios.put(
        `${BACKEND_URL}/user/me`,
        userdata,
        config
      );
      return data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

// delete user
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async ({ rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.delete(`${BACKEND_URL}/user/me`, config);
      localStorage.removeItem("socialmediatoken");
      return data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

// forgot password
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (userdata, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        `${BACKEND_URL}/user/forgot/password`,
        userdata,
        config
      );
      return data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

// reset user's password
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (userdata, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.put(
        `${BACKEND_URL}/user/reset/password/${userdata.token}`,
        userdata,
        config
      );
      return data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

// another user details
export const userDetails = createAsyncThunk(
  "user/userDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.get(
        `${BACKEND_URL}/user/detail/${userId}`,
        config
      );
      return data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

// search user


export const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: true,
    isAuthenticated: false,
    user: null,
    error: null,
    message: null,
    isDeleted: false,
    isUpdated: false,
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

export const { clearError, clearMessage } = userSlice.actions;
export default userSlice.reducer;
