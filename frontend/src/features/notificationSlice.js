import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../url";

// actions for notifications reducer

// create notification
export const createNotification = createAsyncThunk(
  "notification/createNotification",
  async (notificationdata) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.post(
        `${BACKEND_URL}/notification/create`,
        notificationdata,
        config
      );
      return data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

// delete a notification
export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (notificationdata) => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.delete(
        `${BACKEND_URL}/notification/delete`,
        notificationdata,
        config
      );
      return data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

// delete all notifications
export const deleteAllNotifications = createAsyncThunk(
  "notification/deleteAllNotifications",
  async () => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.delete(
        `${BACKEND_URL}/notification/delete/all`,
        config
      );
      return data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

// get all notifications
export const getNotifications = createAsyncThunk(
  "notification/getNotifications",
  async () => {
    try {
      const socialmediatoken = localStorage.getItem("socialmediatoken");
      const config = { headers: { Authorization: socialmediatoken } };
      const { data } = await axios.get(`${BACKEND_URL}/notification`, config);
      return data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

export const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    loading: true,
    message: null,
    error: null,
    notifications: [],
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
    [createNotification.pending]: (state, action) => {
      state.loading = true;
    },
    [createNotification.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [createNotification.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [deleteNotification.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteNotification.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    [deleteNotification.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [deleteAllNotifications.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteAllNotifications.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    [deleteAllNotifications.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [getNotifications.pending]: (state, action) => {
      state.loading = true;
    },
    [getNotifications.fulfilled]: (state, action) => {
      state.loading = false;
      state.notifications = action.payload.notifications;
    },
    [getNotifications.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
  },
});

export const { clearError, clearMessage } = notificationSlice.actions;
export default notificationSlice.reducer;
