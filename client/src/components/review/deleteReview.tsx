import { useContext, Dispatch, SetStateAction } from "react";
import { UserContext } from "../../context/userContext";
import { IDestination } from "../../interfaces/IDestination";
import { IReview } from "../../interfaces/IReview";
import axios from "axios";

export default function DeleteReview(props: {
  setReviews: Dispatch<SetStateAction<IReview[]>>;
  deleteId: string;
  setDestination: Dispatch<SetStateAction<IDestination | null>>;
  handleDeleteId: (id: string) => void;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setReviewError: Dispatch<SetStateAction<string>>;
  setError: Dispatch<SetStateAction<string>>;
}): JSX.Element {
  const { state } = useContext(UserContext);

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
        props.setDestination(data);
        props.setReviews(data.reviews);
        props.setPage(1);
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
