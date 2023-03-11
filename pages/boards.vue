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

    <v-row class="board-row justify-center" v-if="tab === 0 ? !loadingManaged : !loadingMine">
      <v-card class="board-card"
        v-for="(board, i) in tab === 0 ? managedBoards : myBoards"
        :key="i"
        :width="isMobile ? '90%' : '275px'"
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
          <v-btn v-if="tab === 0" target="_blank" :href="`${currentLocation}/${board.link}/post`" text>Add Post</v-btn>
          <v-btn v-if="tab === 0" @click="copyToClipboard(`https://penguinboard.app/${board.link}/post`)" text>Invite Contributors</v-btn>
          <v-btn v-if="tab === 0" @click="deleteBoard(board)" text>Delete Board</v-btn>
          <v-btn v-if="tab === 0" @click="openBoard(board)" text>Edit Board</v-btn>
          <v-btn v-if="tab === 0" @click="sendBoard(board)" text>Send to Recipient</v-btn>
          <!-- <a v-else target="_blank" :href="`${currentLocation}/${board.link}`">
            <v-btn text>View</v-btn>
          </a> -->
          <nuxt-link v-else :to="currentLocation + '/' + board.link">View</nuxt-link>
        </v-card-text>
      </v-card>
      <h2 class="header" v-if="!loadingManaged && tab === 0 && managedBoards.length == 0">
        You do not have any managed boards.
      </h2>
      <h2 class="header" v-else-if="!loadingMine && tab === 1 && myBoards.length == 0">
        You have not received any boards.
      </h2>
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
      currentLocation: "",
      inDevelopmentMode: false
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
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(link).then(() => {
            alert("Link copied to clipboard. Please share with others to invite them to participate on your board.");
          })
        }
        catch (e) {
          alert(`Copying doesn't work on your browser. Please copy the following link to share the post with others:\n ${link}`);
          console.log(e);
        }
      }
      else {
        try {
          const textarea = document.createElement('textarea');
          textarea.value = link;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          alert("Link copied to clipboard. Please share with others to invite them to participate on your board.")
        }
        catch (e) {
          alert(`Copying link doesn't work on your browser. Please copy the following link to share the post with others:\n ${link}`)
          console.log(e);
        }
      }
    },

    async getCurrentLocation() {
      // if (window.location.hostname.contains("penguinboard.app")) {
      //   return "https://penguinboard.app"
      // }
      // else {
      //   return "localhost:3000"
      // }
      if (!this.inDevelopmentMode) {
        return "https://penguinboard.app"
      }
      else {
        return "localhost:3000"
      }
    },

    async asyncData() {
      const posts = await fetchPosts()
      return { posts }
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
    },

    isMobile () {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    },

    getLocation () {
      this.currentLocation = this.getCurrentLocation()
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
