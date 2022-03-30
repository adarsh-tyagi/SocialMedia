import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import {
  clearError,
  clearMessage,
  postLikes,
  toggleLike,
} from "../../features/likeSlice";
import {
  createComment,
  deleteComment,
  postComments,
} from "../../features/commentSlice";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineComment,
  AiOutlineClose,
  AiFillDelete,
} from "react-icons/ai";

const PostCard = ({ post }) => {
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

  const likeHandler = (e) => {
    e.preventDefault();
    dispatch(toggleLike(String(post._id)));
    // dispatch(postLikes(String(post._id)));
  };
  const commentHandler = (e) => {
    e.preventDefault();
    dispatch(createComment({ content: comment, postId: String(post._id) }));
    // dispatch(postComments(String(post._id)))
  };

  const commentDeleteHandler = (e) => {
    e.preventDefault();
    dispatch(deleteComment(String(post._id)));
  };

  useEffect(() => {
    dispatch(postLikes(String(post._id)));
    dispatch(postComments(String(post._id)));
  }, [dispatch, post]);

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

      {openBox ? (
        <div>
          <div>
            <AiOutlineClose onClick={() => setOpenBox(false)} />
            <div>
              {comments.find(
                (comment) => String(comment.owner._id) === String(user._id)
              ) ? (
                <div>
                  <p>Your comment: </p>
                  <p>
                    {
                      comments.find(
                        (comment) =>
                          String(comment.owner._id) === String(user._id)
                      ).content
                    }
                    <span>
                      <AiFillDelete onClick={commentDeleteHandler} />
                    </span>
                  </p>
                </div>
              ) : (
                <form onSubmit={commentHandler}>
                  <input
                    type="text"
                    placeholder="Comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <input type="submit" value="Post" />
                </form>
              )}
            </div>
            <div>
              {comments
                .filter(
                  (comment) => String(comment.owner._id) !== String(user._id)
                )
                .map((comment) => (
                  <div key={comment._id}>
                    <img
                      src={comment?.owner?.avatar.url}
                      alt={comment?.owner?.name}
                      height="50px"
                      width="50px"
                    />
                    <p>{comment?.owner?.name}</p>
                    <p>{comment?.content}</p>
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
