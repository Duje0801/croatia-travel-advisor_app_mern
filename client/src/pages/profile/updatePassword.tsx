import { FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/home/navigation";
import Redirect from "../redirectLoading/redirect";
import axios from "axios";

export default function UpdatePassword(): JSX.Element {
  const [oldPassword, setOldPassword] = useState<string>(``);
  const [newPassword, setNewPassword] = useState<string>(``);
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>(``);
  const [isPasswordChanged, setIsPasswordChanged] = useState<boolean>(false);
  const [error, setError] = useState<string>(``);

  const navigate = useNavigate();

  const { state, dispatch } = useContext(UserContext);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    axios
      .patch(
        `https://croatia-travel-advisor-app-mern.onrender.com/api/user/updatePassword`,
        {
          data: {
            oldPassword,
            newPassword,
            confirmNewPassword,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${state.user?.token}`,
          },
        }
      )
      .then((res) => {
        setIsPasswordChanged(true);
        localStorage.removeItem("user");
        dispatch({ type: "DELETE", payload: null });
      })
      .catch((err) => {
        setOldPassword(``);
        setNewPassword(``);
        setConfirmNewPassword(``);

        if (err?.response?.data?.error) {
          setError(`${err.response.data.error}`);
        } else setError("Something went wrong, please try again later.");
      });
  };

  const handleGoBack = (): void => {
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
