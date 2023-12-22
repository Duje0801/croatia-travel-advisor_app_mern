import { Request, Response } from "express";

const errorHandler = (error: any, req: Request, res: Response) => {
  let errorText: string = `Something went wrong`;
  let status: number = 500;

  if (error.name === "CastError") {
    errorText = `Invalid ${error.path}: ${error.value}.`;
    status = 404;
  } else if (error.name === "ValidationError") {
    let text: string = ``;
    for (let oneError of Object.values(error.errors)) {
      if (text === ``) text = text + `${oneError}`;
      else text = text + `, ${oneError}`;
      status = 401;
    }
    errorText = `${text}.`;
  } else if (error.code === 11000) {
    let textArray: string[] = Object.keys(error.keyPattern);
    let text: string =
      textArray[0].charAt(0).toUpperCase() + textArray[0].slice(1);
    errorText = `${text} is already in use`;
    status = 401;
  } else if (error.name === "JsonWebTokenError") {
    errorText = `Invalid token`;
    status = 401;
  } else if (error.name === "TokenExpiredError") {
    errorText = `Token expiried`;
    status = 401;
  }

  return res.status(status).json({
    status: `fail`,
    error: errorText,
  });
};

export { errorHandler };
