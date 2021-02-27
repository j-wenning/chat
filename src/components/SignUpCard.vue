<template>
<div class='max-w-md w-full space-y-8'>
  <h2 class='mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100'>Create your account</h2>
  <form class='mt-8 space-y-5' @submit.prevent='onSubmit'>
    <div>
      <FormInput
        :value='name'
        :format='formatName'
        :validate='validateName'
        labelText='Name'
        id='name'
        name='name'
        type='text'
        autocomplete='name'
        required />
    </div>
    <div>
      <FormInput
        :value='email'
        :validate='validateEmail'
        labelText='Email'
        id='email'
        name='email'
        type='email'
        autocomplete='name'
        required />
    </div>
    <div>
      <FormInput
        :value='password'
        :validate='validatePassword'
        labelText='Password'
        id='password'
        name='password'
        type='password'
        autocomplete='current-password'
        required />
      <label for='password' class='flex text-sm'>
        <svg class='h-5 w-5 text-blue-500 mr-1' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class='text-gray-900 dark:text-gray-100'>Passwords must be between 8 and 32 characters.</span>
      </label>
    </div>
    <div>
      <FormInput
        :value='passwordConfirmation'
        :validate='validatePasswordConfirmation'
        labelText='Re-enter password'
        id='password-confirmation'
        name='password-confirmation'
        type='password'
        autocomplete='current-password'
        required />
    </div>
    <div>
      <button
        class='w-full button'
        :disabled='isInvalid'
        type='submit'>Sign Up</button>
    </div>
  </form>
</div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'
import FormInput, { FormInputValue } from './FormInput.vue'

@Options({
  name: 'SignUpCard',
  data () {
    return {
      name: FormInputValue(),
      email: FormInputValue(),
      password: FormInputValue(),
      passwordConfirmation: FormInputValue()
    }
  },
  components: { FormInput },
  methods: {
    async onSubmit () {
      let {
        name: { input: name },
        email: { input: email },
        password: { input: password },
        passwordConfirmation: { input: passwordConfirmation }
      } = this
      name = name.trim()
      email = email.trim()
      try {
        const res = await fetch('/api/signup', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, passwordConfirmation })
        })
        if (res.ok) return this.$router.push('/app')
        this.passwordConfirmation.error = { message: 'An unexpected error has occurred.', forced: true }
        throw new Error(await res.json())
      } catch (err) { console.error(err) }
    },
    formatName (input) {
      return input.trimLeft().replace(/[^a-z.,'\s]|\s(\.|,|')/ig, '').replace(/(\.|,|')+|\s+/g, c => c[0]).substr(0, 32)
    },
    validateName (input) { return { message: input.trim().length < 2 ? 'Name must be at least 2 characters long.' : false } },
    async validateEmail (input) {
      try {
        const res = await fetch('/api/validate?email=' + encodeURIComponent(input))
        if (res.ok) return {}
        switch (res.status) {
          case 400:
            return { message: 'This email address is invalid.' }
          case 409:
            return { message: 'This email address is taken.' }
          default:
            console.error(await res.json())
            return { message: 'An unknown error has occurred.' }
        }
      } catch (err) { console.error(err) }
    },
    validatePassword (input) { return { message: input.length < 8 || input.length > 32 } },
    validatePasswordConfirmation (input) { return { message: this.password.input === input ? false : 'Passwords do not match.' } }
  },
  computed: {
    isInvalid () {
      return !this.name.input || !this.email.input || !this.password.input || !this.passwordConfirmation.input ||
      !!this.name.error.message || !!this.email.error.message || !!this.password.error.message || !!this.passwordConfirmation.error.message
    }
  }
})

export default class SignUpCard extends Vue {}
</script>
