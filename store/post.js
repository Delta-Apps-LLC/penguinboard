import axios from "axios"
import { API, authHeader } from './auth'

export const state = () => ({
    posts: [],
})

export const getters = {
}

export const mutations = {
    setPosts(state, data) {
        state.posts = data
    },
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

    async sendPost({}, { post }) {
        try {
            const res = await axios.post(`${API}/post`, {
                message: post.message,
                boardid: post.boardid,
                from: post.from,
                gif: post.gif
            },
            {
                headers: authHeader()
            })
            if (res.status === 201 || res.status === 200) {
                alert('Your post has been sent!')
            }
        } catch (err) {
            console.log(err)
        }
    },

    async deletePost({ dispatch }, { postid, link }) {
        try {
            const res = await axios.delete(`${API}/post?postid=eq.${postid}`, {
                headers: authHeader()
            })
            if (res.status === 204 || res.status === 404) {
                await dispatch('getBoardPosts', { link: link })
            }
        } catch (err) {
            console.log(err)
        }
    }
}