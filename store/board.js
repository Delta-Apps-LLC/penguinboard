import axios from "axios"
import { API, authHeader, SUPABASE_KEY } from './auth'
import randomstring from "randomstring"
import emailjs from "@emailjs/browser"

export const state = () => ({
    managedBoards: [],
    myBoards: [],
    boardData: null,
    publicBoards: [],
    loadingManaged: false,
    loadingMine: false,
    loadingPublic: false,
    loadingBoard: false,
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
    },

    setPublicBoards(state, data) {
        state.publicBoards = data  
    },

    toggleLoadingManaged(state, data) {
        state.loadingManaged = data
    },

    toggleLoadingMine(state, data) {
        state.loadingMine = data
    },

    toggleLoadingPublic(state, data) {
        state.loadingPublic = data
    },

    toggleLoadingBoard(state, data) {
        state.loadingBoard = data
    }
}

export const actions = {
    async createBoard({ dispatch, rootState }, { title, recipientemail, recipientname, image, isPublic, suffix = '' }) {
        let link = recipientname.replace(/\s/g, '').toLowerCase().concat(suffix)
        try {
            const res = await axios.post(`/board`, {
                title: title,
                recipientemail: recipientemail,
                recipientname: recipientname,
                sender: rootState.account.jwtUser.email,
                link: link,
                image: image,
                ispublic: isPublic
            },
            {
                headers: { ...authHeader(), apikey: SUPABASE_KEY }
            })
            if (res.status === 201) {
                alert('Board successfully created!')
                // await dispatch('getManagedBoards')
            }
        } catch (err) {
            console.log(err)
            if (err.response.status === 409) {
                await dispatch('createBoard', {
                    title: title,
                    recipientemail: recipientemail,
                    recipientname: recipientname,
                    image: image,
                    isPublic: isPublic,
                    suffix: randomstring.generate(5)
                })
            } else {
                alert('Something went wrong, please try again.')
            }
        }
    },

    async getManagedBoards({ commit, rootState }) {
        try {
            await commit('toggleLoadingManaged', true)
            const res = await axios.get(`/get_managed_boards?sender=eq.${rootState.account.jwtUser.email}`, {
                headers: { apikey: SUPABASE_KEY }
            })
            if (res.status === 200) {
                await commit('toggleLoadingManaged', false)
                await commit('setManagedBoards', res.data)
            }
        } catch (err) {
            console.log(err)
            await commit('toggleLoadingManaged', false)
        }
    },

    async getMyBoards({ commit, rootState }) {
        try {
            await commit('toggleLoadingMine', true)
            const res = await axios.get(`/get_my_boards?recipientemail=eq.${rootState.account.jwtUser.email}`, {
                headers: { apikey: SUPABASE_KEY }
            })
            if (res.status === 200) {
                await commit('toggleLoadingMine', false)
                await commit('setMyBoards', res.data)
            }
        } catch (err) {
            console.log(err)
            await commit('toggleLoadingMine', false)
        }
    },

    async getPublicBoards({ commit }) {
        try {
            await commit('toggleLoadingPublic', true)
            const res = await axios.get(`/get_public_boards`, {
                headers: { apikey: SUPABASE_KEY }
            })
            if (res.status === 200) {
                await commit('toggleLoadingPublic', false)
                await commit('setPublicBoards', res.data)
            }
        } catch (err) {
            console.log(err)
            await commit('toggleLoadingPublic', false)
        }
    },

    async deleteBoard({ dispatch }, { board }) {
        try {
            const res = await axios.delete(`/board?boardid=eq.${board.boardid}`, {
                headers: { ...authHeader(), apikey: SUPABASE_KEY }
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
                    const res = await axios.patch(`/board?boardid=eq.${board.boardid}`, {
                        sent: true,
                        expiration: expiration.toString(),
                    },
                    {
                        headers: { ...authHeader(), apikey: SUPABASE_KEY }
                    })
                    if (res.status === 204 || res.status === 200 || res.status === 201) {
                        alert(`The board has been sent to ${board.recipientemail}`)
                        await dispatch('getManagedBoards')
                    }
                }, function(error) {
                    console.log('FAILED...', error);
                });
        } catch (err) {
            alert('Could not send email, something went wrong.')
            console.log(err)
        }
    },

    async getBoardData({ commit }, { link }) {
        try {
            await commit('toggleLoadingBoard', true)
            const res = await axios.get(`/get_board_data?link=eq.${link}`, {
                headers: { apikey: SUPABASE_KEY }
            })
            if (res.status === 200) {
                await commit('toggleLoadingBoard', false)
                await commit('setBoardData', res.data[0])
            }
        } catch (err) {
            console.log(err)
            await commit('toggleLoadingBoard', false)
        }
    },

    async saveChanges({ commit, dispatch }, { boardid, title, recipientemail, recipientname, image, isPublic, suffix = '' }) {
        let link = recipientname.replace(/\s/g, '').toLowerCase().concat(suffix)
        try {
            const res = await axios.patch(`/board?boardid=eq.${boardid}`, {
                title: title,
                recipientemail: recipientemail,
                recipientname: recipientname,
                image: image,
                link: link,
                ispublic: isPublic
            },
            {
                headers: { ...authHeader(), Prefer: "return=representation", apikey: SUPABASE_KEY }
            })
            if (res.status === 204 || res.status === 200 || res.status === 201) {
                alert('Your changes have successfully been saved.')
                await commit('setBoardData', res.data[0])
                localStorage.setItem('boardToEdit', res.data[0].link)
            }
        } catch (err) {
            console.log(err)
            if (err.response.status === 409) {
                await dispatch('saveChanges', {
                    boardid: boardid,
                    title: title,
                    recipientemail: recipientemail,
                    recipientname: recipientname,
                    image: image,
                    isPublic: isPublic,
                    suffix: randomstring.generate(5)
                })
            } else {
                alert('Something went wrong, please try again.')
            }
        }
    }
}