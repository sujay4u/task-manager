const db = require("../config/db");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// Create
exports.createTask = async (req, res) => {
  const { title, description } = req.body;

  const userId = req.user.id; //from auth middleware

  const sql = "INSERT INTO tasks (title, description, user_id) VALUES (?, ?,?)";

  try {
    const [result] = await db.query(sql, [title, description || null, userId]);

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
 const userId = req.user.id;

  const sql =
    "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?";

  try {
    const [result] = await db.query(sql, [title, description, status, id,userId]);

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
  const userId = req.user.id;

  const sql = "DELETE FROM tasks WHERE id = ? AND user_id = ?";

  try {
    const [result] = await db.query(sql, [id,userId]);

    if (result.affectedRows === 0)
      return errorResponse(res, 404, "Task not found");

    return successResponse(res, 200, "Task deleted successfully");
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

// Get All
exports.getAllTasks = async (req, res) => {
    const userId = req.user.id;

      const { page = 1, limit = 10, status } = req.query;

    const offset = (page - 1) * limit;
  try {

  let sql = "SELECT * FROM tasks WHERE user_id=?";
let params = [userId]

    if (status) {
      sql += " AND status = ?";
      params.push(status);
    }
    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

  const [results] = await db.query(sql,params);

   let countSql = "SELECT COUNT(*) as total FROM tasks WHERE user_id = ?";
    let countParams = [userId];
    if (status) {
      countSql += " AND status = ?";
      countParams.push(status);
    }
    const [[{ total }]] = await db.query(countSql, countParams);


    return successResponse(res, 200, "Tasks fetched successfully", {
      tasks: results,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

// Get by ID
exports.getTaskById = async (req, res) => {
  const { id } = req.params;

    const userId = req.user.id;

  const sql = "SELECT * FROM tasks WHERE id = ? AND user_id=?";

  try {
   

    const [results] = await db.query(sql, [id, userId]);

    if (results.length === 0)
      return errorResponse(res, 404, "Task not found");

    return successResponse(res, 200, "Task fetched successfully", {
      task: results[0],
    });
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};
