import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  LogOut,
  X,
} from "lucide-react";

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = () => {
    // Remove authentication token
    localStorage.removeItem("authToken");

    // Remove old token key as well, if it exists
    localStorage.removeItem("token");

    // Close sidebar on mobile
    onClose();

    // Redirect to login
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`flex w-64 min-h-screen flex-col bg-slate-950 p-6 text-white border-r border-slate-800 ${
        isOpen ? "block" : "hidden"
      } lg:flex`}
    >
      {/* ==========================================
          Header
      ========================================== */}

      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">
          Finance Tracker
        </h1>

        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 transition hover:text-white lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* ==========================================
          Navigation
      ========================================== */}

      <nav className="flex flex-1 flex-col gap-2">
        {/* Dashboard */}

        <NavLink
          to="/dashboard"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <LayoutDashboard size={20} />

          <span>Dashboard</span>
        </NavLink>

        {/* Transactions */}

        <NavLink
          to="/transactions"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <ArrowLeftRight size={20} />

          <span>Transactions</span>
        </NavLink>

        {/* Categories */}

        <NavLink
          to="/categories"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <Tags size={20} />

          <span>Categories</span>
        </NavLink>
      </nav>

      {/* ==========================================
          Logout
      ========================================== */}

      <div className="mt-auto border-t border-slate-800 pt-5">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={20} />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;