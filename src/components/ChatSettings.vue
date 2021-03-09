<template>
<div
  @click.self='handleClose'
  v-if='isSettingsToggled'
  class='sm:py-12 sm:px-6 lg:px-8 absolute inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50'>
  <div class='space-y-3 p-3 h-full sm:h-unset max-h-full w-full max-w-md flex flex-col border-2 border-gray-400 dark:border-gray-900 bg-gray-50 dark:bg-gray-700'>
    <div>
      <h1 class='text-2xl font-extrabold'>Settings</h1>
    </div>
    <hr class='hr -mx-3'>
    <form @submit.prevent='handleSubmit' class='space-y-3 p-1 -mr-5 max-h-full overflow-y-scroll'>
      <div class='flex justify-center items-center'>
        <div class='mr-3 relative flex justify-center text-center'>
          <FormInput
            :value='file'
            id='avatar'
            name='avatar'
            class='hidden'
            accept='image/png, image/jpeg'
            type='file' />
          <label
            class='h-24 w-24 m-auto absolute inset-0'
            for='avatar'>
            <span class='h-full w-full flex justify-center items-center opacity-0 hover:opacity-100 rounded-full text-white font-bold bg-gray-800 bg-opacity-60'>
              Change avatar
            </span>
            <svg class='p-1 h-7 w-7 absolute top-4 right-4 rounded-full transform translate-x-1/2 -translate-y-1/2 bg-gray-300 dark:bg-gray-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
            </svg>
            <svg class='h-3 w-3 absolute top-2 right-2 rounded-full transform translate-x-1/3 -translate-y-1/3 bg-gray-300 dark:bg-gray-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
            </svg>
          </label>
          <Avatar :src='avatarPreview' alt='Your avatar' class='h-24 w-24' />
        </div>
        <button
          v-show='!!avatar'
          @click='avatar = ""'
          class='button-secondary'
          type='button'>Cancel</button>
      </div>
      <ChatSettingsEntry
        :value='name'
        :curValue='user.name'
        :format='formatName'
        labelText='Name'
        id='name'
        name='name'
        type='name'
        autocomplete='name' />
      <ChatSettingsEntry
        :value='email'
        :curValue='user.email'
        labelText='Email'
        id='email'
        name='email'
        type='email'
        autocomplete='current-email' />
      <ChatSettingsEntry
        :value='password'
        curValue='*****'
        labelText='Pasword'
        id='password'
        name='password'
        type='password'
        autocomplete='new-password' />
      <div class='flex flex-col'>
        <FormInput
          :value='passwordVerification'
          labelText='Current password'
          id='passwordVerification'
          name='passwordVerification'
          type='password'
          autocomplete='current-password' />
        <InfoLabel
          for='passwordVerification'
          labelText='Required to change email/password.'
          class='my-1' />
      </div>
      <div>
        <button
          :disabled='!isSubmittable'
          class='button mr-2'
          type='submit'>Save</button>
        <button
          @click='handleClose'
          class='button-secondary'
          type='button'>Cancel</button>
      </div>
    </form>
  </div>
</div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'
import { mapActions, mapMutations } from 'vuex'
import FormInput, { FormInputValue } from './FormInput.vue'
import Avatar from './Avatar.vue'
import ChatSettingsEntry from './ChatSettingsEntry.vue'
import InfoLabel from './InfoLabel.vue'

@Options({
  name: 'ChatSettings',
  components: { FormInput, Avatar, ChatSettingsEntry, InfoLabel },
  data () {
    return {
      isSettingsToggled: false,
      file: FormInputValue(),
      name: FormInputValue(),
      email: FormInputValue(),
      password: FormInputValue(),
      passwordVerification: FormInputValue(),
      avatar: '',
      user: { avatar: '', name: '', email: '' }
    }
  },
  mounted () {
    this.isSettingsToggled = this.$store.getters.isSettingsToggled
    this.user = this.$store.getters.user
    this.$store.subscribeAction(({ type }) => {
      if (type === 'toggleSettings') this.isSettingsToggled = !this.isSettingsToggled
      if (!this.isSettingsToggled) this.avatar = ''
    })
    this.$watch(
      () => this.file.input,
      newVal => {
        if (!newVal || newVal.length === 0) return null
        const fStream = new FileReader()
        fStream.onload = e => {
          const scale = 75
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const img = document.createElement('img')
          canvas.height = scale
          canvas.width = scale
          img.src = e.currentTarget.result
          img.onload = () => {
            ctx.scale(scale / img.width, scale / img.height)
            ctx.drawImage(img, 0, 0)
            this.avatar = canvas.toDataURL()
          }
        }
        fStream.readAsDataURL(newVal[0])
      }
    )
  },
  methods: {
    ...mapActions(['toggleSettings']),
    ...mapMutations(['updateUser']),
    formatName (input) { return input.substr(0, 32) },
    toggle (dataToggle, dataVal) {
      this[dataToggle] = !this[dataToggle]
      this[dataVal] = ''
    },
    reset () {
      this.avatar = ''
      this.name = FormInputValue()
      this.email = FormInputValue()
      this.password = FormInputValue()
      this.passwordVerification = FormInputValue()
    },
    async handleSubmit () {
      let {
        avatar,
        name: { input: name },
        email: { input: email },
        password: { input: password },
        passwordVerification: { input: passwordVerification }
      } = this
      avatar = avatar || null
      name = name || null
      email = email || null
      password = password || null
      passwordVerification = passwordVerification || null
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar, name, email, password, passwordVerification })
      })
      switch (res.status) {
        case 200:
          this.updateUser({ avatar, name, email })
          this.reset()
          break
        case 400: {
          const { message } = await res.json()
          if (/password/gi.test(message)) this.password.error = { message: 'Invalid password.  Passwords must be between 8 and 32 characters.', forced: true }
          if (/email/gi.test(message)) this.email.error = { message: 'Email is taken or invalid.', forced: true }
          this.passwordVerification.error = { message: true }
          break
        }
        case 401:
          this.passwordVerification.error = { message: 'Invalid password.', forced: true }
          break
        default:
          this.passwordVerification.error = { message: 'An unexpected error has occurred.', forced: true }
      }
    },
    handleClose () {
      this.toggleSettings()
    }
  },
  computed: {
    disabled () { return !this.isSettingsToggled },
    avatarPreview () { return this.avatar || this.user.avatar },
    isSubmittable () {
      const requiresValidation = this.email.input || this.password.input
      const canSubmitMinimum = this.avatar || this.name.input
      return (canSubmitMinimum && !requiresValidation) ||
        (requiresValidation && this.passwordVerification.input)
    }
  }
})

export default class ChatSettings extends Vue {}
</script>

<style>
@media all and (hover: none) {
  .hover\:opacity-100 { @apply opacity-0 !important; }
}
</style>
