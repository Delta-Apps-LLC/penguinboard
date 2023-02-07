<template>
    <section>
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
    integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    
        </head>
        <body>

            <v-col justify="center" align="center" class="dashboard_background">
                <div class="bravo">Bravo!</div>
                <div class="title-board">Title Board</div>
                <div align="left">
                    <post></post>
                </div>
            </v-col>

        </body>
    </section>
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
            post: [
                {
                    image: "No Image Available",
                    message: "Piss off",
                    author: "Billy B. Bob"
                },
                {
                    image: "No Image Available",
                    message: "Congrats",
                    author: "Carl"
                },
                {
                    image: "No Image Available",
                    message: "Take a Hike",
                    author: "Tom"
                },
                {
                    image: "No Image Available",
                    message: "You're worse than Weird Al",
                    author: "Weird Al"
                }
            ]
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
        padding: 10px;
        border: 4px solid red;
    }
    .title-board {
        /* background-color: #585858; */
        background-color: pink;
        padding: 20px;
        border: 4px solid red;
    }
</style>