import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/home/navigation";
import { routes } from "../../routes/routes";
import "../../styles/pages/logInSignUp.css";

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

  const handleGoToForgotPassword = () => {
    navigate(routes.forgotPassword);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToSignUp = () => {
    navigate(routes.signUp);
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
          <div onClick={handleGoToForgotPassword} style={{ color: `#00af87` }}>
            Forgot password?
          </div>
          <button type="submit">Submit</button>
        </form>
        <button onClick={handleGoBack}>Go Back</button>
        <div className="logInDontHaveAcc">
          Don't have an account?{" "}
          <span onClick={handleGoToSignUp} style={{ color: `#00af87` }}>
            Sign up
          </span>
        </div>
      </div>
    </>
  );
}
