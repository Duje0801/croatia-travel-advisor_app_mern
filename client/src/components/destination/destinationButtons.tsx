import { useContext, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

export default function DestinationButtons(props: {
  editQuestion: boolean;
  setEditQuestion: Dispatch<SetStateAction<boolean>>;
  handleDeleteDestination: () => void;
}): JSX.Element {
  const { state } = useContext(UserContext);

  const navigate = useNavigate();

  const handleEditDestination = (): void => {
    props.setEditQuestion(props.editQuestion ? false : true);
  };

  const handleBackClick = (): void => {
    navigate(-1);
  };

  return (
    <div className="destinationGoBackEditDivs">
      {state.user?.username === `admin` && (
        <>
          <button
            className="destinationInfoButtons"
            onClick={handleEditDestination}
          >
            Edit
          </button>
          <button
            className="destinationInfoButtons"
            onClick={props.handleDeleteDestination}
          >
            Delete
          </button>
        </>
      )}
      <button className="destinationInfoButtons" onClick={handleBackClick}>
        Back
      </button>
    </div>
  );
}
