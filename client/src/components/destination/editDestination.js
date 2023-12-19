import { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";

export default function EditDestination({
  destinationId,
  setDestination,
  setEditQuestion,
  editedImg,
  setEditedImg,
  editedDescription,
  setEditedDescription,
  editedNature,
  setEditedNature,
  editedTowns,
  setEditedTowns,
  editedHistory,
  setEditedHistory,
  editedEntertainment,
  setEditedEntertainment,
}) {
  const [editError, setEditError] = useState(``);

  const { user } = useContext(UserContext);

  const handleEditDestination = async (e) => {
    e.preventDefault();

    let category = [];
    let requestBody = { category };
    if (editedImg) requestBody = { ...requestBody, image: editedImg };
    if (editedDescription)
      requestBody = { ...requestBody, description: editedDescription };
    if (editedNature) requestBody = { ...requestBody, category: ["nature"] };
    if (editedTowns)
      requestBody = {
        ...requestBody,
        category: [...requestBody.category, "towns"],
      };
    if (editedHistory)
      requestBody = {
        ...requestBody,
        category: [...requestBody.category, "history"],
      };
    if (editedEntertainment)
      requestBody = {
        ...requestBody,
        category: [...requestBody.category, "entertainment"],
      };

    axios
      .patch(
        `http://localhost:4000/api/destination/${destinationId}`,
        { data: requestBody },
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        const data = res.data.data;
        setDestination(data);
        setEditError(``);
        setEditQuestion(false);

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

  const handleCloseEdit = () => {
    setEditQuestion(false);

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
        value={editedImg}
        maxLength={500}
        onChange={(e) => setEditedImg(e.target.value)}
        id="img"
        required
      ></input>
      <div className="destinationEditImageDescription">
        The best aspect ratio for the image would be 1.5:1
      </div>
      <label htmlFor="description">Description:</label>
      <textarea
        className="destinationEditTextarea"
        value={editedDescription}
        rows={4}
        cols={40}
        maxLength={500}
        onChange={(e) => setEditedDescription(e.target.value)}
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
            checked={editedNature}
            onChange={() => setEditedNature(editedNature ? false : true)}
          />
          <label htmlFor="nature">Nature</label>
        </div>
        <div>
          <input
            type="checkbox"
            name="type"
            id="towns"
            checked={editedTowns}
            onChange={() => setEditedTowns(editedTowns ? false : true)}
          />
          <label htmlFor="towns">Towns</label>
        </div>
        <div>
          <input
            type="checkbox"
            name="type"
            id="history"
            checked={editedHistory}
            onChange={() => setEditedHistory(editedHistory ? false : true)}
          />
          <label htmlFor="history">History</label>
        </div>
        <div>
          <input
            type="checkbox"
            name="type"
            id="entertainment"
            checked={editedEntertainment}
            onChange={() =>
              setEditedEntertainment(editedEntertainment ? false : true)
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
