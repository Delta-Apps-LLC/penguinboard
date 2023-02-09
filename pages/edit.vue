<template>
  <v-col>
    <v-tooltip right>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          @click="goBack()"
          v-bind="attrs"
          v-on="on"
          icon
        >
          <v-icon size="50">mdi-chevron-left</v-icon>
        </v-btn>
      </template>
      <span>Back</span>
    </v-tooltip>

    <v-row class="row">
      <v-card class="post-card text-center" v-for="(post, i) in posts" :key="i">
        <iframe class="gif"
          v-if="post.gif != null"
          :src="`https://giphy.com/embed/${post.gif}`"
          width="90%"
          frameBorder="0"
        ></iframe>
        <v-card-text class="message" v-html="post.message"></v-card-text>
        <v-card-subtitle>&#126;{{post.from}}</v-card-subtitle>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deletePost(post.postid)">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
    <br>
  </v-col>
</template>

<script>
export default {
  middleware: "auth",
  name: 'EditPage',

  mounted () {
    this.$store.dispatch('post/getBoardPosts', {
        link: JSON.parse(localStorage.getItem('boardToEdit')).link
    })
    this.$store.dispatch('board/getBoardData', {
        link: JSON.parse(localStorage.getItem('boardToEdit')).link
    })
  },

  data () {
    return {
      customToolbar: [
        ['blank']
      ]
    }
  },

  methods: {
    goBack() {
      localStorage.removeItem('boardToEdit')
      this.$router.push('/boards')
    },

    deletePost(postid) {
      if (confirm('Are you sure you want to delete this post?')) {
        this.$store.dispatch('post/deletePost', {
          postid: postid,
          link: this.boardData.link,
        })
      }
    }
  },

  computed: {
    posts () {
        return this.$store.state.post.posts
    },

    boardData () {
        return this.$store.state.board.boardData
    },
  },
}
</script>

<style scoped>
@import '~/assets/style.css';

.row {
  margin-top: 5px;
}

.post-card {
  margin: 6px;
  width: 300px;
  height: 100%;
}

.gif {
  margin-top: 10px;
}

.message {
  text-align: left;
  /* border: solid grey 1.5px; */
  border-radius: 6px;
}

</style>
