<template>
  <v-col justify="center" align="center">
    <v-btn @click="goToDashboard()">Show Board</v-btn>
    <v-btn @click="showBoard = true">Create Board</v-btn>
    <v-card class="board-card" v-if="showBoard"
      width="50%"
    >
      <v-card-text>
        <input type="file" ref="fileInput" accept="image/*" @input="previewImage"/>
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
      </v-card-text>
      <v-card-actions>
        <v-btn @click="cancelBoard()">Cancel</v-btn>
        <v-btn @click="createBoard()">Create Board</v-btn>
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
      showBoard: false,
      title: '',
      recipientemail: '',
      recipientname: '',
      imageData: null,
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

    goToDashboard() {
      this.$router.push('./dashboard')
    },
    
    cancelBoard () {
      this.title = ''
      this.recipientemail = ''
      this.recipientname = ''
      this.showBoard = false
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
        })
        this.cancelBoard()
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

#preview-img {
  margin-top: 5px;
  max-width: 300px;
}

</style>
