import React, { useEffect, useState, Fragment } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserError,
  clearUserMessage,
  forgotPassword,
} from "../../features/userSlice";
import { FaEnvelope } from "react-icons/fa";
import Loader from "../Loader/Loader";

const ForgotPassword = () => {
  const { loading, error, message } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const alert = useAlert();

  const [email, setEmail] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearUserError());
    }
    if (message) {
      alert.success(message);
      dispatch(clearUserMessage());
    }
  }, [alert, dispatch, error, message]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="update__container">
          <form encType="multipart/form-data" onSubmit={submitHandler}>
            <div>
              <FaEnvelope />
              <input
                type="email"
                required
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <input type="submit" value="Send Link" className="btn" />
          </form>
        </div>
      )}
    </Fragment>
  );
};

export default ForgotPassword;
