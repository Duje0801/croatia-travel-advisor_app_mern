import ShowReviews from "./showReviews";
import WriteReview from "./writeReview";
import "../../styles/components/reviews.css";

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