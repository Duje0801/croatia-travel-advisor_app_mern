import { Request } from "express";

export interface ReqUser extends Request {
  user: {
    username: string;
    email: string;
    active: boolean;
    role: string;
    createdAt: Date;
    _id: string
  };
}
