<template>
    <v-col justify="center" align="center" class="dashboard_background">
        <div class="bravo">Bravo!</div>
        <div class="title">Title Board</div>
        <post></post>
    </v-col>
</template>

<script>
import post from "~/components/post"

export default {
    name: "dashboard",
    middleware: "auth",
    components: {
        post
    },

    data() {
        return {

        };
    },
}
</script>

<style scoped>
    .dashboard_background {
        background-color: #F5F5F5;
    }
    .bravo {
        color: black;
        background-color: white;
    }
    .title {
        background-color: #585858;
    }
</style>