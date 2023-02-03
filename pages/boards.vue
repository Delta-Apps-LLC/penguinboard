<template>
  <v-col justify="center" align="center">
    <p>Managed Boards: {{ managedBoards }}</p>
  </v-col>
</template>

<script>
export default {
  name: 'BoardsPage',
  middleware: "auth",

  async mounted () {
    await this.$store.dispatch('board/getManagedBoards')
  },

  data () {
    return {
    }
  },

  methods: {
  },

  computed: {
    jwtUser () {
      return this.$store.state.account.jwtUser
    },

    userData () {
      return this.$store.state.account.userData
    },

    managedBoards () {
      return this.$store.state.board.managedBoards
    }
  },
}
</script>

<style scoped>
@import '~/assets/style.css';


</style>
