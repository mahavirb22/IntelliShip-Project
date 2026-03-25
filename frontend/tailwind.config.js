/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Modern Premium — Primary Palette
        primary: "#4287f5",
        "primary-dim": "#2563eb",
        "primary-container": "#1e40af",
        secondary: "#8b5cf6",
        "secondary-dim": "#6d28d9",
        "secondary-container": "#4c1d95",
        tertiary: "#f43f5e",
        "tertiary-dim": "#e11d48",

        // Semantic Colors
        safe: "#10b981", // emerald-500
        minor: "#f59e0b", // amber-500
        severe: "#ef4444", // red-500
        error: "#fca5a5", // red-300

        // Surface System (Slate Premium)
        surface: {
          DEFAULT: "#0f172a", // slate-900
          dim: "#020617", // slate-950
          bright: "#1e293b", // slate-800
          container: "#0f172a",
          "container-low": "#020617",
          "container-high": "#1e293b",
          "container-highest": "#334155", // slate-700
          "container-lowest": "#000000",
        },
        "on-surface": "#f8fafc", // slate-50
        "on-surface-variant": "#94a3b8", // slate-400
        outline: "#475569", // slate-600
        "outline-variant": "#334155", // slate-700
      },
      fontFamily: {
        sans: ["Inter", "Manrope", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-in": "slide-in 0.3s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "gradient-shift": "gradient-shift 4s ease infinite",
        "shimmer": "shimmer 2s infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 20px rgba(66, 135, 245, 0.3)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 40px rgba(66, 135, 245, 0.6)",
          },
        },
        "slide-in": {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(66, 135, 245, 0.15), 0 0 40px rgba(139, 92, 246, 0.05)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(66, 135, 245, 0.3), 0 0 60px rgba(139, 92, 246, 0.1)",
          },
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #4287f5, #8b5cf6)",
        "gradient-hero": "linear-gradient(135deg, #4287f5, #3b82f6, #8b5cf6)",
        "gradient-surface": "linear-gradient(135deg, rgba(66, 135, 245, 0.05), rgba(139, 92, 246, 0.05))",
        "gradient-glass": "linear-gradient(135deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.8))",
      },
      backdropBlur: {
        "glass": "24px",
      },
      boxShadow: {
        "glow": "0 0 20px rgba(66, 135, 245, 0.3), 0 0 40px rgba(66, 135, 245, 0.1)",
        "glow-lg": "0 0 30px rgba(66, 135, 245, 0.4), 0 0 60px rgba(66, 135, 245, 0.15)",
        "glow-violet": "0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)",
        "glow-amber": "0 0 20px rgba(245, 158, 11, 0.3), 0 0 40px rgba(245, 158, 11, 0.1)",
      },
    },
  },
  plugins: [],
};
