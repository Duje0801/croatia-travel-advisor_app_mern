import { useState, useContext, Dispatch, SetStateAction } from "react";
import { UserContext } from "../../../context/userContext";
import { DestinationContext } from "../../../context/destinationContext";
import axios from "axios";

export default function WriteReviewButton(props: {
  destinationId: string;
  setOpenForm: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  const [alreadyReviewedError, setAlreadyReviewedError] = useState<string>(``);

  const { state } = useContext(UserContext);
  const { setDestinationError } = useContext(DestinationContext);

  const handleWriteReview = () => {
    //This function checks if the user has already reviewed this destination
    axios
      .get(
        `http://localhost:4000/api/review/alreadyReviewed/${props.destinationId}`,
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${state.user?.token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.data.isReviewed) {
          return setAlreadyReviewedError(
            `You have already reviewed this destination`
          );
        } else {
          return props.setOpenForm(true);
        }
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          setDestinationError(`${err.response.data.error}`);
        } else {
          setDestinationError(
            `Something went wrong, can't open write a review form. please try again later.`
          );
        }
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
  };

  const handleCloseAlreadyReviewedError = () => {
    setAlreadyReviewedError(``);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="reviewWriteDiv">
      {!alreadyReviewedError ? (
        <button onClick={() => handleWriteReview()}>Write a review</button>
      ) : (
        <div className="reviewAlreadyReviewedError">
          {alreadyReviewedError}{" "}
          <button
            onClick={() => handleCloseAlreadyReviewedError()}
            className="reviewEditButton"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
