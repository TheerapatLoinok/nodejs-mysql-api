const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const postRoute = require("./routes/posts");
const userRoute = require("./routes/users");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/health-check", (req, res) => {
  res.status(200).json({ message: "Server start with port 3000" });
});
app.use("/posts", postRoute);
app.use("/user", userRoute);

module.exports = app;
