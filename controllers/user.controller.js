const models = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Validator = require("fastest-validator");

async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validate incoming data
    const schema = {
      name: { type: "string", optional: false, max: 100 },
      email: { type: "email", optional: false, max: 500 },
      password: { type: "string", optional: false, max: 500 },
    };
    const v = new Validator();
    const validationResponse = v.validate({ name, email, password }, schema);
    if (validationResponse !== true) {
      return res.status(400).json({
        message: "Bad request",
        error: validationResponse,
      });
    }

    // Check if email is already taken
    const existingUser = await models.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        message: "Email is already in use",
      });
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      name: name,
      email: email,
      password: hashedPassword,
    };

    const createdUser = await models.User.create(user);

    res.status(201).json({
      message: "Created user successfully",
      user: createdUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Validate incoming data
    const schema = {
      email: { type: "email", optional: false, max: 500 },
      password: { type: "string", optional: false, max: 500 },
    };
    const v = new Validator();
    const validationResponse = v.validate({ email, password }, schema);
    if (validationResponse !== true) {
      return res.status(400).json({
        message: "Bad request",
        error: validationResponse,
      });
    }

    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }

      if (result) {
        const token = jwt.sign(
          {
            email: user.email,
            userId: user.id,
          },
          process.env.JWT_KEY, // Use environment variable for secret key
          { expiresIn: "1h" } // Token expiration time
        );
        res.status(200).json({
          message: "Authentication successful",
          token: token,
        });
      } else {
        res.status(401).json({
          message: "Invalid credentials",
        });
      }
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  signUp: signUp,
  login: login,
};
