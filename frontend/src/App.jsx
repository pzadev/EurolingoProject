import React, { useState } from "react";
import PhaserGame from "./PhaserGame";
import Header from "./Components/Header";
import LogIn from "./Components/LogIn";
import CreateAccount from "./Components/CreateAccount";
import "./App.css";

const App = () => {
  const [gameStart, setGameStart] = useState(false);
  const [showLogIn, setShowLogIn] = useState(true);

  return (
    <div>
      <Header username="test" />
      <img src="/logo.png" alt="EuroLingo Logo" />
      {gameStart ? (
        <PhaserGame />
      ) : showLogIn ? (
        <LogIn setGameStart={setGameStart} setShowLogIn={setShowLogIn} />
      ) : (
        <CreateAccount setShowLogIn={setShowLogIn} />
      )}
    </div>
  );
};

export default App;
