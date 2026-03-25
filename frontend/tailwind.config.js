/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Modern Premium — Primary Palette (Golden Theme)
        primary: "#D4AF37", // Light Gold
        "primary-dim": "#C9A227", // Accent Gold
        "primary-container": "#FBF8F1", // Very Light Gold for backgrounds
        
        secondary: "#E6C76E", // Soft Gold
        "secondary-dim": "#D4B351",
        "secondary-container": "#FDFBF5",

        tertiary: "#1A1A1A", // Dark Text
        "tertiary-dim": "#4B5563", // Gray matching Secondary Text
        
        // Semantic Colors
        safe: "#10B981", // emerald-500
        minor: "#F59E0B", // amber-500
        severe: "#EF4444", // red-500
        error: "#FCA5A5", // red-300

        // Surface System (Light Premium)
        surface: {
          DEFAULT: "#FAFAFA", // Light Background
          dim: "#F3F4F6", // Gray-100
          bright: "#FFFFFF", // White
          container: "#FFFFFF",
          "container-low": "#FAFAFA",
          "container-high": "#F9FAFB",
          "container-highest": "#F3F4F6",
          "container-lowest": "#FFFFFF",
        },
        "on-surface": "#1A1A1A", // Primary text
        "on-surface-variant": "#6B7280", // Secondary text (muted gray)
        outline: "#E5E7EB", // gray-200
        "outline-variant": "#D1D5DB", // gray-300
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
        display: ["Poppins", "Inter", "sans-serif"],
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
            boxShadow: "0 0 20px rgba(212, 175, 55, 0.2)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 40px rgba(212, 175, 55, 0.4)",
          },
        },
        "slide-in": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
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
            boxShadow: "0 4px 15px rgba(212, 175, 55, 0.15)",
          },
          "50%": {
            boxShadow: "0 8px 25px rgba(212, 175, 55, 0.3)",
          },
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #D4AF37, #E6C76E)",
        "gradient-secondary": "linear-gradient(135deg, #E6C76E, #C9A227)",
        "gradient-hero": "linear-gradient(135deg, #FAFAFA, #FEFCF6, #FFF9EB)",
        "gradient-surface": "linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(250, 250, 250, 0.9))",
      },
      backdropBlur: {
        "glass": "16px",
      },
      boxShadow: {
        "glow": "0 10px 30px rgba(0, 0, 0, 0.05)",
        "glow-lg": "0 20px 40px rgba(0, 0, 0, 0.08)",
        "glow-gold": "0 10px 25px rgba(212, 175, 55, 0.2)",
      },
    },
  },
  plugins: [],
};
