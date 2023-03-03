import { API, SUPABASE, authHeader, deleteJwtToken, getJwtToken, getUserIdFromToken, setJwtToken, SUPABASE_KEY } from "./auth";
import axios from "axios"
import randomstring from "randomstring"
import emailjs from "@emailjs/browser"
const bcrypt = require('bcryptjs')


export const state = () => ({
    jwtUser: getJwtToken(),
    userData: null,
    resetCode: null,
})

export const getters = {
}

export const mutations = {
    setUserFromJwt(state, data) {
        state.jwtUser = data
    },

    setUserData(state, data) {
        state.userData = data
    },

    setResetCode(state, data) {
        state.resetCode = data
    }
}

export const actions = {
    async signup({ dispatch }, { user }) {
        const { data, error, status } = await SUPABASE.rpc('signup', {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            password: await encryptPassword(user.password)
        })
        if (status === 204) {
            await dispatch('login', { user: user })
        } else if (status === 409) {
            alert('An account already exists with that email.')
        } else {
            if (error) {
                console.log(err)
            }
        }
    },

    async getUser({}, { user }) {
        const { data, error, status } = await SUPABASE.from('user')
            .select()
            .eq('email', user.email)
        return data
    },

    async login({ commit, dispatch }, { user }) {
        const res = await dispatch('getUser', { user: user })
        if (res.length > 0) {
            if (await matchPassword(user.password, res[0].password)) {
                const { data, error, status } = await SUPABASE.rpc('login', {
                    email: user.email,
                    password: res[0].password
                })
                if (data.token !== null) {
                    setJwtToken(data.token)
                    await commit('setUserFromJwt', getUserIdFromToken(getJwtToken()))
                    this.$router.push('/')
                }
            } else {
                alert('The password you provided is incorrect.')
            }
        } else if (res.length === 0) {
            alert('No account was found with that email.')
        }
    },

    async getCurrentUser({ commit, state }) {
        try {
            const res = await axios.get(`/rest/v1/public/get_user_data?email=eq.${state.jwtUser.email}`, {
                headers: { apikey: SUPABASE_KEY }
            })
            if (res.status === 200) {
                await commit('setUserData', res.data[0])
            }
        } catch (err) {
            console.log(err)
        }
    },

    async signOut({ commit }) {
        // const { error } = await supabase.auth.signOut()
        deleteJwtToken()
        await commit('setUserFromJwt', null)
        this.$router.push('/login')
    },

    async getPassResetCode({ commit, dispatch }, { email, code = randomstring.generate(6) }) {
        try {
            const res = await axios.get(`/user?email=eq.${email}`, {
                headers: { apikey: SUPABASE_KEY }
            })
            if (res.status === 200) {
                try {
                    const fifteenMin = 900000
                    const expiration = Date.now() + fifteenMin
                    const res2 = await axios.post(`/reset_code`, {
                        code: code,
                        codeemail: email,
                        codeexpiration: expiration.toString(),
                    },
                    {
                        headers: { Prefer: "return=representation", apikey: SUPABASE_KEY }
                    })
                    if (res2.status === 200 || res2.status === 201) {
                        const params = {
                            to_name: res.data[0].firstname,
                            to_email: res2.data[0].codeemail,
                            code: code,
                            codeexpiration: new Date(expiration)
                        }
                        emailjs.send('mmq_gmail_service', 'template_kbqejnl', params, 'rWfLyPQyBNY3WqQSS')
                        .then(async function(response) {
                            alert(`Check your email and enter the code in the space below. The code will expire in 15 minutes.`)
                            await commit('setResetCode', res2.data[0])
                        }, function(error) {
                            console.log('FAILED...', error);
                        });
                    }
                } catch (err) {
                    console.log(err)
                    if (err.response.status === 409) {
                        await dispatch('getPassResetCode', { email: email })
                    }
                }
            }
        } catch (err) {
            console.log(err)
            if (err.response.status === 404) {
                alert('No account found with that email.')
            } else {
                alert('Something went wrong, please try again.')
            }
        }
    },

    async resetPass({}, { email, password }) {
        try {
            const res = await axios.patch(`/user?email=eq.${email}`, {
                password: await encryptPassword(password)
            },
            {
                headers: { apikey: SUPABASE_KEY }
            })
            if (res.status === 204 || res.status === 201 || res.status === 200) {
                alert('Password reset successful')
            }
        } catch (err) {
            console.log(err)
            alert('Something went wrong, please try again.')
        }
    },

    async updateAvatar({ commit }, { userid, avatar }) {
        try {
            const res = await axios.patch(`/user?userid=eq.${userid}`, {
                avatar: avatar
            },
            {
                headers: { ...authHeader(), Prefer: "return=representation", apikey: SUPABASE_KEY }
            })
            if (res.status === 204 || res.status === 200 || res.status === 201) {
                alert('Profile photo successfully updated.')
                await commit('setUserData', res.data[0])
            }
        } catch (err) {
            console.log(err)
            alert('Something went wrong, please try again.')
        }
    }
}


/// FUNCTIONS
async function getUser() {
    // const { data: { user } } = await supabase.auth.getUser()
    // console.log(`GET USER: ${user}`)
    // return user
}

async function encryptPassword (password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export async function matchPassword(givenPass, accountPass) {
    const match = await bcrypt.compare(givenPass, accountPass)
    return match
}
