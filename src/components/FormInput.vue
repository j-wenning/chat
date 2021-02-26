<template>
<label
  v-if='!!labelText && !!$attrs.id'
  class='form-input-label'
  :for='$attrs.id || $.uid'>{{labelText}}</label>
<input
  :='$attrs'
  :id='$attrs.id || $.uid'
  @blur='blurred = true'
  :class='["w-full input", { "form-input-err": !!error && blurred }]'
  v-model='input' />
<label
  class='order-last form-input-label-err'
  v-if='!!error && typeof error === "string" && blurred'
  :for='$attrs.id || $.uid'>{{error}}</label>
</template>

<script>
import { Options, Vue } from 'vue-class-component'
import { mapActions } from 'vuex'

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
      default: () => ''
    },
    format: {
      type: Function,
      required: false,
      default: input => input
    },
    value: {
      type: Object,
      required: false,
      default: { input: '', error: '' }
    }
  },
  data () { return { input: '', error: '', blurred: false } },
  methods: {
    ...mapActions(['updateFormInput']),
    async tryValidate () {
      const { input } = this
      this.value.error = this.error = await this.validate(input) || ''
      this.value.input = input
    }
  },
  mounted () {
    this.$store.subscribeAction(action => {
      if (this.blurred && action.type === 'updateFormInput') this.tryValidate()
    })
  },
  watch: {
    async input () {
      this.input = this.format(this.input) || ''
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
