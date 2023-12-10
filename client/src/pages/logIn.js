import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import Navigation from "../components/navigation";
import { routes } from "../routes/routes";
import "../styles/logInSignUp.css";

export default function LogIn() {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [error, setError] = useState(``);

  const { dispatch } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:4000/api/user/logIn", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseJson = await response.json();

    if (responseJson.status === `success`) {
      setEmail(``);
      setPassword(``);
      setError(``);
      dispatch({ type: "SET", payload: responseJson.data });
      localStorage.setItem("user", JSON.stringify(responseJson.data));
      navigate(routes.home);
    } else if (responseJson.status === `fail`) {
      setPassword(``);
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
        <div className="signUpTitle">Log In:</div>
        <div className="signUpError">{error}</div>
        <form className="signUpForm" onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            maxLength={30}
            value={email}
            id="email"
          ></input>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            maxLength={20}
            value={password}
            id="password"
          ></input>
          <button type="submit">Submit</button>
        </form>
        <button onClick={handleGoBack}>Go Back</button>
        <div className="signUpDontHaveAcc">
          Don't have an account?{" "}
          <span style={{ color: `#00af87` }}>Sign up</span>
        </div>
      </div>
    </>
  );
}
