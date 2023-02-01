<template>
  <v-col justify="center" align="center">
    <p>{{ user }}</p>
    <v-btn @click="goToDashboard()">Show Board</v-btn>
  </v-col>
</template>

<script>
export default {
  name: 'IndexPage',
  middleware: "auth",

  data () {
    return {
    }
  },

  methods: {
    goToDashboard() {
      alert("Made it here")
      this.$router.push('/dashboard')
    }
  },

  computed: {
    user () {
      return this.$store.state.account.user
    }
  },
}
</script>
