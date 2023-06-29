<template>
    <v-footer
      absolute
      app
    >
      <span>&copy; 2023 Delta Apps, LLC</span>
      <a target="_blank" href="https://deltaapps.dev/penguinboard/privacy_policy.pdf">Privacy Policy</a>
      <a target="_blank" href="https://deltaapps.dev/penguinboard/terms_conditions.pdf">Terms and Conditions</a>
      <v-spacer />
      <a target="_blank" href="https://forms.gle/rWfHuxtMp37iDjiJA">Give Us Feedback</a>
    </v-footer>
</template>

<script>
export default {
  name: 'Footer',

  data () {
    return {
    }
  },

  methods: {

  },

  computed: {
  }
}
</script>


<style scoped>
a {
    margin-left: 10px;
}
</style>