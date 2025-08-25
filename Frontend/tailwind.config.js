/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "hsl(217, 91%, 97%)",
          100: "hsl(217, 91%, 93%)",
          200: "hsl(217, 91%, 85%)",
          300: "hsl(217, 91%, 75%)",
          400: "hsl(217, 91%, 65%)",
          500: "hsl(217, 91%, 60%)",
          600: "hsl(217, 91%, 50%)",
          700: "hsl(217, 91%, 45%)",
          800: "hsl(217, 91%, 35%)",
          900: "hsl(217, 91%, 25%)",
          950: "hsl(217, 91%, 15%)",
        },
        accent: {
          50: "hsl(45, 93%, 97%)",
          100: "hsl(45, 93%, 92%)",
          200: "hsl(45, 93%, 82%)",
          300: "hsl(45, 93%, 72%)",
          400: "hsl(45, 93%, 62%)",
          500: "hsl(45, 93%, 47%)",
          600: "hsl(45, 93%, 42%)",
          700: "hsl(45, 93%, 32%)",
          800: "hsl(45, 93%, 27%)",
          900: "hsl(45, 93%, 22%)",
          950: "hsl(45, 93%, 12%)",
        },
        success: {
          50: "hsl(142, 71%, 97%)",
          500: "hsl(142, 71%, 45%)",
          600: "hsl(142, 71%, 40%)",
        },
        warning: {
          50: "hsl(38, 92%, 97%)",
          500: "hsl(38, 92%, 50%)",
          600: "hsl(38, 92%, 45%)",
        },
        error: {
          50: "hsl(0, 72%, 97%)",
          500: "hsl(0, 72%, 51%)",
          600: "hsl(0, 72%, 46%)",
        },
        gray: {
          50: "hsl(210, 40%, 98%)",
          100: "hsl(210, 40%, 94%)",
          200: "hsl(214, 32%, 91%)",
          300: "hsl(213, 27%, 84%)",
          400: "hsl(215, 20%, 65%)",
          500: "hsl(215, 16%, 47%)",
          600: "hsl(215, 19%, 35%)",
          700: "hsl(215, 25%, 27%)",
          800: "hsl(217, 33%, 17%)",
          900: "hsl(224, 71%, 4%)",
          950: "hsl(224, 71%, 2%)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Cal Sans", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "bounce-in": "bounceIn 0.6s ease-out",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        medium:
          "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.04)",
        large:
          "0 10px 50px -10px rgba(0, 0, 0, 0.15), 0 30px 60px -30px rgba(0, 0, 0, 0.1)",
        colored: "0 8px 30px -5px rgba(59, 130, 246, 0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
