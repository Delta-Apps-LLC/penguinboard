<template>
  <v-col justify="center" align="center">
    <v-btn @click="signup()">Signup</v-btn>
    <v-btn @click="login()">Login</v-btn>
    <br>
    USER: {{user}}
  </v-col>
</template>

<script>
export default {
  name: 'IndexPage',

  data () {
    return {
    }
  },

  methods: {
    async signup () {
      const user = {
        email: 'jackkentmorgan@gmail.com',
        password: 'jackmorgan',
      }
      await this.$store.dispatch('account/signup', {
        user: user
      })
    },

    async login () {
      const user = {
        email: 'jackkentmorgan@gmail.com',
        password: 'jackmorgan',
      }
      await this.$store.dispatch('account/login', {
        user: user
      })
    }
  },

  computed: {
    user () {
      return this.$store.state.account.user
    }
  },
}
</script>
