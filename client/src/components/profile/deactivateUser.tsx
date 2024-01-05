import { useContext, Dispatch, SetStateAction } from "react";
import { UserContext } from "../../context/userContext";
import { IUser } from "../../interfaces/IUser";
import axios from "axios";

export default function DeactivateUser(props: {
  userProfile: IUser;
  setUserProfile: Dispatch<SetStateAction<IUser | null>>;
  handleNoAnswer: () => void;
  setIsDeactivated: Dispatch<SetStateAction<boolean>>;
  setActivateQuestion: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
}): JSX.Element {
  const { state, dispatch } = useContext(UserContext);

  const handleActivateUser = async (): Promise<void> => {
    axios
      .patch(
        `https://croatia-travel-advisor-app-mern.onrender.com/api/user/activationUser`,
        { data: props.userProfile.id },
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${state.user?.token}`,
          },
        }
      )
      .then((res) => {
        if (
          !res.data.data.active &&
          res.data.data.username === state.user?.username
        ) {
          localStorage.removeItem("user");
          dispatch({ type: "DELETE", payload: null });
          props.setIsDeactivated(true);
        } else if (state.user?.username === `admin`) {
          props.setUserProfile(res.data.data);
          props.setActivateQuestion(false);
        }
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          props.setError(`${err.response.data.error}`);
        } else {
          props.setError(
            `Can't change user active status. Please try again later`
          );
        }
      });
  };

  return (
    <div className="userProfileDeleteText">
      Do you want to {props.userProfile.active ? `deactivate` : `activate`} user{" "}
      {props.userProfile.username}?
      <div className="userProfileDeleteButtonsDiv">
        <button
          className="userProfileDeleteButtons"
          onClick={() => handleActivateUser()}
        >
          Yes
        </button>
        <button
          className="userProfileDeleteButtons"
          onClick={() => props.handleNoAnswer()}
        >
          No
        </button>
      </div>
    </div>
  );
}
