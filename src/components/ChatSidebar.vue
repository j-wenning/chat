<template>
<div
  ref='root'
  :class='[
    "h-screen w-full max-w-xs flex flex-col bg-gray-300 dark:bg-gray-800",
    { "filter-blur": isSettingsToggled }
  ]'>
  <div class='flex items-center justify-between'>
    <h1 class='px-3 py-2 text-2xl font-bold'>Users</h1>
    <button
      @click='toggleUsers'
      :disabled='disabled'
      class='mx-3 md:hidden button-select'
      type='button'>
      <span class='sr-only'>Close user list</span>
      <svg class='h-8 w-8' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M10 19l-7-7m0 0l7-7m-7 7h18' />
      </svg>
    </button>
  </div>
  <hr class='hr'>
  <div class='px-3 pb-3 pt-1'>
    <FormInput
      :value='search'
      :format='formatSearch'
      :disabled='disabled'
      data-profile-adj='true'
      labelText='Search user'
      id='search'
      name='search'
      type='text'
      required />
  </div>
  <hr class='hr'>
  <div ref='users' class='group h-full overflow-y-scroll-hide'>
    <Profile
      ref='profile'
      v-if='!!selectedUser'
      :handleBlur='blurProfile'
      :user='selectedUser'
      :style='profileStyle'
      class='absolute transform z-10' />
    <div v-for='user in filteredUsers' :key='user.id' class='p-1'>
      <button
        @click='selectUser($event, user)'
        :data-profile-adj='user === filteredUsers[0]'
        :disabled='disabled'
        class='user-button button-select'
        type='button'>
        <div
          class='flex items-center'>
          <Avatar class='mr-3' :src='user.avatar' />
          <span class='h-7 truncate'>{{user.name}}</span>
        </div>
      </button>
    </div>
  </div>
  <div class='mt-auto relative bottom-0 flex items-center justify-between p-3 bg-gray-400 dark:bg-gray-900'>
    <Avatar :src='user.avatar' />
    <span class='h-7 mx-3 w-full truncate'>{{user.name}}</span>
    <button
      @click='toggleSettings'
      :data-profile-adj='users.length === 0'
      :disabled='disabled'
      type='button'
      class='group button-basic rounded-md px-2 py-2'>
      <span class='sr-only'>Open settings</span>
      <svg class='h-7 w-7 transform duration-700 group-hover:rotate-90' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
        <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
      </svg>
    </button>
  </div>
</div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'
import { mapActions } from 'vuex'
import FormInput, { FormInputValue } from './FormInput.vue'
import Avatar from './Avatar.vue'
import Profile from './Profile.vue'

@Options({
  name: 'ChatSidebar',
  data () {
    return {
      users: [],
      user: {},
      search: FormInputValue(),
      selectedUser: null,
      selectedUserEl: null,
      profileStyle: { top: 0, left: 0 },
      isMediumToggled: false,
      isUsersToggled: false,
      isSettingsToggled: false
    }
  },
  components: { FormInput, Avatar, Profile },
  mounted () {
    this.users = this.$store.getters.users
    this.user = this.$store.getters.user
    this.isMediumToggled = this.$store.getters.isMediumToggled
    this.isUsersToggled = this.$store.getters.isUsersToggled
    this.isSettingsToggled = this.$store.getters.isSettingsToggled
    this.$store.subscribeAction(({ type, payload }) => {
      switch (type) {
        case 'setMedium':
          this.isMediumToggled = payload
          break
        case 'toggleUsers':
          this.isUsersToggled = !this.isUsersToggled
          break
        case 'toggleSettings':
          this.isSettingsToggled = !this.isSettingsToggled
          break
      }
    })
  },
  methods: {
    ...mapActions(['toggleUsers', 'toggleSettings']),
    formatSearch (input) { return input.substr(0, 32) },
    selectUser (e, user) {
      this.selectedUserEl = e.currentTarget
      this.selectedUser = user
      if (this.selectedUserEl?.blur) this.selectedUserEl.blur()
      this.$nextTick(() => {
        const offset = 10
        const rootMaxWidth = parseFloat(getComputedStyle(this.$refs.root).maxWidth)
        const profileMaxWidth = parseFloat(getComputedStyle(this.$refs.profile.$el).maxWidth)
        const isTooFar = window.innerWidth <= (rootMaxWidth + profileMaxWidth + offset)
        const isTooLarge = window.innerWidth <= profileMaxWidth + offset
        const { top: userTop = 0 } = this.selectedUserEl?.getBoundingClientRect() || {}
        const { top: usersTop, bottom: usersBottom } = this.$refs.users.getBoundingClientRect()
        const { height: profileHeight } = this.$refs.profile.$el.getBoundingClientRect()
        const isTooHigh = usersTop + offset >= userTop
        const isTooLow = usersBottom <= userTop + profileHeight + offset
        this.profileStyle = {
          left: isTooFar ? '' : rootMaxWidth + offset + 'px',
          right: isTooLarge ? 0 : offset + 'px',
          top: isTooLow
            ? (usersBottom - profileHeight - offset + 'px')
            : (isTooHigh ? (usersTop + offset + 'px') : (userTop + 'px'))
        }
      })
    },
    blurProfile () {
      this.selectedUser = null
      setTimeout(() => { if (document.activeElement.hasAttribute('data-profile-adj', 'true')) this.selectedUserEl.focus() })
    }
  },
  computed: {
    filteredUsers () {
      const regexps = this.search.input.replace(/^\s+|\s$|\s(?=\s)/g, '')
        .split(' ').map(capture => { try { return new RegExp(capture) } catch (err) {} })
      return this.users.filter(({ id, name }) => {
        if (id === this.user.id) return false
        for (const regex of regexps) if (regex?.test(name)) return true
        return false
      })
    },
    disabled () { return (!this.isMediumToggled && !this.isUsersToggled) || this.isSettingsToggled }
  }
})

export default class ChatSidebar extends Vue {}
</script>

<style scoped>
.user-button { @apply w-full p-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-900; }
</style>
