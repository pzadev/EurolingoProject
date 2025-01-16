import { useState } from "react";

const CreateAccount = ({ setShowLogIn }) => {
  const [createUsername, setCreateUsername] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [submissionFeedback, setSubmissionFeedback] = useState("");

  const handleSubmit = (e) => {
    console.log("Submitted");
    e.preventDefault();

    setSubmissionFeedback(
      "Account has been created successfully! Please proceed to login...."
    );

    setCreateUsername("");
    setCreatePassword("");
    setTimeout(() => {
      setShowLogIn(true);
    }, 3000);
  };

  return (
    <div>
      <h3>Create Account</h3>
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
