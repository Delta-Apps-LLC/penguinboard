<template>
  <v-app>
    <h1 class="large-header">Welcome to Penguin Board</h1>
    <h2 class="medium-header">Recognize others</h2>

    <v-btn to="/login" height="60px" color="#1DA9D3" class="white--text" style="margin: 10px; text-align: center; font-size: large;" 
      @click="toggleLogin()">
      Get Started
    </v-btn>

    <p class="description-paragraph">
      Penguin Board is a software platform where you can write digital cards to those you care about. 
      These cards can cover a wide range of occasions such as birthdays, celebrations, Thank You opportunities, encouragement, and more. 
    </p>

    <h2 class="medium-header">Graduation Sample Board</h2>

    <v-row v-if="showSampleRow">
      <post
        :key="1"
        :gif="'cl27Mh8srUEog5GtUR'"
        :message="'<p>Congratulations!!! You did it!</p>'"
        :author="'Aunt Clara'"
        class="col-lg-4 col-md-6 col-sm-12 px-0"
      ></post>

      <post
        :key="2"
        :gif="'WsGIKEooehJsW8ZMH8'"
        :message="'<p>Wooow! Let\'s go!!</p>'"
        :author="'Brent'"
        class="col-lg-4 col-md-6 col-sm-12 px-0"
      ></post>

      <post
        :key="3"
        :gif="'hfoippkIKxOqosR6xm'"
        :message="'<p>So proud of you</p>'"
        :author="'Mom'"
        class="col-lg-4 col-md-6 col-sm-12 px-0"
      ></post>

      <post
        :key="4"
        :gif="'jvtGmtAKiUcnu'"
        :message="'<p>Gender studies graduate isn\'t something to celebrate</p>'"
        :author="'Grandpa'"
        class="col-lg-4 col-md-6 col-sm-12 px-0"
      ></post>

      <post
        :key="5"
        :gif="'vQqeT3AYg8S5O'"
        :message="'<p>Didn\'t doubt you too often. Congrats!</p>'"
        :author="'Emily'"
        class="col-lg-4 col-md-6 col-sm-12 px-0"
      ></post>

      <post
        :key="6"
        :gif="'kyLYXonQYYfwYDIeZl'"
        :message="'<p>Let\'s Party!!!</p>'"
        :author="'Michael'"
        class="col-lg-4 col-md-6 col-sm-12 px-0"
      ></post>
    </v-row>

    <div class="pricing-header">
      <h2 class="pricing-text">Simple Pricing</h2>
    </div>

    <div class="pricing-options">
      <div class="option">
        <h2 style="color: #1DA9D3;">Basic</h2>
        <p>$1 / board</p>
        <ul>
          <li>Access to one Penguin Board with Unlimited Posts</li>
        </ul>
        <v-btn class="white--text" color="#1DA9D3" style="width: 100%;" @click="toggleLogin('1')">
          Select
        </v-btn>
      </div>
      <div class="option">
        <h2 style="color: #7D387D;">Pro</h2>
        <p>$3 / 5 boards</p>
        <ul>
          <li>Access to five Penguin Boards with Unlimited Posts</li>
        </ul>
        <v-btn class="white--text" color="#7D387D" style="width: 100%;" @click="toggleLogin('2')">
          Select
        </v-btn>
      </div>
      <div class="option">
        <h2 style="color: #F26419;">Premium</h2>
        <p>$5 / 10 boards</p>
        <ul>
          <li>Access to ten Penguin Boards with Unlimited Posts</li>
        </ul>
        <v-btn class="white--text" color="#F26419" style="width: 100%;" @click="toggleLogin('3')">
          Select
        </v-btn>
      </div>
      <div class="option">
        <h2 style="color: #ED254E;">Unlimited</h2>
        <p>$20 / Year</p>
        <ul>
          <li>Access to Unlimited Penguin Boards for a year</li>
        </ul>
        <v-btn class="white--text" color="#ED254E" style="width: 100%;" @click="toggleLogin('4')">
          Select
        </v-btn>
      </div>
    </div>

    <v-spacer/>

    <h3 class="small-header">FAQ</h3>
    <FAQ />

    <v-btn to="/login" height="60px" color="#1DA9D3" class="white--text" style="margin: 10px; text-align: center; font-size: large;" 
      @click="toggleLogin()">
      Create my First Board
    </v-btn>

    <v-spacer/>
    <v-spacer/>
    <v-spacer/>
    <v-spacer/>
    <v-spacer/>
    <v-spacer/>

    <Login v-show="showLogin" @close-modal="showLogin = false" :buyBoardNumber="`${buyBoardNum}`"/>
  </v-app>
