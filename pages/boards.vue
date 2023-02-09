<template>
  <v-col justify="center" align="center">
    <span>
      <v-tabs left v-model="tab">
        <v-tabs-slider></v-tabs-slider>
          <v-tab v-for="item in items" :key="item.tab">
            {{ item.tab }} ({{item.tab === 'managed boards' ? managedBoards.length : myBoards.length}})
          </v-tab>
      </v-tabs>
    </span>

    <v-row class="board-row">
      <v-card class="board-card"
        v-for="(board, i) in tab === 0 ? managedBoards : myBoards"
        :key="i"
        width="250px"
      >
          <v-card-title class="justify-center">{{ tab === 0 ? board.recipientname : board.title }}</v-card-title>
          <v-card-subtitle>{{ tab === 0 ? board.title : `From: ${board.sender}` }}</v-card-subtitle>
          <v-card-text>
            <a v-if="tab === 0" target="_blank" :href="`http://localhost:3000/${board.link}/post`">Post</a>
          </v-card-text>
          <v-card-actions>
              <v-spacer />
              <v-btn @click="deleteBoard(board)">Delete</v-btn>
              <v-btn v-if="tab === 0" @click="sendBoard(board)">Send</v-btn>
              <v-btn v-if="tab === 0" @click="openBoard(board)">Open</v-btn>
              <v-btn v-else>
                <a target="_blank" :href="`http://localhost:3000/${board.link}`">View</a>
              </v-btn>
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
    this.$store.dispatch('board/getMyBoards')
  },

  data () {
    return {
      tab: 0,
      items: [
        { tab: 'managed boards' },
        { tab: 'my boards' },
      ],
    }
  },

  methods: {
    async deleteBoard(board) {
      if (confirm('Are you sure you want to delete this board, and all posts in it?')) {
        await this.$store.dispatch('board/deleteBoard', {
          board: board
        })
      }
    },

    async sendBoard(board) {
      if (confirm(`Are you sure you\'re ready to send this board to ${board.recipientemail}?`)) {
        await this.$store.dispatch('board/sendBoard', {
          board: board
        })
      }
    },

    async openBoard(board) {
      localStorage.setItem('boardToEdit', JSON.stringify(board))
      this.$router.push('/edit')
    },
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
    },

    myBoards () {
      return this.$store.state.board.myBoards
    }
  },
}
</script>

<style scoped>
@import '~/assets/style.css';

.board-row {
  margin-top: 20px;
}

.board-card {
    margin: 6px;
}

</style>
