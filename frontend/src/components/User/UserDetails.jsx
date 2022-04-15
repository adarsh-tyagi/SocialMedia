import React, { Fragment, useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearFollowMessage,
  clearFollowError,
  followUser,
  getMyFollowing,
  unfollowUser,
} from "../../features/followSlice";
import { userPosts } from "../../features/postSlice";
import { clearUserError} from "../../features/userSlice";
import Loader from "../Loader/Loader";
import PostCard from "../Posts/PostCard";
import {createNotification} from "../../features/notificationSlice"

const UserDetails = () => {
  const { userID } = useParams();
  const {user} = useSelector(state => state.user)
  const {
    loading,
    othersPosts,
    userDetail,
    otherUserFollowers,
    otherUserFollowings,
    error,
  } = useSelector((state) => state.post);
  const {
    loading: followLoading,
    followingList,
    message,
    error: followError,
  } = useSelector((state) => state.follow);
  const dispatch = useDispatch();
  const alert = useAlert();

  const followHandler = (e) => {
    e.preventDefault();
    dispatch(followUser({ followingId: userID }));
    dispatch(userPosts(String(userID)))
    dispatch(
      createNotification({
        receiverId: userID,
        content: `${user.name} started following you.`,
      })
    );
  };

  const unfollowHandler = (e) => {
    e.preventDefault();
    dispatch(unfollowUser({ followingId: userID }));
    dispatch(userPosts(String(userID)))
    dispatch(
      createNotification({
        receiverId: userID,
        content: `${user.name} unfollowed you.`,
      })
    );
  };

  useEffect(() => {
    dispatch(userPosts(String(userID)));
    dispatch(getMyFollowing());
  }, [dispatch, userID]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearUserError());
    }
    if (followError) {
      alert.error(followError);
      dispatch(clearFollowError());
    }
    if (message) {
      alert.success(message);
      dispatch(clearFollowMessage());
    }
  }, [dispatch, error, alert, followError, message]);

  return (
    <Fragment>
      {loading || followLoading ? (
        <Loader />
      ) : (
        <div>
          <div>
            <img src={userDetail?.avatar.url} alt={userDetail?.name} />
            <p>{userDetail?.name}</p>
            <p>{userDetail?.bio}</p>
            <p>Followers {otherUserFollowers?.length}</p>
            <p>Following {otherUserFollowings?.length}</p>
            {followingList?.find(
              (item) => String(item.following._id) === String(userDetail?._id)
            ) ? (
              <button onClick={(e) => unfollowHandler(e)}>Unfollow</button>
            ) : (
              <button onClick={(e) => followHandler(e)}>Follow</button>
            )}
          </div>
          <div>
            {othersPosts.length > 0 ? (
              othersPosts?.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <h1>No Posts from the user</h1>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default UserDetails;
