/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        posTransitionLeft: {
          "0%": { top: "0px", left: "50px" },
          "100%": { top: "100px", left: "-100px" },
        },
        posTransitionRight: {
          "0%": { top: "0px", right: "50px" },
          "100%": { top: "100px", right: "-100px" },
        },
      },
      animation: {
        posTransitionLeft: "posTransitionLeft 2s ease-in-out",
        posTransitionRight: "posTransitionRight 2s ease-in-out",
      },
    },
  },
  plugins: [],
};
