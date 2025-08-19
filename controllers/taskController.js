const db = require("../config/db");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// Create
exports.createTask = async (req, res) => {
  const { title, description } = req.body;
  const sql = "INSERT INTO tasks (title, description) VALUES (?, ?)";

  try {
    const [result] = await db.query(sql, [title, description || null]);

    return successResponse(res, 201, "Task created successfully", {
      taskId: result.insertId,
    });
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

// Update
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const sql =
    "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?";

  try {
    const [result] = await db.query(sql, [title, description, status, id]);

    if (result.affectedRows === 0)
      return errorResponse(res, 404, "Task not found");

    return successResponse(res, 200, "Task updated successfully");
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

// Delete
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tasks WHERE id = ?";

  try {
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0)
      return errorResponse(res, 404, "Task not found");

    return successResponse(res, 200, "Task deleted successfully");
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

// Get All
exports.getAllTasks = async (req, res) => {
  const sql = "SELECT * FROM tasks ORDER BY created_at DESC";

  try {
    const [results] = await db.query(sql);

    return successResponse(res, 200, "Tasks fetched successfully", {
      tasks: results,
    });
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

// Get by ID
exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM tasks WHERE id = ?";

  try {
    const [results] = await db.query(sql, [id]);

    if (results.length === 0)
      return errorResponse(res, 404, "Task not found");

    return successResponse(res, 200, "Task fetched successfully", {
      task: results[0],
    });
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};
