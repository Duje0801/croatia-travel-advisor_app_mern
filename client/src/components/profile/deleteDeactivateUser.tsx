import { useContext, Dispatch, SetStateAction } from "react";
import { UserContext } from "../../context/userContext";
import { IUser } from "../../interfaces/IUser";
import axios from "axios";

export default function DeleteDeactivateUser(props: {
  userProfile: IUser;
  setUserProfile: Dispatch<SetStateAction<IUser | null>>;
  handleNoAnswer: () => void;
  operation: string;
  setIsDeleted: Dispatch<SetStateAction<boolean>>;
  setActivateQuestion: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
}): JSX.Element {
  const { state, dispatch } = useContext(UserContext);

  const handleDeleteUser = async (): Promise<void> => {
    let axiosMethod: string =
      state.user?.username === `admin` ? `delete` : `patch`;
    let url: string =
      state.user?.username === `admin` ? `deleteUser` : `deleteMe`;

    axios({
      method: `${axiosMethod}`,
      url: `http://localhost:4000/api/user/${url}/`,
      data: { id: props.userProfile.id },
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${state.user?.token}`,
      },
    })
      .then((res) => {
        props.setIsDeleted(true);
        if (state.user?.username !== `admin`) {
          localStorage.removeItem("user");
          dispatch({ type: "DELETE", payload: null });
        }
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          props.setError(`${err.response.data.error}`);
        } else {
          props.setError(
            `Can't ${
              state.user?.username === `admin` ? `deactivate` : `delete`
            } user. Please try again later`
          );
        }
      });
  };

  const handleActivateUser = async (): Promise<void> => {
    axios
      .patch(
        `http://localhost:4000/api/user/activationUser`,
        { data: props.userProfile.id },
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${state.user?.token}`,
          },
        }
      )
      .then((res) => {
        props.setUserProfile(res.data.data);
        props.setActivateQuestion(false);
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
      Do you want to {props.operation} user {props.userProfile.username}?
      <div className="userProfileDeleteButtonsDiv">
        <button
          className="userProfileDeleteButtons"
          onClick={() =>
            props.operation === `delete`
              ? handleDeleteUser()
              : handleActivateUser()
          }
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
