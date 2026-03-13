/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1B5CA8",
        secondary: "#FF6B00",
        accent: "#000000",
        "comic-white": "#EEF4FF",
      },
      fontFamily: {
        display: ["Bangers", "cursive"],
        marker: ["'Permanent Marker'", "cursive"],
        body: ["Inter", "sans-serif"],
      },
      borderWidth: {
        3: "3px",
        4: "4px",
        6: "6px",
      },
      boxShadow: {
        comic: "6px 6px 0px #000",
        "comic-hover": "8px 8px 0px #000",
        "comic-btn": "4px 4px 0px #000",
        "comic-btn-hover": "6px 6px 0px #000",
        "comic-blue": "10px 10px 0px #1B5CA8",
      },
    },
  },
  plugins: [],
};
