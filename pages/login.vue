<template>
  <v-row>
    <v-col class="text-center">
      <h3>Login Page</h3>
      <v-btn @click="signup()">Signup</v-btn>
      <v-btn @click="login()">Login</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'InspirePage',
  layout: 'noauth',

  data () {
    return {

    }
  },

  methods: {
    async signup () {
      const user = {
        email: 'a.thibs98@gmail.com',
        password: 'hellothere',
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
    },
  },

  computed: {
    user () {
      return this.$store.state.account.user
    }
  },
}
</script>
