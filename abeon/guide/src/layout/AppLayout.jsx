import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import { useApp } from "../data/AppContext";
import { CheckCircle2, Info } from "lucide-react";

export default function AppLayout() {
  const { toast } = useApp();

  return (
    <div className="app">
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <main className="page"><Outlet /></main>
      </div>

      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type || "success"}`}>
            {toast.type === "info" ? <Info size={18} /> : <CheckCircle2 size={18} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}