<template>
  <v-col class="text-center">
    <h2 class="header">Public Boards</h2>
    <v-row class="board-row" align="center" justify="center" v-if="!loadingPublic">
        <v-card class="board-card text-center" v-for="(board, i) in publicBoards"
            :key="i"
            width="250px"
            height="100%"
        >
            <v-card-title class="board-name justify-center"
            >
                {{board.recipientname}}
            </v-card-title>
            <v-divider />
            <v-card-subtitle
                class="board-title"
                style="word-break: break-word;"
            >
                {{board.title}}
            </v-card-subtitle>
            <v-card-actions>
                <v-spacer />
                <a target="_blank" :href="`http://localhost:3000/${board.link}/post`">
                    <v-btn text>Post</v-btn>
                </a>
            </v-card-actions>
        </v-card>
    </v-row>


    <!-- Loading indicator -->
    <div class="sk-folding-cube" v-if="loadingPublic">
      <div class="sk-cube1 sk-cube"></div>
      <div class="sk-cube2 sk-cube"></div>
      <div class="sk-cube4 sk-cube"></div>
      <div class="sk-cube3 sk-cube"></div>
    </div>
  </v-col>
</template>

<script>
export default {
  name: 'PublicPage',
  layout: 'linknoauth',

  async created () {
    await this.$store.dispatch('board/getPublicBoards')
  },

  data () {
    return {
    }
  },

  methods: {

  },

  computed: {
    publicBoards () {
        return this.$store.state.board.publicBoards
    },

    loadingPublic () {
        return this.$store.state.board.loadingPublic
    }
  },
}
</script>


<style scoped>
@import '~/assets/style.css';

.header {
    font-family: Plus Jakarta Sans;
    font-size: 28px;
    color: #303030;
}

.board-row {
  margin-top: 20px;
}

.board-card {
    margin: 6px;
    border-radius: 15px;
    background-color: #f3f3f3;
}

.board-name {
    font-family: Plus Jakarta Sans;
    font-size: 22px;
}

.board-title {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 15px;
}

</style>