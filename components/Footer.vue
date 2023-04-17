<template>
    <v-footer
      absolute
      app
    >
      <span>&copy; 2023 Delta Apps, LLC</span>
      <a target="_blank" href="privacy_policy.html">Privacy Policy</a>
      <a target="_blank" href="terms_conditions.pdf">Terms and Conditions</a>
      <!-- <v-btn @click="showPrivacy = !showPrivacy" text>Privacy Policy</v-btn>
      <v-btn @click="showTerms = !showTerms" text>Terms and Conditions</v-btn>
      <iframe v-if="showPrivacy" :src="require(`~/static/privacy_policy.pdf`)" width="40%" height="30%"></iframe>
      <iframe v-if="showTerms" :src="require(`~/static/privacy_policy.pdf`)" width="40%" height="30%"></iframe> -->
      <v-spacer />
      <a target="_blank" href="https://forms.gle/rWfHuxtMp37iDjiJA">Give Us Feedback</a>
    </v-footer>
</template>

<script>
export default {
  name: 'Footer',

  data () {
    return {
      showPrivacy: false,
      showTerms: false,
    }
  },

  methods: {

  },

  computed: {
    // pdfUrl () {
    //   return require('~/static/privacy_policy.pdf')
    // },

    // termsUrl () {
    //   return require('~/static/terms_conditions.pdf')
    // }
  }
}
</script>


<style scoped>
a {
    margin-left: 10px;
}
</style>