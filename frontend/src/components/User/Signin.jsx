import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import {
  MdEmail,
  MdPerson,
  MdLock,
  MdOutlineDriveFileRenameOutline,
  MdPhoto,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import {
  clearUserError,
  clearUserMessage,
  loginUser,
  registerUser,
} from "../../features/userSlice";
import Loader from "../Loader/Loader";

const Signin = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, message } = useSelector(
    (state) => state.user
  );

  const [login, setLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
  });
  const { name, email, password, bio } = user;

  const loginHandler = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email: loginEmail, password: loginPassword }));
  };
  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };
  const registerHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("bio", bio);
    myForm.set("avatar", avatar);
    dispatch(registerUser(myForm));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if (error) {
      alert.error(error);
      dispatch(clearUserError());
    }
    if (message) {
      alert.success(message);
      dispatch(clearUserMessage());
    }
  }, [isAuthenticated, error, dispatch, alert, navigate, message]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="login__container">
          <div className="switch__btn">
            <button
              className={login ? "active" : ""}
              onClick={() => setLogin(true)}
            >
              Login
            </button>
            <button
              className={!login ? "active" : ""}
              onClick={() => setLogin(false)}
            >
              Register
            </button>
          </div>

          {login ? (
            <form onSubmit={loginHandler}>
              <div>
                <MdEmail />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div>
                <MdLock />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <input type="submit" value="Login" className="btn" />
              <Link to="/password/forgot">Forgot Password ?</Link>
            </form>
          ) : (
            <form encType="multipart/form-data" onSubmit={registerHandler}>
              <div>
                <MdPerson />
                <input
                  type="text"
                  required
                  placeholder="Name"
                  name="name"
                  value={name}
                  onChange={registerDataChange}
                />
              </div>
              <div>
                <MdEmail />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={registerDataChange}
                />
              </div>
              <div>
                <MdLock />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={registerDataChange}
                />
              </div>
              <div>
                <MdOutlineDriveFileRenameOutline />
                <input
                  type="text"
                  required
                  placeholder="Bio"
                  name="bio"
                  value={bio}
                  onChange={registerDataChange}
                />
              </div>
              <div>
                <MdPhoto />
                <input
                  type="file"
                  accept="image/*"
                  name="avatar"
                  onChange={registerDataChange}
                  required
                />
              </div>
              <input type="submit" value="Register" className="btn" />
            </form>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default Signin;
