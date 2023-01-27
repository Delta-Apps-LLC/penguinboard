<template>
  <v-col justify="center" align="center">
    <p>{{ user }}</p>
  </v-col>
</template>

<script>
export default {
  name: 'IndexPage',
  middleware: "auth",

  data () {
    return {
    }
  },

  methods: {
  },

  computed: {
    user () {
      return this.$store.state.account.user
    }
  },
}
</script>
