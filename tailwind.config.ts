import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        "primary-green": "#16A34A",
        "electric-blue": "#0EA5E9",
        "sunset-orange": "#F97316",
        coral: "#EF4444",
        gold: "#F59E0B",
        amber: "#F59E0B",
        emerald: "#10B981",
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontSize: {
        "display-md": ["28px", { lineHeight: "36px" }],
        "display-sm": ["22px", { lineHeight: "30px" }],
        "display-xs": ["18px", { lineHeight: "26px" }],
        "body-lg": ["18px", { lineHeight: "26px" }],
        "body-sm": ["15px", { lineHeight: "22px" }],
        caption: ["12px", { lineHeight: "18px" }],
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "28px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(17, 24, 39, 0.06), 0 1px 2px rgba(17, 24, 39, 0.04)",
        "card-hover": "0 8px 24px rgba(17, 24, 39, 0.10)",
        "glow-green": "0 0 24px rgba(22, 163, 74, 0.35)",
        "glow-blue": "0 0 24px rgba(14, 165, 233, 0.35)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;