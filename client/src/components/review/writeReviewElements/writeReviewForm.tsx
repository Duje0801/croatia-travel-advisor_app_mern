import {
  useState,
  FormEvent,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { UserContext } from "../../../context/userContext";
import { DestinationContext } from "../../../context/destinationContext";
import { IDestination } from "../../../interfaces/IDestination";
import axios from "axios";

export default function WriteReviewForm(props: {
  setError: Dispatch<SetStateAction<string>>;
  setOpenForm: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  const [title, setTitle] = useState<string>(``);
  const [text, setText] = useState<string>(``);
  const [rating, setRating] = useState<string>(``);
  const [reviewError, setReviewError] = useState<string>(``);

  const { state } = useContext(UserContext);
  const { destination, setDestination, setReviews, setReviewsNo, setPage } =
    useContext(DestinationContext);

  const handleSendReview = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    const destinationInRequest = {
      id: destination?.id,
      name: destination?.name,
    };

    axios
      .post(
        `http://localhost:4000/api/review/`,
        {
          data: { title, text, rating, destination: destinationInRequest },
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
        setDestination(data);
        setReviews(data.reviews);
        setReviewsNo(data.ratingQuantity);
        setPage(1);
        props.setOpenForm(false);
        setTitle(``);
        setText(``);
        setRating(``);
        setReviewError(``);
        props.setError(``);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          //If review is added but destination is not updated,
          //it will be displayed near the top of the destination page
          if (
            err.response.data.error ===
            `Review is added but can't update destination info now. Please try again later.`
          )
            return props.setError(`${err.response.data.error}`);
          else return setReviewError(`${err.response.data.error}`);
        } else {
          setReviewError(`Can't create new review, please try again later.`);
        }
      });
  };

  return (
    <>
      <div className="reviewWrite">Write a review:</div>
      {reviewError && <div className="reviewWriteError">{reviewError}</div>}
      <form className="reviewWriteForm" onSubmit={handleSendReview}>
        <div className="reviewWriteRatings">
          Your rating:
          <input
            type="radio"
            id="1"
            name="rating"
            value="1"
            onClick={(e) => setRating(e.currentTarget.value)}
          />
          <label htmlFor="1">1</label>
          <input
            type="radio"
            id="2"
            name="rating"
            value="2"
            onClick={(e) => setRating(e.currentTarget.value)}
          />
          <label htmlFor="2">2</label>{" "}
          <input
            type="radio"
            id="3"
            name="rating"
            value="3"
            onClick={(e) => setRating(e.currentTarget.value)}
          />
          <label htmlFor="3">3</label>{" "}
          <input
            type="radio"
            id="4"
            name="rating"
            value="4"
            onClick={(e) => setRating(e.currentTarget.value)}
          />
          <label htmlFor="4">4</label>{" "}
          <input
            type="radio"
            id="5"
            name="rating"
            value="5"
            onClick={(e) => setRating(e.currentTarget.value)}
          />
          <label htmlFor="5">5</label>
        </div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          className="reviewWriteTextarea"
          value={title}
          maxLength={20}
          onChange={(e) => setTitle(e.target.value)}
          id="title"
          required
        ></input>
        <label htmlFor="review">Review:</label>
        <textarea
          className="reviewWriteTextarea"
          value={text}
          rows={4}
          cols={40}
          maxLength={500}
          onChange={(e) => setText(e.target.value)}
          id="review"
          required
        ></textarea>
        <button className="reviewWriteFormButton" type="submit">
          Submit
        </button>
      </form>
    </>
  );
}
