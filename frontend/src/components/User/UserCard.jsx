import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdOutlineAddAPhoto } from "react-icons/md";
import "./UserCard.css"

const UserCard = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="usercard">
      <img src={user.avatar.url} alt={user.name} height="50px" width="30px" />
      <p>{user.name}</p>
      <p>{user.bio}</p>
      <Link to="/profile">View Profile</Link>
      <Link to="/create/post" className="newpost">
        <MdOutlineAddAPhoto />
        New Post
      </Link>
    </div>
  );
};

export default UserCard;
