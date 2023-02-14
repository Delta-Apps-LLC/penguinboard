<template> 
  <v-col class="whole-dashboard">
    <link rel="stylesheet" 
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
      integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" 
      crossorigin="anonymous">
    <div class="title-card" v-if="board != null">
      <img :src="board.image" class="title-image" v-if="board.image != null">
      <span class="title text-center">
        <p class="title-name">{{ board.recipientname }}</p>
        <p class="title-text">{{ board.title }}</p>
      </span>
    </div>
    <v-row>
      <post v-for="post in posts"
        :key="post.postid"
        :gif="post.gif"
        :message="post.message"
        :author="post.from"
        class="col-lg-4 col-md-6 col-sm-12 px-0"
      ></post>
    </v-row> 
  </v-col>
</template>  

<!-- <template>
  <v-col justify="center" align="center">
    <p>Posts: {{ posts }}</p>
    <p>Board: {{ board }}</p>
  </v-col>
  </v-col>
</template> -->

<script>
import { getJwtToken, getUserIdFromToken } from "../../store/auth"
import post from "~/components/post"

export default {
  layout: 'linknoauth',
  name: 'LinkPage',

  components: {
    post
  },

  async asyncData({ params }) {
    const link = params.link
    return { link }
  },

  async created () {
    await this.$store.dispatch('board/getBoardData', {
      link: this.link
    })
    if (this.board.sent === false) {
      alert('This board has not been published yet.')
      this.$router.push('/')
    } else if (this.jwtUser == null || this.jwtUser == undefined) {
      if (Date.now().toString() > this.board.expiration) {
        console.log(Date.now(), this.board.expiration)
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

/* .bravo {
  color: black;
  background-color: white;
  padding: 10px;
  text-align: center;
  width: 103%;
  margin-left: -15px;
  border-radius: 15px;
} */

.title-card {
  background-color: #585858;
  padding: 30px;
  justify-content: center;
  align-items: center;
  color: white;
  margin: 10px 0;
  display: flex;
  border: solid 2px;
  border-radius: 15px;
}

.title-image {
  max-height: 300px;
  max-width: auto;
  border-radius: 15px;
}

.title {
  color: #f3f3f3;
  width: auto;
  margin: 0 50px;
  line-height: 250%;
}

.title-name {
  font-size: 45px;
  font-family: Plus Jakarta Sans;
  text-decoration: underline;
}

.title-text {
  font-size: 40px;
  font-family: Arial, Helvetica, sans-serif;
}


</style>
