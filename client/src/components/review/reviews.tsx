import { Dispatch, SetStateAction } from "react";
import ShowReviews from "./showReviews";
import WriteReview from "./writeReview";
import { IDestination } from "../../interfaces/IDestination";
import "../../styles/components/reviews.css";
import { IReview } from "../../interfaces/IReview";

export default function Reviews(props: {
  destination: IDestination | null;
  setDestination: Dispatch<SetStateAction<IDestination | null>>;
  reviews: IReview[];
  setReviews: Dispatch<SetStateAction<IReview[]>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setError: Dispatch<SetStateAction<string>>;
}): JSX.Element {
  return (
    <>
      <div>
        <ShowReviews
          destination={props.destination}
          setDestination={props.setDestination}
          reviews={props.reviews}
          setReviews={props.setReviews}
          page={props.page}
          setPage={props.setPage}
          setError={props.setError}
        />
        <WriteReview
          destination={props.destination}
          setDestination={props.setDestination}
          setReviews={props.setReviews}
          setError={props.setError}
        /> 
      </div>
    </>
  );
}
