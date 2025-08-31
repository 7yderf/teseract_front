/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("shared/tailwind.config.js")],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        bg: "var(--bg-color)",
        bgSecond: "var(--bg-second-color)",
        text: "var(--text-color)",
        textCustom: "var(--text-custom)",
        textInvert: "var(--text-invert)",
        success: "var(--success-color)",
        error: "var(--error-color)",
        warning: "var(--warning-color)",
      },
      fontFamily: {
        primary: ["var(--primary-font)"],
        secondary: ["var(--secondary-font)"],
      },
      screens: {
        "xs-2": "320px", // teléfono muy pequeño
        xs: "375px", // teléfono estándar
        sm: "535px", // phablet / teléfono grande
        md: "768px", // tablet vertical
        "lg-2": "991px", // tablet horizontal / laptop chica
        lg: "1024px", // laptop mediana
        xl: "1200px", // laptop grande
        "2xl": "1536px", // desktop grande
      },
    },
  },
  content: [
    "./components/**/*.{html,tsx}",
    "./layouts/**/*.{ts,tsx}",
    "./views/**/*.{ts,tsx}",
  ],
};
