<template>
<label
  v-if='!!labelText && !!$attrs.id'
  class='form-input-label'
  :for='$attrs.id || $.uid'>{{labelText}}</label>
<input
  :='$attrs'
  :id='$attrs.id || $.uid'
  @blur='blurred = true'
  :class='[$attrs.class, "input", { "form-input-err": !!error.message && blurred }]'
  v-model='input' />
<label
  class='order-last form-input-label-err'
  v-if='!!error.message && typeof error.message === "string" && blurred'
  :for='$attrs.id || $.uid'>{{error.message}}</label>
</template>

<script>
import { Options, Vue } from 'vue-class-component'
import { mapActions } from 'vuex'

export const FormInputValue = (
  {
    input = '',
    error: {
      message = '',
      forced = false
    } = {}
  } = {}
) => ({ input, error: { message, forced } })

@Options({
  name: 'FormInput',
  props: {
    labelText: {
      type: String,
      required: false,
      default: ''
    },
    validate: {
      type: Function,
      required: false,
      default: () => FormInputValue().error
    },
    format: {
      type: Function,
      required: false,
      default: input => input
    },
    value: {
      type: Object,
      required: false,
      default: FormInputValue()
    }
  },
  data () {
    return {
      ...this.value,
      blurred: false
    }
  },
  methods: {
    ...mapActions(['updateFormInput']),
    async tryValidate () {
      const { input, value: { error: { forced } } } = this
      const { message } = await this.validate(input)
      if (!forced || !!message) this.value.error = this.error = { message, forced: false }
    }
  },
  mounted () {
    this.$store.subscribeAction(action => {
      if (this.blurred && action.type === 'updateFormInput') this.tryValidate()
    })
    this.$watch(
      () => this.value.input,
      () => { this.input = this.value.input }
    )
    this.$watch(
      () => this.value.error,
      () => {
        this.error = this.value.error
        if (this.error.forced) this.blurred = true
      }
    )
  },
  watch: {
    async input () {
      this.value.input = this.input = this.format(this.input) || ''
      await this.tryValidate()
      this.updateFormInput()
    }
  }
})

export default class FormInput extends Vue {}
</script>

<style>
.form-input-label { @apply font-bold text-gray-900 dark:text-gray-100; }

.form-input-label-err { @apply text-red-700 dark:text-red-400 text-sm; }

.form-input-err { @apply border-2 border-red-700 dark:border-red-400 !important; }
</style>
