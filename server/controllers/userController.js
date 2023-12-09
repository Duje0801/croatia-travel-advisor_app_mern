const bcrypt = require(`bcryptjs`);
const catchAsync = require(`../utilis/catchAsync`);
const User = require(`../model/userModel`);
const dotenv = require(`dotenv`);
const jwt = require(`jsonwebtoken`);
const nodemailer = require(`nodemailer`);
const crypto = require(`crypto`);

dotenv.config();

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: process.env.JWT_PRIVATE_KEY_EXPIRES,
  });
};

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

const signUp = catchAsync(async function (req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  let password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ status: `fail`, error: "Passwords must be identical" });

  password = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    username,
    email,
    password,
  });

  const token = createToken(newUser._id);

  res.status(201).json({
    status: `success`,
    data: {
      user: { username: newUser.username, email: newUser.email },
      token,
    },
  });
});

const logIn = catchAsync(async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email })
    .select("+password")
    .select("+active");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res
      .status(400)
      .json({ status: `fail`, error: "Incorrect email or password" });
  }

  if (!user.active) {
    return res
      .status(400)
      .json({ status: `fail`, error: "User is deactivated" });
  }

  const token = createToken(user._id);

  res.status(201).json({
    status: `success`,
    data: { user: { username: user.username, email: user.email }, token },
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

const protect = catchAsync(async function (req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith(`Bearer`))
    return res.status(400).json({ status: `fail`, error: "Token invalid" });

  const token = authorization.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

  const user = await User.findOne({ _id: decoded._id }).select(`+role`);

  if (!user) {
    return res.status(400).json({ status: `fail`, error: "User don't exist" });
  }

  req.user = user;

  next();
});

const restrictTo = (...roles) => {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return res.status(400).json({
        status: `fail`,
        error: "You don't have permission for this operation",
      });
    } else next();
  };
};

const forgotPassword = catchAsync(async function (req, res, next) {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({
      status: `fail`,
      error: "There is no user with this email address",
    });
  }

  const code = crypto.randomBytes(12).toString(`hex`);

  user.restartPasswordCode = code;
  user.restartPasswordCodeExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Admin <admin@cta.com",
    to: req.user.email,
    subject: "Restart password - Croatia Travel Advisor",
    text: `Token for email restart is: ${code}. This code is valid only 10 minutes. 
    If you have not requested a password change, ignore this email.`,
  };

  await transport.sendMail(mailOptions);

  res
    .status(200)
    .json({ status: "success", message: "Mail succesfully send!" });
});

const resetPassword = catchAsync(async function (req, res, next) {
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  const confirmNewPassword = req.body.confirmNewPassword;
  const token = req.body.token;

  const user = await User.findOne({ email })
    .select(`+restartPasswordCode`)
    .select(`+restartPasswordCodeExpire`);

  if (!user) {
    return res.status(200).json({ status: "fail", error: "User don't exist" });
  }

  if (newPassword !== confirmNewPassword) {
    return res
      .status(400)
      .json({ status: `fail`, error: "Passwords must be identical" });
  }

  if (token !== user.restartPasswordCode) {
    return res
      .status(400)
      .json({ status: `fail`, error: "Invalid token code" });
  }

  if (Date.now() > user.restartPasswordCodeExpire) {
    return res.status(400).json({ status: `fail`, error: "Token expired" });
  }

  user.restartPasswordCode = undefined;
  user.restartPasswordCodeExpire = undefined;
  user.password = await bcrypt.hash(newPassword, 12);

  await user.save();

  const newToken = createToken(user._id);

  const userData = {
    username: user.username,
    email: user.email,
  };

  res.status(201).json({
    status: "success",
    data: { user: userData, token: newToken },
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
  signUp,
  logIn,
  getMe,
  deleteMe,
  deleteUser,
  activateUser,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateEmail,
};
