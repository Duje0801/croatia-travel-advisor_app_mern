import { useContext, Dispatch, SetStateAction } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";

export default function DeleteDestination(props: {
  destinationId: string;
  destinationName: string;
  handleDeleteDestination: () => void;
  setIsDeleted: Dispatch<SetStateAction<boolean>>;
  setDeleteError: Dispatch<SetStateAction<string>>;
}): JSX.Element {
  const { state } = useContext(UserContext);

  const finalDeleteDestination = (): void => {
    axios
      .delete(`http://localhost:4000/api/destination/${props.destinationId}`, {
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${state.user?.token}`,
        },
      })
      .then((res) => {
        props.handleDeleteDestination();
        props.setIsDeleted(true);
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          props.handleDeleteDestination();
          props.setDeleteError(`${err.response.data.error}`);
        } else {
          props.handleDeleteDestination();
          props.setDeleteError(
            `Can't delete destination. Please try again later.`
          );
        }
      });
  };

  return (
    <div className="destinationDeleteText">
      Are you sure you want to delete destination {props.destinationName}?
      <div className="destinationDeleteButtonsDiv">
        <button
          className="destinationDeleteButtons"
          onClick={finalDeleteDestination}
        >
          Yes
        </button>
        <button
          className="destinationDeleteButtons"
          onClick={props.handleDeleteDestination}
        >
          No
        </button>
      </div>
    </div>
  );
}
