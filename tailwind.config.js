/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          emerald: {
            DEFAULT: '#124C3A',
            50: '#F2F8F5',
            100: '#E1EFEA',
            200: '#C2DFD5',
            600: '#1B6A52',
            700: '#165743',
            800: '#124C3A',
            900: '#0B3327',
            950: '#072018',
          },
          sand: {
            DEFAULT: '#E9DCC5',
            50: '#FAF8F4',
            100: '#F5EFE5',
            200: '#E9DCC5',
            300: '#DCBFA1',
            400: '#CBB285',
            800: '#645437',
            900: '#3D3320',
          },
          gold: {
            DEFAULT: '#C8A66A',
            50: '#FBF8F2',
            100: '#F6EFE2',
            200: '#ECCFA0',
            400: '#DAB87E',
            500: '#C8A66A',
            600: '#B08E4F',
            700: '#8E7138',
          },
        },
      },
      fontFamily: {
        sans: ['"Montserrat"', '"Gilroy"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        heading: ['"Gilroy"', '"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
