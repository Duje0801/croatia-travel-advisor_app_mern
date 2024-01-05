import { useContext, Dispatch, SetStateAction } from "react";
import { UserContext } from "../../context/userContext";
import { IUser } from "../../interfaces/IUser";
import axios from "axios";

export default function DeleteUser(props: {
  userProfile: IUser;
  setUserProfile: Dispatch<SetStateAction<IUser | null>>;
  handleNoAnswer: () => void;
  setIsDeleted: Dispatch<SetStateAction<boolean>>;
  setActivateQuestion: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
}): JSX.Element {
  const { state } = useContext(UserContext);

  const handleDeleteUser = async (): Promise<void> => {
    axios
      .delete(`https://croatia-travel-advisor-app-mern.onrender.com/api/user/deleteUser/`, {
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${state.user?.token}`,
        },
        data: { id: props.userProfile.id },
      })
      .then((res) => {
        props.setIsDeleted(true);
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          props.setError(`${err.response.data.error}`);
        } else {
          props.setError(`Can't delete user. Please try again later`);
        }
      });
  };

  return (
    <div className="userProfileDeleteText">
      Do you want to delete user {props.userProfile.username}?
      <div className="userProfileDeleteButtonsDiv">
        <button
          className="userProfileDeleteButtons"
          onClick={() => handleDeleteUser()}
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
