import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import UserProfileButtons from "./userProfileButtons";
import { IUser } from "../../interfaces/IUser";

export default function UserProfileHeader(props: {
  userProfile: IUser;
  handleActivate: () => void;
  handleDelete: () => void;
}): JSX.Element {
  const { state } = useContext(UserContext);

  return (
    <div className="userProfileHeader">
      <div>
        <div className="userProfileTitle"> {props.userProfile.username}</div>
        {state.user?.username === `admin` && props.userProfile.username !== `admin` ? (
          <div className="userProfileActive">
            {props.userProfile.active ? `User is active` : `User is not active`}
            <div
              className={
                props.userProfile.active
                  ? `userIsActiveBox`
                  : `userIsNotActiveBox`
              }
            ></div>
          </div>
        ) : null}
      </div>
      <UserProfileButtons
        userProfile={props.userProfile}
        handleActivate={props.handleActivate}
        handleDelete={props.handleDelete}
      />
    </div>
  );
}
