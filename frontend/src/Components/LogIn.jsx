import { useState } from "react";

const LogIn = ({ setGameStart, setShowLogIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setGameStart(true);
    setLoading(true);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h3>Log In</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="login-button" type="submit">
          Submit
        </button>
      </form>
      <button onClick={() => setShowLogIn(false)}>Create Account</button>
    </div>
  );
};

export default LogIn;
