import { useState, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/navigation/navigation";
import Redirect from "../redirectLoading/redirect";
import { routes } from "../../routes/routes";
import axios from "axios";
import "../../styles/pages/logInSignUp.css";

export default function LogIn(): JSX.Element {
  const [email, setEmail] = useState<string>(``);
  const [password, setPassword] = useState<string>(``);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [error, setError] = useState<string>(``);

  const { state, dispatch } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    axios
      .post(
        `https://croatia-travel-advisor-app-mern.onrender.com/api/user/logIn`,
        { data: { email, password } },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setEmail(``);
        setPassword(``);
        setError(``);
        setIsLoggedIn(true);
        dispatch({ type: "SET", payload: res.data.data });
        localStorage.setItem("user", JSON.stringify(res.data.data));
      })
      .catch((err) => {
        setPassword(``);
        if (err?.response?.data?.error) {
          setError(`${err.response.data.error}`);
        } else setError("Something went wrong, please try again later.");
      });
  };

  const handleGoToForgotPassword = (): void => {
    navigate(routes.forgotPassword);
  };

  const handleGoToSignUp = (): void => {
    navigate(routes.signUp);
  };

  const handleGoBack = (): void => {
    navigate(-1);
  };

  if (isLoggedIn) return <Redirect message={"You are logged in"} />;
  else if (state.user)
    return <Redirect message={"You are already logged in"} />;
  else
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
              maxLength={15}
              value={password}
              id="password"
            ></input>
            <div
              onClick={handleGoToForgotPassword}
              className="logInforgotPassword"
            >
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
