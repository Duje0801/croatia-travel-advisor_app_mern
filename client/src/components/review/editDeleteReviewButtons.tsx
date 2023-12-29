import { useNavigate, useParams } from "react-router-dom";
import { IReview } from "../../interfaces/IReview";
import { routes } from "../../routes/routes";

export default function EditDeleteReviewButtons(props: {
  review: IReview;
  handleEditReview: (review: IReview) => void;
  handleDeleteId: (id: string) => void;
}): JSX.Element {
  const params = useParams();
  const navigate = useNavigate();

  const handleShowAll = () => {
    navigate(`${routes.destination}/${props.review.destination.name}`);
    window.location.reload();
  };

  return (
    <div className="reviewButtons">
      {params.reviewId ? (
        <button className="reviewEditButton" onClick={() => handleShowAll()}>
          Show all reviews
        </button>
      ) : null}
      <button
        className="reviewEditButton"
        onClick={() => props.handleEditReview(props.review)}
      >
        Edit
      </button>
      <button
        className="reviewDeleteButton"
        onClick={() => props.handleDeleteId(props.review._id)}
      >
        Delete
      </button>
    </div>
  );
}
