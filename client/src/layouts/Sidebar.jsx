import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  X
} from "lucide-react";

function Sidebar({isOpen, onClose}) {
    return (

        <aside
            className={`w-64 min-h-screen bg-slate-950 p-6 text-white border-r border-slate-800 ${
            isOpen ? "block" : "hidden"
            } lg:block`}
        >

            <div className="flex items-center justify-between mb-10">
            <h1 className="text-xl font-bold tracking-tight">
             Finance Tracker
            </h1>

            <button
             onClick={onClose}
             className="lg:hidden text-slate-400 hover:text-white transition"
            >
             <X size={20} />
            </button>
            </div>

            <nav className="flex flex-col gap-2"> 
                <NavLink
                to="/dashboard"
                onClick={onClose}
                className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
                }
            >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
            </NavLink>

            <NavLink
                to="/transactions"
                onClick={onClose}
                className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
                }
            >
            <ArrowLeftRight size={20} />
            <span>Transactions</span>
            </NavLink>

            <NavLink
                to="/categories"
                onClick={onClose}
                className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
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
        </aside>
    )
}


export default Sidebar;