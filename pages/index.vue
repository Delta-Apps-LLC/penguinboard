<template>
  <v-col justify="center" align="center">
    <v-card class="board-card"
      width="50%"
    >
      <v-card-title class="title justify-center">Create a New Board Here!</v-card-title>
      <v-card-text>
        <label for="image">Upload image (optional)</label>
        <input type="file" name="image" ref="fileInput" accept="image/*" @input="previewImage"/>
        <img id="preview-img" :src="imageData" v-if="imageData" />
        <v-text-field
          v-model="title"
          placeholder="Board Title"
          counter="75"
        ></v-text-field>
        <v-text-field
          v-model="recipientname"
          placeholder="Recipients Name"
          type="name"
        ></v-text-field>
        <v-text-field
          v-model="recipientemail"
          placeholder="Recipients Email"
          type="email"
        ></v-text-field>
        <v-checkbox v-model="isPublic" label="Make Public"></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="clearBoard()" text>Clear</v-btn>
        <v-btn @click="createBoard()" text>Create Board</v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: 'IndexPage',
  middleware: "auth",

  data () {
    return {
      title: '',
      recipientemail: '',
      recipientname: '',
      imageData: null,
      isPublic: true,
    }
  },

  methods: {
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
      this.isPublic = true
    },

    async createBoard () {
      if (this.title === '' || this.recipientemail === '' || this.recipientname === '') {
        alert('No field may be left blank.')
      } else {
        await this.$store.dispatch('board/createBoard', {
          title: this.title,
          recipientemail: this.recipientemail,
          recipientname: this.recipientname,
          image: this.imageData,
          isPublic: this.isPublic,
        })
        this.clearBoard()
        this.$router.push('/boards')
      }
    },
  },

  computed: {
    jwtUser () {
      return this.$store.state.account.jwtUser
    },

    userData () {
      return this.$store.state.account.userData
    },
  },
}
</script>

<style scoped>
@import '~/assets/style.css';

.board-card {
  margin-top: 20px;
}

.title {
  font-family: Plus Jakarta Sans !important;
  font-size: 24px !important;
  color: #303030;
}

#preview-img {
  margin-top: 5px;
  max-width: 300px;
}

</style>
