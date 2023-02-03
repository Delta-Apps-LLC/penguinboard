import { authHeader, deleteJwtToken, getJwtToken, getUserIdFromToken, setJwtToken } from "./auth";
import axios from "axios"
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient('https://hpjkjrfphqywelznpkei.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwamtqcmZwaHF5d2Vsem5wa2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQyNDk4OTIsImV4cCI6MTk4OTgyNTg5Mn0._wwi-agtY8LScuU9MqLogT2BO05_57ADZatuJ4DQX90')

// const API = "https://d1shlwd9bc483j.cloudfront.net"
const API = "http://ec2-54-219-6-20.us-west-1.compute.amazonaws.com:8000"
// Test http connection with AWS Amplify/Beanstalk/Lightsail
// Netlify hosting doesn't allow API connections over http
// AWS EC2 not responding over https

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
                password: user.password
            },
            {
                headers: { ...authHeader(), Prefer: "return=representation" }
            })
            if (res.status === 200) {
                console.log(res)
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
            const res = await axios.post(`${API}/rpc/login`, {
                email: user.email,
                password: user.password
            },
            {
                headers: authHeader()
            })
            if (res.status === 200) {
                console.log(res)
                setJwtToken(res.data[0].token)
                await commit('setUserFromJwt', getUserIdFromToken(getJwtToken()))
                this.$router.push('/')
            }
        } catch (err) {
            console.log(err)
            if (err.response.status === 403 || err.response.status === 401) {
                alert('Email or password is incorrect.')
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
    }
}


/// FUNCTIONS
async function getUser() {
    // const { data: { user } } = await supabase.auth.getUser()
    // console.log(`GET USER: ${user}`)
    // return user
}
