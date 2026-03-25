/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cybernetic Vanguard — Primary Palette
        primary: "#00D9FF",
        "primary-dim": "#00B4D8",
        "primary-container": "#005B6C",
        secondary: "#7C3AED",
        "secondary-dim": "#6001D1",
        "secondary-container": "#D2BBFF",
        tertiary: "#F97316",
        "tertiary-dim": "#FFB690",

        // Semantic Colors
        safe: "#10B981",
        minor: "#F59E0B",
        severe: "#EF4444",
        error: "#FFB4AB",

        // Surface System (Deep Obsidian)
        surface: {
          DEFAULT: "#0E1322",
          dim: "#0E1322",
          bright: "#343949",
          container: "#1A1F2F",
          "container-low": "#161B2B",
          "container-high": "#25293A",
          "container-highest": "#2F3445",
          "container-lowest": "#090E1C",
        },
        "on-surface": "#DEE1F7",
        "on-surface-variant": "#BBC9CE",
        outline: "#859398",
        "outline-variant": "#3C494D",
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
            boxShadow: "0 0 20px rgba(0, 217, 255, 0.4)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 40px rgba(0, 217, 255, 0.7)",
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
            boxShadow: "0 0 20px rgba(0, 217, 255, 0.15), 0 0 40px rgba(0, 217, 255, 0.05)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(0, 217, 255, 0.3), 0 0 60px rgba(0, 217, 255, 0.1)",
          },
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #00D9FF, #7C3AED)",
        "gradient-hero": "linear-gradient(135deg, #00D9FF, #00B4D8, #7C3AED)",
        "gradient-surface": "linear-gradient(135deg, rgba(0, 217, 255, 0.05), rgba(124, 58, 237, 0.05))",
        "gradient-glass": "linear-gradient(135deg, rgba(52, 57, 73, 0.4), rgba(14, 19, 34, 0.8))",
      },
      backdropBlur: {
        "glass": "24px",
      },
      boxShadow: {
        "glow": "0 0 20px rgba(0, 217, 255, 0.3), 0 0 40px rgba(0, 217, 255, 0.1)",
        "glow-lg": "0 0 30px rgba(0, 217, 255, 0.4), 0 0 60px rgba(0, 217, 255, 0.15)",
        "glow-violet": "0 0 20px rgba(124, 58, 237, 0.3), 0 0 40px rgba(124, 58, 237, 0.1)",
        "glow-amber": "0 0 20px rgba(249, 115, 22, 0.3), 0 0 40px rgba(249, 115, 22, 0.1)",
      },
    },
  },
  plugins: [],
};
