import axios from "axios"
import { API, authHeader, getJwtToken, getUserIdFromToken } from './auth'
import randomstring from "randomstring"

export const state = () => ({
    managedBoards: [],
    myBoards: [],
})

export const getters = {

}

export const mutations = {
    setManagedBoards(state, data) {
        state.managedBoards = data
    }
}

export const actions = {
    async createBoard({ dispatch, rootState }, { title, recipientemail, recipientname, suffix = '' }) {
        let link = recipientname.replace(/\s/g, '').toLowerCase().concat(suffix)
        try {
            const res = await axios.post(`${API}/board`, {
                title: title,
                recipientemail: recipientemail,
                recipientname: recipientname,
                sender: rootState.account.jwtUser.email,
                link: link
            },
            {
                headers: authHeader()
            })
            if (res.status === 201) {
                await dispatch('getManagedBoards')
            }
        } catch (err) {
            console.log(err)
            if (err.response.status === 409) {
                await dispatch('createBoard', {
                    title: title,
                    recipientemail: recipientemail,
                    recipientname: recipientname,
                    suffix: randomstring.generate(5)
                })
            }
        }
    },

    async getManagedBoards({ commit, rootState }) {
        try {
            const res = await axios.get(`${API}/get_managed_boards?sender=eq.${rootState.account.jwtUser.email}`)
            if (res.status === 200) {
                await commit('setManagedBoards', res.data)
            }
        } catch (err) {
            console.log(err)
        }
    }
}