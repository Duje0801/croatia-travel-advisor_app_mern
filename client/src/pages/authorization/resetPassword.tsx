import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/navigation/navigation";
import Redirect from "../redirectLoading/redirect";
import axios from "axios";
import Loading from "../redirectLoading/loading";

export default function ResetPassword(): JSX.Element {
  const [email, setEmail] = useState<string>(``);
  const [token, setToken] = useState<string>(``);
  const [newPassword, setNewPassword] = useState<string>(``);
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>(``);
  const [isPasswordChanged, setIsPasswordChanged] = useState<boolean>(false);
  const [notLogged, setNotLogged] = useState<boolean>(false);
  const [error, setError] = useState<string>(``);

  const navigate = useNavigate();

  const { state } = useContext(UserContext);

  useEffect(() => {
    //Checking is user logged in, while waiting loading page will be displayed,
    //if user is logged in it will show redirect page,
    //else it will show restart password form
    if (state.user === null) setNotLogged(true);
  }, [state]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    axios
      .patch(
        `https://croatia-travel-advisor-app-mern.onrender.com/api/user/resetPassword`,
        { data: { email, token, newPassword, confirmNewPassword } },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setEmail(``);
        setToken(``);
        setNewPassword(``);
        setConfirmNewPassword(``);
        setIsPasswordChanged(true);
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          setNewPassword(``);
          setConfirmNewPassword(``);
          setError(`${err.response.data.error}`);
        } else setError(`Something went wrong, please try again later.`);
      });
  };

  const handleGoBack = (): void => {
    navigate(-1);
  };

  if (isPasswordChanged) {
    return <Redirect message={`Password is successfully changed`} />;
  } else if (!state.user && !notLogged) {
    return <Loading />;
  } else if (state.user && notLogged) {
    return <Redirect message={"You are already logged in"} />;
  } else {
    return (
      <>
        <Navigation />
        <div className="signUp">
          <div className="signUpTitle">Reset password:</div>
          <div className="signUpError">{error}</div>
          <form className="signUpForm" onSubmit={handleSubmit}>
            <label htmlFor="token">Email:</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              maxLength={30}
              value={email}
              id="email"
            ></input>

            <label htmlFor="token">Token:</label>
            <input
              type="text"
              onChange={(e) => setToken(e.target.value)}
              maxLength={24}
              value={token}
              id="token"
            ></input>
            <label htmlFor="password">New password:</label>
            <input
              type="password"
              onChange={(e) => setNewPassword(e.target.value)}
              maxLength={15}
              value={newPassword}
              id="password"
            ></input>
            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input
              type="password"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              maxLength={15}
              value={confirmNewPassword}
              id="confirmPassword"
            ></input>
            <button type="submit">Submit</button>
          </form>
          <button onClick={handleGoBack}>Go Back</button>
        </div>
      </>
    );
  }
}
