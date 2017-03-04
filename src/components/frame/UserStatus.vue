<template>
  <div class="UserStatus">
    <div class="" v-if="me">
      <img class="Avatar" :src="me.images[0].url" :alt="me.display_name" v-if="me.images"/>
      <p class="UserStatus">{{ username }}</p>
    </div>
  </div>
</template>

<script>
  import spotify from 'src/mixins/spotify';

  export default {
    // Options / Data
    data() {
      return {};
    },
    props: [],
    computed: {
      me() {
        return this.$store.state.userData;
      },
      username() {
        return this.me && this.me.display_name ? this.me.display_name : 'OFFLINE';
      },
    },
    methods: {},
    mixins: [spotify],
    mounted() {
      this.getMe();
    },
  };
</script>

<style scoped>

  .UserStatus {
    display: inline-block;
    padding: 0 0.5rem;
    margin-bottom: 0;
  }

  .Avatar {
    border-radius: 50%;
    display: inline-block;
    font-weight: 300;
    line-height: 1;
    font-size: 1rem;
    height: 2.4rem;
    width: 2.4rem;
    margin: 0;
    position: relative;
    vertical-align: middle;
  }

  .Avatar img {
    border-radius: 50%;
    height: 100%;
    position: relative;
    width: 100%;
    z-index: 99;
  }

  .Avatar .Avatar--icon {
    background: #fff;
    bottom: -.2em;
    height: 50%;
    padding: 5%;
    position: absolute;
    right: -.2em;
    width: 50%;
  }

</style>
