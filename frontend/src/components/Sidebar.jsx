import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clearAuthState } from "../services/authStorage";
import { logout } from "../services/api";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: PlusCircle, label: "Create Shipment", path: "/dashboard/create" },
  { icon: Package, label: "Active Shipments", path: "/dashboard/shipments" },
];

const MenuContent = ({ collapsed, setIsOpen, handleLogout }) => (
  <div className="flex flex-col h-full w-full">
    <div className={`mb-8 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
      {!collapsed && (
        <div>
          <h1 className="text-2xl font-bold font-display gradient-text">
            IntelliShip
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">AI Logistics Platform</p>
        </div>
      )}
      {collapsed && (
        <div className="bg-primary/20 p-2 rounded-xl text-primary">
          <Package size={24} />
        </div>
      )}
    </div>

    <nav className="flex-1 space-y-2 mt-4">
      {MENU_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/dashboard"}
          className={({ isActive }) =>
            `flex items-center ${collapsed ? "justify-center px-0" : "px-4"} py-3 rounded-xl transition-all duration-300 relative group ${
              isActive
                ? "bg-primary/10 text-primary shadow-[inset_2px_0_0_0_#4287f5]"
                : "text-on-surface-variant/80 hover:bg-surface-container-high hover:text-on-surface"
            }`
          }
          onClick={() => setIsOpen(false)}
          title={collapsed ? item.label : undefined}
        >
          <item.icon size={20} className="group-hover:drop-shadow-[0_0_8px_rgba(66,135,245,0.5)] transition-all" />
          {!collapsed && <span className="font-medium ml-3">{item.label}</span>}
          
          {/* Tooltip for collapsed mode */}
          {collapsed && (
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-surface-container-highest text-on-surface text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-outline-variant/30 backdrop-blur-md">
              {item.label}
            </div>
          )}
        </NavLink>
      ))}
    </nav>

    <button
      onClick={handleLogout}
      className={`flex items-center ${collapsed ? "justify-center" : "px-4"} py-3 mt-auto rounded-xl text-on-surface-variant/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 w-full group relative`}
      title={collapsed ? "Logout" : undefined}
    >
      <LogOut size={20} className="group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
      {!collapsed && <span className="font-medium ml-3">Logout</span>}
      {collapsed && (
        <div className="absolute left-full ml-4 px-3 py-1.5 bg-surface-container-highest text-on-surface text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-outline-variant/30 backdrop-blur-md">
          Logout
        </div>
      )}
    </button>
  </div>
);

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse state
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



  return (
    <>
      {/* Mobile Menu Button - Glassmorphism */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-[60] bg-surface-container/60 backdrop-blur-xl border border-outline-variant/30 p-2.5 rounded-xl shadow-lg text-on-surface hover:bg-surface-container-high transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Sidebar (Sticky, non-fixed for flex/grid layouts) */}
      <aside 
        className={`hidden lg:flex flex-col sticky top-0 h-screen p-6 bg-surface-container-low/40 backdrop-blur-2xl border-r border-outline-variant/20 transition-all duration-300 shrink-0 z-40 ${
          isCollapsed ? "w-[100px]" : "w-[280px]"
        }`}
      >
        <MenuContent collapsed={isCollapsed} setIsOpen={setIsOpen} handleLogout={handleLogout} />
        
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-surface-container-high border border-outline-variant/30 rounded-full p-1.5 text-on-surface hover:text-primary hover:border-primary/50 transition-all shadow-lg z-50"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      {/* Mobile Sidebar Modal */}
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
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-full w-[280px] bg-surface/95 backdrop-blur-3xl p-6 z-50 flex flex-col border-r border-outline-variant/20 shadow-2xl"
            >
              <MenuContent collapsed={false} setIsOpen={setIsOpen} handleLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

