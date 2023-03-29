<template>
  <v-app class="main-fade" dark>
    <v-app-bar
      fixed
      app
      height="85px"
    >
      <v-toolbar-title><img class="logo" src="~/assets/images/penguin-logo-hz.png" /></v-toolbar-title>
      <v-spacer />
      <v-btn v-if="jwtUser == null || jwtUser == undefined" to="/login" height="60px" color="#1DA9D3" class="white--text" style="margin: 10px;">Signup</v-btn>
      <v-btn v-else @click="toHome()" height="60px" text>Home</v-btn>
    </v-app-bar>

    <v-main class="main-fade" id="main">
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    
    <Footer />
    
  </v-app>
</template>

<script>
import Login from '~/components/Login'
import Footer from '~/components/Footer.vue'
export default {
  name: 'LinkNoauthLayout',

  components: {
    Login,
    Footer
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
