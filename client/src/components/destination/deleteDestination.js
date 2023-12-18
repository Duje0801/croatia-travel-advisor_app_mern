import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";

export default function DeleteDestination({
  destinationId,
  destinationName,
  handleDeleteDestination,
  setIsDeleted,
  setDeleteError,
}) {
  const { user } = useContext(UserContext);

  const finalDeleteDestination = () => {
    axios
      .delete(`http://localhost:4000/api/destination/${destinationId}`, {
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        handleDeleteDestination();
        setIsDeleted(true);
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          handleDeleteDestination();
          setDeleteError(`${err.response.data.error}`);
        } else {
          handleDeleteDestination();
          setDeleteError(`Can't delete destination. Please try again later.`);
        }
      });
  };

  return (
    <div className="destinationDeleteText">
      Are you sure you want to delete destination {destinationName}?
      <div className="destinationDeleteButtonsDiv">
        <button
          className="destinationDeleteButtons"
          onClick={finalDeleteDestination}
        >
          Yes
        </button>
        <button
          className="destinationDeleteButtons"
          onClick={handleDeleteDestination}
        >
          No
        </button>
      </div>
    </div>
  );
}
