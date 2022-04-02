import React, { Fragment, useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyFollowers, getMyFollowing } from "../../features/followSlice";
import { ownPosts } from "../../features/postSlice";
import {
  clearError,
  clearMessage,
  deleteUser,
  logoutUser,
  resetDelete,
} from "../../features/userSlice";
import Loader from "../Loader/Loader";
import PostCard from "../Posts/PostCard";
import { Link } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { loading, user, error, isAuthenticated, isDeleted, message } =
    useSelector((state) => state.user);
  const {
    loading: postLoading,
    ownPosts: ownPost,
    error: postError,
  } = useSelector((state) => state.post);
  const {
    loading: followLoading,
    error: followError,
    followersList,
    followingList,
  } = useSelector((state) => state.follow);

  const logoutHandler = () => {
    dispatch(logoutUser());
  };

  const deleteHandler = () => {
    dispatch(deleteUser());
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }
    if (postError) {
      alert.error(postError);
      dispatch(clearError());
    }
    if (followError) {
      alert.error(followError);
      dispatch(clearError());
    }
    if (message) {
      alert.success(message);
      dispatch(clearMessage());
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
  ]);

  return (
    <Fragment>
      {loading || postLoading || followLoading ? (
        <Loader />
      ) : (
        <div>
          <div>
            <img src={user?.avatar?.url} alt={user?.name} />
            <p>{user?.name}</p>
            <p>{user?.email}</p>
            <p>{user?.bio}</p>
            <p>Joined on {user?.created_at.slice(0, 10)}</p>
            <p>{followersList?.length} Followers</p>
            <p>{followingList?.length} Following</p>
            <Link to="/liked-posts">Liked Posts</Link>
            <Link to="/update/profile">Update Profile</Link>
          </div>
          <div>
            <button onClick={logoutHandler}>Logout</button>
            <button onClick={deleteHandler}>Delete Account</button>
          </div>
          <div>
            {ownPost.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Profile;
