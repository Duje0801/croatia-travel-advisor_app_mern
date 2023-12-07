const express = require("express");
const mongoose = require("mongoose");
const cors = require(`cors`);
const dotenv = require(`dotenv`);

const destinationRoutes = require("./routes/destinationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");

const errorHandling = require("./utilis/errorHandler");

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

app.use(`/api/destination/`, destinationRoutes);
app.use(`/api/review/`, reviewRoutes);
app.use(`/api/user/`, userRoutes);

mongoose.connect(`${process.env.MONGODB_CONNECTION}`).then(() => {
  console.log("Database connected!");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server working on port ${PORT}`);
});

app.use(errorHandling);
