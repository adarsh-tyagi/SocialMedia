import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TiSocialInstagram } from "react-icons/ti";

const Header = ({ isAuthenticated, user }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const submitHandler = () => {};

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
          <img src={user.avatar.url} alt={user.name} />
        ) : (
          <Link to="/signin">Sign In</Link>
        )}
      </div>
    </div>
  );
};

export default Header;
