import {
  useEffect,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { UserContext } from "../../context/userContext";
import ShowReviewStarComments from "../stars/showReviewStarComments";
import { useNavigate, useParams } from "react-router-dom";
import DeleteReview from "./deleteReview";
import Pagination from "../pagination/pagination";
import EditReview from "./editReview";
import FilterByRating from "./filterByRating";
import DateString from "../../logic/dateString";
import EditDeleteReviewButtons from "./editDeleteReviewButtons";
import { DestinationContext } from "../../context/destinationContext";
import { IReview } from "../../interfaces/IReview";
import { routes } from "../../routes/routes";

export default function ShowReviews(props: {
  setError: Dispatch<SetStateAction<string>>;
}): JSX.Element {
  const [editId, setEditId] = useState<string>(``);
  const [deleteId, setDeleteId] = useState<string>(``);
  const [reviewError, setReviewError] = useState<string>(``);

  const params = useParams();

  const { state } = useContext(UserContext);
  const { destination, reviews, reviewsNo, page, setPage } =
    useContext(DestinationContext);

  const navigate = useNavigate();

  useEffect((): void => {
    //Restarts error text when another delete review box opens
    setReviewError(``);
  }, [deleteId]);

  const handleEditReview = (review: IReview): void => {
    setEditId(editId === review._id ? `` : review._id);
  };

  const handleDeleteId = (id: string): void => {
    setDeleteId(deleteId === id ? `` : id);
  };

  const handleUsernameClick = (username: string): void => {
    navigate(`${routes.user}/${username}`);
  };

  if (destination && reviews) {
    const reviewsToReturn: JSX.Element[] = reviews.map(
      (review, i): JSX.Element => {
        return (
          <div className="review" key={i}>
            <div className="reviewBox">
              <div>
                <div className="reviewTitle">
                  <span
                    onClick={() => handleUsernameClick(review.user.username)}
                  >
                    {review.user.username}
                  </span>{" "}
                  on {DateString(review.createdAt)}
                </div>
                <div>{ShowReviewStarComments(review.rating)}</div>
                <div className="reviewTitle">{review.title}</div>
              </div>
              {review.user.username === state.user?.username ||
              state.user?.username === `admin` ? (
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
                handleDeleteId={handleDeleteId}
                setReviewError={setReviewError}
                setError={props.setError}
              />
            ) : null}
            <div>{review.text}</div>
            {editId === review._id ? (
              <EditReview
                review={review}
                setEditId={setEditId}
                setError={props.setError}
              />
            ) : null}
          </div>
        );
      }
    );

    return (
      <div>
        <FilterByRating />
        {reviewsToReturn}
        <div>
          {!params.reviewId ? (
            <Pagination
              totalLength={reviewsNo}
              itemsPerPage={5}
              page={page}
              setPage={setPage}
            />
          ) : null}
        </div>
      </div>
    );
  } else return <div></div>;
}