</template>

<script>
import post from "~/components/post"
import Login from "~/components/Login.vue"
import FAQ from "~/components/Faq.vue"

export default {
  name: 'LoginPage',
  layout: 'noauth',
  middleware: "login",

  components: {
    Login,
    FAQ,
    post
  },

  data () {
    return {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      isLogin: false,
      showLogin: false,
      buyBoardNum: 0,
    }
  },

  methods: {
    async toggleLogin(boardNum) {
      this.buyBoardNum = boardNum
      await this.$store.commit('account/setShowSampleRow', false)
      this.showLogin = true
    },

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
    },

    isMobile () {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    },

    showSampleRow () {
      return this.$store.state.account.showSampleRow
    }
  },
}
</script>


<style scoped>
@import '~/assets/style.css';

.large-header {
  position: relative;
  margin-bottom: 2%;
  margin-top: 10%;
  clear: both;
  font-family: Poppins, sans-serif;
  font-size: 4rem;
  font-weight: 600;
  letter-spacing: -.02em;
  white-space: normal;
  text-align: center; 
  color: #EBEBEB;
}

.medium-header {
  margin-top: 0;
  margin-bottom: 40px;
  font-family: Poppins, sans-serif;
  line-height: 1.5;
  font-size: 3rem;
  font-weight: 400;
  letter-spacing: -.02em;
  -webkit-column-span: none;
  column-span: none;
  text-align: center; 
  color: #EBEBEB;
}

.small-header {
  font-family: Poppins, sans-serif;
  font-size: 2rem;
  margin-top: 50px;
  padding: 6px;
  text-align: center;
  color: #EBEBEB;
  background-image: linear-gradient(to right, #7D387D, #1DA9D3);
  border-radius: 20px;
}

.description-paragraph {
  margin-top: 40px;
  margin-bottom: 40px;
  font-family: Poppins, sans-serif;
  font-size: .875rem;
  line-height: 1.5;
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: -.02em;
  -webkit-column-span: none;
  column-span: none;
  text-align: center; 
  color: #EBEBEB;
}

.card {
  background-color: #f3f3f3;
  padding-top: 20px;
  width: 560px;
  margin: 20px auto;
  border-radius: 8px;
  box-shadow:  0 0 6px #303030;
  background-image: url("~/assets/images/penguin-fade.png");
  background-position: center;
  background-size: 60%;
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

.forgot-password {
  margin: 20px;
}

.pricing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  color: white;
  text-align: center!important;
  padding-left: 25%;
  padding-right: 25%;
  padding-top: 4%;
  padding-bottom: 1%;
}

.pricing-text{
  width: 100%;
  /* background-color: #f9f9f9; */
  padding: 20px;
  position: relative;
  align-items: center;
}

.pricing-options {
  display: flex;
  justify-content: space-between;
}

.option {
  width: 23%;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  position: relative;
}

.option h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.option p {
  font-size: 18px;
  margin-bottom: 20px;
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

.option v-btn {
  background-color: #4CAF50;
  color: aqua;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.popular .badge {
  background-color: #ff9800;
  color: white;
  padding: 10px;
  border-radius: 5px;
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
}
  
  .wider {
    width: 150px;
  }
  
  @media (max-width: 768px) {
    .option {
      flex-basis: 100%;
    }
  }
  
  @media (min-width: 769px) and (max-width: 1024px) {
    .pricing-options {
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .option {
      flex-basis: 48%;
    }
  }

</style>