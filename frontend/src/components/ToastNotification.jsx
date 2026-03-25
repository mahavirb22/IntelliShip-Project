import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X } from "lucide-react";

const ToastNotification = ({ message, type = "success", onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      color: "bg-white border-safe/30 text-emerald-700 shadow-xl shadow-safe/10",
    },
    error: {
      icon: AlertCircle,
      color: "bg-white border-severe/30 text-red-700 shadow-xl shadow-severe/10",
    },
    warning: {
      icon: AlertCircle,
      color: "bg-white border-minor/30 text-amber-700 shadow-xl shadow-minor/10",
    },
  };

  const { icon: Icon, color } = config[type] || config.success;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 z-50 rounded-xl ${color} border flex items-center gap-3 min-w-[300px] max-w-md px-4 py-3`}
    >
      <Icon size={24} className={type === "success" ? "text-safe" : type === "error" ? "text-severe" : "text-minor"} />
      <p className="flex-1 font-medium">{message}</p>
      <button onClick={onClose} className="hover:opacity-70 text-gray-400 hover:text-gray-900 transition-opacity">
        <X size={20} />
      </button>
    </motion.div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <AnimatePresence>
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </AnimatePresence>
  );
};

export default ToastContainer;
