import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Search,
  QrCode,
  Sparkles,
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState("");

  const handleTrackShipment = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/track?shipmentId=${encodeURIComponent(trackingId.trim())}`);
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Real-Time Monitoring",
      description:
        "Track shipment integrity with millisecond precision using Edge AI sensors",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: Shield,
      title: "Damage Prevention",
      description: "Immediate alerts for vibrations and impacts during transit",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Comprehensive insights into your logistics operations",
      color: "from-blue-400 to-purple-500",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Device Detects",
      description: "Edge AI sensors monitor vibrations",
    },
    {
      number: "02",
      title: "Instant Alert",
      description: "Events sent to cloud in real-time",
    },
    {
      number: "03",
      title: "You Track",
      description: "View timeline on web dashboard",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-card mx-4 mt-4 mb-8 flex justify-between items-center px-8 py-4 relative z-10"
      >
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            IntelliShip
          </h1>
          <p className="text-xs text-gray-400">AI Logistics Platform</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate("/signup")} className="btn-secondary">
            Sign Up
          </button>
          <button onClick={() => navigate("/login")} className="btn-primary">
            Seller Login
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              y: [0, -10, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-primary/20 to-purple-500/20 p-8 rounded-3xl backdrop-blur-sm border border-primary/30">
                <Package
                  size={80}
                  className="text-primary drop-shadow-[0_0_15px_rgba(66,135,245,0.5)]"
                />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-primary to-purple-500"
          >
            Real-Time AI Logistics
            <br />
            <span className="inline-flex items-center gap-3">
              Monitoring{" "}
              <Sparkles className="text-yellow-400 animate-pulse" size={40} />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Edge AI powered shipment integrity tracking for modern supply
            chains. Monitor every vibration, every impact, in real-time.
          </motion.p>

          {/* Track Shipment Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="glass-card p-8 border-2 border-primary/30">
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                <Search className="text-primary" />
                Track Your Shipment
              </h3>
              <p className="text-gray-400 mb-6 text-sm">
                Enter your shipment ID or scan the QR code from your package
              </p>
              <form onSubmit={handleTrackShipment} className="flex gap-3">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Shipment ID (e.g., ISP1234567890ABCDE)"
                  className="input-field flex-1 text-center font-mono"
                />
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2 px-8"
                >
                  <Search size={20} />
                  Track
                </button>
              </form>
              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <QrCode size={16} />
                  <span>Or scan QR code on package</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => navigate("/signup")}
              className="btn-primary text-lg px-8 py-4 shadow-lg shadow-primary/50"
            >
              Get Started <ArrowRight className="inline ml-2" size={20} />
            </button>
            <button
              onClick={() => navigate("/track/demo")}
              className="btn-secondary text-lg px-8 py-4"
            >
              View Demo
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
        >
          Why Choose IntelliShip?
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card text-center group cursor-pointer border border-white/10 hover:border-primary/50 transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`bg-gradient-to-br ${feature.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
              >
                <feature.icon size={40} className="text-white" />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
        >
          How It Works
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-card border border-white/10 hover:border-primary/50 transition-all duration-300"
              >
                <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary/50 to-purple-500/50 mb-4">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="hidden md:block absolute top-1/2 -right-4 transform translate-x-full -translate-y-1/2"
                >
                  <ArrowRight size={32} className="text-primary/50" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card border-2 border-primary/30"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center py-8">
            <div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-primary mb-2"
              >
                99.9%
              </motion.div>
              <p className="text-gray-400">Uptime Guarantee</p>
            </div>
            <div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-2"
              >
                &lt;100ms
              </motion.div>
              <p className="text-gray-400">Response Time</p>
            </div>
            <div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-2"
              >
                24/7
              </motion.div>
              <p className="text-gray-400">Real-Time Monitoring</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card text-center py-16 max-w-4xl mx-auto border-2 border-primary/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Ready to Transform Your Logistics?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join leading companies using AI-powered shipment monitoring
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="btn-primary text-lg px-12 py-4 shadow-2xl shadow-primary/50"
            >
              Start Free Trial <ArrowRight className="inline ml-2" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400 border-t border-white/10 mt-20 relative z-10">
        <div className="mb-4">
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            IntelliShip
          </h3>
          <p className="text-sm">Edge AI Smart Logistics Platform</p>
        </div>
        <p className="text-sm">&copy; 2026 IntelliShip. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
