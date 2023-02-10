import axios from "axios"
import { API, authHeader, getJwtToken, getUserIdFromToken } from './auth'
import randomstring from "randomstring"
import emailjs from "@emailjs/browser"

export const state = () => ({
    managedBoards: [],
    myBoards: [],
    boardData: null,
})

export const getters = {

}

export const mutations = {
    setManagedBoards(state, data) {
        state.managedBoards = data
    },

    setMyBoards(state, data) {
        state.myBoards = data
    },

    setBoardData(state, data) {
        state.boardData = data
    }
}

export const actions = {
    async createBoard({ dispatch, rootState }, { title, recipientemail, recipientname, image, suffix = '' }) {
        let link = recipientname.replace(/\s/g, '').toLowerCase().concat(suffix)
        try {
            const res = await axios.post(`${API}/board`, {
                title: title,
                recipientemail: recipientemail,
                recipientname: recipientname,
                sender: rootState.account.jwtUser.email,
                link: link,
                image: image
            },
            {
                headers: authHeader()
            })
            if (res.status === 201) {
                alert('Board successfully created!')
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
    },

    async getMyBoards({ commit, rootState }) {
        try {
            const sent = true
            const res = await axios.get(`${API}/get_my_boards?recipientemail=eq.${rootState.account.jwtUser.email}`)
            if (res.status === 200) {
                await commit('setMyBoards', res.data)
            }
        } catch (err) {
            console.log(err)
        }
    },

    async deleteBoard({ dispatch }, { board }) {
        try {
            const res = await axios.delete(`${API}/board?boardid=eq.${board.boardid}`, {
                headers: authHeader()
            })
            if (res.status === 204 || res.status === 404) {
                await dispatch('getManagedBoards')
                await dispatch('getMyBoards')
            }
        } catch (err) {
            console.log(err)
        }
    },

    async sendBoard({ dispatch }, { board }) {
        try {
            const twoWeeksMs = 1209600000
            const expiration = Date.now() + twoWeeksMs
            const params = {
                to_name: board.recipientname,
                link: board.link,
                from_email: board.sender,
                to_email: board.recipientemail,
            }
            emailjs.send('mmq_gmail_service', 'template_t7nqxg9', params, 'rWfLyPQyBNY3WqQSS')
                .then(async function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    const res = await axios.patch(`${API}/board?boardid=eq.${board.boardid}`, {
                        sent: true,
                        expiration: expiration.toString(),
                    },
                    {
                        headers: authHeader()
                    })
                    if (res.status === 204) {
                        await dispatch('getManagedBoards')
                    }
                }, function(error) {
                    console.log('FAILED...', error);
                });
        } catch (err) {
            console.log(err)
        }
    },

    async getBoardData({ commit }, { link }) {
        try {
            const res = await axios.get(`${API}/get_board_data?link=eq.${link}`)
            if (res.status === 200) {
                await commit('setBoardData', res.data[0])
            }
        } catch (err) {
            console.log(err)
        }
    },
}