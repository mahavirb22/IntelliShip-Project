import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Package, Search, Key, Shield, ArrowRight } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface overflow-hidden font-sans text-on-surface">
      {/* Navbar overlay */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2 text-primary font-bold text-xl font-display">
          <Package className="text-primary" />
          <span>IntelliShip</span>
        </div>

        <div className="hidden md:flex items-center gap-12 text-sm font-medium text-on-surface-variant">
          <a href="#" className="hover:text-primary transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Features
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Tracking
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            About
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate("/login")}
            className="whitespace-nowrap px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border border-outline-variant text-xs sm:text-sm font-medium hover:border-primary hover:text-primary transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="whitespace-nowrap px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-primary text-white text-xs sm:text-sm font-medium hover:bg-primary-dim transition-all shadow-[0_4px_14px_rgba(212,175,55,0.4)]"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-12 lg:pt-24 relative z-10 flex flex-col lg:flex-row items-center">
        {/* Left Column (Text & UI) */}
        <div className="w-full lg:w-1/2 pr-0 lg:pr-12 relative z-20 mt-10 lg:mt-0 order-2 lg:order-1">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl lg:text-7xl font-bold font-display leading-[1.1] tracking-tight mb-8"
          >
            The clarity you need
            <br />
            starts deep in
            <br />
            your supply chain.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-10"
          >
            <hr className="border-t-[1.5px] border-outline-variant/30 max-w-md my-4 flex items-center gap-2" />
            <p className="text-on-surface-variant text-lg max-w-md my-6">
              Edge AI powered tracking ensures your high-value shipments are
              monitored for vibration, impact, and safety at every single step.
            </p>
            <hr className="border-t-[1.5px] border-outline-variant/30 max-w-md my-4" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <button
              onClick={() => navigate("/track")}
              className="px-8 py-4 rounded-[2rem] bg-teal-800 text-white font-medium hover:bg-teal-900 transition-all shadow-lg flex items-center gap-2"
            >
              Track Shipment <ArrowRight size={18} />
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/signup")}
                className="w-14 h-14 rounded-full border border-outline-variant/50 flex items-center justify-center text-primary hover:bg-primary/5 transition-all"
              >
                <Search size={20} />
              </button>
              <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                Explore
              </span>
            </div>
          </motion.div>

          {/* Pagination dots (like the image) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex gap-3 mt-20"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-outline-variant/30"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-outline-variant/30"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-outline-variant/30"></div>
          </motion.div>
        </div>

        {/* Right Column (Hero Graphic) */}
        <div className="w-full lg:w-1/2 relative min-h-[500px] lg:min-h-[700px] flex justify-center items-center order-1 lg:order-2">
          {/* Abstract background shape (blob) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[90%] h-[110%] bg-[#FDF8EE] z-0"
            style={{
              borderRadius: "20% 80% 65% 35% / 25% 45% 55% 75%",
              border: "2px solid rgba(212, 175, 55, 0.1)",
            }}
          />

          {/* Image inside organic container */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-10 w-[300px] h-[400px] sm:w-[350px] sm:h-[450px] lg:w-[450px] lg:h-[550px] overflow-hidden shadow-2xl bg-white"
            style={{
              borderRadius: "35% 65% 50% 50% / 50% 50% 60% 40%",
            }}
          >
            <img
              src="https://images.pexels.com/photos/6169033/pexels-photo-6169033.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Logistics Professional"
              className="w-full h-full object-cover scale-105"
            />
          </motion.div>

          {/* Floating UI Elements matching reference (Keys, dots, lines) */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -left-4 sm:-left-10 z-20"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg border border-emerald-200">
              <Shield className="text-emerald-600" size={24} />
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-4 right-0"></div>
          </motion.div>

          <motion.div
            animate={{ y: [15, -15, 15] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-1/4 -right-2 sm:-right-8 z-20"
          >
            <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center shadow-lg border border-rose-200">
              <Key className="text-rose-500" size={28} />
            </div>
            <div className="w-3 h-3 rounded-full bg-amber-400 absolute bottom-0 -left-6"></div>
          </motion.div>

          <motion.div
            animate={{ x: [-10, 10, -10] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-10 sm:right-20 z-0 text-primary-dim/30 hidden sm:block"
          >
            <svg width="100" height="100" viewBox="0 0 100 100">
              <path
                d="M0 50 Q 25 25 50 50 T 100 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          </motion.div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 left-10 z-20 hidden sm:block"
          >
            <div className="w-3 h-3 rounded-full bg-primary drop-shadow-md"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
