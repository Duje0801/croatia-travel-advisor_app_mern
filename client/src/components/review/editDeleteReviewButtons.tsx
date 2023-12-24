import { IReview } from "../../interfaces/IReview";

export default function EditDeleteReviewButtons(props: {
  review: IReview;
  handleEditReview: (review: IReview) => void;
  handleDeleteId: (id: string) => void;
}): JSX.Element {
  return (
    <div className="reviewButtons">
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
