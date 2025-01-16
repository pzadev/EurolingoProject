import { useState } from "react";
import { findUser } from "../api";

const LogIn = ({ setGameStart, setShowLogIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  // do we using this statment somewhere?
  const [submissionFeedback, setSubmissionFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await findUser(username, password);
      if (data.password === password) {
        setSubmissionFeedback("Log in successfully");
        setGameStart(true);
        setUsername("");
        setPassword("");
      } else if (data.password !== password) {
        setSubmissionFeedback("Incorrect password");
        setPassword("");
      }
    } catch (err) {
      // console.log("error", error.message); this is not working
      setSubmissionFeedback("User doesn't exist, check your log in details");
    } finally {
      setLoading(false);
    }
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
      <div className="submissionFeedback">
        <p>{submissionFeedback}</p>
      </div>
      <button onClick={() => setShowLogIn(false)}>Create Account</button>
    </div>
  );
};

export default LogIn;
