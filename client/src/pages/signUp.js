import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import Navigation from "../components/navigation";
import { routes } from "../routes/routes";
import "../styles/logInSignUp.css";

export default function SignUp() {
  const [username, setUsername] = useState(``);
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [confirmPassword, setConfirmPassword] = useState(``);
  const [error, setError] = useState(``);

  const { dispatch } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:4000/api/user/signUp", {
      method: "POST",
      body: JSON.stringify({ username, email, password, confirmPassword }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseJson = await response.json();

    if (responseJson.status === `success`) {
      setUsername(``);
      setEmail(``);
      setPassword(``);
      setConfirmPassword(``);
      setError(``);
      dispatch({ type: "SET", payload: responseJson.data });
      localStorage.setItem("user", JSON.stringify(responseJson.data));
      navigate(routes.home);
    } else if (responseJson.status === `fail`) {
      setPassword(``);
      setConfirmPassword(``);
      setError(responseJson.error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Navigation />
      <div className="signUp">
        <div className="signUpTitle">Sign Up:</div>
        <div className="signUpError">{error}</div>
        <form className="signUpForm" onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            maxLength={15}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            id="username"
            required
          ></input>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            maxLength={30}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            id="email"
            required
          ></input>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            maxLength={15}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            id="password"
            required
          ></input>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            maxLength={15}
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            id="confirmPassword"
            required
          ></input>
          <button type="submit">Submit</button>
          <button className="signUpGoBackButton" onClick={handleGoBack}>
            Go Back
          </button>
        </form>
      </div>
    </>
  );
}
