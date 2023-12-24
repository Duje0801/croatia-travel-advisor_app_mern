import { IReview } from "./IReview";

export interface IDestination {
  id: string;
  name: string;
  description: string;
  image: string;
  averageRating: number;
  ratingQuantity: number;
  category: string[];
  reviews: IReview[];
}
