const Review = require(`../model/reviewModel`);

const createReview = async (req, res, next) => {
  try {
    const text = req.body.text;
    const rating = req.body.rating;
    const destination = `6571a79800ebf5febf06dcbb`;

    const newReview = await Review.create({
      text,
      rating,
      destination,
    });

    res.status(201).json({ status: `success`, review: newReview });
  } catch (error) {
    res.status(404).json({ status: `fail`, error });
  }
};

const updateReview = async (req, res, next) => {
  try {
    let updatedFields = {};
    if (req.body.text) updatedFields = { text: req.body.text };
    if (req.body.rating)
      updatedFields = { ...updatedFields, rating: req.body.rating };

    const updatedReview = await Review.findOneAndUpdate(
      { _id: req.params.id },
      {
        ...updatedFields,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedReview) {
      return res.status(404).json({
        status: `fail`,
        error: `Can't find destination with this ID`,
      });
    }

    res.status(201).json({ status: `success`, review: updatedReview });
  } catch (error) {
    res.status(404).json({ status: `fail`, error });
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const deletedReview = await Review.findOneAndDelete({ _id: req.params.id });

    if (!deletedReview) {
      return res.status(404).json({
        status: `fail`,
        error: `Can't find destination with this ID`,
      });
    }

    res
      .status(201)
      .json({ status: `success`, message: `Review succesfully deleted!` });
  } catch (error) {
    res.status(404).json({ status: `fail`, error });
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
};
