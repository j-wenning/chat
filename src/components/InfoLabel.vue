<template>
<label class='flex text-sm'>
  <svg class='h-5 w-5 text-blue-500 mr-1' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
  </svg>
  <span>{{labelText}}</span>
</label>
</template>

<script>
import { Options, Vue } from 'vue-class-component'

@Options({ name: 'InfoLabel', props: { labelText: { type: String, required: true } } })

export default class InfoLabel extends Vue {}
</script>
