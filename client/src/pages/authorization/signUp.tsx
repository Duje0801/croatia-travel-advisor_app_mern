import { useState, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/navigation/navigation";
import Redirect from "../redirectLoading/redirect";
import axios from "axios";
import "../../styles/pages/logInSignUp.css";

export default function SignUp(): JSX.Element {
  const [username, setUsername] = useState<string>(``);
  const [email, setEmail] = useState<string>(``);
  const [password, setPassword] = useState<string>(``);
  const [confirmPassword, setConfirmPassword] = useState<string>(``);
  const [isSignedUp, setIsSignedUp] = useState<boolean>(false);
  const [error, setError] = useState<string>(``);

  const { state, dispatch } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    axios
      .post(
        `https://croatia-travel-advisor-app-mern.onrender.com/api/user/signUp`,
        { data: { username, email, password, confirmPassword } },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setUsername(``);
        setEmail(``);
        setPassword(``);
        setConfirmPassword(``);
        setError(``);
        setIsSignedUp(true);
        dispatch({ type: "SET", payload: res.data.data });
        localStorage.setItem("user", JSON.stringify(res.data.data));
      })
      .catch((err) => {
        setPassword(``);
        setConfirmPassword(``);
        if (err?.response?.data?.error) {
          setError(`${err.response.data.error}`);
        } else setError("Something went wrong, please try again later.");
      });
  };

  const handleGoBack = (): void => {
    navigate(-1);
  };

  if (isSignedUp) return <Redirect message={"You are logged in"} />;
  else if (state.user)
    return <Redirect message={"You are already logged in"} />;
  else
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
          </form>
          <button className="signUpGoBackButton" onClick={handleGoBack}>
            Go Back
          </button>
        </div>
      </>
    );
}
