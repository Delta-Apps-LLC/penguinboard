<template>
    <section>
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
    integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
        </head>
        <body class="whole-card">
            <img :src="`https://media.giphy.com/media/${gif}/giphy.gif`"
                class="image-box"
                v-if="gif !== null">
            <div v-else class="transparent-box"></div>
            <div class="message-box">
                <p class="message-paragraph" v-html="message"></p>
                <p class="message-author">&#126;{{author}}</p>
            </div>
            <div v-if="gif === null || gif === ''" class="transparent-box"></div>
        </body>
    </section>
</template>

<script>
export default {
    props: {
        gif: {
            type: String,
            required: false,
            default: null
        },
        message: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        }
    },
    setup() {},
    methods: {
        getLink() {
            return this.image
        }
    }
}
</script>

<style scope>
.whole-card {
    float: center;
    padding: 1%;
    vertical-align: center;
    margin-top: 10px;
    background-image: linear-gradient(to top right, #ba8989, #81a5c7);
    /* background-image: url('assets/files/post_background.jpg'); */
    background-size: 100% 100%;
    margin: 8px;
    border-radius: 15px;

}

.card-body {
    padding: 1%;
}

.image-box {
    max-width: 100%;
    height: 250px;
    width: auto;
    float: center;
    margin-left: auto;
    margin-right: auto;
    display: block;
    border-radius: 15px;
}

.message-box{
    background-color: #f3f3f3;
    text-align: center;
    padding: 10px;
    float: center;
    height: 200px;
    width: auto;
    overflow: auto;
    border-radius: 15px;
}

.message-paragraph {
    text-align: center;
    font-weight: 400;
    font-size: 21px;
    line-height: 30.24px;
    padding: 10px;
    font-family: Plus Jakarta Sans;
}

.message-author {
    text-align: right end;
    font-weight: 400;
    font-size: 16px;
    line-height: 20.16px;
}

.transparent-box {
    height: 125px;
    width: auto;
    opacity: 0.0;
    padding: 10px;
    padding-top: 10px;
}
</style>