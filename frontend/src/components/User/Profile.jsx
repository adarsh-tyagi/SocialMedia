import React, { Fragment, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getMyFollowers,
  getMyFollowing,
  clearFollowError,
} from "../../features/followSlice";
import {
  deletePost,
  ownPosts,
  clearPostError,
  clearPostMessage,
} from "../../features/postSlice";
import {
  clearUserError,
  clearUserMessage,
  deleteUser,
  logoutUser,
  resetDelete,
} from "../../features/userSlice";
import Loader from "../Loader/Loader";
import PostCard from "../Posts/PostCard";
import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import "./Profile.css";

const Profile = ({ socket }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { loading, user, error, isAuthenticated, isDeleted, message } =
    useSelector((state) => state.user);
  const {
    loading: postLoading,
    ownPosts: ownPost,
    error: postError,
    message: postMessage,
  } = useSelector((state) => state.post);
  const {
    loading: followLoading,
    error: followError,
    followersList,
    followingList,
  } = useSelector((state) => state.follow);

  const [openFollowerBox, setOpenFollowerBox] = useState(false);
  const [openFollowingBox, setOpenFollowingBox] = useState(false);

  const logoutHandler = () => {
    dispatch(logoutUser());
  };

  const deleteHandler = () => {
    dispatch(deleteUser());
  };

  const postDeleteHandler = (postId) => {
    dispatch(deletePost(postId));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
    if (error) {
      alert.error(error);
      dispatch(clearUserError());
    }
    if (postError) {
      alert.error(postError);
      dispatch(clearPostError());
    }
    if (followError) {
      alert.error(followError);
      dispatch(clearFollowError());
    }
    if (message) {
      alert.success(message);
      dispatch(clearUserMessage());
    }
    if (postMessage) {
      alert.success(postMessage);
      dispatch(clearPostMessage());
      navigate("/profile");
    }
    if (isDeleted) {
      dispatch(resetDelete());
      navigate("/signin");
    }
    dispatch(ownPosts());
    dispatch(getMyFollowers());
    dispatch(getMyFollowing());
  }, [
    dispatch,
    isAuthenticated,
    navigate,
    error,
    alert,
    postError,
    followError,
    message,
    isDeleted,
    postMessage,
  ]);

  return (
    <Fragment>
      {loading || postLoading || followLoading ? (
        <Loader />
      ) : (
        <div className="profile__container">
          <div className="profile__info">
            <img src={user?.avatar?.url} alt={user?.name} />
            <div>
              <p>{user?.name}</p>
              <p className="email">{user?.email}</p>
              <p className="bio">{user?.bio}</p>
              <p className="email">Joined on {user?.created_at.slice(0, 10)}</p>

              <p
                onClick={() => setOpenFollowerBox(true)}
                className="follow__btn"
              >
                {followersList?.length} Followers
              </p>
              {openFollowerBox ? (
                <div className="follow__container">
                  <AiOutlineClose onClick={() => setOpenFollowerBox(false)} />
                  <div className="follow__box">
                    {followersList.map((item) => (
                      <Link
                        to={`/user/detail/${item.follower._id}`}
                        key={item._id}
                      >
                        <img
                          src={item.follower.avatar.url}
                          alt={item.follower.name}
                          height="30px"
                          width="30px"
                        />
                        <p>{item.follower.name}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}

              <p
                onClick={() => setOpenFollowingBox(true)}
                className="follow__btn"
              >
                {followingList?.length} Following
              </p>
              {openFollowingBox ? (
                <div className="follow__container">
                  <AiOutlineClose onClick={() => setOpenFollowingBox(false)} />
                  <div className="follow__box">
                    {followingList.map((item) => (
                      <Link
                        to={`/user/detail/${item.following._id}`}
                        key={item._id}
                      >
                        <img
                          src={item.following.avatar.url}
                          alt={item.follower.name}
                          height="30px"
                          width="30px"
                        />
                        <p>{item.following.name}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}

              <Link to="/update/profile">Update Profile</Link>
            </div>
          </div>
          <div className="profile__buttons">
            <button onClick={logoutHandler} className="logout">
              Logout
            </button>
            <button onClick={deleteHandler} className="delete">
              Delete Account
            </button>
          </div>
          <div className="profile__posts">
            {ownPost.map((post) => (
              <div key={post._id}>
                <button
                  onClick={(e) => postDeleteHandler(post._id)}
                  className="postdltbtn"
                >
                  Delete
                </button>
                <PostCard post={post} socket={socket} />
              </div>
            ))}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Profile;
