import React, { Fragment, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyFollowers, getMyFollowing } from "../../features/followSlice";
import { deletePost, ownPosts } from "../../features/postSlice";
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
import { AiOutlineClose } from "react-icons/ai";

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
    if (postMessage) {
      alert.success(postMessage);
      dispatch(clearMessage());
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
    postMessage
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

            <p onClick={() => setOpenFollowerBox(true)}>
              {followersList?.length} Followers
            </p>
            {openFollowerBox ? (
              <div>
                <AiOutlineClose onClick={() => setOpenFollowerBox(false)} />
                <div>
                  {followersList.map((item) => (
                    <Link to={`/detail/${item.follower._id}`} key={item._id}>
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

            <p onClick={() => setOpenFollowingBox(true)}>
              {followingList?.length} Following
            </p>
            {openFollowingBox ? (
              <div>
                <AiOutlineClose onClick={() => setOpenFollowingBox(false)} />
                <div>
                  {followingList.map((item) => (
                    <Link to={`/detail/${item.following._id}`} key={item._id}>
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
          <div>
            <button onClick={logoutHandler}>Logout</button>
            <button onClick={deleteHandler}>Delete Account</button>
          </div>
          <div>
            {ownPost.map((post) => (
              <div key={post._id}>
                <PostCard post={post} />
                <button onClick={(e) => postDeleteHandler(post._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Profile;
