<template>
<div class='max-w-md w-full space-y-8'>
  <!-- <img class='mx-auto h-12 w-auto' src='' alt=''> -->
  <h2 class='mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100'>Sign in to your account</h2>
  <form class='mt-8 space-y-5' @submit.prevent='onSubmit'>
    <div>
      <FormInput
        :value='email'
        labelText='Email'
        class='w-full'
        id='email-address'
        name='email'
        type='email'
        autocomplete='email'
        required />
    </div>
    <div>
      <FormInput
        :value='password'
        labelText='Password'
        class='w-full'
        id='password'
        name='password'
        type='password'
        autocomplete='current-password'
        required />
      <router-link
        class='font-medium text-sm link'
        to='/forgot'>Forgot your password?</router-link>
    </div>
    <div>
      <button
        class='w-full button'
        :disabled='isInvalid'
        type='submit'>Sign in</button>
      <router-link
        class='block w-full link text-right'
        to='/signup'>
        <span class='text-gray-900 dark:text-gray-100'>New User?</span>
        Sign up!</router-link>
    </div>
  </form>
</div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'
import FormInput, { FormInputValue } from './FormInput.vue'

@Options({
  name: 'SignInCard',
  data () {
    return {
      email: FormInputValue(),
      password: FormInputValue()
    }
  },
  components: { FormInput },
  methods: {
    async onSubmit () {
      const { email: { input: email }, password: { input: password } } = this
      try {
        const res = await fetch('/api/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        switch (res.status) {
          case 200:
            this.$router.push('/app')
            break
          case 401:
            this.email.error = { message: 'Invalid email or password.', forced: true }
            this.password = FormInputValue()
            break
          default:
            this.email.error = { message: 'An unexpected error has occurred.', forced: true }
            console.error(await res.json())
        }
      } catch (err) { console.error(err) }
    }
  },
  computed: {
    isInvalid () { return !this.email.input || !this.password.input }
  }
})

export default class SignInCard extends Vue {}
</script>
