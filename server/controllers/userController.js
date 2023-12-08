const bcrypt = require(`bcryptjs`);
const catchAsync = require(`../utilis/catchAsync`);
const User = require(`../model/userModel`);
const dotenv = require(`dotenv`);
const jwt = require(`jsonwebtoken`);

dotenv.config();

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: process.env.JWT_PRIVATE_KEY_EXPIRES,
  });
};

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

module.exports = {
  signUp,
  logIn,
  getMe,
  deleteMe,
  deleteUser,
  protect,
  restrictTo,
};
