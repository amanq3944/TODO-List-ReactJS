module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      scrollBehavior: {
        smooth: 'smooth',
      },
    },
  },
  variants: {
    extend: {
      scrollBehavior: ['responsive'],
    },
  },
  plugins: [],
};
