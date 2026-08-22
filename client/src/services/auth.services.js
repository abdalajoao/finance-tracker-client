import axios from "axios";

const API_URL = "https://finance-tracker-server-w158.onrender.com/auth";

const authService = axios.create({
  baseURL: API_URL,
});

// Signup
const signup = (userData) => {
  return authService.post("/signup", userData);
};

// Login
const login = (userData) => {
  return authService.post("/login", userData);
};

export { signup, login };