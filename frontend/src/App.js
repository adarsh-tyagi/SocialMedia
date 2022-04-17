import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { loadUser } from "./features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./components/Loader/Loader";
import Header from "./components/Header/Header";
import Home from "./components/User/Home";
import Signin from "./components/User/Signin";
import Profile from "./components/User/Profile";
import UpdateProfile from "./components/User/UpdateProfile";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import CreatePost from "./components/Posts/CreatePost";
import UserDetails from "./components/User/UserDetails";
import ProtectRoute from "./ProtectRoute";
import { io } from "socket.io-client";

function App() {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [backdrop, setBackdrop] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      socket?.emit("newUser", user?._id);
    }
  }, [socket, user,isAuthenticated]);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <div className="app">
      {loading ? (
        <Loader />
      ) : (
        <Router>
          <Header
            isAuthenticated={isAuthenticated}
            user={user}
            backdrop={backdrop}
            setBackdrop={setBackdrop}
            socket={socket}
          />
          <Routes>
            <Route exact path="/" element={<Home socket={socket} />} />
            <Route exact path="/signin" element={<Signin />} />

            <Route exact path="/password/forgot" element={<ForgotPassword />} />
            <Route
              exact
              path="/password/reset/:token"
              element={<ResetPassword />}
            />
            <Route
              exact
              path="/profile"
              element={<ProtectRoute component={Profile} socket={socket} />}
            />
            <Route
              exact
              path="/update/profile"
              element={
                <ProtectRoute component={UpdateProfile} socket={socket} />
              }
            />
            <Route
              exact
              path="/user/detail/:userID"
              element={<ProtectRoute component={UserDetails} socket={socket} />}
            />
            <Route
              exact
              path="/create/post"
              element={<ProtectRoute component={CreatePost} socket={socket} />}
            />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
