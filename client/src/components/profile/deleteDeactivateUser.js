import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";

export default function DeleteDeactivateUser({
  userProfile,
  setUserProfile,
  handleNoAnswer,
  operation,
  setIsDeleted,
  setActivateQuestion,
  setError,
}) {
  const { user, dispatch } = useContext(UserContext);

  const handleDeleteUser = async () => {
    let axiosMethod = user.username === `admin` ? `delete` : `patch`;
    let url = user.username === `admin` ? `deleteUser` : `deleteMe`;

    axios({
      method: `${axiosMethod}`,
      url: `http://localhost:4000/api/user/${url}/`,
      data: { id: userProfile._id },
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => {
        setIsDeleted(true);
        if (user.username !== `admin`) {
          localStorage.removeItem("user");
          dispatch({ type: "DELETE" });
        }
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          setError(`${err.response.data.error}`);
        } else {
          setError(
            `Can't ${
              user.username === `admin` ? `deactivate` : `delete`
            } user. Please try again later`
          );
        }
      });
  };

  const handleActivateUser = async () => {
    const activate = userProfile.active ? `de` : ``;
    axios
      .patch(
        `http://localhost:4000/api/user/${activate}activateUser/`,
        { data: userProfile._id },
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        setUserProfile(res.data.data);
        setActivateQuestion(false);
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          setError(`${err.response.data.error}`);
        } else {
          setError(`Can't ${activate}activate user. Please try again later`);
        }
      });
  };

  return (
    <div className="userProfileDeleteText">
      Do you want to {operation} user {userProfile.username}?
      <div className="userProfileDeleteButtonsDiv">
        <button
          className="userProfileDeleteButtons"
          onClick={() =>
            operation === `delete` ? handleDeleteUser() : handleActivateUser()
          }
        >
          Yes
        </button>
        <button
          className="userProfileDeleteButtons"
          onClick={() => handleNoAnswer()}
        >
          No
        </button>
      </div>
    </div>
  );
}
