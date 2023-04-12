<template>

</template>

<script>
import { getJwtToken, getUserIdFromToken } from '~/store/auth'
export default {
    name: 'Unlimited',

    async mounted () {
        await this.$store.commit('account/setUserFromJwt', getUserIdFromToken(getJwtToken()))
        await this.$store.dispatch('account/getCurrentUser')
        let expiration = Date.now()
        expiration += 31536000000
        await this.$store.dispatch('account/unlimited', {
            expiration: expiration
        })
    },
}
</script>
