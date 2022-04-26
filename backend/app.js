const express = require("express");
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error");
const path = require("path")

// import routers
const userRouter = require("./routes/userRoute");
const postRouter = require("./routes/postRoute");
const likeRouter = require("./routes/likeRoute");
const commentRouter = require("./routes/commentRoute");
const followRouter = require("./routes/followRoute");
const notificationRouter = require("./routes/notificationRoute");

// using env properties
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// initialize app
const app = express();
app.use(express.json({ limit: "100mb" }));
app.use(fileupload());
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(cors());

// routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/follow", followRouter);
app.use("/api/v1/notification", notificationRouter);

app.use(express.static(path.join(__dirname, "../frontend/build")))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
})

app.use(errorMiddleware);

module.exports = app;
