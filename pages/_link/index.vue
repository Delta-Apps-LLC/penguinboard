<template>
  <v-col justify="center" align="center">
    <p>Posts: {{ posts }}</p>
    <p>Board: {{ board }}</p>
  </v-col>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../../store/auth"
export default {
  layout: 'linknoauth',
  name: 'LinkPage',

  async asyncData({ params }) {
    const link = params.link
    return { link }
  },

  async created () {
    await this.$store.dispatch('board/getBoardData', {
      link: this.link
    })
    if (this.board.expiration == '0') {
      alert('This board has not been published yet.')
      this.$router.push('/')
    } else if (this.jwtUser == null || this.jwtUser == undefined) {
      if (Date.now().toString() > this.board.expiration) {
        alert('Viewing priviledges for this board have expired, please log in or sign up to regain access.')
        this.$router.push('/login')
      } else {
        await this.$store.dispatch('post/getBoardPosts', {
            link: this.link
        })
      }
    } else if (this.jwtUser != null && this.jwtUser != undefined) {
      await this.$store.commit('account/setUserFromJwt', getUserIdFromToken(getJwtToken()))
      if (this.jwtUser.email !== this.board.recipientemail) {
        alert('You do not have permission to view this board.')
        this.$router.push('/')
      } else {
        await this.$store.dispatch('post/getBoardPosts', {
            link: this.link
        })
      }
    }
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

    posts () {
        return this.$store.state.post.posts
    },

    board () {
      return this.$store.state.board.boardData
    }
  },
}
</script>

<style scoped>
@import '~/assets/style.css';


</style>
