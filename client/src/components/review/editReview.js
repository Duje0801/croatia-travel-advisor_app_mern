import { useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useParams } from "react-router-dom";

export default function EditReview({
  reviewEdit,
  setReviewEdit,
  setDestination,
}) {
  const [editTitle, setEditTitle] = useState(reviewEdit.title);
  const [editText, setEditText] = useState(reviewEdit.text);
  const [editRating, setEditRating] = useState(reviewEdit.rating);
  const [error, setError] = useState(``);

  const { user } = useContext(UserContext);

  const params = useParams();

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:4000/api/review/${reviewEdit._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            title: editTitle,
            text: editText,
            rating: editRating,
          }),
        }
      );

      const responseJson = await response.json();

      if (responseJson.status === `success`) {
        try {
          //Fetching destination data again
          const response = await fetch(
            `http://localhost:4000/api/destination/${params.id}`
          );
          const responseJson = await response.json();
          const data = responseJson.data[0];
          if (responseJson.status === `success`) {
            setReviewEdit(null);
            setDestination(data);
            setError(``);

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          } else if (responseJson.status === `fail`) {
            setError(`${responseJson.error}`);
          }
        } catch (err) {
          setError(
            `Review is edited but can't update destination info now. Please try again later.`
          );
        }
      } else if (responseJson.status === `fail`) {
        setError(`${responseJson.error}`);
      }
    } catch (err) {
      setError(`Can't edit review. Please try again later`);
    }
  };

  return (
    <div>
      <form className="reviewEdit" onSubmit={handleEditSubmit}>
        <div className="reviewEditTitle">Edit review:</div>
        <div className="reviewEditRatings">
          New rating:
          <input
            type="radio"
            id="1"
            name="rating"
            value="1"
            onClick={(e) => setEditRating(Number(e.currentTarget.value))}
          />
          <label htmlFor="1">1</label>
          <input
            type="radio"
            id="2"
            name="rating"
            value="2"
            onClick={(e) => setEditRating(Number(e.currentTarget.value))}
          />
          <label htmlFor="2">2</label>{" "}
          <input
            type="radio"
            id="3"
            name="rating"
            value="3"
            onClick={(e) => setEditRating(Number(e.currentTarget.value))}
          />
          <label htmlFor="3">3</label>{" "}
          <input
            type="radio"
            id="4"
            name="rating"
            value="4"
            onClick={(e) => setEditRating(Number(e.currentTarget.value))}
          />
          <label htmlFor="4">4</label>{" "}
          <input
            type="radio"
            id="5"
            name="rating"
            value="5"
            onClick={(e) => setEditRating(Number(e.currentTarget.value))}
          />
          <label htmlFor="5">5</label>
        </div>
        <div className="reviewEditCurrentRating">
          The current rating is: {reviewEdit.rating}
        </div>
        <div className="reviewDeleteEditError">{error}</div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          className="reviewEditTextarea"
          value={editTitle}
          maxLength={20}
          onChange={(e) => setEditTitle(e.currentTarget.value)}
          id="title"
          required
        ></input>
        <label htmlFor="text">Review:</label>
        <textarea
          className="reviewEditTextarea"
          value={editText}
          rows={4}
          cols={40}
          maxLength={500}
          onChange={(e) => setEditText(e.currentTarget.value)}
          id="text"
          required
        ></textarea>
        <button
          className="reviewEditFormButton reviewCloseEditButton"
          type="button"
          onClick={() => setReviewEdit(null)}
        >
          Close Edit
        </button>
        <button className="reviewEditFormButton" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
