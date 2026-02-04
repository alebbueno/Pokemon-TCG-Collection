/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: "#F6C453",
        secondary: "#F39C12",
        
        // Neutrals
        background: "#F8F6F2",
        surface: "#FFFFFF",
        divider: "#EAEAEA",
        
        // Text
        "text-primary": "#1C1C1C",
        "text-secondary": "#7A7A7A",
        
        // Feedback
        success: "#2ECC71",
        danger: "#E74C3C",
      },
      fontFamily: {
        inter: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "title-xl": ["28px", { lineHeight: "34px", fontWeight: "700" }],
        title: ["22px", { lineHeight: "28px", fontWeight: "600" }],
        subtitle: ["18px", { lineHeight: "24px", fontWeight: "500" }],
        body: ["16px", { lineHeight: "22px", fontWeight: "400" }],
        caption: ["13px", { lineHeight: "18px", fontWeight: "400" }],
      },
      borderRadius: {
        card: "14px",
        button: "12px",
        badge: "999px",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
