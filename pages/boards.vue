<template>
  <v-col justify="center" align="center">
    <span>
      <v-tabs background-color="transparent" left v-model="tab">
        <v-tabs-slider></v-tabs-slider>
          <v-tab v-for="item in items" :key="item.tab">
            {{ item.tab }} ({{item.tab === 'managed boards' ? managedBoards.length : myBoards.length}})
          </v-tab>
      </v-tabs>
    </span>

    <v-row class="board-row" v-if="tab === 0 ? !loadingManaged : !loadingMine">
      <v-card class="board-card"
        v-for="(board, i) in tab === 0 ? managedBoards : myBoards"
        :key="i"
        width="250px"
        height="100%"
      >
          <v-card-title class="card-title justify-center">
            {{ tab === 0 ? board.recipientname : board.title }}
          </v-card-title>
          <v-card-subtitle class="card-subtitle">
            {{ tab === 0 ? board.title : `From: ${board.sender}` }}
          </v-card-subtitle>
          <img id="image" v-if="board.image != null" :src="board.image" />
          <v-card-text>
            <v-btn v-if="tab === 0" target="_blank" :href="`http://54.219.6.20:3000/${board.link}/post`" text>Add Post</v-btn>
            <v-btn v-if="tab === 0" @click="copyToClipboard(`http://54.219.6.20:3000/${board.link}/post`)" text>Invite Others to Post</v-btn>
            <v-btn v-if="tab === 0" @click="deleteBoard(board)" text>Delete Board</v-btn>
            <v-btn v-if="tab === 0" @click="openBoard(board)" text>Edit Board</v-btn>
            <v-btn v-if="tab === 0" @click="sendBoard(board)" text>Send to Recipient</v-btn>
            <a v-else target="_blank" :href="`http://54.219.6.20:3000/${board.link}`">
              <v-btn text>View</v-btn>
            </a>
          </v-card-text>
          <!-- <v-card-actions>
              <v-spacer />
              <v-btn v-if="tab === 0" target="_blank" :href="`http://54.219.6.20:3000/${board.link}/post`" text>Add Post</v-btn>
              <v-btn v-if="tab === 0" @click="deleteBoard(board)" text>Delete Board</v-btn>
              <v-btn v-if="tab === 0" @click="sendBoard(board)" text>Send to Recipient</v-btn>
              <v-btn v-if="tab === 0" @click="openBoard(board)" text>Edit Board</v-btn>
              <a v-else target="_blank" :href="`http://54.219.6.20:3000/${board.link}`">
                <v-btn text>View</v-btn>
              </a>
          </v-card-actions> -->
      </v-card>
    </v-row>

    <!-- Loading indicator -->
    <div class="sk-folding-cube" v-if="tab === 0 ? loadingManaged : loadingMine">
      <div class="sk-cube1 sk-cube"></div>
      <div class="sk-cube2 sk-cube"></div>
      <div class="sk-cube4 sk-cube"></div>
      <div class="sk-cube3 sk-cube"></div>
    </div>
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
      localStorage.removeItem('boardToEdit')
      localStorage.setItem('boardToEdit', board.link)
      this.$router.push('/edit')
    },

    async copyToClipboard(link) {
      navigator.clipboard.writeText(link)
      .then(() => {
        alert(`Link to post copied to clipboard. Please share with others to invite them to participate on your board. ${link}`)      })
      .catch(() => {
        alert("something went wrong");
      });
    }
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
    },

    loadingMine () {
      return this.$store.state.board.loadingMine
    },

    loadingManaged () {
      return this.$store.state.board.loadingManaged
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
    border-radius: 15px;
    background-color: #f3f3f3;
}

.card-title, .card-subtitle {
  font-family: Plus Jakarta Sans;
  word-wrap: break-word pre;
}

.card-subtitle {
  font-size: 16px;
}

#image {
  max-width: 100px;
}

</style>
