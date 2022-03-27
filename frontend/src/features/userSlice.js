import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../url";

// actions for user reducer

// register user
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userdata) => {
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
      throw error.response.data.message;
    }
  }
);

// login user
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userdata) => {
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
      throw error.response.data.message;
    }
  }
);

// load user
export const loadUser = createAsyncThunk("user/loadUser", async () => {
  try {
    const socialmediatoken = localStorage.getItem("socialmediatoken");
    const config = { headers: { Authorization: socialmediatoken } };
    const { data } = await axios.get(`${BACKEND_URL}/user/me`, config);
    return data;
  } catch (error) {
    throw error.response.data.message;
  }
});

// logout user
export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  try {
    const socialmediatoken = localStorage.getItem("socialmediatoken");
    const config = { headers: { Authorization: socialmediatoken } };
    const { data } = await axios.get(`${BACKEND_URL}/user/logout`, config);
    localStorage.removeItem("socialmediatoken");
    return data;
  } catch (error) {
    throw error.response.data.message;
  }
});

// update user profile
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userdata) => {
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
      throw error.response.data.message;
    }
  }
);

// delete user
export const deleteUser = createAsyncThunk("user/deleteUser", async () => {
  try {
    const socialmediatoken = localStorage.getItem("socialmediatoken");
    const config = { headers: { Authorization: socialmediatoken } };
    const { data } = await axios.delete(`${BACKEND_URL}/user/me`, config);
    localStorage.removeItem("socialmediatoken");
    return data;
  } catch (error) {
    throw error.response.data.message;
  }
});

// forgot password
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (userdata) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        `${BACKEND_URL}/user/forgot/password`,
        userdata,
        config
      );
      return data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

// reset user's password
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (userdata) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.put(
        `${BACKEND_URL}/user/reset/password/${userdata.token}`,
        userdata,
        config
      );
      return data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

// another user details
export const userDetails = createAsyncThunk(
  "user/userDetails",
  async (userId) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.get(
        `${BACKEND_URL}/user/detail/${userId}`,
        config
      );
      return data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

// search user
export const searchUser = createAsyncThunk(
  "user/searchUser",
  async (search) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.get(
        `${BACKEND_URL}/search?search=${search}`,
        config
      );
      return data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

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
    userDetail: null,
    searchResult: [],
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    resetUpdate: (state) => {
      state.isUpdated = false;
    },
    resetDelete: (state) => {
      state.isDeleted = false;
    },
  },
  extraReducers: {
    [registerUser.pending]: (state, action) => {
      state.loading = true;
    },
    [registerUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    [registerUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [loginUser.pending]: (state, action) => {
      state.loading = true;
    },
    [loginUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    [loginUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [loadUser.pending]: (state, action) => {
      state.loading = true;
    },
    [loadUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    [loadUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [logoutUser.pending]: (state, action) => {
      state.loading = true;
    },
    [logoutUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.message = action.payload.message;
    },
    [logoutUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [updateUser.pending]: (state, action) => {
      state.loading = true;
    },
    [updateUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.message = action.payload.message;
      state.isUpdated = action.payload.success;
    },
    [updateUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [deleteUser.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.message = action.payload.message;
      state.isDeleted = action.payload.success;
    },
    [deleteUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [forgotPassword.pending]: (state, action) => {
      state.loading = true;
    },
    [forgotPassword.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    [forgotPassword.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [resetPassword.pending]: (state, action) => {
      state.loading = true;
    },
    [resetPassword.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    [resetPassword.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [userDetails.pending]: (state, action) => {
      state.loading = true;
    },
    [userDetails.fulfilled]: (state, action) => {
      state.loading = false;
      state.userDetail = action.payload.otherUser;
    },
    [userDetails.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [searchUser.pending]: (state, action) => {
      state.loading = true;
    },
    [searchUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.searchResult = action.payload.searchResults;
    },
    [searchUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
  },
});

export const { clearError, clearMessage, resetUpdate, resetDelete } =
  userSlice.actions;
export default userSlice.reducer;
