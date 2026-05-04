module.exports = {
  darkMode: "class", // 👈 important
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // LIGHT
        background: "#ffffff",
        foreground: "#0f172a",
        primary: "#00829b",
        secondary: "#ecfcff",
        border: "#e4e7ec",

        // DARK
        "background-dark": "#111827",
        "foreground-dark": "#f9fafb",
        "border-dark": "#393a3c",
      },
    },
  },
};