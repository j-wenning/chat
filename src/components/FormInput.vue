<template>
<label
  v-if='!!labelText'
  class='font-bold'
  :for='id'>{{labelText}}</label>
<input
  v-if='$attrs.type === "file"'
  ref='input'
  :='$attrs'
  :id='id'
  :class='["w-full input", { "form-input-err": !!error.message && blurred }]'
  @blur='blurred = true'
  @change='handleChange' />
<input
  v-else
  :='$attrs'
  :id='id'
  :class='["w-full input", { "form-input-err": !!error.message && blurred }]'
  @blur='blurred = true'
  v-model='value.input' />
<label
  class='order-last form-input-label-err'
  v-if='!!error.message && typeof error.message === "string" && blurred'
  :for='id'>{{error.message}}</label>
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
      default: FormInputValue
    }
  },
  data () { return { blurred: false } },
  methods: {
    ...mapActions(['updateFormInput']),
    async tryValidate () {
      const { input, value: { error: { forced } } } = this
      const { message } = await this.validate(input)
      if (!forced || !!message) this.value.error = { message, forced: false }
    },
    handleChange (e) { this.value.input = { ...e.currentTarget.files } }
  },
  computed: {
    id () { return this.$attrs.id || this.$.uid },
    input () { return this.value.input },
    error () { return this.value.error }
  },
  mounted () {
    this.$store.subscribeAction(action => {
      if (this.blurred && action.type === 'updateFormInput') this.tryValidate()
    })
    this.$watch(
      () => this.value.input,
      this.$attrs.type === 'file'
        ? async () => {
          this.$refs.input.value = ''
          this.updateFormInput()
        }
        : async newVal => {
          this.value.input = this.format(newVal) || ''
          await this.tryValidate()
          this.updateFormInput()
        }
    )
    this.$watch(
      () => this.value.error,
      newVal => { if (newVal.forced) this.blurred = true }
    )
  }
})

export default class FormInput extends Vue {}
</script>

<style>
.form-input-label-err { @apply text-red-700 dark:text-red-400 text-sm; }

.form-input-err { @apply border-2 border-red-700 dark:border-red-400 !important; }
</style>
