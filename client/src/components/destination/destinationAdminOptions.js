export default function DestinationAdminOptions({
  handleEditDestination,
  handleDeleteDestination,
}) {
  //Appears only if username is admin
  return (
    <>
      <button
        className="destinationInfoButtons"
        onClick={handleEditDestination}
      >
        Edit
      </button>
      <button
        className="destinationInfoButtons"
        onClick={handleDeleteDestination}
      >
        Delete
      </button>
    </>
  );
}
