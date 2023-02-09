<template>
  <v-app dark>
    <v-app-bar
      fixed
      app
    >
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-btn v-if="jwtUser == null || jwtUser == undefined" @click="showLogin = true">Signup</v-btn>
      <v-btn v-else to="/">Home</v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

    <Login v-show="showLogin" @close-modal="showLogin = false" />

  </v-app>
</template>

<script>
import Login from '~/components/Login'
export default {
  name: 'LinkNoauthLayout',

  components: {
    Login,
  },

  data () {
    return {
      fixed: false,
      title: 'Bravo!',
      showLogin: false,
    }
  },

  methods: {
  },

  computed: {
    jwtUser () {
      return this.$store.state.account.jwtUser
    },
  }
}
</script>
