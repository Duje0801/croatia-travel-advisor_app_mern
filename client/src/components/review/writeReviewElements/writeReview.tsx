import { useContext, useState } from "react";
import { UserContext } from "../../../context/userContext";
import { DestinationContext } from "../../../context/destinationContext";
import WriteReviewForm from "./writeReviewForm";
import WriteReviewNoUser from "./writeReviewNoUser";
import WriteReviewButton from "./writeReviewButton";

export default function WriteReview(): JSX.Element {
  const [openForm, setOpenForm] = useState<boolean>(false);

  const { state } = useContext(UserContext);
  const { destination } = useContext(DestinationContext);

  if (!destination) return <div></div>;

  //If user is not logged in
  if (!state.user?.username) return <WriteReviewNoUser />;
  // A step before writing a review opens,
  //checking if the user has already reviewed the selected destination
  else if (state.user?.username && !openForm)
    return (
      <WriteReviewButton
        destinationId={destination.id}
        setOpenForm={setOpenForm}
      />
    );
  // If the user is logged in and has not reviewed the destination
  else if (state.user?.username && openForm)
    return <WriteReviewForm setOpenForm={setOpenForm} />;
  else return <div></div>;
}
