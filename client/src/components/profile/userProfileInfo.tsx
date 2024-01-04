import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import DateString from "../../logic/dateString";
import { IUser } from "../../interfaces/IUser";

export default function UserProfileInfo(props: {
  userProfile: IUser;
  reviewsCount: number;
}): JSX.Element {
  const { state } = useContext(UserContext);

  return (
    <>
      <div className="userProfileUserInfoTitle">User info:</div>
      <div className="userProfileData">
        {state.user?.username === props.userProfile.username ||
        state.user?.username === `admin` ? (
          <div>
            <b>Email address:</b> {props.userProfile.email}
          </div>
        ) : null}
        <div>
          <b>Profile created at:</b> {DateString(props.userProfile.createdAt)}
        </div>
        <div>
          <b>Number of reviews:</b> {props.reviewsCount}
        </div>
      </div>
    </>
  );
}
