import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Bell, User, ChevronDown, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clearAuthState, getAuthUser } from "../services/authStorage";
import { logout } from "../services/api";

const Navbar = ({ onMenuToggle }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const user = getAuthUser();
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userInitials = userName.substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Proceed with client side logout
    }
    clearAuthState();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16 max-w-7xl mx-auto">
        {/* Left section: Logo & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <Package size={24} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold font-display text-on-surface">
                IntelliShip
              </h1>
            </div>
          </Link>
        </div>

        {/* Right section: Actions & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 pl-2 pr-3 bg-surface hover:bg-gray-50 border border-gray-100 rounded-full transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-medium shadow-sm">
                {userInitials}
              </div>
              <ChevronDown size={14} className="text-on-surface-variant" />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 py-1 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-medium text-on-surface">{userName}</p>
                      <p className="text-xs text-on-surface-variant">{userEmail}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
