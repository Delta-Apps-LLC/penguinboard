import axios from "axios"
import { API, authHeader } from './auth'

export const state = () => ({
    posts: [],
    boardData: null,
})

export const getters = {
}

export const mutations = {
    setPosts(state, data) {
        state.posts = data
    },

    setBoardData(state, data) {
        state.boardData = data
    }
}

export const actions = {
    async getBoardPosts({ commit }, { link }) {
        try {
            const res = await axios.get(`${API}/get_board_posts?link=eq.${link}`)
            if (res.status === 200) {
                await commit('setPosts', res.data)
            }
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

    async sendPost({ commit }, { post }) {
        try {
            const res = await axios.post(`${API}/post`, {
                message: post.message,
                boardid: post.boardid,
                from: post.from
            },
            {
                headers: authHeader()
            })
            if (res.status === 201 || res.status === 200) {
                console.log(res)
                alert('Your post has been sent!')
            }
        } catch (err) {
            console.log(err)
        }
    }
}