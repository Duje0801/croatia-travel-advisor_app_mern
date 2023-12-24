export default function DestinationAdminOptions(props: {
  handleEditDestination: () => void;
  handleDeleteDestination: () => void;
}): JSX.Element {
  //Appears only if username is admin
  return (
    <>
      <button
        className="destinationInfoButtons"
        onClick={props.handleEditDestination}
      >
        Edit
      </button>
      <button
        className="destinationInfoButtons"
        onClick={props.handleDeleteDestination}
      >
        Delete
      </button>
    </>
  );
}
