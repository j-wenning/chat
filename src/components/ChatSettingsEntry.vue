<template>
<div class='flex flex-wrap items-end'>
  <div class='w-full sm:w-3/4'>
    <FormInput
      v-if='isInputToggled'
      :='$attrs'
      :value='value'
      :labelText='labelText'
      @blur='handleBlur' />
    <template v-else>
      <label :for='id' class='font-bold'>{{labelText}}</label>
      <p :id='id' class='break-words'>{{curValue}}</p>
    </template>
  </div>
  <div :class='[
      {
        "sm:mb-0.5": isInputToggled && !hasErrorText,
        "sm:mb-7": isInputToggled && hasErrorText && blurred
      }, "mt-2 sm:mt-0 w-full sm:w-1/4 sm:text-right"
    ]'>
    <button
      @click='toggleInput'
      class='button'
      type='button'>{{isInputToggled ? "Cancel" : "Change"}}</button>
  </div>
</div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'
import FormInput, { FormInputValue } from './FormInput.vue'

@Options({
  name: 'ChatSettingsEntry',
  inheritAttrs: false,
  components: { FormInput },
  data () { return { blurred: false, isInputToggled: false, hasErrorText: false } },
  props: {
    labelText: {
      type: String,
      required: false,
      default: ''
    },
    value: { type: Object, required: true },
    curValue: { type: String, required: true }
  },
  mounted () {
    this.$watch(
      () => this.value.error,
      newVal => { this.hasErrorText = !!newVal.message?.length }
    )
  },
  computed: {
    id () { return this.$attrs.id || this.$.uid }
  },
  methods: {
    toggleInput () {
      this.isInputToggled = !this.isInputToggled
      if (!this.isInputToggled) {
        this.value.input = FormInputValue().input
        this.value.error = FormInputValue().error
        this.blurred = false
      }
    },
    handleBlur () { this.blurred = true }
  }
})

export default class ChatSettingsEntry extends Vue {}
</script>
