module.exports = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).json({
      status: `fail`,
      error: `Invalid ${error.path}: ${error.value}.`,
    });
  } else if (error.name === "ValidationError") {
    let text = ``;
    for (let oneError of Object.values(error.errors)) {
      if (text === ``) text = text + `${oneError}`;
      else text = text + `, ${oneError}`;
    }
    return res.status(400).json({ status: `fail`, error: `${text}.` });
  } else if (error.code === 11000) {
    return res
      .status(400)
      .json({ status: `fail`, error: `Destination name is already in use` });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(400).json({ status: `fail`, error: `Invalid token` });
  } else if (error.name === "TokenExpiredError") {
    return res.status(400).json({ status: `fail`, error: `Token expiried` });
  }

  return res.status(400).json({ status: `fail`, error });
};