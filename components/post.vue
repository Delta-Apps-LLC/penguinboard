<template>
    <section>
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
    integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
        </head>
        <body class="whole-card">
            <img :src="image"
                class="image-box">
            <div class="message-box">
                <p class="message-paragraph">{{message}}</p>
                <p class="message-author">Author: {{author}}</p>
            </div>
        </body>    
    </section>
</template>

<!-- style="width: 106.957px; height: 82px; margin: 1.6px 0px;" -->

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
        background-color: #D3D3D3;
        border: 1px solid black;
        float: center;
        padding: 1%;
        vertical-align: center;
        margin-top: 10px;
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
</style>