<template>
  <v-col justify="center" align="center">
    <p>Posts: {{ posts }}</p>
  </v-col>
</template>

<script>
export default {
  layout: 'linknoauth',
  name: 'LinkPage',

  async asyncData({ params }) {
    const link = params.link
    return { link }
  },

  mounted () {
    this.$store.dispatch('post/getBoardPosts', {
        link: this.link
    })
  },

  data () {
    return {
    }
  },

  methods: {
  },

  computed: {
    posts () {
        return this.$store.state.post.posts
    }
  },
}
</script>

<style scoped>
@import '~/assets/style.css';


</style>
