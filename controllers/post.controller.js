const Validator = require("fastest-validator");
const models = require("../models");

async function index(req, res) {
  try {
    const result = await models.Post.findAll();
    if (result) {
      res.status(200).json({
        data: result,
      });
    } else {
      res.status(404).json({
        message: "Post Not Found",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
async function save(req, res) {
  try {
    const post = {
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.body.image_url,
      categoryId: req.body.category_id,
      userId: 1,
    };

    const schema = {
      title: { type: "string", optional: false, max: "100" },
      content: { type: "string", optional: false, max: "500" },
      categoryId: { type: "number", optional: false, max: "500" },
    };

    const v = new Validator();
    const validationResponse = v.validate(post, schema);

    if (validationResponse !== true) {
      res.status(400).json({
        message: "Bad request",
        error: validationResponse,
      });
    } else {
      const result = await models.Post.create(post);
      res.status(201).json({
        message: "Created Successfully",
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
async function show(req, res) {
  try {
    const id = req.params.id;
    const result = await models.Post.findByPk(id);
    if (result) {
      res.status(200).json({
        data: result,
      });
    } else {
      res.status(404).json({
        message: "Post Not Found",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
async function update(req, res) {
  try {
    const { id } = req.params;
    const { title, content, image_url, category_id } = req.body;

    const updatedPost = {
      title,
      content,
      imageUrl: image_url,
      categoryId: category_id,
    };

    const userId = 1;

    const schema = {
      title: { type: "string", optional: false, max: 100 },
      content: { type: "string", optional: false, max: 500 },
      categoryId: { type: "number", optional: false, max: 500 },
    };

    const v = new Validator();
    const validationResponse = v.validate(updatedPost, schema);

    if (validationResponse !== true) {
      return res.status(400).json({
        message: "Bad request",
        error: validationResponse,
      });
    }

    const post = await models.Post.findByPk(id);

    if (!post) {
      return res.status(404).json({
        message: `Not Found Post`,
      });
    }

    await models.Post.update(updatedPost, { where: { id, userId } });

    res.status(200).json({
      message: "Updated post",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
async function destroy(req, res) {
  try {
    const { id } = req.params;
    const userId = 1;

    const post = await models.Post.findByPk(id);

    if (!post) {
      return res.status(404).json({
        message: "Not Found Post",
      });
    }

    await models.Post.destroy({ where: { id, userId } });
    res.status(200).json({
      message: "Post was successfully destroyed",
      postId: id,
    });
  } catch (error) {
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
