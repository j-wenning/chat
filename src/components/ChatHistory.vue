<template>
<div
  :class='[
    "h-screen w-full top-0 left-0 fixed md:static flex flex-col transform md:transform-none duration-100",
    { "translate-x-80": isUsersToggled },
    { "filter-blur": isSettingsToggled }
  ]'>
  <div
    @click='toggleUsers'
    :class='[
      "w-full inset-0 absolute bg-gray-800 z-50 transform duration-100",
      isUsersToggled ? "opacity-75" : "opacity-0 pointer-events-none"
    ]' />
  <div
    :class='[
      "p-2 w-full flex items-center bg-gray-300 dark:bg-gray-800",
      { "filter-blur": isUsersToggled }
    ]'>
    <button
      v-show='toggleUsers'
      :disabled='disabled'
      @click='toggleUsers'
      class='button-select md:hidden mr-3'
      type='button'>
      <span class='sr-only'>Open user list</span>
      <svg class='h-7 w-7' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 6h16M4 12h16M4 18h16' />
      </svg>
    </button>
    <h1 class='text-2xl font-bold truncate'>Global Chat</h1>
  </div>
  <hr :class='["hr", { "filter-blur": isUsersToggled } ]'>
  <div class='relative h-full w-full'>
    <div
      ref='messages'
      @scroll='onScroll'
      :class='[
        "px-1 absolute inset-0 overflow-y-scroll bg-gray-50 dark:bg-gray-700",
        { "filter-blur": isUsersToggled }
      ]'>
      <button
        @click='jumpToBottom'
        :disabled='disabled'
        class=''
        type='button'>
        <span>New message(s); jump to bottom</span>
      </button>
      <div
        class='my-1 py-2 px-1 w-full flex rounded-sm hover:bg-gray-300 dark:hover:bg-gray-800'
        v-for='{ user: { avatar, name }, id, content, timestamp } in _messages'
        :key='id'>
        <div class='w-4/12 sm:w-2/12 lg:w-auto'>
          <Avatar :src='avatar' class='avatar-chat-history' />
        </div>
        <div class='w-8/12 sm:w-10/12 lg:w-full'>
          <div class='xl:flex items-end'>
            <p class='xl:mr-2 truncate font-semibold'>{{name}}</p>
            <p class='xl:pb-0.5 truncate text-xs'>{{timestamp}}</p>
          </div>
          <p class='break-all'>{{content}}</p>
        </div>
      </div>
    </div>
  </div>
  <form
    :class='[
      "px-2 pb-2 w-full relative z-10 flex bg-gray-50 dark:bg-gray-700",
      { "filter-blur": isUsersToggled }
    ]'>
    <FormInput
      :value='message'
      :disabled='disabled'
      class='mr-3'
      type='text'
      placeholder='Message'
      required />
    <button
      :disabled='disabled'
      class='button-basic px-2 py-2'
      type='button'>
      <span class='sr-only'>Send message</span>
      <svg class='h-7 w-7 transform rotate-90' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
      </svg>
    </button>
  </form>
</div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'
import { mapActions } from 'vuex'
import FormInput, { FormInputValue } from './FormInput.vue'
import Avatar from './Avatar.vue'
import { randInt } from '#/scripts/random'

const fakeMessages = [...new Array(30)].map((_, i) => ({
  id: i,
  uid: randInt(0, 20),
  content: [...new Array(randInt(0, 1000))].map(() => String.fromCharCode(randInt(32, 126))).join(''),
  timestamp: Date.now()
})).reverse()

@Options({
  name: 'ChatHistory',
  components: { FormInput, Avatar },
  data () {
    return {
      users: [],
      messages: [],
      message: FormInputValue(),
      isMediumToggled: false,
      isUsersToggled: false,
      isSettingsToggled: false,
      autoScroll: true,
      newMessages: 0
    }
  },
  mounted () {
    this.users = this.$store.getters.users
    this.messages = fakeMessages
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
    this.jumpToBottom()
  },
  computed: {
    _messages () {
      let today = Date.now()
      let yesterday = today - 86400000
      today = new Date(today).toLocaleDateString()
      yesterday = new Date(yesterday).toLocaleDateString()
      return this.messages.map(message => {
        let { uid, timestamp, ...data } = message
        const user = this.users.find(user => user.id === uid)
        const date = new Date(timestamp)
        timestamp = date.toLocaleDateString()
        switch (timestamp) {
          case today:
            timestamp = 'Today'
            break
          case yesterday:
            timestamp = 'Yesterday'
            break
        }
        timestamp += ' at ' + date.toLocaleTimeString().replace(/:\d+\s/, ' ')
        return { user, timestamp, ...data }
      })
    },
    disabled () { return (!this.isMediumToggled && this.isUsersToggled) || this.isSettingsToggled }
  },
  methods: {
    ...mapActions(['toggleUsers']),
    onScroll (e) {
      const messages = e.currentTarget
      this.autoScroll = messages.scrollTop + messages.getBoundingClientRect().height >= messages.scrollHeight
      if (this.autoScroll) this.newMessages = 0
    },
    scrollToBottom () {
      const messages = this.$refs.messages
      this.$nextTick(() => messages.scroll({ top: messages.scrollHeight, left: 0, behavior: 'auto' }))
    },
    jumpToBottom () {
      this.scrollToBottom()
      this.autoScroll = true
      this.newMessages = 0
    }
  },
  watch: {
    newMessages (newVal) {
      if (newVal && this.autoScroll) {
        this.scrollToBottom()
        this.newMessages = 0
      }
    }
  }
})

export default class ChatHistory extends Vue {}
</script>

<style>
.avatar-chat-history { @apply mr-3 h-unset lg:h-16 w-5/6 lg:w-16 !important; }
</style>
