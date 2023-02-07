<template>
  <v-col justify="center" align="center">
    <v-card width="40%">
      <v-card-title class="justify-center" v-if="board != null">{{ board.recipientname }}</v-card-title>
      <v-card-subtitle v-if="board != null">{{ board.title }}</v-card-subtitle>
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
  </v-col>
</template>

<script>
import { VueEditor } from "vue2-editor"
export default {
  layout: 'noauth',
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
    this.$store.dispatch('post/getBoardData', {
      link: path
    })
  },

  data () {
    return {
        message: '',
        name: '',
        customToolbar: [
          [{ font: [] }, { header: [false, 1, 2, 3, 4, 5, 6] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [
            { align: "" },
            { align: "center" },
            { align: "right" },
            { align: "justify" }
          ],
          ["image", "code-block"],
        ],
    }
  },

  methods: {
    async sendPost() {
      if (this.message === '' || this.name === '') {
        alert('No field may be left empty.')
      } else {
        let post = {
          from: this.name,
          message: this.message,
          boardid: this.board.boardid
        }
        await this.$store.dispatch('post/sendPost', {
          post: post
        })
        this.name = ''
        this.message = ''
      }
    }
  },

  computed: {
    board () {
      return this.$store.state.post.boardData
    },
  },
}
</script>

<style scoped>
@import '~/assets/style.css';


</style>
