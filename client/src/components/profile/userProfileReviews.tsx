import { useNavigate } from "react-router-dom";
import DateString from "../../logic/dateString";
import ShowReviewStars from "../stars/showReviewStars";
import { IReview } from "../../interfaces/IReview";
import { routes } from "../../routes/routes";

export default function UserProfileReviews(props: {
  userReviews: IReview[];
}): JSX.Element {
  const navigate = useNavigate();

  const handleRedirectDestination = (name: string, reviewId: string): void => {
    navigate(`${routes.destination}/${name}/${reviewId}`);
  };

  return (
    <div>
      {props.userReviews.map((review: IReview, i) => {
        return (
          <div
            className="userProfileReview"
            onClick={() =>
              handleRedirectDestination(review.destination.name, review._id)
            }
            key={i}
          >
            <div>
              <b>{review.destination.name}</b>
            </div>
            <div className="userProfileReviewBox">
              <div>
                <div className="userProfileReviewTitle">
                  {review.user.username} on {DateString(review.createdAt)}
                </div>
                <div>{ShowReviewStars(review.rating)}</div>
                <div className="userProfileReviewTitle">{review.title}</div>
              </div>
            </div>
            <div>{review.text}</div>
          </div>
        );
      })}
    </div>
  );
}
