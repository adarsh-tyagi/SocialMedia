const cloudinary = require("cloudinary");
const connectDB = require("./config/database");
// const { Server } = require("socket.io");
const app = require("./app");
const server = require("http").createServer(app);
const Notification = require("./models/notificationModel");

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

// socket io
// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL,
//   },
// });

const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:3000" },
});

// socket for notifications and online users
let onlineUsers = [];

const addNewUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", async (userId) => {
    addNewUser(userId, socket.id);
    console.log("new user added");
    const receiver = getUser(userId);
    let notifications = await Notification.find({ receiver: userId })
      .populate("sender")
      .limit(10)
      .sort({ created_at: -1 });
    if (receiver) {
      io.to(receiver.socketId).emit("getNotification", notifications);
    }
  });

  socket.on("sendNotification", async ({ sender, receiver, content }) => {
    const notification = await Notification.create({
      sender,
      receiver,
      content,
    });
    await notification.save();
    const receiverUser = getUser(receiver);
    let notifications = await Notification.find({ receiver: receiver })
      .populate("sender")
      .limit(10)
      .sort({ created_at: -1 });
    if (receiverUser) {
      io.to(receiverUser.socketId).emit("getNotification", notifications);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

// connect DB and start server
const start = () => {
  connectDB(process.env.MONGO_URI);
  server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
};

start();
