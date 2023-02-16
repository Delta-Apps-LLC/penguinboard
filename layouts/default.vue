<template>
  <v-app class="main-fade" dark>
    <v-navigation-drawer
      :mini-variant="miniVariant"
      :clipped="true"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          @click="item.click"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="true"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="miniVariant = !miniVariant" />
      <v-toolbar-title>
        <img class="logo" src="~/assets/images/bravo_logo.png" />
      </v-toolbar-title>
      <v-spacer />
      <v-btn to="/public" text>Public Boards</v-btn>
    </v-app-bar>

    <v-main class="main-fade" id="main">
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
  </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
export default {
  name: 'DefaultLayout',

  mounted () {
    this.$store.commit('account/setUserFromJwt', getUserIdFromToken(getJwtToken()))
    this.$store.dispatch('account/getCurrentUser')
  },
  
  data () {
    return {
      fixed: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-apps',
          title: 'Boards',
          to: '/boards'
        },
        {
          icon: 'mdi-account',
          title: 'Account',
          to: '/account'
        },
        {
          icon: 'mdi-logout-variant',
          title: 'Logout',
          click: this.signOut
        }
      ],
      miniVariant: false,
      title: 'Bravo!'
    }
  },

  methods: {
    async signOut () {
      await this.$store.dispatch('account/signOut')
    }
  },
}
</script>

<style scoped>
@import '~/assets/style.css';


</style>
