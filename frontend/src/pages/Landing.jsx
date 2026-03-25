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
      color: "from-amber-400 to-orange-500",
      glow: "shadow-glow-amber",
    },
    {
      icon: Shield,
      title: "Damage Prevention",
      description: "Immediate alerts for vibrations and impacts during transit",
      color: "from-emerald-400 to-teal-500",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Comprehensive insights into your logistics operations",
      color: "from-primary to-secondary",
      glow: "shadow-glow",
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
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-primary/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-3xl"
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
          <h1 className="text-2xl font-bold font-display gradient-text">
            IntelliShip
          </h1>
          <p className="text-xs text-on-surface-variant">AI Logistics Platform</p>
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
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-3xl backdrop-blur-sm border border-primary/20">
                <Package
                  size={80}
                  className="text-primary drop-shadow-[0_0_15px_rgba(0,217,255,0.5)]"
                />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 font-display gradient-text-hero"
          >
            Real-Time AI Logistics
            <br />
            <span className="inline-flex items-center gap-3">
              Monitoring{" "}
              <Sparkles className="text-tertiary animate-pulse" size={40} />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-on-surface-variant mb-12 max-w-3xl mx-auto"
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
            <div className="glass-card p-8 border border-primary/20">
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2 font-display">
                <Search className="text-primary" />
                Track Your Shipment
              </h3>
              <p className="text-on-surface-variant mb-6 text-sm">
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
              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-on-surface-variant/60">
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
              className="btn-primary text-lg px-8 py-4 shadow-glow"
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
          className="text-4xl md:text-5xl font-bold text-center mb-16 font-display gradient-text"
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
              className="glass-card text-center group cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`bg-gradient-to-br ${feature.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
              >
                <feature.icon size={40} className="text-white" />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 font-display group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-on-surface-variant">{feature.description}</p>
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
          className="text-4xl md:text-5xl font-bold text-center mb-16 font-display gradient-text"
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
                className="glass-card"
              >
                <div className="text-6xl font-bold gradient-text mb-4 font-display">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold mb-2 font-display">{step.title}</h3>
                <p className="text-on-surface-variant">{step.description}</p>
              </motion.div>
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="hidden md:block absolute top-1/2 -right-4 transform translate-x-full -translate-y-1/2"
                >
                  <ArrowRight size={32} className="text-primary/40" />
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
          className="glass-card border border-primary/20"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center py-8">
            <div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="text-5xl font-bold mb-2 font-display"
                style={{
                  background: "linear-gradient(135deg, #00D9FF, #00B4D8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                99.9%
              </motion.div>
              <p className="text-on-surface-variant">Uptime Guarantee</p>
            </div>
            <div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-5xl font-bold mb-2 font-display gradient-text"
              >
                &lt;100ms
              </motion.div>
              <p className="text-on-surface-variant">Response Time</p>
            </div>
            <div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold mb-2 font-display"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #D2BBFF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                24/7
              </motion.div>
              <p className="text-on-surface-variant">Real-Time Monitoring</p>
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
          className="glass-card text-center py-16 max-w-4xl mx-auto border border-primary/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display gradient-text">
              Ready to Transform Your Logistics?
            </h2>
            <p className="text-xl text-on-surface-variant mb-8">
              Join leading companies using AI-powered shipment monitoring
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="btn-primary text-lg px-12 py-4 shadow-glow-lg"
            >
              Start Free Trial <ArrowRight className="inline ml-2" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-on-surface-variant border-t border-outline-variant/20 mt-20 relative z-10">
        <div className="mb-4">
          <h3 className="text-2xl font-bold font-display gradient-text mb-2">
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
