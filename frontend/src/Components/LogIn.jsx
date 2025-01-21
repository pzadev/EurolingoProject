import { useState } from "react";
import Lottie from 'lottie-react'; // Default export, not named
import loadingAnimation from '../../public/assets/loadingAnimation2.json'; // Loading animation JSON import
import { findUser } from "../api";
import '../../public/assets/loadingBox.gif'

const LogIn = ({ setGameStart, setShowLogIn, setUsername, username }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await findUser(username, password);
      if (data.password === password) {
        setSubmissionFeedback("Log in successfully");
        setGameStart(true);
        setUsername(username)
        setPassword("");
      } else if (data.password !== password) {
        setSubmissionFeedback("Incorrect password");
        setPassword("");
      }
    } catch (err) {
      setSubmissionFeedback("User doesn't exist, check your log in details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loadingContainer">
        <img className='loadingImage' src='../../public/assets/loadingBox.gif'></img>
        <p className="loadingText" >Loading, this may take a while...please be patient!</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="welcomeText">Log In</h3>
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
