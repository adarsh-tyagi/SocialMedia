const cloudinary = require("cloudinary");
const connectDB = require("./config/database");
const app = require("./app");

// using env properties
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 5000;

// connect DB and start server
const start = () => {
  connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
};

start();
