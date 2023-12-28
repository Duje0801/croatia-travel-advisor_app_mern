import { useContext, Dispatch, SetStateAction } from "react";
import { UserContext } from "../../context/userContext";
import { DestinationContext } from "../../context/destinationContext";
import { IDestination } from "../../interfaces/IDestination";
import axios from "axios";

export default function DeleteReview(props: {
  deleteId: string;
  handleDeleteId: (id: string) => void;
  setReviewError: Dispatch<SetStateAction<string>>;
  setError: Dispatch<SetStateAction<string>>;
}): JSX.Element {
  const { state } = useContext(UserContext);
  const { setDestination, setReviews, setPage } =
    useContext(DestinationContext);

  const handleDeleteReview = async (): Promise<void> => {
    axios
      .delete(`http://localhost:4000/api/review/${props.deleteId}`, {
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${state.user?.token}`,
        },
      })
      .then((res) => {
        const data: IDestination = res.data.data;
        setDestination(data);
        setReviews(data.reviews);
        setPage(1);
        props.handleDeleteId(``);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          //If review is deleted but destination is not updated,
          //it will show near the top of the destination page
          if (
            err.response.data.error ===
            `Review is deleted but destination is not updated.`
          )
            return props.setError(`${err.response.data.error}`);
          else return props.setReviewError(`${err.response.data.error}`);
        } else {
          props.setReviewError(`Can't delete review, please try again later.`);
        }
      });
  };

  return (
    <div className="reviewDeleteText">
      Are you sure you want to delete this review?
      <div className="reviewDeleteButtonsDiv">
        <button
          className="reviewDeleteButtons"
          onClick={() => handleDeleteReview()}
        >
          Yes
        </button>
        <button
          className="reviewDeleteButtons"
          onClick={() => props.handleDeleteId(``)}
        >
          No
        </button>
      </div>
    </div>
  );
}
