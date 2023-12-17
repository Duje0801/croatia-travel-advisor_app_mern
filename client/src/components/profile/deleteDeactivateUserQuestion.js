export default function DeleteDeactivateUserQuestion({
  userProfile,
  handleYesAnswer,
  handleNoAnswer,
  operation,
}) {
  return (
    <div className="destinationDeleteText">
      Do you want to {operation} user {userProfile.username}?
      <div className="destinationDeleteButtonsDiv">
        <button
          className="destinationDeleteButtons"
          onClick={() => handleYesAnswer()}
        >
          Yes
        </button>
        <button
          className="destinationDeleteButtons"
          onClick={() => handleNoAnswer(``)}
        >
          No
        </button>
      </div>
    </div>
  );
}
