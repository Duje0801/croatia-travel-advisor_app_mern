export default function EditDeleteReviewButtons({
  review,
  handleEditReview,
  handleDeleteId,
}) {
  return (
    <div className="reviewButtons">
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
    </div>
  );
}
