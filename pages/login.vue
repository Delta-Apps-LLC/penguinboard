<template>
  <div class="card text-center">
    <h2 class="welcome">Welcome to Bravo!</h2>
    <v-btn-toggle
      class="toggle-btn"
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
      <v-btn class="submit-btn" type="submit">Sign Up</v-btn>
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
      <v-btn class="submit-btn" type="submit">Sign In</v-btn>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'noauth',
  middleware: "login",

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

.card {
  background-color: #f3f3f3;
  padding: 20px;
  width: 560px;
  margin: auto;
  border-radius: 8px;
  box-shadow:  0 0 6px #303030;
}

.welcome {
  font-family: 'Plus Jakarta Sans';
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
  color: #303030;
}

.form {
  margin-top: 20px;
}

.form-field {
  font-family: Plus Jakarta Sans;
  background-color: #EBEBEB;
  border: solid gray;
  border-radius: 6px;
  padding: 6px;
}

.spacer {
  margin-top: 6px;
}

.toggle-btn {
  margin-top: 8px;
  font-family: Plus Jakarta Sans;
}

.submit-btn {
  background-color: #0085FF !important;
  color: #EBEBEB;
  font-family: Plus Jakarta Sans;
}

</style>