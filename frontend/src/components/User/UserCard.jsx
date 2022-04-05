import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdOutlineAddAPhoto } from "react-icons/md";

const UserCard = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div>
      <img src={user.avatar.url} alt={user.name} height="50px" width="30px" />
      <p>{user.name}</p>
      <p>{user.bio}</p>
      <Link to="/profile">View Profile</Link>
      <Link to="/create/post">
        <MdOutlineAddAPhoto />
        <p>New Post</p>
      </Link>
    </div>
  );
};

export default UserCard;
