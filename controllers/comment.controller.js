const Validator = require("fastest-validator");
const models = require("../models");

const index = async (req, res) => {
  try {
    const comments = await models.Comment.findAll();
    if (comments.length > 0) {
      res.status(200).json({
        data: comments,
      });
    } else {
      res.status(404).json({
        message: "No comments found",
      });
    }
  } catch (error) {
    console.error("Error retrieving comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const save = async (req, res) => {
  try {
    const { content, postId } = req.body;

    // Validate incoming data
    const schema = {
      content: { type: "string", optional: false, max: 100 },
      postId: { type: "number", optional: false },
    };
    const v = new Validator();
    const validationResponse = v.validate({ content, postId }, schema);

    if (validationResponse !== true) {
      return res.status(400).json({
        message: "Bad request",
        error: validationResponse,
      });
    }

    const postData = await models.Post.findByPk(postId);
    if (postData === null) {
      return res.status(404).json({
        message: `Post not found with id ${postId}`,
      });
    }

    const comment = {
      content: content,
      userId: req.userData.userId,
      postId: postId,
    };

    const createdComment = await models.Comment.create(comment);

    // Return response
    res.status(201).json({
      message: "Comment created successfully",
      data: createdComment,
    });
  } catch (error) {
    console.error("Error saving comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const show = async (req, res) => {
  try {
    // Using destructuring to directly get id from req.params
    const { id } = req.params;
    const comment = await models.Comment.findByPk(id);

    // Use optional chaining operator to simplify null check
    if (comment?.dataValues) {
      res.status(200).json({
        data: comment,
      });
    } else {
      res.status(404).json({
        message: "Comment Not Found",
      });
    }
  } catch (error) {
    console.error("Error fetching comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, postId } = req.body;

    const schema = {
      content: { type: "string", optional: false, max: 100 },
      postId: { type: "number", optional: false },
    };
    const v = new Validator();
    const validationResponse = v.validate({ content, postId }, schema);

    if (validationResponse !== true) {
      return res.status(400).json({
        message: "Bad request",
        error: validationResponse,
      });
    }

    const comment = await models.Comment.findOne({
      where: { id: id, postId: postId, userId: req.userData.userId },
    });
    if (!comment) {
      return res.status(404).json({
        message: `Comment not found`,
      });
    }

    const updatedComment = {
      content: content,
    };

    // Update comment
    await models.Comment.update(updatedComment, {
      where: { id: id, postId: postId, userId: req.userData.userId },
    });

    res.status(200).json({
      message: "Comment updated successfully",
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await models.Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({
        message: `Post not found with id ${id}`,
      });
    }

    await models.Comment.destroy({ where: { id: id } });
    res.status(200).json({
      message: "Comment was successfully destroyed",
      postId: id,
    });
  } catch (error) {
    console.error("Error destroy comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  index: index,
  save: save,
  show: show,
  update: update,
  destroy: destroy,
};
