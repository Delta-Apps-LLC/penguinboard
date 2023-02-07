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

    <v-tab-items v-model="tab">
      <v-row class="board-row">
        <v-card class="board-card"
          v-for="(board, i) in tab === 0 ? managedBoards : myBoards"
          :key="i"
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
    </v-tab-items>
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
