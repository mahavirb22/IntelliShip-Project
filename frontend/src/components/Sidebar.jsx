import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: PlusCircle, label: "Create Shipment", path: "/dashboard/create" },
  { icon: Package, label: "Active Shipments", path: "/dashboard/shipments" },
];

const MenuContent = ({ collapsed, setIsOpen }) => (
  <div className="flex flex-col h-full w-full">
    <nav className="flex-1 space-y-2 mt-2">
      {MENU_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/dashboard"}
          className={({ isActive }) =>
            `flex items-center ${collapsed ? "justify-center px-0" : "px-4"} py-3 rounded-xl transition-all duration-300 relative group ${
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-on-surface-variant hover:bg-gray-50 hover:text-on-surface"
            }`
          }
          onClick={() => setIsOpen && setIsOpen(false)}
          title={collapsed ? item.label : undefined}
        >
          <item.icon size={20} className={({ isActive }) => isActive ? "text-primary drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)]" : "group-hover:text-primary transition-colors"} />
          {!collapsed && <span className="ml-3 font-medium">{item.label}</span>}
          
          {/* Tooltip for collapsed mode */}
          {collapsed && (
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-white shadow-lg text-on-surface text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-gray-100 font-medium">
              {item.label}
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  </div>
);

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse state

  return (
    <>
      {/* Mobile Menu Button - Floating bottom right or could be in navbar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] bg-white border border-gray-200 p-3 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.1)] text-on-surface hover:text-primary hover:border-primary/30 transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col sticky top-16 h-[calc(100vh-4rem)] p-4 bg-white border-r border-gray-100 transition-all duration-300 shrink-0 z-40 ${
          isCollapsed ? "w-[88px]" : "w-[260px]"
        }`}
      >
        <MenuContent collapsed={isCollapsed} />
        
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1.5 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all shadow-sm z-50"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
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
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-full w-[280px] bg-white p-6 z-50 flex flex-col border-r border-gray-100 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-primary font-display font-bold text-xl">
                  <Package /> IntelliShip
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-gray-900 bg-gray-50 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <MenuContent collapsed={false} setIsOpen={setIsOpen} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

