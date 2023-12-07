const express = require("express");
const mongoose = require("mongoose");
const cors = require(`cors`);
const dotenv = require(`dotenv`);

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

mongoose.connect(`${process.env.MONGODB_CONNECTION}`).then(() => {
  console.log("Database connected!");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server working on port ${PORT}`);
});
