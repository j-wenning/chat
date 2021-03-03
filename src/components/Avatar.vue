<template>
<img
  :src='_src'
  :alt='_alt'
  class='h-10 w-10 rounded-full object-contain' />
</template>

<script>
import { Options, Vue } from 'vue-class-component'

@Options({
  name: 'Avatar',
  props: {
    src: {
      type: String,
      required: false
    },
    alt: {
      type: String,
      required: false
    }
  },
  computed: {
    _src () { return this.src || 'https://via.placeholder.com/150' },
    _alt () { return this.alt || '' }
  }
})

export default class Avatar extends Vue {}
</script>

<style>

</style>
