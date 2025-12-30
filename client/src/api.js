import axios from "axios";


const API_URL = "https://event-platform-api-jahk.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
