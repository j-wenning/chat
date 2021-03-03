<template>
<div class='max-w-2xs w-full p-3 rounded-sm text-center button-select bg-gray-400 dark:bg-gray-900'>
  <div class='relative flex flex-wrap justify-center'>
    <Avatar class='h-24 w-24' :src='avatar' />
    <p class='w-full break-words mt-3'>{{name}}</p>
    <router-link
      ref='link'
      @blur='handleBlur'
      class='button mt-3'
      :to='"/chat/" + id'>Message</router-link>
  </div>
</div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'
import Avatar from './Avatar.vue'

@Options({
  name: 'Profile',
  components: { Avatar },
  props: {
    user: {
      type: Object,
      required: true
    },
    handleBlur: {
      type: Function,
      required: true
    }
  },
  updated () { this.$refs.link.$el.focus() },
  computed: {
    avatar () { return this.user.avatar || '' },
    name () { return this.user.name || '' },
    id () { return this.user.id || '' }
  }
})

export default class Profile extends Vue {}
</script>
