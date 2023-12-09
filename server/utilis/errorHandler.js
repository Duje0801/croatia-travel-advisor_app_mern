module.exports = (error, req, res, next) => {
  let errorText = `Something went wrong`;

  if (error.name === "CastError") {
    errorText = `Invalid ${error.path}: ${error.value}.`;
  } else if (error.name === "ValidationError") {
    let text = ``;
    for (let oneError of Object.values(error.errors)) {
      if (text === ``) text = text + `${oneError}`;
      else text = text + `, ${oneError}`;
    }
    errorText = `${text}.`;
  } else if (error.code === 11000) {
    let text = Object.keys(error.keyPattern);
    text = text[0].charAt(0).toUpperCase() + text[0].slice(1);
    errorText = `${text} is already in use`;
  } else if (error.name === "JsonWebTokenError") {
    errorText = `Invalid token`;
  } else if (error.name === "TokenExpiredError") {
    errorText = `Token expiried`;
  }

  return res.status(400).json({
    status: `fail`,
    error: errorText,
  });
};
