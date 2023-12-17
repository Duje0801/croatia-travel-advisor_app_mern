import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/navigation";
import Redirect from "../redirectLoading/redirect";

export default function ResetPassword() {
  const [email, setEmail] = useState(``);
  const [token, setToken] = useState(``);
  const [newPassword, setNewPassword] = useState(``);
  const [confirmNewPassword, setConfirmNewPassword] = useState(``);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [error, setError] = useState(``);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:4000/api/user/resetPassword",
        {
          method: "PATCH",
          body: JSON.stringify({
            email,
            token,
            newPassword,
            confirmNewPassword,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseJson = await response.json();

      if (responseJson.status === `success`) {
        setIsPasswordChanged(true);
      } else if (responseJson.status === `fail`) {
        setError(responseJson.error);
      }
    } catch (err) {
      setError(`Something went wrong, please try again later.`);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isPasswordChanged)
    return <Redirect message={`Password is successfully changed`} />;
  else
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
              maxLength={20}
              value={newPassword}
              id="password"
            ></input>
            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input
              type="password"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              maxLength={20}
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
