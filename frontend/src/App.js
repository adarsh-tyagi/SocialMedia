import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { loadUser } from "./features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./components/Loader/Loader";
import Header from "./components/Header/Header";

function App() {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Header isAuthenticated={isAuthenticated} user={user} />
        <Routes></Routes>
      </Router>
    </div>
  );
}

export default App;
