import ShowReviews from "./showReviews";
import "../styles/reviews.css";

export default function Reviews({ destination, setDestination }) {
  return (
    <>
      <div>
        <ShowReviews
          destination={destination}
          setDestination={setDestination}
        />
      </div>
    </>
  );
}
