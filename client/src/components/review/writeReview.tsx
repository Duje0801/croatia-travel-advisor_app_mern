import {
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { IDestination } from "../../interfaces/IDestination";
import { routes } from "../../routes/routes";
import axios from "axios";

export default function WriteReview(props: {
  destination: IDestination | null;
  setDestination: Dispatch<SetStateAction<IDestination | null>>;
  setError: Dispatch<SetStateAction<string>>;
}): JSX.Element {
  const [title, setTitle] = useState<string>(``);
  const [text, setText] = useState<string>(``);
  const [rating, setRating] = useState<string>(``);
  const [reviewError, setReviewError] = useState<string>(``);

  const navigate = useNavigate();

  const { state } = useContext(UserContext);

  if (!props.destination) return <div></div>;

  const handleSendReview = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    const destinationInRequest = {
      id: props.destination?.id,
      name: props.destination?.name,
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
        props.setDestination(data);
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
          //it will show near the top of the destination page
          if (
            err.response.data.error ===
            `Review is added but can't update destination info now. Please try again later.`
          )
            return props.setError(`${err.response.data.error}`);
          else return setReviewError(`${err.response.data.error}`);
        } else {
          setReviewError(`Can't delete review, please try again later.`);
        }
      });
  };

  // This function checks did user already reviewed destination
  // User can only review destination once
  const isReviewed = () => {
    if (props.destination) {
      let check = false;
      for (let review of props.destination.reviews) {
        //Used for..of loop, so looping can finish earlier if needed review was found
        if (review.user.username === state.user?.username) {
          check = true;
          break;
        }
      }
      return check;
    }
  };

  //If user is not logged in and the destination already has at least one review
  if (!state.user?.username && props.destination.reviews.length > 0) {
    return (
      <div className="reviewWriteSignIn">
        Please{" "}
        <span
          className="reviewWriteSignInSpan"
          onClick={() => navigate(routes.logIn)}
        >
          log in
        </span>{" "}
        to review this destination.
      </div>
    );
  }
  //If user is not logged in and the destination is not reviewed yet
  else if (!state.user?.username && props.destination.reviews.length === 0) {
    return (
      <div className="reviewWriteSignIn">
        {" "}
        <span
          className="reviewWriteSignInSpan"
          onClick={() => navigate(routes.logIn)}
        >
          Log in
        </span>{" "}
        and be the first to review this destination.
      </div>
    );
  }
  // If user is logged in and already reviewed the destination
  else if (state.user?.username && isReviewed()) {
    return (
      <div className="reviewWriteSignIn">
        You have already reviewed this destination
      </div>
    );
  }
  // If user is logged in and didn't review the destination
  else if (state.user?.username && !isReviewed()) {
    return (
      <div>
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
      </div>
    );
  } else return <div></div>;
}
