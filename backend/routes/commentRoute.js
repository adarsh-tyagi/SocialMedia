const express = require("express")
const { createComment, deleteComment, getPostComments } = require("../controllers/commentController")
const router = express.Router()
const authMiddleware = require("../middlewares/auth")

// comment routes
router.route("/create").post(authMiddleware, createComment)
router.route("/delete/:postId").delete(authMiddleware, deleteComment)
router.route("/post/:postId").get(authMiddleware, getPostComments)

module.exports = router