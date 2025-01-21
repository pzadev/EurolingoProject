import React, { useEffect, useState } from "react";
import "./Header.css";
const Header = ({ username, gameStart }) => {

  const [isHidden, setIsHidden] = useState(true)

  const toggleIsHidden = () => {

    setIsHidden(!isHidden)
}
  
  return (
    <header className="header">
        <div className="header-logo">
          <img src="/logo.png" alt="EuroLingo Logo" />
        </div>
        {gameStart ? <h3 className="welcomeText">Welcome {username}! 
        <button className='toggleButton' onClick={toggleIsHidden}>
        </button>
        </h3> : null}
        {!isHidden && (<div className="infoContainer"><ul className="infoText">
          <strong>Welcome to EuroLingo...</strong>
          <li>Each house on the map represents a different country, displayed by the flag on its door.</li>
          <li>Explore our map by using your arrow keys and to enter the houses to engage in some language learning, word pairing games ! Each house will have 5 rounds, which once completed will earn you a flag.</li>
          <li>After all flags have been collected, you will unlock a final level testing the new knowledge you've accumulated !</li></ul></div>)}
    </header>
  );
};
export default Header;
