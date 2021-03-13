<template>
<button @click='toggleDark' role='switch' :aria-checked='isDarkToggled' class='fixed p-3 m-2 right-0 z-50'>
  <span class='sr-only'>Toggle dark mode</span>
  <svg v-if='isDarkToggled' class='h-7 w-7 text-gray-100' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
  <svg v-else class='h-7 w-7 text-gray-900' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' />
  </svg>
</button>
<router-view class='bg-gray-50 dark:bg-gray-700 text-primary' />
</template>

<script>
import { Options, Vue } from 'vue-class-component'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '~/tailwind.config.js'

const htmlClasses = document.querySelector('html')?.classList
let { theme: { screens: { md: mdBreakpoint } } } = resolveConfig(tailwindConfig)
mdBreakpoint = parseInt(mdBreakpoint)

@Options({
  data () { return { isDarkToggled: false, isMdBreakpoint: false } },
  methods: {
    toggleDark () {
      this.isDarkToggled = !this.isDarkToggled
      if (this.isDarkToggled) htmlClasses.add('dark')
      else htmlClasses.remove('dark')
    },
    handleWindowResize (e) {
      const isMdBreakpoint = e.currentTarget.innerWidth >= mdBreakpoint
      if (isMdBreakpoint !== this.isMdBreakpoint) {
        this.$store.dispatch('setMedium', isMdBreakpoint)
        this.isMdBreakpoint = isMdBreakpoint
      }
    }
  },
  mounted () {
    this.isDarkToggled = htmlClasses.contains('dark')
    window.addEventListener('resize', this.handleWindowResize)
    window.dispatchEvent(new Event('resize'))
  },
  beforeUnmount () { window.removeEventListener('resize', this.handleWindowResize) }
})

export default class App extends Vue {}
</script>

<style>
@tailwind base;

@tailwind components;

@tailwind utilities;

.text-primary {
  @apply text-gray-900 dark:text-gray-100;
}

.button-disabled {
  @apply disabled:opacity-50 disabled:cursor-default;
}

.button-select {
  @apply focus:outline-none
    border border-transparent
    focus:ring-2 focus:ring-offset-2 focus:ring-green-500
    button-disabled;
}

.button-basic {
  @apply
    text-sm font-medium
    text-white
    bg-green-600 hover:bg-green-700 disabled:bg-green-600
    button-select;
}

.button { @apply py-2 px-4 rounded-md button-basic; }

.button-secondary {
  @apply focus:ring-purple-500 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600 !important;
  @apply button;
}

.input {
  @apply px-3 py-2
    border rounded-sm
    text-primary
    placeholder-gray-400
    bg-white dark:bg-gray-600
    border-gray-300 dark:border-gray-900
    focus:outline-none focus:ring-green-500 focus:border-green-500
    focus:z-10;
}

.hr { @apply border-t-2 border-gray-400 dark:border-gray-900; }

.link { @apply text-green-500 hover:text-green-400; }

::-webkit-scrollbar { @apply w-5 h-5 rounded-full; }

::-webkit-scrollbar-thumb { @apply border-8 border-solid rounded-full border-transparent bg-clip-content bg-gray-400 dark:bg-gray-900; }

::-webkit-scrollbar-track-piece:start { @apply mt-2; }

::-webkit-scrollbar-track-piece:end { @apply mb-2; }

.overflow-y-scroll-hide { @apply pr-1 hover:pr-0 overflow-y-hidden hover:overflow-y-scroll; }

@media all and (hover: none) {
  .overflow-y-scroll-hide { @apply pr-0 overflow-y-scroll; }
}

@layer utilities {
  .filter-blur { filter: blur(5px); }
}

</style>
