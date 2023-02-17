<template>
  <v-col justify="center" align="center">
    <v-card v-if="board != null && !board.sent && !loadingBoard"
      :width="isMobile ? '95%' : '40%'"
    >
      <v-card-title class="post-title justify-center">{{ board.recipientname }}</v-card-title>
      <v-card-subtitle>{{ board.title }}</v-card-subtitle>

      <v-btn class="gif-btn" @click="showGifs ? hideGifs() : getGifs(true)" v-if="!isGifSelected">
        {{ showGifs ? 'Cancel' : 'Add GIF' }}
      </v-btn>
      <v-text-field id="gif-search" v-if="showGifs"
        v-model="gifSearch"
        rounded
        filled
        dense
        placeholder="Search GIF"
        append-icon="mdi-magnify"
        @click:append="searchGif(true)"
        @keyup.enter="searchGif(true)"
      ></v-text-field>

      <v-col class="gif-section" v-if="showGifs">
        <p id="category"><q>{{ category }}</q></p>
        <v-row justify="center" align="center">
          <div id="parent" v-for="(gif, i) in gifs" :key="i">
            <iframe class="gif-iframe" :src="`https://giphy.com/embed/${gif.id}`" width="200" frameBorder="0"></iframe>
            <button @click="chooseGif(gif.id)">Select</button>
          </div>
        </v-row>
        <v-btn @click="loadMore()">Load More</v-btn>
      </v-col>

      <!-- Display Selected GIF here -->
      <iframe class="gif-iframe" v-if="isGifSelected" :src="`https://giphy.com/embed/${chosenGif}`" width="200" frameBorder="0"></iframe>
      <v-btn class="remove-icon" v-if="isGifSelected" @click="removeGif()" icon><v-icon>mdi-close</v-icon></v-btn>

      <v-card-text>
        <client-only>
          <VueEditor
            v-model="message"
            :editorToolbar="customToolbar"
          />
        </client-only>
        <v-text-field
          type="name"
          v-model="name"
          placeholder="Enter your name"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="message = ''">Clear</v-btn>
        <v-btn @click="sendPost()">Send</v-btn>
      </v-card-actions>
    </v-card>

    <h3 v-else-if="board != null && board.sent">This board has been sent, and posting is now closed.</h3>

    <!-- Loading indicator -->
    <div class="sk-folding-cube" v-if="loadingBoard">
      <div class="sk-cube1 sk-cube"></div>
      <div class="sk-cube2 sk-cube"></div>
      <div class="sk-cube4 sk-cube"></div>
      <div class="sk-cube3 sk-cube"></div>
    </div>
  </v-col>
</template>

<script>
import { VueEditor } from "vue2-editor"
export default {
  layout: 'linknoauth',
  name: 'PostPage',

  components: {
    VueEditor
  },

  async asyncData({ params }) {
    const link = params.link
    return { link }
  },

  created () {
    let path = this.$route.path.split('/')[1]
    this.$store.dispatch('board/getBoardData', {
      link: path
    })
  },

  data () {
    return {
        message: '',
        name: '',
        customToolbar: [
          [{ header: [false, 1, 2, 3, 4, 5, 6] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        showGifs: false,
        gifSearch: '',
        category: 'Trending',
        quantity: 0,
        isGifSelected: false,
        chosenGif: '',
    }
  },

  methods: {
    async sendPost() {
      if (this.message === '' || this.name === '') {
        alert('Message and name fields cannot be empty.')
      } else {
        let post = {
          from: this.name,
          gif: this.isGifSelected ? this.chosenGif : null,
          message: this.message,
          boardid: this.board.boardid
        }
        await this.$store.dispatch('post/sendPost', {
          post: post
        })
        this.name = ''
        this.message = ''
        this.removeGif()
      }
    },

    async getGifs(isFirst) {
      isFirst ? this.quantity += 15 : null
      await this.$store.dispatch('giphy/getGifs', {
        quantity: this.quantity
      })
      this.category = 'Trending'
      this.showGifs = true
    },

    async searchGif(isNewSearch) {
      if (this.gifSearch === '') this.getGifs(true)
      isNewSearch ? this.quantity = 15 : null
      this.category = this.gifSearch
      await this.$store.dispatch('giphy/searchGifs', {
        searchText: this.gifSearch,
        quantity: this.quantity
      })
    },

    async loadMore() {
      this.quantity += 15
      if (this.category === 'Trending') {
        this.getGifs(false)
      } else {
        this.searchGif(false)
      }
    },

    async hideGifs() {
      this.showGifs = false
      this.gifSearch = ''
      this.quantity = 0
    },

    async chooseGif(id) {
      this.chosenGif = id
      this.isGifSelected = true
      this.hideGifs()
    },

    async removeGif() {
      this.chosenGif = ''
      this.isGifSelected = false
    },
  },

  computed: {
    board () {
      return this.$store.state.board.boardData
    },

    gifs () {
      return this.$store.state.giphy.gifs
    },

    loadingBoard () {
      return this.$store.state.board.loadingBoard
    },

    isMobile () {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    }
  },
}
</script>

<style scoped>
@import '~/assets/style.css';

.post-title {
  font-family: Plus Jakarta Sans;
  font-size: 22px;
}

.gif-section {
  margin-top: 10px;
  width: 100%;
  height: 300px;
  overflow-y: scroll;
  justify-content: center;
  background-color: rgb(57, 57, 57);
}

.gif-btn {
  margin-bottom: 6px;
}

#category {
  color: rgb(221, 221, 221);
  font-weight: bold;
}

#parent {
  width: 125px;
  height: auto;
  margin: 2px;
}

iframe {
  width: 100%;
  height: 100%;
  border: 0px;
  vertical-align: top;
}

#parent > button {
  opacity: 0.3;
  position: relative;
  float: right;
  right: 10px;
  bottom: 35px;
  transition: 0.5s;
}

#parent > button {
  opacity: 1;
}

button {
  background-color: rgb(221, 221, 221);
  padding: 0 4px;
  border-radius: 4px;
}

.remove-icon {
  margin-top: 6px;
}

</style>
