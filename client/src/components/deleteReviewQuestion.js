export default function DeleteReviewQuestion({
  handleFinalDeleteReview,
  setDeleteId,
  deleteId
}) {
  return (
    <div className="reviewDeleteText">
      Are you sure you want to delete this review?
      <div className="reviewDeleteButtonsDiv">
        <button
          className="reviewDeleteButtons"
          onClick={() => handleFinalDeleteReview(deleteId)}
        >
          Yes
        </button>
        <button className="reviewDeleteButtons" onClick={() => setDeleteId(``)}>
          No
        </button>
      </div>
    </div>
  );
}
