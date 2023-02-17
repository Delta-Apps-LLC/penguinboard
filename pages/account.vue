<template>
  <v-col justify="center" align="center" v-if="userData != null">
    <h2>Personal Information</h2>
    <v-avatar class="avatar" size="110" color="transparent" v-if="!loading">
      <v-icon size="110" v-if="(userData.avatar === null && avatar === null) || blank === true">
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
          <v-icon>{{icon.icon}}</v-icon>
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
            :disabled="currentPass === '' || pass === '' || confirmPass === '' || pass !== confirmPass"
            text
          >
            Submit
          </v-btn>
        </td>
      </tr>
    </table>
  </v-col>
</template>

<script>
import { matchPassword } from '~/store/account'
export default {
  name: 'AccountPage',
  middleware: "auth",

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
    }
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

.upload {
  max-width: 22px;
}

h2 {
  font-family: Plus Jakarta Sans;
  font-size: 30px;
  color: #303030;
}

.icon-row {
  justify-content: center;
  margin-top: 1px;
  margin-bottom: 10px;
}

.table {
  width: 90%;
  border-collapse: collapse;
}

.table-row {
  height: 60px;
}

.header {
  font-family: Plus Jakarta Sans;
  font-size: 24px;
  text-align: center;
}

.data {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
}

td {
  width: 50%;
}

tr:nth-child(odd) {
    background-color: #dfdfdf;
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

</style>
