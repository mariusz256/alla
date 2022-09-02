const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ text: "Hello there!" });
});

const userRauter = require("./src/routes/users.js");

app.use("/api/user", userRauter);

const workingHours = require("./src/routes/workingHours");
app.use("/workdays", workingHours);

app.listen(process.env.PORT, () => {
  console.log(`App running on port: ${process.env.PORT}`);
});
