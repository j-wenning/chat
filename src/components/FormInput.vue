<template>
<label
  v-if='!!labelText && !!$attrs.id'
  class='font-bold text-gray-900 dark:text-gray-100'
  :for='`${$attrs.id}-${$.uid}`'>{{labelText}}</label>
<input
  :='$attrs'
  :id='`${$attrs.id}-${$.uid}`'
  @blur='blurred = true'
  :class='[
    !!error && blurred
      ? "border-red-700 dark:border-red-400 border-2"
      : "border border-gray-300 dark:border-gray-900",
    "w-full px-3 py-2 dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-sm",
    "focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10"
  ]'
  v-model='input' />
<p
  class='w-full text-red-700 dark:text-red-400 text-sm order-last'
  v-if='!!error && typeof error === "string" && blurred'>{{error}}</p>
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
      const error = this.error = await this.validate(input) || ''
      this.value.input = input
      this.value.error = error
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

</style>
