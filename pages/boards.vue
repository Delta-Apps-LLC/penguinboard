<template>
  <v-col justify="center" align="center">
    <p>Managed Boards: {{ managedBoards }}</p>
    <v-row>
        <v-card class="board-card" v-for="(board, i) in managedBoards" :key="i"
            width="250px"
        >
            <v-card-title class="justify-center">{{board.recipientname}}</v-card-title>
            <v-card-subtitle>{{board.title}}</v-card-subtitle>
            <v-card-text>
                {{board.recipientemail}}
                <v-spacer />
                <a target="_blank" :href="`http://localhost:3000/${board.link}/post`">Post</a>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn>Delete</v-btn>
                <v-btn>Send</v-btn>
                <v-btn>Open</v-btn>
            </v-card-actions>
        </v-card>
    </v-row>
  </v-col>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
export default {
  name: 'BoardsPage',
  middleware: "auth",

  mounted () {
    this.$store.commit('account/setUserFromJwt', getUserIdFromToken(getJwtToken()))
    this.$store.dispatch('account/getCurrentUser')
    this.$store.dispatch('board/getManagedBoards')
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

.board-card {
    margin: 6px;
}

</style>
