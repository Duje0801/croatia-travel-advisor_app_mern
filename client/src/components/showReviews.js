import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import ShowReviewStarComments from "./showReviewStarComments";
import DeleteReviewQuestion from "./deleteReviewQuestion";
import { useParams } from "react-router-dom";
import EditReview from "./editReview";

export default function ShowReviews({ destination, setDestination }) {
  const [reviewEdit, setReviewEdit] = useState(null);
  const [deleteId, setDeleteId] = useState(``);
  const [error, setError] = useState(``);

  const { user } = useContext(UserContext);

  const params = useParams();

  useEffect(() => {
    //Restarts error text when another delete review box opens
    setError(``);
  }, [deleteId]);

  const handleEditReview = (review) => {
    if (!reviewEdit || reviewEdit._id !== review._id) setReviewEdit(review);
    else if (reviewEdit._id === review._id) setReviewEdit(null);
  };

  const handleFinalDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/review/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      const responseJson = await response.json();

      if (responseJson.status === `success`) {
        setDeleteId(``);
        setError(``);

        //Fetching destination data again (without deleted review)
        const response = await fetch(
          `http://localhost:4000/api/destination/${params.id}`
        );
        const responseJson = await response.json();
        const data = responseJson.data[0];
        setDestination(data);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else if (responseJson.status === `fail`) {
        setError(`${responseJson.error}`);
      }
    } catch (err) {
      setError(`${err.error}`);
    }
  };

  const handleDeleteId = (id) => {
    setDeleteId(id);
  };

  const date = (createdAt) => {
    const dateAndTime = createdAt.split("T");
    const date = dateAndTime[0].split("-");
    const time = dateAndTime[1].split(":");
    return `${time[0]}:${time[1]} ${date[2]}.${date[1]}.${date[0]}`;
  };

  if (destination) {
    const reviewsToReturn = destination.reviews.map((review, i) => {
      return (
        <div className="review" key={i}>
          <div className="reviewBox">
            <div>
              <div className="reviewTitle">
                {review.user.username} on {date(review.createdAt)}
              </div>
              <div>{ShowReviewStarComments(review.rating)}</div>
              <div className="reviewTitle">{review.title}</div>
            </div>
            <div className="reviewButtons">
              {review.user.username === user?.username ||
              user?.username === `admin` ? (
                <>
                  <button
                    className="reviewEditButton"
                    onClick={() => handleEditReview(review)}
                  >
                    Edit
                  </button>
                  <button
                    className="reviewDeleteButton"
                    onClick={() => handleDeleteId(review._id)}
                  >
                    Delete
                  </button>
                </>
              ) : null}
            </div>
          </div>
          {error && deleteId === review._id ? (
            <div className="reviewDeleteEditError">{error}</div>
          ) : null}
          {deleteId === review._id ? (
            <DeleteReviewQuestion
              handleFinalDeleteReview={handleFinalDeleteReview}
              setDeleteId={setDeleteId}
              deleteId={deleteId}
            />
          ) : null}
          <div>{review.text}</div>
          {reviewEdit?._id === review._id ? (
            <EditReview
              reviewEdit={reviewEdit}
              setReviewEdit={setReviewEdit}
              setDestination={setDestination}
            />
          ) : null}
        </div>
      );
    });
    return <div>{reviewsToReturn}</div>;
  } else return <div></div>;
}
