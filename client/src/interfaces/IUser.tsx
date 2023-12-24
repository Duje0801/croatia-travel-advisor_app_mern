import { IReview } from "./IReview";

enum Roles {
  "user",
  "admin",
}

export interface IUser {
  username: string;
  email: string;
  active: boolean;
  role: Roles;
  reviews: IReview[];
  createdAt: string;
  id: string;
}
