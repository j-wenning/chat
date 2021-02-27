module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: 'class', // false, 'media', or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {
      cursor: ['disabled'],
      backgroundColor: ['disabled'],
      opacity: ['disabled']
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
