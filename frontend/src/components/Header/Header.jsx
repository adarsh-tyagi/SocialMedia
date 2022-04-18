import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TiSocialInstagram } from "react-icons/ti";
import { MdClose, MdNotifications, MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../features/userSlice";
import Backdrop from "@mui/material/Backdrop";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  setNotifications,
} from "../../features/notificationSlice";

const Header = ({ isAuthenticated, user, backdrop, setBackdrop, socket }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationBox, setNotificationBox] = useState(false);
  const [screen, setScreen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  // const [notifications, setNotifications] = useState(null)

  const { loading, searchResult } = useSelector((state) => state.user);
  const { notifications } = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(searchUser(searchTerm));
    setBackdrop(true);
  };

  const closeHandler = () => {
    setBackdrop(false);
  };

  const deleteNotificationHandler = (e, notificationId) => {
    e.preventDefault();
    dispatch(deleteNotification(notificationId));
  };

  const deleteAllNotificationHandler = (e) => {
    e.preventDefault();
    dispatch(deleteAllNotifications());
  };

  const toggleScreen = () => {
    window.innerWidth <= 600 ? setScreen(true) : setScreen(false);
  };

  // useEffect(() => {
  //   dispatch(getNotifications());
  // }, [dispatch]);

  useEffect(() => {
    socket.on("getNotification", (data) => {
      // setNotifications(data)
      dispatch(setNotifications(data));
    });
  }, [socket]);

  useEffect(() => {
    toggleScreen();
    window.addEventListener("resize", toggleScreen);
    return () => window.removeEventListener("resize", toggleScreen);
  }, []);

  return (
    <div className="header">
      <Link to="/">
        <TiSocialInstagram /> PhotoGram
      </Link>
      {openSearch && screen ? (
        <div className="header__div1">
          <form onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Search people"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </form>
        </div>
      ) : (
        ""
      )}
      {screen ? (
        <MdOutlineSearch onClick={() => setOpenSearch(!openSearch)} />
      ) : (
        <div className="header__div1">
          <form onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Search People"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </form>
        </div>
      )}

      <MdNotifications onClick={() => setNotificationBox(!notificationBox)} />
      {notificationBox ? (
        <div>
          {notifications?.length > 0 ? (
            <div>
              {notifications?.map((item) => (
                <p key={item._id}>
                  {item.content}
                  <span>
                    <MdClose
                      onClick={(e) =>
                        deleteNotificationHandler(e, String(item._id))
                      }
                    />
                  </span>
                </p>
              ))}
              <button onClick={(e) => deleteAllNotificationHandler(e)}>
                Remove All
              </button>
            </div>
          ) : (
            <p>No New Notifications</p>
          )}
        </div>
      ) : (
        ""
      )}
      <div className="header__div2">
        {isAuthenticated ? (
          <Link to="/profile">
            <img
              src={user.avatar.url}
              alt={user.name}
              height="50px"
              width="50px"
            />
          </Link>
        ) : (
          <Link to="/signin">Sign In</Link>
        )}
      </div>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0, 0, 0, 0.900)",
        }}
        open={backdrop}
        onClick={closeHandler}
      >
        <div className="search__results">
          {loading ? (
            <h1 className="loading__msg">Loading...</h1>
          ) : (
            searchResult
              ?.filter((item) => String(item._id) !== String(user._id))
              .map((item) => (
                <Link to={`/user/detail/${String(item._id)}`} key={item._id}>
                  {item.name}
                </Link>
              ))
          )}
        </div>
      </Backdrop>
    </div>
  );
};

export default Header;
