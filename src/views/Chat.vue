<template>
<div class='min-h-screen w-full flex'>
  <ChatSidebar />
  <ChatHistory />
  <ChatSettings />
</div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'
import ChatSidebar from '@/components/ChatSidebar.vue'
import ChatHistory from '@/components/ChatHistory.vue'
import ChatSettings from '@/components/ChatSettings.vue'

@Options({ name: 'Chat', components: { ChatSidebar, ChatHistory, ChatSettings } })

export default class App extends Vue {}
</script>
