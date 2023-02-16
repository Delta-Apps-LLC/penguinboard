<template>
  <v-col justify="center" align="center">
    <v-card v-if="board != null && !board.sent && !loadingBoard" width="40%">
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
