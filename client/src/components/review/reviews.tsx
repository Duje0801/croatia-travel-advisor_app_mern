import { Dispatch, SetStateAction } from "react";
import ShowReviews from "./showReviews";
import WriteReview from "./writeReview";
import { IDestination } from "../../interfaces/IDestination";
import "../../styles/components/reviews.css";

export default function Reviews(props: {
  destination: IDestination | null;
  setDestination: Dispatch<SetStateAction<IDestination | null>>;
  setError: Dispatch<SetStateAction<string>>;
}): JSX.Element {
  return (
    <>
      <div>
        <ShowReviews
          destination={props.destination}
          setDestination={props.setDestination}
          setError={props.setError}
        />
        <WriteReview
          destination={props.destination}
          setDestination={props.setDestination}
          setError={props.setError}
        />
      </div>
    </>
  );
}
