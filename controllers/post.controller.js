const Validator = require("fastest-validator");
const models = require("../models");

async function index(req, res) {
  try {
    const posts = await models.Post.findAll();
    if (posts.length > 0) {
      res.status(200).json({
        data: posts,
      });
    } else {
      res.status(404).json({
        message: "No posts found",
      });
    }
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
async function save(req, res) {
  try {
    const { title, content, image_url, category_id } = req.body;

    // Validate incoming data
    const schema = {
      title: { type: "string", optional: false, max: 100 },
      content: { type: "string", optional: false, max: 500 },
      category_id: { type: "number", optional: false },
    };
    const v = new Validator();
    const validationResponse = v.validate(
      { title, content, category_id },
      schema
    );

    if (validationResponse !== true) {
      return res.status(400).json({
        message: "Bad request",
        error: validationResponse,
      });
    }

    // Create post
    const post = {
      title,
      content,
      imageUrl: image_url,
      categoryId: category_id,
      userId: 1,
    };
    const result = await models.Post.create(post);

    // Return response
    res.status(201).json({
      message: "Created Successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
async function show(req, res) {
  try {
    // Using destructuring to directly get id from req.params
    const { id } = req.params;
    const post = await models.Post.findByPk(id);

    // Use optional chaining operator to simplify null check
    if (post?.dataValues) {
      res.status(200).json({
        data: post,
      });
    } else {
      res.status(404).json({
        message: "Post Not Found",
      });
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
async function update(req, res) {
  try {
    const { id } = req.params;
    const { title, userId, content, image_url, categoryId } = req.body;

    // Validation schema
    const schema = {
      title: { type: "string", optional: false, max: 100 },
      content: { type: "string", optional: false, max: 500 },
      categoryId: { type: "number", optional: false },
      userId: { type: "number", optional: false },
    };

    // Validate request body
    const v = new Validator();
    const validationResponse = v.validate(
      { title, userId, content, image_url, categoryId },
      schema
    );

    if (validationResponse !== true) {
      return res.status(400).json({
        message: "Bad request",
        error: validationResponse,
      });
    }

    // Check if post exists
    const post = await models.Post.findByPk(id);

    if (!post) {
      return res.status(404).json({
        message: `Post not found with id ${id}`,
      });
    }

    const updatedPost = {
      title,
      content,
      imageUrl: image_url,
      categoryId: categoryId,
      userId: userId,
    };

    // Update post
    await models.Post.update(updatedPost, { where: { id, userId } });

    res.status(200).json({
      message: "Post updated successfully",
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
async function destroy(req, res) {
  try {
    const { id } = req.params;
    const userId = 1;
    // Check if post exists
    const post = await models.Post.findByPk(id);
    if (!post) {
      return res.status(404).json({
        message: `Post not found with id ${id}`,
      });
    }
    // Delete post
    await models.Post.destroy({ where: { id, userId } });
    res.status(200).json({
      message: "Post was successfully destroyed",
      postId: id,
    });
  } catch (error) {
    console.error("Error destroying post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  index: index,
  save: save,
  show: show,
  update: update,
  destroy: destroy,
};
