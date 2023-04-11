<template>
  <v-col justify="center" align="center" v-if="userData != null">
    <h3 class="small-header" style="margin-top: 0;">Account Information</h3>
    <v-avatar class="avatar" size="110" color="transparent" v-if="!loading">
      <v-icon 
     color="white" size="110" v-if="(userData.avatar === null && avatar === null) || blank === true">
        mdi-account-circle
      </v-icon>
      <img v-if="userData.avatar !== null && avatar === null && blank === false" :src="userData.avatar" />
      <img v-if="avatar !== null" :src="avatar" />
    </v-avatar>

    <!-- Loading indicator -->
    <div class="sk-folding-cube" v-if="loading">
      <div class="sk-cube1 sk-cube"></div>
      <div class="sk-cube2 sk-cube"></div>
      <div class="sk-cube4 sk-cube"></div>
      <div class="sk-cube3 sk-cube"></div>
    </div>

    <v-row class="icon-row">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            icon
          >
            <v-file-input class="upload"
              v-model="selectedFile"
              accept="image/*"
              prepend-icon="mdi-upload"
              ref="fileInput"
              @change="previewImage"
              dense
              hide-input
            ></v-file-input>
          </v-btn>
        </template>
        <span>Upload Picture</span>
      </v-tooltip>
      <v-tooltip bottom v-for="(icon, i) in icons" :key="i">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="icon.click"
            v-bind="attrs"
            v-on="on"
            icon
            :disabled="icon.disabled"
          >
            <v-icon class="icons">{{icon.icon}}</v-icon>
          </v-btn>
        </template>
        <span>{{icon.span}}</span>
      </v-tooltip>
    </v-row>

    <table class="table">
      <tr class="table-row">
        <td class="header">Name</td>
        <td class="data">{{userData.firstname}} {{userData.lastname}}</td>
      </tr>

      <tr class="table-row">
        <td class="header">Email</td>
        <td class="data">{{userData.email}}</td>
      </tr>

      <tr class="table-row">
        <td class="header">Password</td>
        <td class="data">
          <input class="form-field-1" type="password" v-model="currentPass" placeholder="Current Password" />
          <br>
          <input class="form-field-2" type="password" v-model="pass" placeholder="New Password" />
          <br>
          <input class="form-field-3" type="password" v-model="confirmPass" placeholder="Confirm Password" />
          <v-btn
            @click="changePassword()"
            :disabled="disableSubmitBtn"
            class="blue--text"
            text
          >
            Submit
          </v-btn>
        </td>
      </tr>
    </table>

    <h3 class="small-header" id="pricing">Purchase Boards</h3>
    <h4 class="pricing-subtext">Remaining Boards: {{userData.boardsremaining}}</h4>

    <div class="pricing-options">
      <div class="option">
        <h2 style="color: #1DA9D3;">Single</h2>
        <p>$1 / board</p>
        <ul>
          <li>Access to one Penguin Board with Unlimited Posts</li>
        </ul>
        <v-btn class="white--text" color="#1DA9D3" style="width: 100%;" @click="buyBoard('1')">
          Select
        </v-btn>
      </div>
      <div class="option">
        <h2 style="color: #7D387D;">Small</h2>
        <p>$3 / 5 boards</p>
        <ul>
          <li>Access to five Penguin Boards with Unlimited Posts</li>
        </ul>
        <v-btn class="white--text" color="#7D387D" style="width: 100%;" @click="buyBoard('2')">
          Select
        </v-btn>
      </div>
      <div class="option">
        <h2 style="color: #F26419;">Medium</h2>
        <p>$5 / 10 boards</p>
        <ul>
          <li>Access to ten Penguin Boards with Unlimited Posts</li>
        </ul>
        <v-btn class="white--text" color="#F26419" style="width: 100%;" @click="buyBoard('3')">
          Select
        </v-btn>
      </div>
      <div class="option">
        <h2 style="color: #ED254E;">Unlimited</h2>
        <p>$20 / Year</p>
        <ul>
          <li>Access to Unlimited Penguin Boards for a year</li>
        </ul>
        <v-btn class="white--text" color="#ED254E" style="width: 100%;" @click="buyBoard('4')">
          Select
        </v-btn>
      </div>
    </div>

  </v-col>
</template>

