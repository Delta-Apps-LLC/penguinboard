<template>
  <v-col justify="center" align="center">
    <h2>Personal Information</h2>
    <table class="table" v-if="userData != null">
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

h2 {
  margin-bottom: 20px;
  font-family: Plus Jakarta Sans;
  font-size: 30px;
  color: #303030;
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
