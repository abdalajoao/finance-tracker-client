import { useState } from "react";
import Sidebar from "./Sidebar";

function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  console.log("Sidebar:", isSidebarOpen);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex items-center justify-between border-b bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            ☰
          </button>

          <h1 className="font-semibold text-slate-900">
            Finance Tracker
          </h1>

          <div className="w-8" />
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;