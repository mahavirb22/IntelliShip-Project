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
      color: "bg-safe/20 border-safe text-safe",
    },
    error: {
      icon: AlertCircle,
      color: "bg-severe/20 border-severe text-severe",
    },
    warning: {
      icon: AlertCircle,
      color: "bg-minor/20 border-minor text-minor",
    },
  };

  const { icon: Icon, color } = config[type] || config.success;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 z-50 glass-card ${color} border-2 flex items-center gap-3 min-w-[300px] max-w-md`}
    >
      <Icon size={24} />
      <p className="flex-1 font-medium">{message}</p>
      <button onClick={onClose} className="hover:opacity-70 transition-opacity">
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
