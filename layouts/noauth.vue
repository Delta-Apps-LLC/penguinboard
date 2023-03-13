<template>
  <v-app class="main-fade" dark>
    <v-app-bar
      fixed
      app
      height="85px"
    >
      <v-toolbar-title><img class="logo" src="~/assets/images/penguin-logo-hz.png" /></v-toolbar-title>
      <v-spacer />
      <v-btn to="/public" height="60px" style="margin: 3px;" text>Public Boards</v-btn>
      <v-btn height="60px" style="background-color: #1C7293; color: white; margin: 3px;" @click="showLogin = true" text>Login</v-btn>
    </v-app-bar>

    <v-main class="main-fade" id="main">
      <v-container>
        <Nuxt id="main" />
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
import Login from "~/components/Login.vue"
export default {
  name: 'NoauthLayout',

  components: {
    Login,
  },

  data () {
    return {
      fixed: false,
      showLogin: false,
    }
  },

  methods: {
  },
}
</script>

<style scoped>
@import '~/assets/style.css';

</style>
