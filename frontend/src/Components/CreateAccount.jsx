import { useState } from "react";
import loadingBox from "../../public/assets/loadingBox.gif";
import { checkIfUserExists, createUser } from "../api";

const CreateAccount = ({ setShowLogIn }) => {
  const [createUsername, setCreateUsername] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [submissionFeedback, setSubmissionFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const existinguser = await checkIfUserExists(createUsername);
      if (existinguser) {
        setSubmissionFeedback("Username already taken, please choose another");
        setCreateUsername("");
        setCreatePassword("");
      } else {
        await createUser(createUsername, createPassword);
        setSubmissionFeedback("Account created successfully");
        setCreateUsername("");
        setCreatePassword("");
        setTimeout(() => {
          setShowLogIn(true);
        }, 2000);
      }
    } catch (err) {
      setSubmissionFeedback(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loadingContainer">
        <img className="loadingImage" src={loadingBox}></img>
        <p className="loadingText">
          Loading, this may take a while...please be patient!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="welcomeText">Create Account</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Create Username"
          value={createUsername}
          onChange={(e) => setCreateUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Create Password"
          value={createPassword}
          onChange={(e) => setCreatePassword(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      <div className="submissionFeedback">
        <p>{submissionFeedback}</p>
      </div>
      <button onClick={() => setShowLogIn(true)}>Back to Log In</button>
    </div>
  );
};

export default CreateAccount;
