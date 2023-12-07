const Destination = require(`../model/destinationModel`);

const getDestination = async (req, res, next) => {
  try {
    let destinationFind = Destination.find();

    if (req.params.id) {
      destinationFind = Destination.find({ _id: req.params.id }).populate({
        path: `reviews`,
      });
    }

    const destination = await destinationFind;

    if (!destination) {
      return res.status(404).json({
        status: `fail`,
        error: `Can't find any destination`,
      });
    }

    res
      .status(200)
      .json({ status: `success`, quantity: destination.length, destination });
  } catch (error) {
    res.status(404).json({ status: `fail`, error });
  }
};

const createDestination = async (req, res, next) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const image = req.body.image;

    const newDestination = await Destination.create({
      name,
      description,
      image,
    });

    res.status(201).json({ status: `success`, destination: newDestination });
  } catch (error) {
    res.status(404).json({ status: `fail`, error });
  }
};

const updateDestination = async (req, res, next) => {
  try {
    let updatedFields = {};
    if (req.body.name) updatedFields = { name: req.body.name };
    if (req.body.description)
      updatedFields = { ...updatedFields, description: req.body.description };
    if (req.body.image)
      updatedFields = { ...updatedFields, image: req.body.image };

    const updatedDestination = await Destination.findOneAndUpdate(
      { _id: req.params.id },
      { ...updatedFields },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDestination) {
      return res.status(404).json({
        status: `fail`,
        error: `Can't find destination with this ID`,
      });
    }

    res.status(201).json({
      status: `success`,
      destination: updatedDestination,
    });
  } catch (error) {
    res.status(404).json({ status: `fail`, error });
  }
};

const deleteDestination = async (req, res, next) => {
  try {
    const deletedDestination = await Destination.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deletedDestination) {
      return res.status(404).json({
        status: `fail`,
        error: `Can't find destination with this ID`,
      });
    }

    res.status(201).json({
      status: `success`,
      message: `Destination succesfully deleted!`,
    });
  } catch (error) {
    res.status(404).json({ status: `fail`, error });
  }
};

module.exports = {
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
};
