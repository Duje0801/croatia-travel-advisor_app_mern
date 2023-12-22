import { Document } from "mongoose";
import { IReview } from "./review";

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  active: boolean;
  role: string;
  reviews: IReview[];
  restartPasswordCode?: string;
  restartPasswordCodeExpire?: Date;
  createdAt: Date;
}
