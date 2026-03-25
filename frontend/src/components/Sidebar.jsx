import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clearAuthState } from "../services/authStorage";
import { logout } from "../services/api";

const Sidebar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Client-side logout should still proceed when API logout fails.
    }
    clearAuthState();
    navigate("/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: PlusCircle, label: "Create Shipment", path: "/dashboard/create" },
    { icon: Package, label: "Active Shipments", path: "/dashboard/shipments" },
  ];

  const MenuContent = () => (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display gradient-text">
          IntelliShip
        </h1>
        <p className="text-sm text-on-surface-variant">AI Logistics Platform</p>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative group ${
                isActive
                  ? "bg-primary/10 text-primary border-l-[3px] border-primary"
                  : "text-on-surface-variant/80 hover:bg-surface-container-high hover:text-on-surface"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            <item.icon size={20} className="group-hover:drop-shadow-[0_0_6px_rgba(0,217,255,0.4)] transition-all" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 w-full mt-auto"
      >
        <LogOut size={20} />
        <span className="font-medium">Logout</span>
      </button>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 glass-card p-3"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen p-6 bg-surface-container-lowest border-r border-outline-variant/10">
        <MenuContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 20 }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 bg-surface-container-lowest p-6 z-50 flex flex-col border-r border-outline-variant/10"
            >
              <MenuContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
