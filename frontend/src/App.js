import React, { useEffect } from "react";
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
import LikedPost from "./components/Posts/LikedPost";

function App() {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <div className="App">
      {loading ? (
        <Loader />
      ) : (
        <Router>
          <Header isAuthenticated={isAuthenticated} user={user} />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/signin" element={<Signin />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/update/profile" element={<UpdateProfile />} />
            <Route exact path="/password/forgot" element={<ForgotPassword />} />
            <Route
              exact
              path="/password/reset/:token"
              element={<ResetPassword />}
            />

            <Route exact path="/liked-posts" element={<LikedPost />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
