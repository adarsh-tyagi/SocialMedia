import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import {
  clearError,
  clearMessage,
  postLikes,
  toggleLike,
} from "../../features/likeSlice";
import { postComments } from "../../features/commentSlice";
import { AiOutlineLike, AiFillLike, AiOutlineComment } from "react-icons/ai";

const PostCard = ({ post }) => {
  const [openBox, setOpenBox] = useState(false);

  const {
    postLikes: likes,
    likeCount,
    message,
    error,
  } = useSelector((state) => state.likes);
  const {
    comments,
    commentCount,
    message: commentMessage,
    error: commentError,
  } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const alert = useAlert();

  const likeHandler = (e) => {
    e.preventDefault();
    dispatch(toggleLike(String(post._id)));
    dispatch(postLikes(String(post._id)));
  };
  const commentHandler = () => {};

  useEffect(() => {
    dispatch(postLikes(String(post._id)));
    dispatch(postComments(String(post._id)));
  }, [dispatch, post]);

  useEffect(() => {
    if (message) {
      alert.success(message);
      dispatch(clearMessage());
    }
    if (commentMessage) {
      alert.success(commentMessage);
      dispatch(clearMessage());
    }
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }
    if (commentError) {
      alert.error(commentError);
      dispatch(clearError());
    }
  }, [alert, error, message, commentError, commentMessage, dispatch]);

  return (
    <div>
      <img src={post?.image.url} alt="post" />
      <p>{post?.caption}</p>
      <div>
        <p onClick={likeHandler}>
          {likes?.find((item) => String(item?.owner) === String(user?._id)) ? (
            <AiFillLike />
          ) : (
            <AiOutlineLike />
          )}
          <span>{likeCount}</span>
        </p>
        <p onClick={() => setOpenBox(!openBox)}>
          <AiOutlineComment />
          <span>{commentCount}</span>
        </p>
      </div>

      {openBox ? <div>Box opened</div> : ""}
    </div>
  );
};

export default PostCard;
