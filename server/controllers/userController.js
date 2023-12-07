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

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res
      .status(400)
      .json({ status: `fail`, error: "Incorrect email or password" });
  }

  const token = createToken(user._id);

  res.status(201).json({
    status: `success`,
    data: { user: { username: user.username, email: user.email }, token },
  });
});

module.exports = {
  signUp,
  logIn,
};
