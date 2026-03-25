import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Package, ArrowLeft, Mail, Lock, Shield, Key } from "lucide-react";
import { signin } from "../services/api";
import { setAuthState } from "../services/authStorage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await signin({ email, password });

      if (response.data.success) {
        setAuthState({
          token: response.data.token,
          user: response.data.user,
        });

        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex overflow-hidden font-sans">
      {/* Left Graphic Side - Hidden on Mobile */}
      <div className="hidden lg:flex w-1/2 relative bg-[#FDF8EE] justify-center items-center">
        {/* Abstract background shape */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute right-10 top-1/2 -translate-y-1/2 w-[80%] h-[90%] bg-surface z-0 shadow-sm"
          style={{
            borderRadius: '20% 80% 65% 35% / 25% 45% 55% 75%',
            border: '1px solid rgba(212, 175, 55, 0.1)',
          }}
        />

        {/* Image inside organic container */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 w-[400px] h-[500px] overflow-hidden shadow-2xl bg-white"
          style={{
            borderRadius: '40% 60% 50% 50% / 50% 50% 60% 40%',
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=1000&auto=format&fit=crop" 
            alt="Logistics Technology" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </motion.div>

        {/* Floating UI Elements */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-20 z-20"
        >
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg border border-emerald-200">
            <Shield className="text-emerald-600" size={24} />
          </div>
        </motion.div>
          
        <motion.div
          animate={{ y: [15, -15, 15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 right-1/4 z-20"
        >
          <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center shadow-lg border border-rose-200">
            <Key className="text-rose-500" size={28} />
          </div>
        </motion.div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative z-10 bg-surface">
        <button
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 btn-secondary flex items-center gap-2 text-sm tracking-wide"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 text-primary font-bold text-xl font-display mb-12">
            <Package className="text-primary" />
            <span>IntelliShip</span>
          </div>

          <h2 className="text-4xl font-display font-bold mb-3 tracking-tight">Welcome Back</h2>
          <p className="text-on-surface-variant mb-10 text-lg">Sign in to your seller account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="text-sm font-semibold mb-2 text-on-surface-variant flex items-center gap-2 tracking-wide uppercase">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seller@company.com"
                  className="w-full px-4 py-3 bg-white border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  required
                />
                <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 text-on-surface-variant flex items-center gap-2 tracking-wide uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  required
                />
                <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary-dim transition-all shadow-[0_4px_14px_rgba(212,175,55,0.4)] disabled:opacity-60 disabled:shadow-none min-h-[56px]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} className="ml-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-on-surface-variant">
            <p>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:text-primary-dim font-bold transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
