const express = require("express");
const postController = require("../controllers/post.controller");

const router = express.Router();

router.get("/", postController.index);
router.get("/:id", postController.show);
router.post("/create", postController.save);
router.patch("/:id", postController.update);
router.delete("/:id", postController.destroy);

module.exports = router;
