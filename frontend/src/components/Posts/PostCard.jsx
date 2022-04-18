import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { clearLikeError, postLikes, toggleLike } from "../../features/likeSlice";
import {
  createComment,
  deleteComment,
  postComments,
  clearCommentError,
  // clearCommentMessage
} from "../../features/commentSlice";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineComment,
  AiOutlineClose,
  AiFillDelete,
} from "react-icons/ai";
import { Link } from "react-router-dom";
// import { createNotification } from "../../features/notificationSlice";

const PostCard = ({ post, socket }) => {
  const [openBox, setOpenBox] = useState(false);
  const [comment, setComment] = useState("");

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

  const boxOpenHandler = (e) => {
    e.preventDefault();

    // fetch likes and comments
    dispatch(postLikes(String(post._id)));
    dispatch(postComments(String(post._id)));

    setOpenBox(true);
  };

  const likeHandler = (e) => {
    e.preventDefault();
    dispatch(toggleLike(String(post._id)));
    if (String(post.owner._id) !== String(user._id)) {
      // dispatch(
      //   createNotification({
      //     receiverId: post.owner._id,
      //     content: `${user.name} liked your post.`,
      //   })
      // );
      socket.emit("sendNotification", {
        sender: user._id,
        receiver: post.owner._id,
        content: `${user.name} liked your post`,
      });
    }
  };

  const commentHandler = (e) => {
    e.preventDefault();
    dispatch(createComment({ content: comment, postId: String(post._id) }));
    if (String(post.owner._id) !== String(user._id)) {
      // dispatch(
      //   createNotification({
      //     receiverId: post.owner._id,
      //     content: `${user.name} commented on your post.`,
      //   })
      // );
      socket.emit("sendNotification", {
        sender: user._id,
        receiver: post.owner._id,
        content: `${user.name} commented on your post`,
      });
    }
  };

  const commentDeleteHandler = (e) => {
    e.preventDefault();
    dispatch(deleteComment(String(post._id)));
    setComment("");
  };

  useEffect(() => {
    // if (message) {
    //   alert.success(message);
    //   dispatch(clearMessage());
    // }
    // if (commentMessage) {
    //   alert.success(commentMessage);
    //   dispatch(clearMessage());
    // }
    if (error) {
      alert.error(error);
      dispatch(clearLikeError());
    }
    if (commentError) {
      alert.error(commentError);
      dispatch(clearCommentError());
    }
  }, [alert, error, message, commentError, commentMessage, dispatch]);

  return (
    <div>
      <div>
        <img
          src={post?.owner?.avatar?.url}
          alt={post?.owner?.name}
          height="30px"
          width="30px"
        />
        {post?.owner?._id === user?._id ? (
          <p>{post?.owner?.name}</p>
        ) : (
          <Link to={`/user/detail/${post?.owner?._id}`}>
            {post?.owner?.name}
          </Link>
        )}
      </div>
      <img src={post?.image.url} alt="post" />
      <p>
        <span>{String(post?.created_at).slice(0, 10)} </span>
        {post?.caption}
      </p>
      <button onClick={(e) => boxOpenHandler(e)}>View Information</button>

      {openBox ? (
        <div>
          <AiOutlineClose onClick={() => setOpenBox(false)} />
          <div>
            <p onClick={(e) => likeHandler(e)}>
              {likes.find(
                (item) => String(item.owner._id) === String(user._id)
              ) ? (
                <AiFillLike />
              ) : (
                <AiOutlineLike />
              )}{" "}
              <span>{likeCount}</span>
            </p>
            <p>
              <AiOutlineComment /> {commentCount}
            </p>
            <div>
              {comments.find(
                (item) => String(item.owner._id) === String(user._id)
              ) ? (
                <div>
                  <p>Your comment</p>
                  <p>
                    {
                      comments.find(
                        (item) => String(item.owner._id) === String(user._id)
                      ).content
                    }{" "}
                    <AiFillDelete onClick={(e) => commentDeleteHandler(e)} />
                  </p>
                </div>
              ) : (
                <form onSubmit={(e) => commentHandler(e)}>
                  <input
                    type="text"
                    placeholder="Comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <input type="submit" value="Submit" />
                </form>
              )}
            </div>
            <div>
              {comments
                .filter((item) => String(item.owner._id) !== String(user._id))
                .map((item) => (
                  <div key={item._id}>
                    <img
                      src={item.owner.avatar.url}
                      alt={item.owner.name}
                      height="30px"
                      width="30px"
                    />
                    <p>{item.content}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default PostCard;
