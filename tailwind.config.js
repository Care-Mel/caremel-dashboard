/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sofia: ["Sofia Pro"],
      },
      fontSize: {
        header: ["28px"],
        body: ["18px"],
        cardheader: ["22px"],
        cardbody: ["14px"],
      },
      colors: {
        primary: "#3DBB47", // Custom primary color
        secondary: "#2EA14A", // Custom secondary color
        header: "#121212",
        hihglight: "#154119",
        sub: "#F5F5F5",
        footer: "#1C1C1C",
        delete: "#E60000",
        // Add more custom colors as needed
      },
    },

    // screens: {
    //   sm: "576px",
    //   // => @media (min-width: 576px) { ... }

    //   md: "960px",
    //   // => @media (min-width: 960px) { ... }

    //   lg: "1440px",
    //   // => @media (min-width: 1440px) { ... }
    // },
  },
  plugins: [],
};
