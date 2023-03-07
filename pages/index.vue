<template>
  <v-col justify="center" align="center">
    <v-card class="board-card"
      :width="isMobile ? '100%' : '50%'"
    >
      <v-card-title class="title justify-center"
        style="word-break: break-word;"
      >
        Create a New Board Here!
      </v-card-title>

      <v-card-text>
        <label for="image" v-if="imageData == null">Upload image (optional)</label>
        <v-tooltip left v-if="imageData != null">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon
              v-bind="attrs"
              v-on="on"
              @click="imageData = null"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Remove Image</span>
        </v-tooltip>
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

    isMobile () {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    },
  },
}
</script>

<style scoped>
@import '~/assets/style.css';

.board-card {
  margin-top: 20px;
  background-image: url("~/assets/images/penguin-fade.png");
  background-position: center;
  background-size: 80%;
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
