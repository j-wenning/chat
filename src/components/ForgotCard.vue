<template>
<div class='max-w-md w-full space-y-8'>
  <h1 class='mt-6 text-center text-3xl font-extrabold'>Recover your password</h1>
  <p>Enter the email associated with your account in order to have instructions on how to reset your password sent to your inbox.</p>
  <form class='mt-8 space-y-5 sm:space-y-0 sm:flex items-start' @submit.prevent='onSubmit'>
    <div class='sm:w-full'>
      <FormInput
        :value='email'
        labelText='Email'
        id='email-address'
        name='email'
        type='email'
        autocomplete='email'
        required />
    </div>
    <div class='sm:w-3/12 sm:ml-4 sm:pt-6'>
      <button
        class='w-full sm:mt-0.5 button'
        :disabled='sending'
        type='submit'>Send</button>
    </div>
  </form>
  <p v-show='sent' class='font-bold'>Your instructions are being delivered.  Please check both your inbox and spam folders.</p>
</div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'
import FormInput, { FormInputValue } from './FormInput.vue'

@Options({
  name: 'ForgotCard',
  components: { FormInput },
  data () { return { sent: false, email: FormInputValue() } },
  methods: {
    async onSubmit () {
      document.activeElement.blur()
      try {
        const res = await fetch('/api/reset?password', { method: 'POST' })
        if (res.ok) return (this.sent = true)
        this.sent = false
        this.email.error = { message: 'An unexpected error has occurred.' }
      } catch (err) { console.error(err) }
    }
  }
})

export default class ForgotCard extends Vue {}
</script>

<style>

</style>
