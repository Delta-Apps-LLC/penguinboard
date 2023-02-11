<template>
    <v-col class="whole-dashboard">
        <link rel="stylesheet" 
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
        integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" 
        crossorigin="anonymous">
        <h1 class="bravo">Bravo!</h1>
        <div class="title-card">
            <img :src="image2" class="title-image" v-if="image1 !== ''">
            <p class="title-text">Congratulations on the sell</p>
        </div>
        <v-row>
            <post v-for="post in posts"
                :key="post.author"
                :gif="post.image"
                :message="post.message"
                :author="post.author"
                class="col-lg-4 col-md-6 col-sm-12 px-0"
            ></post>
        </v-row> 
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
            image1: 'https://media.istockphoto.com/id/187722063/photo/funny-man-with-watermelon-helmet-and-goggles.jpg?s=612x612&w=0&k=20&c=gRAm8vtLqdOU8a-mJVt6m_Wnv8pLpa3TBh2vRQP4208=',
            image2: 'https://cdn.xxl.thumbs.canstockphoto.com/crazy-emotion-stock-photography_csp11187800.jpg',
            image3: '',
            posts: [
                {
                    message: "Piss off",
                    author: "Billy B. Bob"
                },
                {
                    image: '5cdenDXni65aM',
                    message: "Good job on the sell. You jacked them like this monkey.",
                    author: "Marx"
                },
                {
                    image: 'KzGCAlMiK6hQQ',
                    message: "You're worse than Fred, I despise that guy.",
                    author: "Fred",
                },
                {
                    image: 'xT5LMQgNBvswjMfF0Q',
                    message: "Yeah yeah, let's go Brandon",
                    author: "Sen. Joe Biren"
                },
                {
                    message: "Take a Hike",
                    author: "Tom"
                },
                {
                    image: 'tu54GM19sqJOw',
                    message: "What if someone just writes a freaking ton of stuff? Like... what if some douche bag just writes a ton of text because they really want to congratulate some person for doing a sucky job that was doomed to begin with? WHAT WOULD HAPPEN?!?!",
                    author: "Some Douchebag"
                },
                {
                    image: 'RSEuJxiw2H24U',
                    message: "Yo! Let's smoke it up after work.",
                    author: "Elon Musk"
                }
            ]
        };
    },
}
</script>

<style scoped>
@import '~/assets/style.css';

.bravo {
    color: black;
    background-color: white;
    padding: 10px;
    text-align: center;
    width: 103%;
    margin-left: -15px;
}

.title-card {
    background-color: #585858;
    padding: 20px;
    justify-content: center;
    align-items: center;
    color: white;
    
    width: 103%;
    margin-left: -15px;
    display: flex;
    margin-bottom: 1em;
    border: solid 2px;
}

.title-image {
    max-height: auto;
    max-width: 40%;
}

.title-text {
    width: auto;
    margin: 100px;
    font-size: 50px;
}

</style>