import React from "react";
import PhaserGame from "./PhaserGame";
import Header from "./Components/Header";

const App = () => {
  return (
    <div>
      <Header />
      <img src="/logo.png" />
      <PhaserGame />
    </div>
  );
};

export default App;
