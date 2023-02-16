<template>
  <v-app class="main-fade" dark>
    <v-app-bar
      fixed
      app
    >
      <v-toolbar-title><img class="logo" src="~/assets/images/bravo_logo.png" /></v-toolbar-title>
      <v-spacer />
      <v-btn to="/public" text>Public Boards</v-btn>
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
  </v-app>
</template>

<script>
export default {
  name: 'NoauthLayout',

  data () {
    return {
      fixed: false,
      title: 'Bravo!'
    }
  },

  methods: {
  },
}
</script>

<style scoped>
@import '~/assets/style.css';

</style>
