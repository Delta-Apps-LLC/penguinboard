<template>
  <v-col justify="center" align="center">
    <p>User's name: {{ userData.firstname }} {{ userData.lastname }}</p>
    <p>User's email: {{ userData.email }}</p>
  </v-col>
</template>

<script>
export default {
  name: 'AccountPage',
  middleware: "auth",

  data () {
    return {
    }
  },

  methods: {
  },

  computed: {
    jwtUser () {
      return this.$store.state.account.jwtUser
    },

    userData () {
      return this.$store.state.account.userData
    },
  },
}
</script>

<style scoped>
@import '~/assets/style.css';


</style>
