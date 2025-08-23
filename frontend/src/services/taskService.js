import axios from "axios";

const API_BASE = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE,
});

// Get all tasks
export async function getTasks(token, param ={}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/tasks?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data.tasks; 
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
