/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/*.html' , './public/**/*.js'],
  theme: {
    screens : {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px'
    },
    container : {
      center : true,
      padding : {
        DEFAULT : '1.5rem',
        xs : '0.5rem',
        sm : '0.5rem',
        md : '0',
        lg : '0',
        xl : '0',
      }
    },
    extend: {
      colors : {
        primary : '#D0F80C',
        secondary : '#114246',
        blueLight : {
          100 : '#89DDCE',
          200 : '#61b2a3'
        },
        
      }
    },
  },
  plugins: [],
}

