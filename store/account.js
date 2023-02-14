import { API, authHeader, deleteJwtToken, getJwtToken, getUserIdFromToken, setJwtToken } from "./auth";
import axios from "axios"
const bcrypt = require('bcryptjs')
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient('https://hpjkjrfphqywelznpkei.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwamtqcmZwaHF5d2Vsem5wa2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQyNDk4OTIsImV4cCI6MTk4OTgyNTg5Mn0._wwi-agtY8LScuU9MqLogT2BO05_57ADZatuJ4DQX90')

export const state = () => ({
    jwtUser: getJwtToken(),
    userData: null,
})

export const getters = {
}

export const mutations = {
    setUserFromJwt(state, data) {
        state.jwtUser = data
    },

    setUserData(state, data) {
        state.userData = data
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
            if (res.status === 200) {
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
            }
        } catch(err) {
            if (err.response.status === 404) {
                alert('No account was found with that email.')
            } else if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again.')
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

async function matchPassword(givenPass, accountPass) {
    const match = await bcrypt.compare(givenPass, accountPass)
    return match
}
