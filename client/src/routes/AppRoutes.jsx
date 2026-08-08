 import { Routes, Route, Navigate } from "react-router-dom";

 import Login from "../pages/Login/Login";
 import Signup from "../pages/Signup/Signup";
 import Dashboard from "../pages/Dashboard/Dashboard";
 import Transactions from "../pages/Transactions/Transactions";
 import Categories from "../pages/Categories/Categories";


 function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login"  replace/>} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/categories" element={<Categories />} />   
        </Routes>
    );
 }

 export default AppRoutes;