<template>
    <div class="modal-overlay" @click="close()">
        <div :class="isMobile ? 'modal-mobile' : 'modal'" 
            @click.stop
            :style="{'height': isMobile ? null : isLogin ? '300px' : null}"
        >
          <h2 class="welcome" :style="{'font-size': isMobile ? '28px' : null}">Welcome to Penguin Board!</h2>
          <h1 v-if="buyBoardNumber !== ''" class="purchase" :style="{'font-size': isMobile ? '28px' : null}">
            Please sign in/up before you purchase a board
          </h1>
            <v-col class="text-center">
                <v-btn-toggle
                    class="toggle-btn"
                    mandatory
                    rounded
                    v-model="isLogin"
                    v-if="!loadingLogin"
                >
                    <v-btn @click="isLogin = false">
                    Sign Up
                    </v-btn>
                    <v-btn @click="isLogin = true">
                    Sign In
                    </v-btn>
                </v-btn-toggle>

                <form class="form" @submit.prevent="signup" v-if="!isLogin && !loadingLogin">
                    <input class="form-field" type="name" v-model="firstname" placeholder="First Name" />
                    <input class="form-field" type="name" v-model="lastname" placeholder="Last Name" :style="{'margin-top': isMobile ? '6px' : null}" />
                    <v-spacer class="spacer" />
                    <input class="form-field" type="email" v-model="email" placeholder="Email" />
                    <input class="form-field" type="password" v-model="password" placeholder="Password" :style="{'margin-top': isMobile ? '6px' : null}" />
                    <v-spacer />
                    <input class="check" type="checkbox" name="age" v-model="overThirteen" />
                    <label for="age">Confirm you are at least 13 years of age.</label>
                    <v-spacer />
                    <input class="check" type="checkbox" name="consent" v-model="consent" />
                    <label for="consent">
                      <span>I consent to the </span>
                      <a target="_blank" href="/privacy_policy.pdf">Privacy Policy</a>
                      <span> and the </span>
                      <a target="_blank" href="/terms_conditions.pdf">Terms and Conditions</a>
                    </label>
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
                    <v-btn type="submit" :disabled="!overThirteen || !consent" color="#1DA9D3" class="white--text">
                      Sign Up
                    </v-btn>
                </form>

                <form class="form" @submit.prevent="login" v-if="isLogin && !loadingLogin">
                    <input class="form-field" type="email" v-model="email" placeholder="Email" />
                    <input class="form-field" type="password" v-model="password" placeholder="Password" :style="{'margin-top': isMobile ? '6px' : null}" />
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
                    <v-btn type="submit" color="#1DA9D3" class="white--text">Sign In</v-btn>
                </form>

                <!-- Loading indicator -->
                <div class="sk-folding-cube" v-if="loadingLogin">
                  <div class="sk-cube1 sk-cube"></div>
                  <div class="sk-cube2 sk-cube"></div>
                  <div class="sk-cube4 sk-cube"></div>
                  <div class="sk-cube3 sk-cube"></div>
                </div>

                <p class="forgot-password" @click="$emit('close-modal')">
                  <nuxt-link to="/password"><b>Forgot Password</b></nuxt-link>
                </p>
            </v-col>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Login',

  props: {
    buyBoardNumber: {
      type: String,
      default: '',
    }
  },

  data () {
    return {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      isLogin: false,
      overThirteen: false,
      consent: false,
    }
  },

  methods: {
    async close () {
      this.email = ""
      this.password = ""
      this.firstname = ""
      this.lastname = ""
      await this.$store.commit('account/setShowSampleRow', true)
      this.$emit('close-modal')
    },
    
    clearForm () {
      this.firstname = '' 
      this.lastname = ''
      this.email = ''
      this.password = ''
      this.overThirteen = false
      this.consent = false
    },

    async signup () {
      const user = {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email.toLowerCase(),
        password: this.password,
      }
      await this.$store.dispatch('account/signup', {
        user: user,
        boardNum: this.buyBoardNumber,
      })
      this.clearForm()
    },

    async login () {
      const user = {
        email: this.email.toLowerCase(),
        password: this.password,
      }
      await this.$store.dispatch('account/login', {
        user: user,
        boardNum: this.buyBoardNumber,
      })
      this.clearForm()
    },
  },

  computed: {
    isMobile () {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    },

    loadingLogin () {
      return this.$store.state.account.loadingLogin
    }
  },
}
</script>

<style scoped>
@import '~/assets/style.css';

.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000f0;
}

.modal {
  text-align: center;
  background-color: #EBEBEB;
  height: 400px;
  width: 560px;
  margin-top: 10%;
  padding: 15px 0;
  border-radius: 20px;
  box-shadow:  0 0 6px #303030;
  background-image: url("~/assets/images/penguin-fade.png");
  background-position: center;
  background-size: 60%;
}

.modal-mobile {
    text-align: center;
    background-color: #EBEBEB;
    height: 60%;
    width: 95%;
    margin-top: 25%;
    padding: 15px 0;
    border-radius: 20px;
    box-shadow:  0 0 6px #303030;
    background-image: url("~/assets/images/penguin-fade.png");
    background-position: center;
    background-size: 100%;
}

.modal, .modal-overlay, .modal-mobile {
    animation: fadeInAnimation ease 1s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

@keyframes fadeInAnimation {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

.check {
  height: 18px;
  width: 18px;
}

.spacer {
  margin-top: 6px;
}

.welcome {
  font-family: 'Plus Jakarta Sans';
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
  color: #303030;
}

.purchase {
  font-family: 'Plus Jakarta Sans';
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 10px;
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
  padding: 8px;
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

.forgot-password {
  margin: 20px;
}

</style>
