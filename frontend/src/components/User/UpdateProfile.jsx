import React, { Fragment, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearError,
  clearMessage,
  resetUpdate,
  updateUser,
} from "../../features/userSlice";
import Loader from "../Loader/Loader";
import { FaUserAlt, FaPencilAlt } from "react-icons/fa";

const UpdateProfile = () => {
  const { loading, user, error, isUpdated, message } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState(user.bio);

  const updateDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else if (e.target.name === "name") {
      setName(e.target.value);
    } else {
      setBio(e.target.value);
    }
  };

  const updateHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("bio", bio);
    myForm.set("avatar", avatar);
    dispatch(updateUser(myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }
    if (message) {
      alert.success(message);
      dispatch(clearMessage());
    }
    if (isUpdated) {
      dispatch(resetUpdate());
      navigate("/profile");
    }
  }, [alert, dispatch, message, isUpdated, navigate, error]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <form encType="multipart/form-data" onSubmit={updateHandler}>
            <div>
              <FaUserAlt />
              <input
                type="text"
                required
                placeholder="Name"
                name="name"
                value={name}
                onChange={updateDataChange}
              />
            </div>
            <div>
              <img src={user.avatar.url} alt={user.name} />
              <input
                type="file"
                accept="image/*"
                name="avatar"
                onChange={updateDataChange}
              />
            </div>
            <div>
              <FaPencilAlt />
              <input
                type="text"
                required
                placeholder="Bio"
                name="bio"
                value={bio}
                onChange={updateDataChange}
              />
            </div>
            <input type="submit" value="Update" className="btn" />
          </form>
        </div>
      )}
    </Fragment>
  );
};

export default UpdateProfile;
