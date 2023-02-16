<template>
  <v-col>
    <v-row>
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

      <v-btn @click="show = !show" text>{{ show ? 'Hide' : 'Show'}} Board Details</v-btn>
      
      <!-- Card with board details -->
      <v-card v-if="show"
        class="board-card"
        width="50%"
      >
        <v-card-text class="text-center">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="edit-icon"
                @click="edit = true"
                v-bind="attrs"
                v-on="on"
                icon
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>

          <label for="image">Upload image (optional)</label>
          <input
            type="file"
            name="image"
            ref="fileInput"
            accept="image/*"
            @input="previewImage"
            :disabled="!edit"
          />
          <img id="preview-img" :src="imageData" v-if="imageData" />

          <v-text-field
            v-model="title"
            placeholder="Board Title"
            counter="75"
            :disabled="!edit"
          ></v-text-field>
          <v-text-field
            v-model="recipientname"
            placeholder="Recipients Name"
            type="name"
            :disabled="!edit"
          ></v-text-field>
          <v-text-field
            v-model="recipientemail"
            placeholder="Recipients Email"
            type="email"
            :disabled="!edit"
          ></v-text-field>
          <v-checkbox :disabled="!edit" v-model="isPublic" label="Make Public"></v-checkbox>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="clearBoard()" text>Clear</v-btn>
          <v-btn @click="saveChanges()" text>Save Changes</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>

    <!-- Row of posts -->
    <v-row class="post-row">
      <v-card class="post-card text-center" v-for="(post, i) in posts" :key="i">
        <iframe class="gif-iframe"
          v-if="post.gif != null"
          :src="`https://giphy.com/embed/${post.gif}`"
          width="90%"
          frameBorder="0"
        ></iframe>
        <v-card-text class="message" v-html="post.message"></v-card-text>
        <v-card-subtitle>&#126;{{post.from}}</v-card-subtitle>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deletePost(post.postid)" text>Delete</v-btn>
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

  async mounted () {
    await this.$store.dispatch('post/getBoardPosts', {
        link: localStorage.getItem('boardToEdit')
    })
    await this.$store.dispatch('board/getBoardData', {
      link: localStorage.getItem('boardToEdit')
    })
    this.loadData()
  },

  data () {
    return {
      customToolbar: [
        ['blank']
      ],
      show: false,
      edit: false,
      title: null,
      recipientemail: null,
      recipientname: null,
      imageData: null,
      isPublic: false,
    }
  },

  methods: {
    loadData () {
      this.title = this.boardData.title
      this.recipientemail = this.boardData.recipientemail
      this.recipientname = this.boardData.recipientname
      this.imageData = this.boardData.image
      this.isPublic = this.boardData.ispublic
    },

    goBack() {
      localStorage.removeItem('boardToEdit')
      this.$router.push('/boards')
    },

    previewImage(event) {
      const file = event.target.files[0]
      if (!file) return;
      const reader = new FileReader()
      reader.onload = e => {
        this.imageData = e.target.result
      }
      reader.readAsDataURL(file)
    },
    
    clearBoard () {
      this.title = ''
      this.recipientemail = ''
      this.recipientname = ''
      this.imageData = null
    },

    saveChanges() {
      if (this.title === '' || this.recipientemail === '' || this.recipientname === '') {
        alert('No field may be left blank.')
      } else {
        this.$store.dispatch('board/saveChanges', {
          boardid: this.boardData.boardid,
          title: this.title,
          recipientemail: this.recipientemail,
          recipientname: this.recipientname,
          image: this.imageData,
          isPublic: this.isPublic
        })
        this.edit = false
      }
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

.board-card {
  margin-top: 20px;
}

.edit-icon {
  float: right;
}

#preview-img {
  margin-top: 5px;
  max-width: 300px;
}

.post-row {
  margin-top: 20px;
}

.post-card {
  margin: 6px;
  width: 300px;
  height: 100%;
  border-radius: 15px;
}

.gif-iframe {
  margin-top: 10px;
}

.message {
  text-align: left;
  /* border: solid grey 1.5px; */
  border-radius: 6px;
}

</style>
