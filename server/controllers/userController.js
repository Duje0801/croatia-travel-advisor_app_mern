const bcrypt = require(`bcryptjs`);
const catchAsync = require(`../utilis/catchAsync`);
const User = require(`../model/userModel`);

const allUsers = catchAsync(async function (req, res, next) {
  const skip = ((req.query.page * 1 || 1) - 1) * 10;

  const totalUsersNumber = await User.find({ active: true })
    .countDocuments()
    .count();

  const users = await User.find({ active: true }).skip(skip).limit(10);

  if (!users[0]) {
    return res.status(400).json({
      status: `fail`,
      error: "Can't find any users",
    });
  }

  res.status(200).json({
    status: `success`,
    quantity: totalUsersNumber,
    data: users,
  });
});

const oneUser = catchAsync(async function (req, res, next) {
  const user = await User.findOne({
    username: req.params.id,
  }).populate({
    path: `reviews`,
  });

  if (!user) {
    return res.status(400).json({
      status: `fail`,
      error: "Can't find user with this name",
    });
  }

  res.status(200).json({
    status: `success`,
    user,
  });
});

const deleteMe = catchAsync(async function (req, res, next) {
  const myProfile = await User.findOne({ username: req.user.username });

  if (!myProfile)
    return res.status(400).json({
      status: `fail`,
      error: "Can't find user with this name",
    });

  myProfile.active = false;

  await myProfile.save();

  res.status(201).json({
    status: `success`,
    message: "Profile deactivated!",
  });
});

const deleteUser = catchAsync(async function (req, res, next) {
  const profileToDelete = await User.findOneAndDelete({
    _id: req.body.id,
  });

  if (!profileToDelete)
    return res.status(400).json({
      status: `fail`,
      error: "Can't find user with this name",
    });

  res.status(201).json({
    status: `success`,
    message: "Profile permanently deleted!",
  });
});

const activateUser = catchAsync(async function (req, res, next) {
  const user = await User.findOne({ _id: req.body.id });

  if (!user)
    return res.status(400).json({
      status: `fail`,
      error: "Can't find user with this ID",
    });

  user.active = true;

  await user.save();

  res.status(201).json({
    status: `success`,
    message: "User is active again!",
  });
});

const deactivateUser = catchAsync(async function (req, res, next) {
  const user = await User.findOne({ _id: req.body.id });

  if (!user)
    return res.status(400).json({
      status: `fail`,
      error: "Can't find user with this ID",
    });

  user.active = false;

  await user.save();

  res.status(201).json({
    status: `success`,
    message: "User is active again!",
  });
});

const updatePassword = catchAsync(async function (req, res, next) {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const confirmNewPassword = req.body.confirmNewPassword;

  const user = await User.findOne({ _id: req.user._id }).select(`+password`);

  if (!user) {
    return res.status(200).json({ status: "fail", error: "User don't exist" });
  }

  if (newPassword !== confirmNewPassword) {
    return res
      .status(400)
      .json({ status: `fail`, error: "Passwords must be identical" });
  }

  if (!(await bcrypt.compare(oldPassword, user.password))) {
    return res
      .status(400)
      .json({ status: `fail`, error: "Incorrect old password" });
  }

  user.password = await bcrypt.hash(newPassword, 12);

  await user.save();

  res.status(201).json({
    status: "success",
    message: "Password successfully updated!",
  });
});

const updateEmail = catchAsync(async function (req, res, next) {
  const oldEmail = req.body.oldEmail;
  const newEmail = req.body.newEmail;
  const password = req.body.password;

  const user = await User.findOne({ _id: req.user._id }).select(`+password`);

  if (!user) {
    return res.status(200).json({ status: "fail", error: "User don't exist" });
  }

  if (oldEmail === newEmail) {
    return res
      .status(400)
      .json({ status: `fail`, error: "New mail is same as old email" });
  }

  if (oldEmail !== user.email) {
    return res
      .status(400)
      .json({ status: `fail`, error: "Incorrect old mail" });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res
      .status(400)
      .json({ status: `fail`, error: "Incorrect password" });
  }

  const emailInUse = await User.findOne({ email: newEmail });

  if (emailInUse) {
    return res
      .status(400)
      .json({ status: `fail`, error: "Email is already in use" });
  }

  user.email = newEmail;

  await user.save();

  const userData = {
    username: user.username,
    email: user.email,
  };

  res.status(201).json({
    status: "success",
    data: userData,
  });
});

module.exports = {
  oneUser,
  allUsers,
  deleteMe,
  deleteUser,
  activateUser,
  deactivateUser,
  updatePassword,
  updateEmail,
};
