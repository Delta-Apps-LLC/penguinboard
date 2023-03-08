import axios from "axios"
import { SUPABASE } from './auth'
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
        const { data, error, status } = await SUPABASE.from('board')
            .insert({
                title: title,
                recipientemail: recipientemail,
                recipientname: recipientname,
                sender: rootState.account.jwtUser.email,
                link: link,
                image: image,
                ispublic: isPublic
            })
        if (status === 201 || status === 200 || status === 204) {
            alert('Board successfully created!')
        } else if (status === 409) {
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
    },

    async getManagedBoards({ commit, rootState }) {
        await commit('toggleLoadingManaged', true)
        const { data, error, status } = await SUPABASE.from('get_managed_boards')
            .select()
            .eq('sender', rootState.account.jwtUser.email)
        if (status === 200 || status === 201 || status === 204) {
            await commit('toggleLoadingManaged', false)
            await commit('setManagedBoards', data)
        } else await commit('toggleLoadingManaged', false)
    },

    async getMyBoards({ commit, rootState }) {
        await commit('toggleLoadingMine', true)
        const { data, error, status } = await SUPABASE.from('get_my_boards')
            .select()
            .eq('recipientemail', rootState.account.jwtUser.email)
        if (status === 200 || status === 201 || status === 204) {
            await commit('toggleLoadingMine', false)
            await commit('setMyBoards', data)
        } else await commit('toggleLoadingMine', false)
    },

    async getPublicBoards({ commit }) {
        await commit('toggleLoadingPublic', true)
        const { data, error, status } = await SUPABASE.from('get_public_boards').select()
        if (status === 200 || status === 201 || status === 204) {
            await commit('toggleLoadingPublic', false)
            await commit('setPublicBoards', data)
        } else await commit('toggleLoadingPublic', false)
    },

    async deleteBoard({ dispatch }, { board }) {
        const { data, error, status } = await SUPABASE.from('board')
            .delete()
            .eq('boardid', board.boardid)
        if (status === 200 || status === 201 || status === 204) {
            await dispatch('getManagedBoards')
            await dispatch('getMyBoards')
        } else {
            alert('Something went wrong, please try again.')
        }
    },

    async sendBoard({ dispatch }, { board }) {
        const twoWeeksMs = 1209600000
        const expiration = Date.now() + twoWeeksMs
        const params = {
            to_name: board.recipientname,
            link: board.link,
            from_email: board.sender,
            to_email: board.recipientemail,
        }
        emailjs.send('service_gkpmhag', 'template_raywi9b', params, 'xV0FXrkqMbJpZz4Eg')
            .then(async function(response) {
                const { data, error, status } = await SUPABASE.from('board')
                    .update({
                        sent: true,
                        expiration: expiration.toString()
                    })
                    .eq('boardid', board.boardid)
                if (status === 204 || status === 200 || status === 201) {
                    alert(`The board has been sent to ${board.recipientemail}`)
                    await dispatch('getManagedBoards')
                } else {
                    alert('Something went wrong, please try again.')
                }
            }, function(error) {
                console.log('FAILED...', error);
                alert('Could not send email, something went wrong.')
            });
    },

    async getBoardData({ commit }, { link }) {
        await commit('toggleLoadingBoard', true)
        const { data, error, status } = await SUPABASE.from('get_board_data')
            .select()
            .eq('link', link)
        if (status === 200 || status === 201 || status === 204) {
            await commit('toggleLoadingBoard', false)
            await commit('setBoardData', data[0])
        } else await commit('toggleLoadingBoard', false)
    },

    async saveChanges({ commit, dispatch }, { boardid, title, recipientemail, recipientname, image, isPublic, suffix = '' }) {
        let link = recipientname.replace(/\s/g, '').toLowerCase().concat(suffix)
        const { data, error, status } = await SUPABASE.from('board')
            .update({
                title: title,
                recipientemail: recipientemail,
                recipientname: recipientname,
                image: image,
                link: link,
                ispublic: isPublic
            })
            .eq('boardid', boardid)
            .select()
        if (status === 204 || status === 200 || status === 201) {
            alert('Your changes have successfully been saved.')
            await commit('setBoardData', data[0])
            localStorage.setItem('boardToEdit', data[0].link)
        } else if (status === 409) {
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