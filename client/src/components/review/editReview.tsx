import {
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  FormEvent,
} from "react";
import { UserContext } from "../../context/userContext";
import { IDestination } from "../../interfaces/IDestination";
import { IReview } from "../../interfaces/IReview";
import axios from "axios";

export default function EditReview(props: {
  review: IReview;
  setEditId: Dispatch<SetStateAction<string>>;
  setDestination: Dispatch<SetStateAction<IDestination | null>>;
  setError: Dispatch<SetStateAction<string>>;
}): JSX.Element {
  const [editTitle, setEditTitle] = useState<string>(props.review.title);
  const [editText, setEditText] = useState<string>(props.review.text);
  const [editRating, setEditRating] = useState<number>(props.review.rating);
  //editReviewError will show inside edit box, error (setError) will show before destination description
  const [editReviewError, setEditReviewError] = useState<string>(``);

  const { state } = useContext(UserContext);

  const handleEditSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    axios
      .patch(
        `http://localhost:4000/api/review/${props.review._id}`,
        {
          data: {
            title: editTitle,
            text: editText,
            rating: editRating,
          },
        },
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${state.user?.token}`,
          },
        }
      )
      .then((res) => {
        const data: IDestination = res.data.data;
        props.setDestination(data);
        props.setEditId("");
        props.setError(``);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          //If review is deleted but destination is not updated,
          //it will show near the top of the destination page
          if (
            err.response.data.error ===
            `Review is edited but destination is not updated.`
          )
            return props.setError(`${err.response.data.error}`);
          else return setEditReviewError(`${err.response.data.error}`);
        } else {
          setEditReviewError(`Can't edit review, please try again later.`);
        }
      });
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
          The current rating is: {props.review?.rating}
        </div>
        {editReviewError && (
          <div className="reviewDeleteEditError">{editReviewError}</div>
        )}
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
          onClick={() => props.setEditId("")}
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
