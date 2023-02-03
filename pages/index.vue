<template>
  <v-col justify="center" align="center">
    <p>{{ jwtUser }}</p>
    <p>{{ userData }}</p>
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
