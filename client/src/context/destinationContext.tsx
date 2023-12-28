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
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

export const DestinationContext = createContext<ContextObject>(
  {} as ContextObject
);

export const DestinationProvider = ({ children }: { children: ReactNode }) => {
  const [destination, setDestination] = useState<IDestination | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [page, setPage] = useState<number>(1);

  const value: ContextObject = {
    destination,
    setDestination,
    reviews,
    setReviews,
    page,
    setPage,
  };

  return (
    <DestinationContext.Provider value={value}>
      {children}
    </DestinationContext.Provider>
  );
};
