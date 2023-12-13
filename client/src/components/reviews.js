import ShowReviews from "./showReviews";
import "../styles/reviews.css";
import WriteReview from "./writeReview";

export default function Reviews({ destination, setDestination }) {
  return (
    <>
      <div>
        <ShowReviews
          destination={destination}
          setDestination={setDestination}
        />
        <WriteReview destination={destination} setDestination={setDestination} />
      </div>
    </>
  );
}