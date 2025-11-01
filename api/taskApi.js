import axios from "axios";

export async function handleGETAllTask() {
  try {
    const response = await axios.get("https://advance-task-manager-backend.onrender.com/api/v1/task");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch tasks");
  }
}

export async function handleCreateTask(taskData) {
  const response = await axios.post("https://advance-task-manager-backend.onrender.com/api/v1/task", { title: taskData.task });
  return response.data;
}

export async function handleDeleteTask(taskId) {
  const response = await axios.delete(`https://advance-task-manager-backend.onrender.com/api/v1/task/${taskId}`);
  return response.data;
}

export async function handleUpdateTask({ id, title }) {
  const response = await axios.put(`https://advance-task-manager-backend.onrender.com/api/v1/task/${id}`, { title });
  return response.data;
}

export async function toggleTaskStatus(id) {
  const response = await axios.patch(`https://advance-task-manager-backend.onrender.com/api/v1/task/${id}/toggle`);
  return response.data;
}