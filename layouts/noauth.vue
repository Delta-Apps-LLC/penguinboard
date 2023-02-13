<template>
  <v-app dark>
    <v-app-bar
      fixed
      app
    >
      <v-toolbar-title><img class="logo" src="~/assets/images/bravo_logo.png" /></v-toolbar-title>
    </v-app-bar>

    <v-main class="main">
      <v-container>
        <Nuxt class="main" />
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
