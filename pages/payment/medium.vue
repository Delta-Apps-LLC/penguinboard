<template>

</template>

<script>
import { getJwtToken, getUserIdFromToken } from '~/store/auth'
export default {
    name: 'Medium',

    async mounted () {
        await this.$store.commit('account/setUserFromJwt', getUserIdFromToken(getJwtToken()))
        await this.$store.dispatch('account/getCurrentUser')
        await this.$store.dispatch('account/buyBoards', {
            num: 10
        })
        this.$router.push('/account#pricing')
        alert('Thank you for your purchase. You should see your available boards posted in your account settings.')
    },
}
</script>
