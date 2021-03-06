/* eslint-disable */
const { screens: { sm, ...defaultScreens } } = require('tailwindcss/defaultTheme')

module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: 'class', // false, 'media', or 'class'
  theme: {
    screens: {
      sm: '384px',
      ...defaultScreens
    },
    extend: {
      height: {
        unset: 'unset'
      },
      maxWidth: {
        '3xs': '8rem',
        '2xs': '14rem'
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'],
      cursor: ['disabled'],
      opacity: ['disabled'],
      overflow: ['hover'],
      padding: ['hover'],
      rotate: ['group-hover']
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
