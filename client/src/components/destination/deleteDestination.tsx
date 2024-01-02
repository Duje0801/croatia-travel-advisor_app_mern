import { useContext, Dispatch, SetStateAction } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";

export default function DeleteDestination(props: {
  destinationId: string;
  destinationName: string;
  handleDeleteDestination: () => void;
  setIsDeleted: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
}): JSX.Element {
  const { state } = useContext(UserContext);

  const finalDeleteDestination = (): void => {
    axios
      .delete(`https://croatia-travel-advisor-app-mern.onrender.com/api/destination/${props.destinationId}`, {
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
          props.setError(`${err.response.data.error}`);
        } else {
          props.handleDeleteDestination();
          props.setError(
            `Can't delete destination. Please try again later`
          );
        }
      });
  };

  return (
    <div className="destinationDeleteText">
      Are you sure you want to delete destination {props.destinationName}?
      <div className="destinationDeleteButtons">
        <button
          onClick={finalDeleteDestination}
        >
          Yes
        </button>
        <button
          onClick={props.handleDeleteDestination}
        >
          No
        </button>
      </div>
    </div>
  );
}
