import axios from "axios";

const API_URL = "http://localhost:5005/auth";

const authService = axios.create({
  baseURL: API_URL,
  
});

const login = (userData) => {

    return authService.post("/login", userData)
}


export {login};