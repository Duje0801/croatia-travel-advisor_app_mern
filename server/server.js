const express = require("express");
const mongoose = require("mongoose");
const dotenv = require(`dotenv`);
const helmet = require(`helmet`);
const rateLimit = require(`express-rate-limit`);
const mongoSanatize = require(`express-mongo-sanitize`);
const cors = require(`cors`);

const destinationRoutes = require("./routes/destinationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");

const errorHandling = require("./utilis/errorHandler");

const app = express();

dotenv.config();

app.use(express.json({ limit: `10kb` }));

//$ in unusable in input (for example logging only knowing password)
app.use(mongoSanatize());

//Additional security (headers)
app.use(helmet());

//Limiting number of requests from one IP, maximum 50 in 30 minutes
/* const limitRequests = rateLimit({
  max: 1000,
  windowMs: 1800000,
  message: `Too many requests from this IP address, please try again in 30 minutes.`,
});
app.use(`/api`, limitRequests);
 */
//Allows access from other domains (front-end)
app.use(cors());

//Routes
app.use(`/api/destination/`, destinationRoutes);
app.use(`/api/review/`, reviewRoutes);
app.use(`/api/user/`, userRoutes);

//If route does not exist
app.all(`*`, (req, res, next) => {
  res.status(404).json({
    status: `fail`,
    message: `Cant find ${req.originalUrl} on this server`,
  });
});

//Connecting to MongoDB
mongoose.connect(`${process.env.MONGODB_CONNECTION}`).then(() => {
  console.log("Database connected!");
});

//Connecting to server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server working on port ${PORT}`);
});

//Global error handler, catches errors
app.use(errorHandling);
