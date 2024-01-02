import {
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  FormEvent,
} from "react";
import { UserContext } from "../../context/userContext";
import { IDestination } from "../../interfaces/IDestination";
import axios from "axios";

export default function EditDestination(props: {
  destinationId: string;
  setDestination: Dispatch<SetStateAction<IDestination | null>>;
  setEditQuestion: Dispatch<SetStateAction<boolean>>;
  editedImg: string;
  setEditedImg: Dispatch<SetStateAction<string>>;
  editedDescription: string;
  setEditedDescription: Dispatch<SetStateAction<string>>;
  editedNature: boolean;
  setEditedNature: Dispatch<SetStateAction<boolean>>;
  editedTowns: boolean;
  setEditedTowns: Dispatch<SetStateAction<boolean>>;
  editedHistory: boolean;
  setEditedHistory: Dispatch<SetStateAction<boolean>>;
  editedEntertainment: boolean;
  setEditedEntertainment: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  const [editError, setEditError] = useState<string>(``);

  const { state } = useContext(UserContext);

  const handleEditDestination = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    let category: string[] = [];
    let requestBody: {} = {};
    if (props.editedImg)
      requestBody = { ...requestBody, image: props.editedImg };
    if (props.editedDescription)
      requestBody = { ...requestBody, description: props.editedDescription };
    if (props.editedNature) category = ["nature"];
    if (props.editedTowns) category = [...category, "towns"];
    if (props.editedHistory) category = [...category, "history"];
    if (props.editedEntertainment) category = [...category, "entertainment"];

    requestBody = { ...requestBody, category };

    axios
      .patch(
        `https://croatia-travel-advisor-app-mern.onrender.com/api/destination/${props.destinationId}`,
        { data: requestBody },
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${state.user?.token}`,
          },
        }
      )
      .then((res) => {
        const data = res.data.data;
        props.setDestination(data);
        setEditError(``);
        props.setEditQuestion(false);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          setEditError(`${err.response.data.error}`);
        } else {
          setEditError(`Can't edit destination info`);
        }
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
  };

  const handleCloseEdit = (): void => {
    props.setEditQuestion(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <form className="destinationEditForm" onSubmit={handleEditDestination}>
      <div className="destinationEditTitle">Change destination info:</div>
      <div className="destinationError">{editError}</div>
      <label htmlFor="img">Image link:</label>
      <input
        type="text"
        className="destinationEditTextarea"
        value={props.editedImg}
        maxLength={500}
        onChange={(e) => props.setEditedImg(e.target.value)}
        id="img"
        required
      ></input>
      <div className="destinationEditImageDescription">
        The best aspect ratio for the image would be 1.5:1
      </div>
      <label htmlFor="description">Description:</label>
      <textarea
        className="destinationEditTextarea"
        value={props.editedDescription}
        rows={4}
        cols={40}
        maxLength={500}
        onChange={(e) => props.setEditedDescription(e.target.value)}
        id="description"
        required
      ></textarea>
      <fieldset className="destinationEditFileset">
        <legend>Change destinations category:</legend>
        <div>
          <input
            type="checkbox"
            name="type"
            id="nature"
            checked={props.editedNature}
            onChange={() =>
              props.setEditedNature(props.editedNature ? false : true)
            }
          />
          <label htmlFor="nature">Nature</label>
        </div>
        <div>
          <input
            type="checkbox"
            name="type"
            id="towns"
            checked={props.editedTowns}
            onChange={() =>
              props.setEditedTowns(props.editedTowns ? false : true)
            }
          />
          <label htmlFor="towns">Towns</label>
        </div>
        <div>
          <input
            type="checkbox"
            name="type"
            id="history"
            checked={props.editedHistory}
            onChange={() =>
              props.setEditedHistory(props.editedHistory ? false : true)
            }
          />
          <label htmlFor="history">History</label>
        </div>
        <div>
          <input
            type="checkbox"
            name="type"
            id="entertainment"
            checked={props.editedEntertainment}
            onChange={() =>
              props.setEditedEntertainment(
                props.editedEntertainment ? false : true
              )
            }
          />
          <label htmlFor="entertainment">Entertainment</label>
        </div>
      </fieldset>
      <button className="destinationEditDeleteButton" onClick={handleCloseEdit}>
        Close Edit
      </button>
      <button className="destinationEditDeleteButton" type="submit">
        Submit
      </button>
    </form>
  );
}
