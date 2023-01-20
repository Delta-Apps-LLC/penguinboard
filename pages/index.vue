<template>
  <v-col justify="center" align="center">
    <v-btn @click="hitEndpoint()">Hit Endpoint</v-btn>
    <br>
    {{response}}
  </v-col>
</template>

<script>
import { createClient } from '@supabase/supabase-js'
export default {
  name: 'IndexPage',

  data () {
    return {
      response: 'Empty'
    }
  },

  methods: {
    async hitEndpoint() {
      const supabase = createClient('https://hpjkjrfphqywelznpkei.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwamtqcmZwaHF5d2Vsem5wa2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQyNDk4OTIsImV4cCI6MTk4OTgyNTg5Mn0._wwi-agtY8LScuU9MqLogT2BO05_57ADZatuJ4DQX90')
      // Make a request
      const { data: users, error } = await supabase.from('user').select('*')
      this.response = users
    }
  },
}
</script>
