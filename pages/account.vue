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
    <h4 class="pricing-subtext">
      Remaining Boards: {{userData.subscriptionexp != null ? 'Unlimited' : userData.boardsremaining}}
    </h4>
    <h4 class="pricing-subtext" v-if="userData.subscriptionexp != null">
      Your one year subscription will expire on {{expirationdate}}
    </h4>

    <div :class="isMobile ? 'pricing-options-mobile justify-center' : 'pricing-options'">
      <div class="option" :style="{'flex-basis': isMobile ? '46%' : null, 'margin': '2px'}">
        <h2 style="color: #1DA9D3;">Single</h2>
        <p>$1 / board</p>
        <ul>
          <li>Access to one Penguin Board with Unlimited Posts</li>
        </ul>
        <v-btn class="white--text" color="#1DA9D3" style="width: 100%;" @click="buyBoard('1')"
          :disabled="purchaseBtnDisabled"
        >
          Select
        </v-btn>
      </div>
      <div class="option" :style="{'flex-basis': isMobile ? '46%' : null, 'margin': '2px'}">
        <h2 style="color: #7D387D;">Small</h2>
        <p>$3 / 5 boards</p>
        <ul>
          <li>Access to five Penguin Boards with Unlimited Posts</li>
        </ul>
        <v-btn class="white--text" color="#7D387D" style="width: 100%;" @click="buyBoard('2')"
          :disabled="purchaseBtnDisabled"
        >
          Select
        </v-btn>
      </div>
      <div class="option" :style="{'flex-basis': isMobile ? '46%' : null, 'margin': '2px'}">
        <h2 style="color: #F26419;">Medium</h2>
        <p>$5 / 10 boards</p>
        <ul>
          <li>Access to ten Penguin Boards with Unlimited Posts</li>
        </ul>
        <v-btn class="white--text" color="#F26419" style="width: 100%;" @click="buyBoard('3')"
          :disabled="purchaseBtnDisabled"
        >
          Select
        </v-btn>
      </div>
      <div class="option" :style="{'flex-basis': isMobile ? '46%' : null, 'margin': '2px'}">
        <h2 style="color: #ED254E;">Unlimited</h2>
        <p>$20 / Year</p>
        <ul>
          <li>Access to Unlimited Penguin Boards for a year</li>
        </ul>
        <v-btn class="white--text" color="#ED254E" style="width: 100%;" @click="buyBoard('4')"
          :disabled="purchaseBtnDisabled"
        >
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
    },

    purchaseBtnDisabled () {
      return this.userData.subscriptionexp != null
    },

    expirationdate () {
      let date = new Date(parseInt(this.userData.subscriptionexp)).toDateString()
      return date
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
  background-color: #EBEBEB;
  width: 95%;
  border-collapse: separate;
  border-radius: 50px !important;
  border-spacing: 0;
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
  margin-top: 10px;
  /* font-size: 16px; */
}

.pricing-options {
  margin: 10px;
  display: flex;
  justify-content: space-between;
}

.pricing-options-mobile {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: wrap !important;
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
