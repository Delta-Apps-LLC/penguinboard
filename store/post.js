import { SUPABASE } from './auth'

export const state = () => ({
    posts: [],
    loading: false,
})

export const getters = {
}

export const mutations = {
    setPosts(state, data) {
        state.posts = data
    },

    toggleLoading(state, data) {
        state.loading = data
    }
}

export const actions = {
    async getBoardPosts({ commit }, { link }) {
        await commit('toggleLoading', true)
        const { data, error, status } = await SUPABASE.from('get_board_posts')
            .select()
            .eq('link', link)
        if (status === 200 || status === 201 || status === 204) {
            await commit('toggleLoading', false)
            await commit('setPosts', data)
        } else {
            await commit('toggleLoading', false)
        }
    },

    async sendPost({}, { post }) {
        const { data, error, status } = await SUPABASE.from('post')
            .insert({
                message: post.message,
                boardid: post.boardid,
                from: post.from,
                gif: post.gif
            })
        if (status === 201 || status === 200 || status === 204) {
            alert('Your post has been sent!')
        } else {
            alert('Something went wrong, please try again.')
        }
    },

    async deletePost({ dispatch }, { postid, link }) {
        const { data, error, status }  = await SUPABASE.from('post')
            .delete()
            .eq('postid', postid)
        if (status === 204 || status === 404 || status === 200) {
            await dispatch('getBoardPosts', { link: link })
        }
    }
}