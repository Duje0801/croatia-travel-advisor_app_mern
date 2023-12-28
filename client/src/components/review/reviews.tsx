import { Dispatch, SetStateAction } from "react";
import ShowReviews from "./showReviews";
import WriteReview from "./writeReview";
import "../../styles/components/reviews.css";

export default function Reviews(props: {
  setError: Dispatch<SetStateAction<string>>;
}): JSX.Element {
  return (
    <>
      <div>
        <ShowReviews setError={props.setError} />
        <WriteReview setError={props.setError} />
      </div>
    </>
  );
}
