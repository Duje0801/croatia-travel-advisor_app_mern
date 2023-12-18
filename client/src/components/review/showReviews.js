import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import ShowReviewStarComments from "../stars/showReviewStarComments"
import { useNavigate } from "react-router-dom";
import DeleteReview from "./deleteReview";
import Pagination from "../pagination/pagination";
import EditReview from "./editReview";
import DateString from "../../logic/dateString";
import EditDeleteReviewButtons from "./editDeleteReviewButtons";
import { routes } from "../../routes/routes";

export default function ShowReviews({ destination, setDestination, setError }) {
  const [reviewEdit, setReviewEdit] = useState(null);
  const [deleteId, setDeleteId] = useState(``);
  const [page, setPage] = useState(1);
  const [reviewError, setReviewError] = useState(``);

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    //Every time page is changed, window is scrolling to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  useEffect(() => {
    //Restarts error text when another delete review box opens
    setReviewError(``);
  }, [deleteId]);

  const handleEditReview = (review) => {
    setReviewEdit(reviewEdit._id === review._id ? null : review);
  };

  const handleDeleteId = (id) => {
    setDeleteId(id);
  };

  const handleUsernameClick = (username) => {
    navigate(`${routes.user}/${username}`);
  };

  if (destination) {
    const startSlice = page * 5 - 5;
    const endSlice = page * 5;
    const reviewsToShow = destination.reviews.slice(startSlice, endSlice);

    const reviewsToReturn = reviewsToShow.map((review, i) => {
      return (
        <div className="review" key={i}>
          <div className="reviewBox">
            <div>
              <div className="reviewTitle">
                <span onClick={() => handleUsernameClick(review.user.username)}>
                  {review.user.username}
                </span>{" "}
                on {DateString(review.createdAt)}
              </div>
              <div>{ShowReviewStarComments(review.rating)}</div>
              <div className="reviewTitle">{review.title}</div>
            </div>
            {review.user.username === user?.username ||
            user?.username === `admin` ? (
              <EditDeleteReviewButtons
                review={review}
                handleEditReview={handleEditReview}
                handleDeleteId={handleDeleteId}
              />
            ) : null}
          </div>
          {reviewError && deleteId === review._id ? (
            <div className="reviewDeleteEditError">{reviewError}</div>
          ) : null}
          {deleteId === review._id ? (
            <DeleteReview
              deleteId={deleteId}
              setDestination={setDestination}
              handleDeleteId={handleDeleteId}
              setPage={setPage}
              setReviewError={setReviewError}
              setError={setError}
            />
          ) : null}
          <div>{review.text}</div>
          {reviewEdit?._id === review._id ? (
            <EditReview
              reviewEdit={reviewEdit}
              setReviewEdit={setReviewEdit}
              setDestination={setDestination}
              setError={setError}
            />
          ) : null}
        </div>
      );
    });

    return (
      <div>
        {reviewsToReturn}
        <div>
          <Pagination
            totalLength={destination.reviews.length}
            itemsPerPage={5}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    );
  } else return <div></div>;
}
