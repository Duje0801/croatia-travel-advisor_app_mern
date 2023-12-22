import { IReview } from "./review";

export interface IDestination {
  name: string;
  description: string;
  image: string;
  averageRating: number;
  ratingQuantity: number;
  category: string[];
  reviews?: IReview[];
  createdAt?: Date;
}
