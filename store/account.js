import { authHeader, deleteJwtToken, getJwtToken, getUserIdFromToken, setJwtToken } from "./auth";
import axios from "axios"
import { createClient } from '@supabase/supabase-js'
import auth from "~/middleware/auth";
const supabase = createClient('https://hpjkjrfphqywelznpkei.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwamtqcmZwaHF5d2Vsem5wa2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQyNDk4OTIsImV4cCI6MTk4OTgyNTg5Mn0._wwi-agtY8LScuU9MqLogT2BO05_57ADZatuJ4DQX90')

// const API = "https://postgrest-alb-1826971431.us-west-1.elb.amazonaws.com"
const API = "http://ec2-54-219-6-20.us-west-1.compute.amazonaws.com:8000"
// Test http connection with AWS Amplify/Beanstalk/Lightsail
// Netlify hosting doesn't allow API connections over http
// AWS EC2 not responding over https

export const state = () => ({
    user: getJwtToken(),
})

export const getters = {
}

export const mutations = {
    setUser(state, data) {
        state.user = data
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
                headers: authHeader()
            })
            console.log(res)
            await dispatch('login', { user: user })
        } catch (err) {
            // 409 conflict user exists
            console.log(err)
        }
        // const { data, error } = await supabase.auth.signUp({
        //     email: user.email,
        //     password: user.password
        // })
    },

    async login({ commit }, { user }) {
        // const { data, error } = await supabase.auth.signInWithPassword({
        //     email: user.email,
        //     password: user.password
        // })
        // setJwtToken(data.session.access_token)
        try {
            const res = await axios.post(`${API}/rpc/login`, {
                email: user.email,
                password: user.password
            },
            {
                headers: authHeader()
            })
            console.log(res)
            setJwtToken(res.data[0].token)
            await commit('setUser', getUserIdFromToken(getJwtToken()))
            this.$router.push('/')
        } catch (err) {
            // 403 invalid user or password
            console.log(err)
        }
    },

    async signOut({ commit }) {
        // const { error } = await supabase.auth.signOut()
        deleteJwtToken()
        await commit('setUser', null)
        this.$router.push('/login')
    }
}


/// FUNCTIONS
async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    console.log(`GET USER: ${user}`)
    return user
}
