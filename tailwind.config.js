/** @type {import('tailwindcss').Config} */



/** @type {import('tailwindcss').Config} */
// tailwind.config.js

module.exports = {
  content: ["./screens/**/*.{js,jsx,ts,tsx}", "./comps/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        HindRegular: ['HindSiliguri-Regular'],
        HindSemiBold: ['HindSiliguri-SemiBold'],
        HindMedium: ['HindSiliguri-Medium'],
        HindLight: ['HindSiliguri-Light'],
        HindBold: ['HindSiliguri-Bold'],
        SutonnyBold: ['SutonnyOMJ'],
        Tiro: ['TiroBangla-Regular'],
        Kalpana: ['Kalpana UNICODE'],
      },
    },
  },
    plugins: [],
  }

  
