import { useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";

export default function EditDestination({
  setEditOpen,
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
  setDestination,
  setError,
}) {
  const params = useParams();

  const { user } = useContext(UserContext);

  const handleEditDestination = async (e) => {
    e.preventDefault();

    let requestBody = {};
    let category = [];
    if (editedImg) requestBody = { ...requestBody, image: editedImg };
    if (editedDescription)
      requestBody = { ...requestBody, description: editedDescription };
    if (editedNature)
      requestBody = { ...requestBody, category: [...category, "nature"] };
    if (editedTowns)
      requestBody = { ...requestBody, category: [...category, "towns"] };
    if (editedHistory)
      requestBody = { ...requestBody, category: [...category, "history"] };
    if (editedEntertainment)
      requestBody = {
        ...requestBody,
        category: [...category, "entertainment"],
      };

    try {
      const response = await fetch(
        `http://localhost:4000/api/destination/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      const responseJson = await response.json();

      if (responseJson.status === `success`) {
        setDestination(responseJson.data);
        setEditOpen(false);
        setError(``);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
      if (responseJson.status === `fail`) {
        setError(`${responseJson.error}`);
      }
    } catch (err) {
      setError(`Can't edit destination info. Please try again later`);
      setEditOpen(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleCloseEditDestination = () => {
    setEditOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <form className="destinationEditForm" onSubmit={handleEditDestination}>
      <div className="destinationEditTitle">Change destination info:</div>
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
      <button
        className="destinationEditDeleteButton"
        onClick={handleCloseEditDestination}
      >
        Close Edit
      </button>
      <button className="destinationEditDeleteButton" type="submit">
        Submit
      </button>
    </form>
  );
}
