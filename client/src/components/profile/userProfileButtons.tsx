import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { routes } from "../../routes/routes";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../interfaces/IUser";

export default function UserProfileButtons(props: {
  userProfile: IUser;
  handleActivate: () => void;
  handleDelete: () => void;
}): JSX.Element {
  const { state } = useContext(UserContext);

  const navigate = useNavigate();

  const handleChangeEmail = (): void => {
    navigate(routes.updateEmail);
  };

  const handleChangePassword = (): void => {
    navigate(routes.updatePassword);
  };

  const handleBack = (): void => {
    navigate(-1);
  };

  return (
    <div className="userProfileButtonsDiv">
      {state.user?.username === props.userProfile.username &&
      state.user?.username !== `admin` ? (
        <>
          <button onClick={() => handleChangeEmail()}>Change Email</button>
          <button onClick={() => handleChangePassword()}>
            Change Password
          </button>{" "}
        </>
      ) : null}
      {state.user?.username === props.userProfile.username ||
      state.user?.username === `admin` ? (
        <>
          <button
            className="userProfileButton"
            onClick={() => props.handleActivate()}
          >
            {!props.userProfile?.active ? `Activate` : `Deactivate`}
          </button>
        </>
      ) : null}
      {state.user?.username === `admin` &&
      props.userProfile.username !== `admin` ? (
        <button
          className="userProfileButton"
          onClick={() => props.handleDelete()}
        >
          Delete
        </button>
      ) : null}
      <button className="userProfileButton" onClick={() => handleBack()}>
        Back
      </button>
    </div>
  );
}
