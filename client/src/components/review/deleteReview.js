import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

export default function DeleteReview({
  deleteId,
  setDestination,
  handleDeleteId,
  setPage,
  setReviewError,
  setError,
}) {
  const { user } = useContext(UserContext);

  const handleDeleteReview = async () => {
    axios
      .delete(`http://localhost:4000/api/review/${deleteId}`, {
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setDestination(res.data.data);
        handleDeleteId(``);
        setPage(1);

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
            return setError(`${err.response.data.error}`);
          else return setReviewError(`${err.response.data.error}`);
        } else {
          setReviewError(`Can't delete review, please try again later.`);
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
          onClick={() => handleDeleteId(``)}
        >
          No
        </button>
      </div>
    </div>
  );
}
