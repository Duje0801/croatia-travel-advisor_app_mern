import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import ShowReviewStarComments from "./showReviewStarComments";
import DeleteReviewQuestion from "./deleteReviewQuestion";
import { useNavigate, useParams } from "react-router-dom";
import Pagination from "../pagination/pagination";
import EditReview from "./editReview";
import { routes } from "../../routes/routes";

export default function ShowReviews({ destination, setDestination }) {
  const [reviewEdit, setReviewEdit] = useState(null);
  const [deleteId, setDeleteId] = useState(``);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(``);

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const params = useParams();

  useEffect(() => {
    //Every time page is changed, window is scrolling to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  useEffect(() => {
    //Restarts error text when another delete review box opens
    setError(``);
  }, [deleteId]);

  const handleEditReview = (review) => {
    if (!reviewEdit || reviewEdit._id !== review._id) setReviewEdit(review);
    else if (reviewEdit._id === review._id) setReviewEdit(null);
  };

  const handleFinalDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/review/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      const responseJson = await response.json();

      if (responseJson.status === `success`) {
        try {
          //Fetching destination data again (without deleted review)
          const response = await fetch(
            `http://localhost:4000/api/destination/${params.id}`
          );
          const responseJson = await response.json();
          const data = responseJson.data[0];
          if (responseJson.status === `success`) {
            setDestination(data);
            setPage(1);
            setDeleteId(``);
            setError(``);

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          } else if (responseJson.status === `fail`) {
            setError(`${responseJson.error}`);
          }
        } catch (err) {
          setError(
            `Review is deleted but can't update destination info now. Please try again later.`
          );
        }
      } else if (responseJson.status === `fail`) {
        setError(`${responseJson.error}`);
      }
    } catch (err) {
      setError(`Can't delete review. Please try again later.`);
    }
  };

  const handleDeleteId = (id) => {
    setDeleteId(id);
  };

  const date = (createdAt) => {
    const dateAndTime = createdAt.split("T");
    const date = dateAndTime[0].split("-");
    const time = dateAndTime[1].split(":");
    return `${time[0]}:${time[1]} ${date[2]}.${date[1]}.${date[0]}`;
  };

  const handleUsernameClick = (username) => {
    navigate(`${routes.user}/${username}`);
  };

  if (destination) {
    const startSlice = page * 5 - 5;
    const endSlice = page * 5;
    const reviewsToShow = destination.reviews.slice(startSlice, endSlice);

    const reviewsToReturn = reviewsToShow.map((review, i) => {
      return (
        <div className="review" key={i}>
          <div className="reviewBox">
            <div>
              <div className="reviewTitle">
                <span onClick={() => handleUsernameClick(review.user.username)}>
                  {review.user.username}
                </span>{" "}
                on {date(review.createdAt)}
              </div>
              <div>{ShowReviewStarComments(review.rating)}</div>
              <div className="reviewTitle">{review.title}</div>
            </div>
            <div className="reviewButtons">
              {review.user.username === user?.username ||
              user?.username === `admin` ? (
                <>
                  <button
                    className="reviewEditButton"
                    onClick={() => handleEditReview(review)}
                  >
                    Edit
                  </button>
                  <button
                    className="reviewDeleteButton"
                    onClick={() => handleDeleteId(review._id)}
                  >
                    Delete
                  </button>
                </>
              ) : null}
            </div>
          </div>
          {error && deleteId === review._id ? (
            <div className="reviewDeleteEditError">{error}</div>
          ) : null}
          {deleteId === review._id ? (
            <DeleteReviewQuestion
              handleFinalDeleteReview={handleFinalDeleteReview}
              setDeleteId={setDeleteId}
              deleteId={deleteId}
            />
          ) : null}
          <div>{review.text}</div>
          {reviewEdit?._id === review._id ? (
            <EditReview
              reviewEdit={reviewEdit}
              setReviewEdit={setReviewEdit}
              setDestination={setDestination}
            />
          ) : null}
        </div>
      );
    });
    return (
      <div>
        {reviewsToReturn}
        <div>
          <Pagination
            totalLength={destination.reviews.length}
            itemsPerPage={5}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    );
  } else return <div></div>;
}
