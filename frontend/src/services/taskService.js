import axios from "axios";

const API_BASE = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE,
});

// Get all tasks
export async function getTasks(
  token,
  {
    status = "",
    search = "",
    sortBy = "created_at",
    sortOrder = "desc",
    page = 1,
    limit = 5,
  } = {}
) {
  try {
    const params = {};
    if (status) params.status = status;
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const res = await api.get(`/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return {
      tasks: res.data.data.tasks,
      pagination: res.data.data.pagination,
    };
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch tasks");
  }
}

// Add task
export async function addTask(task, token) {
  try {
    const res = await api.post("/tasks", task, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data.task;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to add task");
  }
}

// Update task
export async function updateTask(id, updatedTask, token) {
  try {
    const res = await api.put(`/tasks/${id}`, updatedTask, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data.task;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update task");
  }
}

// Delete task
export async function deleteTask(id, token) {
  try {
    await api.delete(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to delete task");
  }
}
