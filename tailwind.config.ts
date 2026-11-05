import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        foreground: "var(--text)",
        card: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text)",
        },
        popover: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        muted: {
          DEFAULT: "var(--surface-2)",
          foreground: "var(--text-muted)",
        },
        subtle: "var(--text-subtle)",
        primary: {
          DEFAULT: "rgb(var(--primary-rgb) / <alpha-value>)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-fg)",
        },
        success: "rgb(var(--success-rgb) / <alpha-value>)",
        warning: "rgb(var(--warning-rgb) / <alpha-value>)",
        destructive: "rgb(var(--danger-rgb) / <alpha-value>)",
        info: "rgb(var(--info-rgb) / <alpha-value>)",
        ring: "var(--primary)",
        // AeroLink brand palette
        golden: {
          50:  "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          DEFAULT: "#FFBD24",
          500: "#FFBD24",
          600: "#E6AE22",
          700: "#B45309",
        },
        cream: {
          DEFAULT: "#FAF9F6",
          50:  "#FAF9F6",
          100: "#F5F2EA",
          200: "#EDE8DC",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        display: ["2.25rem", { lineHeight: "1.15", fontWeight: "600" }],
        "heading-1": ["1.75rem", { lineHeight: "1.2", fontWeight: "600" }],
        "heading-2": ["1.375rem", { lineHeight: "1.3", fontWeight: "600" }],
        "heading-3": ["1.125rem", { lineHeight: "1.35", fontWeight: "600" }],
        body: ["0.9375rem", { lineHeight: "1.55", fontWeight: "400" }],
        label: ["0.875rem", { lineHeight: "1.4", fontWeight: "500" }],
        caption: ["0.8125rem", { lineHeight: "1.4", fontWeight: "400" }],
      },
      borderRadius: {
        control: "var(--radius-sm)",
        panel: "var(--radius-md)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "fade-in-up": "fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "float": "float 5s ease-in-out infinite",
        "radar-sweep": "radarSweep 4s linear infinite",
        "radar-ping": "radarPing 2.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        "spin-slow": "spin 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        radarPing: {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "70%, 100%": { transform: "scale(2.2)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
