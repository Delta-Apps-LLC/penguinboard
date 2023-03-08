import { GiphyFetch } from '@giphy/js-fetch-api'
const gf = new GiphyFetch('TSTsZUj5ef011dyfVhM44VRhdLaqM1RX')
// TODO: GET PRODUCTION GIPHY KEY

export const state = () => ({
    gifs: []
})

export const mutations = {
    setGifs(state, data) {
        state.gifs = data
    }
}

export const actions = {
    async getGifs({ commit }, { quantity }) {
        try {
            const { data: gifs } = await gf.trending({ limit: quantity })
            await commit('setGifs', gifs)
        } catch (err) {
            console.log(err)
        }
    },

    async searchGifs({ commit }, { searchText, quantity }) {
        try {
            const { data: gifs } = await gf.search(searchText, { sort: 'relevant', limit: quantity })
            await commit('setGifs', gifs)
        } catch (err) {
            console.log(err)
        }
    }
}
