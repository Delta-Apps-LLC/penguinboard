<template>
  <v-app dark>
    <v-app-bar
      fixed
      app
    >
      <v-toolbar-title><img class="logo" src="~/assets/images/bravo_logo.png" /></v-toolbar-title>
      <v-spacer />
      <v-btn v-if="jwtUser == null || jwtUser == undefined" @click="showLogin = true" text>Signup</v-btn>
      <v-btn v-else @click="toHome()" text>Home</v-btn>
    </v-app-bar>

    <v-main class="main">
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
    toHome() {
      this.$router.push('/')
    }
  },

  computed: {
    jwtUser () {
      return this.$store.state.account.jwtUser
    },
  }
}
</script>

<style scoped>
@import '~/assets/style.css';

</style>
