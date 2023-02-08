<template>
    <section>
        <head>
            <link rel="stylesheet" 
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
            integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" 
            crossorigin="anonymous">
        </head>
        <v-app class="dashboard_background">
            <h1 class="bravo">Bravo!</h1>
            <h2 class="title-board">Title Board</h2>
            <v-row>
                <post v-for="post in posts"
                    :key="post.author"
                    :image="post.image"
                    :message="post.message"
                    :author="post.author"
                    class="col-lg-4 col-md-6 col-sm-12 px-0"
                ></post>
            </v-row>
        </v-app>
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
            posts: [
                {
                    message: "Piss off",
                    author: "Billy B. Bob"
                },
                {
                    image: 'https://media.giphy.com/media/5cdenDXni65aM/giphy.gif',
                    message: "Congrats",
                    author: "Carl"
                },
                {
                    message: "Take a Hike",
                    author: "Tom"
                },
                {
                    image: 'https://media.giphy.com/media/KzGCAlMiK6hQQ/giphy.gif',
                    message: "You're worse than Weird Al",
                    author: "Weird Al",
                },
                {
                    image: 'https://media.giphy.com/media/xT5LMQgNBvswjMfF0Q/giphy.gif',
                    message: "Yeah yeah, let's go Brandon",
                    author: "Sen. Joe Biren"
                },
                {
                    image: 'https://media.giphy.com/media/tu54GM19sqJOw/giphy.gif',
                    message: "What if someone just writes a freaking ton of stuff? Like... what if some douche bag just writes a ton of text because they really want to congratulate some person for doing a sucky job that was doomed to begin with? WHAT WOULD HAPPEN?!?!",
                    author: "Some Douchebag"
                },
                {
                    image: 'https://media.giphy.com/media/RSEuJxiw2H24U/giphy.gif',
                    message: "Yo! Let's smoke it up after work.",
                    author: "Elon Musk"
                }
            ]
        };
    },
}
</script>

<style scoped>
    .dashboard_background {
        background-color: #E0EBE7;
        background: #E0EBE7;
        width: 100%;
        height: 100%;
        background-size:     cover;                 
        background-repeat:   repeat;
        background-position: center center;
    }
    .bravo {
        color: black;
        background-color: white;
        padding: 10px;
        text-align: center;
    }
    .title-board {
        background-color: #585858;
        padding: 20px;
        text-align: center;
        color: white;
    }
</style>