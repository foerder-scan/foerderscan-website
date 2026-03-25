import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B4F72",
          50: "#EBF5FB",
          100: "#D6EAF8",
          200: "#AED6F1",
          300: "#85C1E9",
          400: "#5DADE2",
          500: "#2E86C1",
          600: "#1B6FA8",
          700: "#1B4F72",
          800: "#154360",
          900: "#0D2B3E",
        },
        secondary: {
          DEFAULT: "#2E86C1",
        },
        accent: {
          DEFAULT: "#27AE60",
          50: "#EAFAF1",
          100: "#D5F5E3",
          500: "#27AE60",
          600: "#1E8449",
        },
        surface: {
          DEFAULT: "#F8FAFC",
          50: "#FFFFFF",
          100: "#F8FAFC",
          200: "#F1F5F9",
          300: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "6xl": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "7xl": ["4.5rem", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)",
        "card-hover":
          "0 10px 25px -5px rgba(27,79,114,0.12), 0 4px 10px -6px rgba(27,79,114,0.08)",
        nav: "0 1px 0 0 rgba(0,0,0,0.06)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out both",
        "fade-in": "fadeIn 0.4s ease-out both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
