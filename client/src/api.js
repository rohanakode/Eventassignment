import axios from "axios";

// 1. Force the URL to be your Render Backend
// REPLACE THE URL BELOW with your actual Render URL (no slash at the end)
const API_URL = "https://event-platform-api-jahk.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
