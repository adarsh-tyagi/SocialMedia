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

function App() {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [backdrop, setBackdrop] = useState(false);

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
          />
          <Routes>
            <Route exact path="/" element={<Home />} />
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
              element={<ProtectRoute component={Profile} />}
            />
            <Route
              exact
              path="/update/profile"
              element={<ProtectRoute component={UpdateProfile} />}
            />
            <Route
              exact
              path="/user/detail/:userID"
              element={<ProtectRoute component={UserDetails} />}
            />
            <Route
              exact
              path="/create/post"
              element={<ProtectRoute component={CreatePost} />}
            />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
