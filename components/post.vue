<template>
    <section>    
        <ul>
            <div class="image-box">
                <ol>{{image}}</ol>
            </div>
            <div class="message-box">
                <p class="message-paragraph">{{message}}</p>
                <p class="message-author">{{author}}</p>
            </div>
        </ul>
    </section>
</template>

<script>
export default {
    props: {
        image: {
            type: String,
            required: false,
            default: "Image"
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
}
</script>

<style>
    .image-box {
        background-color: blue;
        text-align: center;
        width: 420px;
        height: 225px;
        padding: 10px;
        border: 4px solid red;
    }

    .message-box{
        background-color: aqua;
        width: 420px;
        height: 218px;
        top: 213px;
        text-align: center;
        padding: 10px;
        border: 4px solid red;
        float: center;
        width: 33.33%;
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