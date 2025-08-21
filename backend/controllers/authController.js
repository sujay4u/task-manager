const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../utils/responseHandler");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email =?",
      [email]
    );

    if (existingUser.length > 0) {
      return errorResponse(res, 400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query("Insert into users (name, email, password) VALUES (?,?,?)", [
      name,
      email,
      hashedPassword,
    ]);

    return successResponse(res, 201, "User registered successfully");
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);

    if (users.length === 0) {
      return errorResponse(res, 400, "Invalid email or password");
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 400, "Invalid email or password");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return successResponse(res,200,"Login successful",{
      token,
      user:{
         id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};
