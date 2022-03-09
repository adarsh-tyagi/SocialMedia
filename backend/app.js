const express = require("express");
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error");

// import routers
const userRouter = require("./routes/userRoute");

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

app.use(errorMiddleware);

module.exports = app;
