<template>
<div class='max-w-md w-full space-y-8'>
  <h1 class='mt-6 text-center text-3xl font-extrabold'>Create your account</h1>
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
        autocomplete='new-password'
        required />
      <InfoLabel
        for='password'
        labelText='Passwords must be between 8 and 32 characters.' />
    </div>
    <div>
      <FormInput
        :value='passwordConfirmation'
        :validate='validatePasswordConfirmation'
        labelText='Re-enter password'
        id='password-confirmation'
        name='password-confirmation'
        type='password'
        autocomplete='new-password'
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
import InfoLabel from './InfoLabel.vue'

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
  components: { FormInput, InfoLabel },
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
      document.activeElement.blur()
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
      return input.trimLeft().replace(/\s{3,}/g, c => c.substr(0, 3).replace(/./g, ' ')).substr(0, 32)
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
