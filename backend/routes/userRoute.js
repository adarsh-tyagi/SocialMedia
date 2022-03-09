const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserDetails,
  deleteUser,
  updateUserDetails,
  logoutUser,
  forgotUserPassword,
  resetUserPassword,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");

// user routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(authMiddleware, logoutUser);
router
  .route("/me")
  .get(authMiddleware, getUserDetails)
  .delete(authMiddleware, deleteUser)
  .put(authMiddleware, updateUserDetails);

// password routes
router.route("/forgot/password").post(forgotUserPassword);
router.route("/reset/password/:token").put(resetUserPassword);

module.exports = router;
