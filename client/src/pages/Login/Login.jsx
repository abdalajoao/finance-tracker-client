import {useState} from "react";
import { login } from "../../services/auth.services";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();


    try {
      const response = await login({
        email,
        password,
    });

     localStorage.setItem("authToken", response.data.authToken);

     console.log("Token Salvo");

     navigate("/dashboard");

     console.log("Redirecionando...");

    

    } catch (error) {
      console.log(error.response?.status);
      console.log(error.response?.data);
    }   
  };


   return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        
        <h1 className="text-3xl font-bold text-center mb-2">
          Finance Tracker
        </h1>

        <h2 className="text-gray-500 text-center mb-6">
          Welcome Back 👋
        </h2>

        <form 
        className="space-y-6"
        onSubmit={handleLogin}
        >

          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 mb-2"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-medium text-gray-700 mb-2"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );

  }

  


export default Login;