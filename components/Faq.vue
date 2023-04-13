<template>
  <div class="container">
    <div class="faq" v-for="(faq, index) in faqs" :key="index">
      <div @click="toggle(index)" class="faq-header">
        <span class="faq-icon" :class="{'active': open}">
            {{ faq.open ? '&ndash;' : '+' }}
        </span>
        {{ faq.question }}
      </div>
      <transition name="faq-slide">
        <div v-if="faq.open" class="faq-body">{{ faq.answer }}</div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FAQ',

  data() {
    return {
      faqs: [
        {
          question: "How does Penguin Board work?",
          answer:
            "Using Penguin Board, you can create a virtual card for someone - such as a coworker, friend, or family member - invite people to \"sign\" it, then send it to the recipient! You are in charge of managing any boards you create, including monitoring posts and sending the card when it\'s ready.",
          open: false,
        },
        {
          question: "What are the benefits of using Penguin Board?",
          answer:
            "Penguin Board is designed to improve engagement between coworkers, family, and friends and make supporting others better! Rather than trying to physically collect signatures that will get thrown away, we made it easier for anyone to participate in recognizing others. Soon, you will earn points for the boards you send and be able to redeem them!",
          open: false,
        },
        {
          question: "Why use a digital card instead of just a normal physical greeting card?",
          answer:
            "Did you know that the US sends 6.5 billion greeting cards every year? The carbon dioxide emissions from all those cards are the same as charging 110 billion smartphones, or powering 110,000 homes for an entire year. That's a lot of CO2. Additionally, more and more cards are ending up in landfill because the decorations on them make them unrecyclable. We want to help save the environment, and our digital version will do just that!",
          open: false,
        },
        {
          question: "How much does it cost?",
          answer:
            "It is completely free to join Penguin Board! When you sign up, you are given five free boards to send. Purchasing more boards later is incredibly cheap!",
          open: false,
        },
      ],
    };
  },

  methods: {
    toggle(index) {
      this.faqs[index].open = !this.faqs[index].open;
    },
  },
};
</script>

<style>
@import '~/assets/style.css';

.container {
    margin-bottom: 40px;
}

.faq {
    color: #EBEBEB;
    border: solid 1px #EBEBEB;
    border-radius: 10px;
}

.faq-header {
  margin-top: 5px;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: bold;
  font-size: 22px;
  font-family: Poppins, sans-serif;
}

.faq-body {
  margin: 10px 0;
  padding: 30px;
  font-family: Georgia;
  font-size: 20px;
  text-align: center;
}

/* Define animation classes */
.faq-slide-enter-active,
.faq-slide-leave-active {
  transition: all 0.6s ease-out;
}

.faq-slide-enter,
.faq-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

</style>
