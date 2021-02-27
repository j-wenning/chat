<template>
<div class='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
  <SignUpCard />
</div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'
import SignUpCard from '@/components/SignUpCard.vue'

@Options({ name: 'SignUp', components: { SignUpCard } })

export default class SignUp extends Vue {}
</script>
