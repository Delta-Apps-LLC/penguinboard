import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://hpjkjrfphqywelznpkei.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwamtqcmZwaHF5d2Vsem5wa2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQyNDk4OTIsImV4cCI6MTk4OTgyNTg5Mn0._wwi-agtY8LScuU9MqLogT2BO05_57ADZatuJ4DQX90')

export const state = () => ({
    user: getUser(),
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
        const { data, error } = await supabase.auth.signUp({
            email: user.email,
            password: user.password
        })
        console.log(`SIGNUP: ${data}`)
        await dispatch('login', { user: user })
    },

    async login({ commit }, { user }) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: user.password
        })
        console.log(`LOGIN: ${data}`)
        await commit('setUser', data)
    }
}


/// FUNCTIONS
async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    console.log(`GET USER: ${user}`)
    return user
}