<script>
import { matchPassword } from '~/store/account'
export default {
  name: 'AccountPage',
  middleware: "auth",

  mounted() {
    console.log(this.$route.from)
    const queryString = this.$route.query
    console.log(queryString)
  },

  data () {
    return {
      currentPass: '',
      pass: '',
      confirmPass: '',
      avatar: null,
      selectedFile: null,
      blank: false,
      loading: false,
      icons: [
        {
          icon: 'mdi-close-circle',
          span: 'Remove Picture',
          click: this.removePicture,
          disabled: false
        },
        {
          icon: 'mdi-content-save',
          span: 'Save',
          click: this.savePicture,
          disabled: this.avatar == null && this.blank == false
        },
      ]
    }
  },

  methods: {
    async changePassword() {
      if (await matchPassword(this.currentPass, this.userData.password)) {
        await this.$store.dispatch('account/resetPass', {
          email: this.userData.email,
          password: this.confirmPass
        })
        this.currentPass = ''
        this.pass = ''
        this.confirmPass = ''
      } else {
        alert('Your current password is incorrect.')
      }
    },

    previewImage(event) {
      this.loading = true
      const file = this.selectedFile
      if (!file) return;
      const reader = new FileReader()
      reader.onload = e => {
        this.avatar = e.target.result
      }
      reader.readAsDataURL(file)
      this.loading = false
      this.blank = false
    },

    removePicture() {
      this.selectedFile = null
      this.avatar = null
      this.blank = true
    },

    async savePicture() {
      if (!this.blank && this.avatar === null) {
        // do nothing
      } else {
        this.loading = true
        await this.$store.dispatch('account/updateAvatar', {
          userid: this.userData.userid,
          avatar: this.avatar
        })
        this.selectedFile = null
        this.avatar = null
        this.loading = false
      }
    },

    buyBoard(boardNum) {
      if (boardNum === '1') {
        window.open('https://buy.stripe.com/test_eVag1y2PL5JtaGsdQQ', '_blank');
      }
      else if (boardNum === '2') {
        window.open('https://buy.stripe.com/test_28o2aI3TP3BlaGs6op', '_blank');
      }
      else if (boardNum === '3') {
        window.open('https://buy.stripe.com/test_8wM4iQ1LHc7R5m8002', '_blank');
      }
      else if (boardNum === '4') {
        window.open('https://buy.stripe.com/test_5kAdTqdup1td5m8dQT', '_blank');
      }
    }
  },

  computed: {
    jwtUser () {
      return this.$store.state.account.jwtUser
    },

    userData () {
      return this.$store.state.account.userData
    },

    disableSubmitBtn() {
      return this.currentPass === '' || this.pass === '' || this.confirmPass === '' || this.pass !== this.confirmPass
    }
  },
}
</script>

<style scoped>
@import '~/assets/style.css';

.avatar {
  margin-top: 10px;
}

.upload {
  max-width: 22px;
  color: #EBEBEB;
}

.icons {
  color: #EBEBEB !important;
}

h2 {
  font-family: Plus Jakarta Sans;
  font-size: 30px;
  color: #EBEBEB;
}

.icon-row {
  justify-content: center;
  margin-top: 1px;
  margin-bottom: 10px;
}

.table {
  width: 95%;
  border-collapse: collapse;
}

.table-row {
  height: 60px;
}

.header {
  font-family: Plus Jakarta Sans;
  font-size: 24px;
  text-align: center;
  /* color: #EBEBEB; */
  color: solid gray;
}

.data {
  font-family: Plus Jakarta Sans;
  font-size: 18px;
  /* color: #EBEBEB; */
  color: solid gray;
}

td {
  width: 50%;
}

tr:nth-child(even) {
    /* background-color: #7D387D; */
    background-color: #EBEBEB;
}

tr:nth-child(odd) {
    /* background-color: #303030; */
    background-color: #EBEBEB;
}

.form-field-1, .form-field-2, .form-field-3 {
  background-color: #EBEBEB;
  border: solid gray;
  border-radius: 6px;
  padding: 4px;
}

.form-field-1 {
  margin-top: 6px;
  margin-bottom: 1px;
}

.form-field-2 {
  margin-top: 1px;
  margin-bottom: 1px;
}

.form-field-3 {
  margin-top: 1px;
  margin-bottom: 6px;
}

.small-header {
  margin-top: 50px;
}

.pricing-subtext {
  font-style: italic;
  color: #EBEBEB;
  /* font-size: 16px; */
}

.pricing-options {
  margin: 20px;
  display: flex;
  justify-content: space-between;
}

.option {
  width: 23%;
  background-color: #EBEBEB;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  position: relative;
}

.option ul {
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: left;
  margin-bottom: 20px;
}

.option li {
  font-size: 16px;
  margin-bottom: 5px;
}

</style>
