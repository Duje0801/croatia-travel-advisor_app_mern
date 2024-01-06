import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ReviewsList from "./reviewsList";
import Pagination from "../pagination/pagination";
import WriteReview from "./writeReviewElements/writeReview";
import FilterByRating from "./filterByRating";
import { DestinationContext } from "../../context/destinationContext";

export default function Reviews(): JSX.Element {
  const [deleteId, setDeleteId] = useState<string>(``);
  const [reviewError, setReviewError] = useState<string>(``);

  const params = useParams();

  const { destination, reviews, reviewsNo, page, setPage } =
    useContext(DestinationContext);

  useEffect((): void => {
    //Restarts error text when another delete review box opens
    setReviewError(``);
  }, [deleteId]);

  if (destination && reviews) {
    return (
      <>
        <div className="reviewsTitle">Reviews:</div>
        <FilterByRating />
        {reviews.length > 0 ? (
          <ReviewsList
          reviewError={reviewError}
          setReviewError={setReviewError}
          deleteId={deleteId}
          setDeleteId={setDeleteId}
           />
        ) : (
          <div className="reviewNoReviews">No reviews to show</div>
        )}
        <div>
          {!params.reviewId ? (
            <Pagination
              totalLength={reviewsNo}
              itemsPerPage={5}
              page={page}
              setPage={setPage}
            />
          ) : null}
        </div>
        <WriteReview />
      </>
    );
  } else return <div></div>;
}
