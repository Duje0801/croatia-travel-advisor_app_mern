import { useState, Dispatch, SetStateAction, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { DestinationContext } from "../../context/destinationContext";
import DateString from "../../logic/dateString";
import EditDeleteReviewButtons from "./editDeleteReviewButtons";
import DeleteReview from "./deleteReview";
import EditReview from "./editReview";
import ShowReviewStarComments from "../stars/showReviewStars";
import { IReview } from "../../interfaces/IReview";
import { routes } from "../../routes/routes";

export default function ReviewsList(props:{
    reviewError: string,
    setReviewError: Dispatch<SetStateAction<string>>,
    deleteId: string,
    setDeleteId: Dispatch<SetStateAction<string>>
}): JSX.Element {

    const [editId, setEditId] = useState<string>(``);

    const {state} = useContext(UserContext)

    const { reviews } =
    useContext(DestinationContext);

    const navigate = useNavigate()

    const handleEditReview = (review: IReview): void => {
        setEditId(editId === review._id ? `` : review._id);
      };
    
      const handleDeleteId = (id: string): void => {
        props.setDeleteId(props.deleteId === id ? `` : id);
      };
    
      const handleUsernameClick = (username: string): void => {
        navigate(`${routes.user}/${username}`);
      };

      return <div>{reviews.map(
        (review, i): JSX.Element => {
          return (
            <div className="review" key={i}>
              <div className="reviewBox">
                <div>
                  <div className="reviewTitle">
                    <span
                      className="reviewTitleAuthor"
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
              {props.reviewError && props.deleteId === review._id ? (
                <div className="reviewDeleteEditError">{props.reviewError}</div>
              ) : null}
              {props.deleteId === review._id ? (
                <DeleteReview
                  deleteId={props.deleteId}
                  handleDeleteId={handleDeleteId}
                  setReviewError={props.setReviewError}
                />
              ) : null}
              <div>{review.text}</div>
              {editId === review._id ? (
                <EditReview review={review} setEditId={setEditId} />
              ) : null}
            </div>
          );
        } 
    )}</div>
}
