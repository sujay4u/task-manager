const db = require("../config/db");
const { successResponse, errorResponse } = require("../utils/responseHandler");

//Create
exports.createTask = (req, res) => {
  const { title, description } = req.body;

  const sql = "INSERT INTO tasks (title, description) VALUES (?,?)";
  db.query(sql, [title, description || null], (err, result) => {
    if (err) return errorResponse(res, err.message, 500);
    return successResponse(
      res,
      "Task created successfully",
      { taskId: result.insertId },
      201
    );
  });
};

//Update
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const sql =
    "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?";
  const { title, description, status } = req.body;

  db.query(sql, [title, description, status, id], (err, result) => {
    if (err) return errorResponse(res, err.message, 500);
    if (result.affectedRows === 0)
      return errorResponse(res, "Task not found", 404);

    return successResponse(res, "Task updated successfully");
  });
};

//Delete
exports.deleteTask = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM tasks WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return errorResponse(res, err.message, 500);

    if (result.affectedRows === 0)
      return errorResponse(res, "Task not found", 404);
    return successResponse(res, "Task deleted successfully");
  });
};

//Select
exports.getAllTasks = (req, res) => {
  const sql = "SELECT * FROM tasks ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) return errorResponse(res, err.message, 500);
    return successResponse(res, "Tasks fetched successfully", {
      tasks: results,
    });
  });
};

//Select by ID
exports.getTaskById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM tasks WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return errorResponse(res, err.message, 500);

    if (results.length === 0) return errorResponse(res, "Task not found", 404);

    return successResponse(res, "Task fetch successfully", { task: result[0] });
  });
};
