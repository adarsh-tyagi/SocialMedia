import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TiSocialInstagram } from "react-icons/ti";

const Header = ({ isAuthenticated, user }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="header">
      <Link to="/">
        <TiSocialInstagram />
      </Link>
      <div className="header__div1">
        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Search people"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>
      <div className="header__div2">
        {isAuthenticated ? (
          <Link to="/profile">
            <img src={user.avatar.url} alt={user.name} />
          </Link>
        ) : (
          <Link to="/signin">Sign In</Link>
        )}
      </div>
    </div>
  );
};

export default Header;
