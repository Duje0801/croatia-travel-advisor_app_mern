import ShowReviews from "./showReviews";
import WriteReview from "./writeReview";
import "../../styles/components/reviews.css";

export default function Reviews({ destination, setDestination, setError }) {
  return (
    <>
      <div>
        <ShowReviews
          destination={destination}
          setDestination={setDestination}
          setError={setError}
        />
        <WriteReview
          destination={destination}
          setDestination={setDestination}
          setError={setError}
        />
      </div>
    </>
  );
}
