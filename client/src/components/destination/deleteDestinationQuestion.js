export default function DeleteDestinationQuestion({
  destination,
  handleFinalDeleteDestination,
  handleDeleteDestination,
}) {
  return (
    <div className="destinationDeleteText">
      Are you sure you want to delete destination {destination.name}?
      <div className="destinationDeleteButtonsDiv">
        <button
          className="destinationDeleteButtons"
          onClick={handleFinalDeleteDestination}
        >
          Yes
        </button>
        <button
          className="destinationDeleteButtons"
          onClick={handleDeleteDestination}
        >
          No
        </button>
      </div>
    </div>
  );
}
