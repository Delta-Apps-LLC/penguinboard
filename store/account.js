import { API, authHeader, deleteJwtToken, getJwtToken, getUserIdFromToken, setJwtToken } from "./auth";
import axios from "axios"
import randomstring from "randomstring"
import emailjs from "@emailjs/browser"
const bcrypt = require('bcryptjs')
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient('https://hpjkjrfphqywelznpkei.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwamtqcmZwaHF5d2Vsem5wa2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQyNDk4OTIsImV4cCI6MTk4OTgyNTg5Mn0._wwi-agtY8LScuU9MqLogT2BO05_57ADZatuJ4DQX90')

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
        try {
            const res = await axios.post(`${API}/rpc/signup`, {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                password: await encryptPassword(user.password)
            },
            {
                headers: { ...authHeader(), Prefer: "return=representation" }
            })
            if (res.status === 200) {
                await dispatch('login', { user: user })
            }
        } catch (err) {
            console.log(err)
            if (err.response.status === 409) {
                alert('An account with that email already exists.')
            }
        }
        // const { data, error } = await supabase.auth.signUp({
        //     email: user.email,
        //     password: user.password
        // })
    },

    async login({ commit }, { user }) {
        try {
            const res = await axios.get(`${API}/user?email=eq.${user.email}`)
            if (res.status === 200 && res.data.length !== 0) {
                if (await matchPassword(user.password, res.data[0].password)) {
                    try {
                        const response = await axios.post(`${API}/rpc/login`, {
                            email: user.email,
                            password: res.data[0].password
                        },
                        {
                            headers: authHeader()
                        })
                        if (response.status === 200) {
                            setJwtToken(response.data[0].token)
                            await commit('setUserFromJwt', getUserIdFromToken(getJwtToken()))
                            this.$router.push('/')
                        }
                    } catch(err) {
                        console.log(err)
                        if (err.response.status === 403 || err.response.status === 401) {
                            alert('Email or password is incorrect.')
                        }
                    }
                } else {
                    alert('The password you entered was incorrect.')
                }
            } else {
                if (res.data.length === 0) {
                    alert('No account was found with that email.')
                }
            }
        } catch(err) {
            if (err) {
                console.log(err)
                if (err.response.status === 404) {
                    alert('No account was found with that email.')
                } else if (err.response.status === 400) {
                    alert('Something went wrong, please refresh the page and try again.')
                }
            }
        }
        // const { data, error } = await supabase.auth.signInWithPassword({
        //     email: user.email,
        //     password: user.password
        // })
        // setJwtToken(data.session.access_token)
    },

    async getCurrentUser({ commit, state }) {
        try {
            const res = await axios.get(`${API}/get_user_data?email=eq.${state.jwtUser.email}`)
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
            const res = await axios.get(`${API}/user?email=eq.${email}`)
            if (res.status === 200) {
                try {
                    const fifteenMin = 900000
                    const expiration = Date.now() + fifteenMin
                    const res2 = await axios.post(`${API}/reset_code`, {
                        code: code,
                        codeemail: email,
                        codeexpiration: expiration.toString(),
                    },
                    {
                        headers: { Prefer: "return=representation" }
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
            const res = await axios.patch(`${API}/user?email=eq.${email}`, {
                password: await encryptPassword(password)
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
            const res = await axios.patch(`${API}/user?userid=eq.${userid}`, {
                avatar: avatar
            },
            {
                headers: { ...authHeader(), Prefer: "return=representation" }
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
