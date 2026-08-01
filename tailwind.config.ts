import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-green": "#3F9142",
        "electric-blue": "#0078D4",
        "electric-blue-hover": "#006CBE",
        "sunset-orange": "#FF6B00",
        emerald: "#10B981",
        amber: "#FF9900",
        coral: "#FF6B6B",
        "neutral-900": "#101828",
        "neutral-700": "#344054",
        "neutral-600": "#475467",
        "neutral-500": "#667085",
        "neutral-400": "#98A2B3",
        "neutral-300": "#D0D5DD",
        "neutral-200": "#EAECF0",
        "neutral-100": "#F0F2F5",
        "neutral-50": "#F9FAFB",
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["3rem", { lineHeight: "1.1", fontWeight: "700" }],
        "display-lg": ["2.25rem", { lineHeight: "1.15", fontWeight: "700" }],
        "display-md": ["1.75rem", { lineHeight: "1.2", fontWeight: "600" }],
        "display-sm": ["1.375rem", { lineHeight: "1.25", fontWeight: "600" }],
        "display-xs": ["1.125rem", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.5", fontWeight: "400" }],
        "body-md": ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        "body-xs": ["0.8125rem", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["0.6875rem", { lineHeight: "1.4", fontWeight: "400" }],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "28px",
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(0,120,212,0.3)",
        "glow-green": "0 0 20px rgba(63,145,66,0.3)",
        "glow-orange": "0 0 20px rgba(255,107,0,0.3)",
        card: "0 1px 3px rgba(16,24,40,0.06), 0 1px 2px rgba(16,24,40,0.04)",
        "card-hover": "0 4px 12px rgba(16,24,40,0.08), 0 2px 4px rgba(16,24,40,0.04)",
      },
      animation: {
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
