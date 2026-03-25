import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  Package,
  ArrowLeft,
  ArrowRight,
  Zap,
  CheckCircle,
} from "lucide-react";
import { signup } from "../services/api";
import { setAuthState } from "../services/authStorage";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        company: formData.company,
        phone: formData.phone,
      });

      if (response.data.success) {
        setAuthState({
          token: response.data.token,
          user: response.data.user,
        });

        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex overflow-hidden font-sans">
      {/* Right Graphic Side - Hidden on Mobile (Swapped for signup variant) */}
      <div className="hidden lg:flex w-5/12 relative bg-[#FDF8EE] justify-center items-center order-2">
        {/* Abstract background shape */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute left-10 top-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-surface z-0 shadow-sm"
          style={{
            borderRadius: '30% 70% 50% 50% / 50% 50% 60% 40%',
            border: '1px solid rgba(212, 175, 55, 0.1)',
          }}
        />

        {/* Image inside organic container */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 w-[350px] h-[500px] overflow-hidden shadow-2xl bg-white"
          style={{
            borderRadius: '40% 60% 50% 50% / 50% 50% 60% 40%',
          }}
        >
          <img 
            src="https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=800" 
            alt="Logistics Technology" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </motion.div>

        {/* Floating UI Elements */}
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-20 z-20"
        >
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center shadow-lg border border-amber-200">
            <Zap className="text-amber-500" size={28} />
          </div>
        </motion.div>
          
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 left-1/4 z-20"
        >
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg border border-emerald-200">
            <CheckCircle className="text-emerald-600" size={24} />
          </div>
        </motion.div>
      </div>

      {/* Left Form Side */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 lg:p-12 xl:p-24 relative z-10 bg-surface order-1">
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
          className="w-full max-w-2xl"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2 text-primary font-bold text-xl font-display">
              <Package className="text-primary" />
              <span>IntelliShip</span>
            </div>
            <div className="text-sm font-medium text-on-surface-variant">
              Already a seller? <Link to="/login" className="text-primary hover:text-primary-dim ml-1 font-bold">Sign In</Link>
            </div>
          </div>

          <h2 className="text-4xl font-display font-bold mb-3 tracking-tight">Create your account</h2>
          <p className="text-on-surface-variant mb-12 text-lg">Join IntelliShip and secure your supply chain today.</p>

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

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold mb-2 text-on-surface-variant block uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-white border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold mb-2 text-on-surface-variant block uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seller@company.com"
                  className="w-full px-4 py-3 bg-white border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold mb-2 text-on-surface-variant block uppercase tracking-wider">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="ABC Logistics"
                  className="w-full px-4 py-3 bg-white border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold mb-2 text-on-surface-variant block uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-3 bg-white border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold mb-2 text-on-surface-variant block uppercase tracking-wider">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="text-xs font-semibold mb-2 text-on-surface-variant block uppercase tracking-wider">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  required
                />
              </div>
            </div>

            <hr className="border-t border-outline-variant/20 my-6" />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary-dim transition-all shadow-[0_4px_14px_rgba(212,175,55,0.4)] disabled:opacity-60 disabled:shadow-none min-h-[56px]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} className="ml-1" />
                </>
              )}
            </button>
          </form>
          <p className="mt-8 text-xs text-on-surface-variant text-center max-w-sm mx-auto leading-relaxed">
            By creating an account, you agree to our Terms of Service and Privacy Policy. Secure infrastructure provided by IntelliShip Edge AI.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
