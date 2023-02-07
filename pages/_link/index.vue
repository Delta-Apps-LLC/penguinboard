<template>
  <v-col justify="center" align="center">
    <p>{{ link }}</p>
    <p>Posts: {{ posts }}</p>
  </v-col>
</template>

<script>
export default {
  layout: 'noauth',
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
