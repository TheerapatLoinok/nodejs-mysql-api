const express = require("express");
const checkAuthMiddleware = require("../middleware/check-auth");
const commentController = require("../controllers/comment.controller");
const router = express.Router();

router.get("/", checkAuthMiddleware.checkAuth, commentController.index);
router.post("/create", checkAuthMiddleware.checkAuth, commentController.save);
router.get("/:id", checkAuthMiddleware.checkAuth, commentController.show);
router.patch("/:id", checkAuthMiddleware.checkAuth, commentController.update);
router.delete("/:id", checkAuthMiddleware.checkAuth, commentController.destroy);

module.exports = router;
