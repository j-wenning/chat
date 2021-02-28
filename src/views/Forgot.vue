<template>
<div class='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
  <ForgotCard />
</div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'
import ForgotCard from '@/components/ForgotCard.vue'

@Options({ name: 'Forgot', components: { ForgotCard } })

export default class Forgot extends Vue {}
</script>
