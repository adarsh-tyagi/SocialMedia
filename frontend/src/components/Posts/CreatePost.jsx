import React, { useEffect, useState, Fragment } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearPostError,
  clearPostMessage,
  createPost,
} from "../../features/postSlice";
import Loader from "../Loader/Loader";
import { MdOutlineAddPhotoAlternate, MdOutlineMessage } from "react-icons/md";

const CreatePost = () => {
  const { loading, message, error } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [postImage, setPostImage] = useState("");

  const changeHandler = (e) => {
    if (e.target.name === "postImage") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPostImage(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setCaption(e.target.value);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("caption", caption);
    myForm.set("image", postImage);
    dispatch(createPost(myForm));
  };

  useEffect(() => {
    if (message) {
      alert.success(message);
      dispatch(clearPostMessage());
      navigate("/profile");
    }
    if (error) {
      alert.error(error);
      dispatch(clearPostError());
    }
  }, [alert, dispatch, error, message, navigate]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <h1>Create New Post</h1>

          <form onSubmit={submitHandler}>
            <div>
              <MdOutlineAddPhotoAlternate />
              <input
                type="file"
                accept="image/*"
                name="postImage"
                onChange={changeHandler}
              />
            </div>
            <div>
              <MdOutlineMessage />
              <input
                type="text"
                required
                placeholder="Post Caption"
                name="caption"
                value={caption}
                onChange={changeHandler}
              />
            </div>
            <input type="submit" value="Post" className="btn" />
          </form>
        </div>
      )}
    </Fragment>
  );
};

export default CreatePost;
