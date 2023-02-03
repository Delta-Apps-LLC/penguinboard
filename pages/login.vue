<template>
  <v-app>
    <v-col class="text-center">
      <v-btn-toggle
        mandatory
        rounded
        v-model="isLogin"
      >
        <v-btn @click="isLogin = false">
          Sign Up
        </v-btn>
        <v-btn @click="isLogin = true">
          Sign In
        </v-btn>
      </v-btn-toggle>

      <form class="form" @submit.prevent="signup" v-if="!isLogin">
        <input class="form-field" type="name" v-model="firstname" placeholder="First Name" />
        <input class="form-field" type="name" v-model="lastname" placeholder="Last Name" />
        <v-spacer class="spacer" />
        <input class="form-field" type="email" v-model="email" placeholder="Email" />
        <input class="form-field" type="password" v-model="password" placeholder="Password" />
        <v-spacer class="spacer" />
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="clearForm()"
              v-bind="attrs"
              v-on="on"
              icon
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Clear Form</span>
        </v-tooltip>
        <v-btn type="submit">Sign Up</v-btn>
      </form>

      <form class="form" @submit.prevent="login" v-if="isLogin">
        <input class="form-field" type="email" v-model="email" placeholder="Email" />
        <input class="form-field" type="password" v-model="password" placeholder="Password" />
        <v-spacer class="spacer" />
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="clearForm()"
              v-bind="attrs"
              v-on="on"
              icon
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Clear Form</span>
        </v-tooltip>
        <v-btn type="submit">Sign In</v-btn>
      </form>
    </v-col>
  </v-app>
</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'noauth',

  data () {
    return {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      isLogin: false,
    }
  },

  methods: {
    clearForm () {
      this.firstname = '' 
      this.lastname = ''
      this.email = ''
      this.password = ''
    },

    async signup () {
      const user = {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email.toLowerCase(),
        password: this.password,
      }
      await this.$store.dispatch('account/signup', {
        user: user
      })
      this.clearForm()
    },

    async login () {
      const user = {
        email: this.email.toLowerCase(),
        password: this.password,
      }
      await this.$store.dispatch('account/login', {
        user: user
      })
      this.clearForm()
    },
  },

  computed: {
    jwtUser () {
      return this.$store.state.account.jwtUser
    }
  },
}
</script>


<style scoped>
@import '~/assets/style.css';

.form {
  margin-top: 20px;
}

.form-field {
  border: solid gray;
  border-radius: 6px;
  padding: 6px;
}

.spacer {
  margin-top: 6px;
}

</style>