<template>
    <section>
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
    integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
        </head>
        <body class="whole-card">
            <img :src="image"
                class="image-box"
                v-if="image !== ''">
            <div v-else class="transparent-box"></div>
            <div class="message-box">
                <p class="message-paragraph">{{message}}</p>
                <p class="message-author">Author: {{author}}</p>
            </div>
            <div v-if="image === ''" class="transparent-box"></div>
        </body>    
    </section>
</template>

<script>
export default {
    props: {
        image: {
            type: String,
            required: false,
            default: ''
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
        border: 1px solid black;
        float: center;
        padding: 1%;
        vertical-align: center;
        margin-top: 10px;
        background-image: url('assets/files/post_background.jpg');     
        background-size: 100% 100%;
        background-repeat: repeat; 
        margin: 0px;  
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
    }

    .message-box{
        background-color: white;
        text-align: center;
        padding: 10px;
        float: center;
        height: 200px;
        width: auto;
        overflow: auto;
    }

    .message-paragraph {
        text-align: center;
        font-weight: 400;
        font-size: 24px;
        line-height: 30.24px;
        padding: 10px;
        font: Plus Jakarta Sans;
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