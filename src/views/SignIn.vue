<template>
<div class='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8'>
  <SignInCard />
</div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'
import SignInCard from '@/components/SignInCard.vue'

@Options({ name: 'SignIn', components: { SignInCard } })

export default class SignIn extends Vue {}
</script>
