const bcrypt = require(`bcryptjs`);
const catchAsync = require(`../utilis/catchAsync`);
const User = require(`../model/userModel`);

const allUsers = catchAsync(async function (req, res, next) {
  const users = await User.find().select(`+active`);

  if (!users[0]) {
    return res.status(400).json({
      status: `fail`,
      error: "Can't find any users",
    });
  }

  res.status(200).json({
    status: `success`,
    users,
  });
});

const oneUser = catchAsync(async function (req, res, next) {
  const user = await User.findOne({
    _id: req.params.id,
    active: true,
  }).populate({
    path: `reviews`,
  });

  if (!user) {
    return res.status(400).json({
      status: `fail`,
      error: "Can't find user with this ID",
    });
  }

  res.status(200).json({
    status: `success`,
    user,
  });
});

const getMe = catchAsync(async function (req, res, next) {
  const myProfile = await User.findOne({ _id: req.user._id }).populate({
    path: `reviews`,
  });

  if (!myProfile)
    return res.status(400).json({
      status: `fail`,
      error: "Can't find user with this ID",
    });

  res.status(201).json({
    status: `success`,
    data: myProfile,
  });
});

const deleteMe = catchAsync(async function (req, res, next) {
  const myProfile = await User.findOne({ _id: req.user._id }).select(`+active`);

  if (!myProfile)
    return res.status(400).json({
      status: `fail`,
      error: "Can't find user with this ID",
    });

  myProfile.active = false;

  await myProfile.save();

  res.status(201).json({
    status: `success`,
    message: "Profile deactivated!",
  });
});

const deleteUser = catchAsync(async function (req, res, next) {
  const profileToDelete = await User.findOneAndDelete({ _id: req.body.userId });

  if (!profileToDelete)
    return res.status(400).json({
      status: `fail`,
      error: "Can't find user with this ID",
    });

  res.status(201).json({
    status: `success`,
    message: "Profile permanently deleted!",
  });
});

const activateUser = catchAsync(async function (req, res, next) {
  const user = await User.findOne({ _id: req.params.id });

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

  res.status(201).json({
    status: "success",
    message: "Email successfully updated!",
  });
});

module.exports = {
  oneUser,
  allUsers,
  getMe,
  deleteMe,
  deleteUser,
  activateUser,
  updatePassword,
  updateEmail,
};
