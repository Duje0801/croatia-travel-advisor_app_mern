import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
import { IDestination } from "../interfaces/IDestination";
import { IReview } from "../interfaces/IReview";

interface ContextObject {
  destination: IDestination | null;
  setDestination: Dispatch<SetStateAction<IDestination | null>>;
  reviews: IReview[];
  setReviews: Dispatch<SetStateAction<IReview[]>>;
  reviewsNo: number;
  setReviewsNo: Dispatch<SetStateAction<number>>;
  filterRating: number;
  setFilterRating: Dispatch<SetStateAction<number>>;
  destinationError: string;
  setDestinationError: Dispatch<SetStateAction<string>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

export const DestinationContext = createContext<ContextObject>(
  {} as ContextObject
);

export const DestinationProvider = ({ children }: { children: ReactNode }) => {
  const [destination, setDestination] = useState<IDestination | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [reviewsNo, setReviewsNo] = useState<number>(0);
  const [filterRating, setFilterRating] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  //Destination error is displayed above destination description
  const [destinationError, setDestinationError] = useState<string>(``);

  const value: ContextObject = {
    destination,
    setDestination,
    reviews,
    setReviews,
    reviewsNo,
    setReviewsNo,
    filterRating,
    setFilterRating,
    page,
    setPage,
    destinationError,
    setDestinationError,
  };

  return (
    <DestinationContext.Provider value={value}>
      {children}
    </DestinationContext.Provider>
  );
};
