const mongoose = require("mongoose");

// create connection with mongodb atlas
module.exports = (url) => {
  mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((data) => console.log("Database connected successfully"))
    .catch((err) => {
      console.log("Database connection failed.");
      process.exit(1);
    });
};
