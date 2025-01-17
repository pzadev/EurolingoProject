import React from "react";
import "./Header.css";
const Header = ({ username }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <h1></h1>
        </div>
        <nav className="header-nav">
          <p>Hello {username}</p>
        </nav>
      </div>
    </header>
  );
};
export default Header;
