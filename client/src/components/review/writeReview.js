import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { routes } from "../../routes/routes";

export default function WriteReview({ destination, setDestination }) {
  const [title, setTitle] = useState(``);
  const [text, setText] = useState(``);
  const [rating, setRating] = useState(``);
  const [error, setError] = useState(``);

  const navigate = useNavigate();

  const params = useParams();

  const { user } = useContext(UserContext);

  if (!destination) return <div></div>;

  const handleSendComment = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:4000/api/review/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          title,
          text,
          rating,
          destination: { id: destination._id, name: destination.name },
        }),
      });

      const responseJson = await response.json();

      if (responseJson.status === `success`) {
        setTitle(``);
        setText(``);
        setRating(``);
        try {
          //Fetching destination data again
          const response = await fetch(
            `http://localhost:4000/api/destination/${params.id}`
          );
          const responseJson = await response.json();
          const data = responseJson.data[0];
          if (responseJson.status === `success`) {
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
            `Review is added but can't update destination info now. Please try again later.`
          );
        }
      } else if (responseJson.status === `fail`) {
        setError(`${responseJson.error}`);
      }
    } catch (err) {
      setError(`Can't add new review. Please try again later.`);
    }
  };

  // This function is checking did user already reviewed destination
  // User can only review destination once
  const isReviewed = () => {
    let check = false;
    for (let review of destination.reviews) {
      //Used for..of loop, so looping can finish earlier if needed review was found
      if (review.user.username === user.username) {
        check = true;
        break;
      }
    }
    return check;
  };

  //If user is not logged in and the destination already has at least one review
  if (!user?.username && destination.reviews.length > 0) {
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
  else if (!user?.username && destination.reviews.length === 0) {
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
  else if (user?.username && isReviewed()) {
    return (
      <div className="reviewWriteSignIn">
        You have already reviewed this destination
      </div>
    );
  }
  // If user is logged in and didn't review the destination
  else if (user?.username && !isReviewed()) {
    return (
      <div>
        <>
          <div className="reviewWrite">Write a review:</div>
          <div className="reviewWriteError">{error}</div>
          <form className="reviewWriteForm" onSubmit={handleSendComment}>
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
