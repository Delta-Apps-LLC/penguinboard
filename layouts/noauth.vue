<template>
  <v-app class="main-fade" dark>
    <v-app-bar
      fixed
      app
      height="85px"
    >
      <v-toolbar-title><img class="logo" src="~/assets/images/penguin-logo-hz.png" /></v-toolbar-title>
      <v-spacer />
      <v-btn to="/public" height="60px" text>Public Boards</v-btn>
      <v-btn height="60px" @click="showLogin = true" text>Login</v-btn>
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
