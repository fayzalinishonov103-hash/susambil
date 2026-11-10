module.exports = {
  content: ["./templates/**/*.html"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0f0c",
        paper: "#fbfaf5",
        sand: "#f1eee3",
        line: "#e7e2d4",
        brand: { DEFAULT: "#1fc45e", strong: "#0d8f40", soft: "#e4f8ea" },
      },
      fontFamily: {
        display: ["Montserrat", "Noto Sans", "Noto Sans Arabic", "system-ui", "sans-serif"],
        body: ["Inter", "Noto Sans", "Noto Sans Arabic", "system-ui", "sans-serif"],
      },
    },
  },
};
