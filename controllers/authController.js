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
