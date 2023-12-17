import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/homeComponents/navigation";
import Redirect from "../redirectLoading/redirect";

export default function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState(``);
  const [newPassword, setNewPassword] = useState(``);
  const [confirmNewPassword, setConfirmNewPassword] = useState(``);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [error, setError] = useState(``);

  const navigate = useNavigate();

  const { user, dispatch } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:4000/api/user/updatePassword",
        {
          method: "PATCH",
          body: JSON.stringify({
            oldPassword,
            newPassword,
            confirmNewPassword,
          }),
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      const responseJson = await response.json();

      if (responseJson.status === `success`) {
        setIsPasswordChanged(true);
        localStorage.removeItem("user");
        dispatch({ type: "DELETE" });
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
    return (
      <Redirect
        message={`Password is successfully changed, now log in with new password`}
      />
    );
  else
    return (
      <>
        <Navigation />
        <div className="signUp">
          <div className="signUpTitle">Change Password:</div>
          <div className="signUpError">{error}</div>
          <form className="signUpForm" onSubmit={handleSubmit}>
            <label htmlFor="oldPassword">Old Password:</label>
            <input
              type="password"
              onChange={(e) => setOldPassword(e.target.value)}
              maxLength={15}
              value={oldPassword}
              id="oldPassword"
            ></input>
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              onChange={(e) => setNewPassword(e.target.value)}
              maxLength={15}
              value={newPassword}
              id="newPassword"
            ></input>
            <label htmlFor="confirmNewPassword">Confirm New Password:</label>
            <input
              type="password"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              maxLength={15}
              value={confirmNewPassword}
              id="confirmNewPassword"
            ></input>
            <button type="submit">Submit</button>
          </form>
          <button onClick={handleGoBack}>Go Back</button>
        </div>
      </>
    );
}
