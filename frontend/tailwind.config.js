/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        anton: ['"Anton"', 'sans-serif'],
        barlow: ['"Barlow"', 'sans-serif'],
        oswald: ['"Oswald"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
        montserrat: ['"Montserrat"', 'sans-serif'],
        poppins: ['"Poppins"', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
      },
      colors: {
        border: "rgba(255, 255, 255, 0.2)",
        input: "rgba(255, 255, 255, 0.1)",
        ring: "#4158D0",
        background: "transparent",
        foreground: "#1F2937",
        primary: {
          DEFAULT: "#4158D0",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#7DD3FC",
          foreground: "#1F2937",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "rgba(255, 255, 255, 0.7)",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "#4C1D95",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "rgba(255, 255, 255, 0.95)",
          foreground: "#1F2937",
        },
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.95)",
          foreground: "#1F2937",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "calc(1rem - 2px)",
        sm: "calc(1rem - 4px)",
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(79, 70, 229, 0.3), 0 0 10px rgba(79, 70, 229, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(79, 70, 229, 0.6), 0 0 30px rgba(79, 70, 229, 0.4)' },
          '100%': { boxShadow: '0 0 5px rgba(79, 70, 229, 0.3), 0 0 10px rgba(79, 70, 229, 0.2)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out both',
        glow: 'glow 2s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}