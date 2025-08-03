module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-up": "fadeUp 1s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        fadeUp: {
          from: { opacity: 0, transform: "translateY(40px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
};
