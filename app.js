const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const postRoute = require("./routes/posts");
const userRoute = require("./routes/users");
const imageRoute = require("./routes/images");
const commentRoute = require("./routes/comments");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/health-check", (req, res) => {
  res.status(200).json({ message: "Server start with port 3000" });
});
app.use("/posts", postRoute);
app.use("/user", userRoute);
app.use("/images", imageRoute);
app.use("/comments", commentRoute);

module.exports = app;
