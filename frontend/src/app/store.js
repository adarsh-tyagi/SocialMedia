import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/userSlice";
import postSlice from "../features/postSlice";
import likeSlice from "../features/likeSlice";
import commentSlice from "../features/commentSlice";
import followSlice from "../features/followSlice";
import notificationSlice from "../features/notificationSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    likes: likeSlice,
    comments: commentSlice,
    follow: followSlice,
    notification: notificationSlice,
  },
});
