import {
  useEffect,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { UserContext } from "../../context/userContext";
import ShowReviewStarComments from "../stars/showReviewStarComments";
import { useNavigate } from "react-router-dom";
import DeleteReview from "./deleteReview";
import Pagination from "../pagination/pagination";
import EditReview from "./editReview";
import DateString from "../../logic/dateString";
import EditDeleteReviewButtons from "./editDeleteReviewButtons";
import { IDestination } from "../../interfaces/IDestination";
import { routes } from "../../routes/routes";
import { IReview } from "../../interfaces/IReview";

export default function ShowReviews(props: {
  destination: IDestination | null;
  setDestination: Dispatch<SetStateAction<IDestination | null>>;
  setError: Dispatch<SetStateAction<string>>;
}): JSX.Element {
  const [editId, setEditId] = useState<string>(``);
  const [deleteId, setDeleteId] = useState<string>(``);
  const [page, setPage] = useState<number>(1);
  const [reviewError, setReviewError] = useState<string>(``);

  const { state } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect((): void => {
    //Every time page is changed, window is scrolling to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

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

  if (props.destination) {
    const startSlice: number = page * 5 - 5;
    const endSlice: number = page * 5;
    const reviewsToShow: IReview[] = props.destination.reviews.slice(
      startSlice,
      endSlice
    );

    const reviewsToReturn: JSX.Element[] = reviewsToShow.map(
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
                setDestination={props.setDestination}
                handleDeleteId={handleDeleteId}
                setPage={setPage}
                setReviewError={setReviewError}
                setError={props.setError}
              />
            ) : null}
            <div>{review.text}</div>
            {editId === review._id ? (
              <EditReview
                review={review}
                setEditId={setEditId}
                setDestination={props.setDestination}
                setError={props.setError}
              />
            ) : null}
          </div>
        );
      }
    );

    return (
      <div>
        {reviewsToReturn}
        <div>
          <Pagination
            totalLength={props.destination.reviews.length}
            itemsPerPage={5}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    );
  } else return <div></div>;
}
