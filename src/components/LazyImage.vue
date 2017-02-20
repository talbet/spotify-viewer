<template>
  <figure class="IntrinsicWrapper" :style=ratioHeight>
    <img ref="image" class="IntrinsicImage" :src=loadedSrc :alt=loadedAlt :aria-busy=isBusy>
  </figure>
</template>

<script>
  export default {
    data() {
      return {
        loadedSrc: '',
        loadedAlt: '',
        isBusy: true,
      }
    },

    props: ['src', 'ratio', 'alt', 'container'],

    computed: {
      ratioHeight() {
        let ratioArr = this.ratio.split(':');
        let padding = 100 * ratioArr[1] / ratioArr[0];
        return { paddingBottom: `${padding}%` };
      },
      containerEl() {
        return this.container ? document.querySelector('.Panel--main') : window;
      }
    },

    methods: {
      isElementInViewport(el)
      {
        let rect = el.getBoundingClientRect();
        return rect.bottom > 0
          && rect.right > 0
          && rect.top < (window.innerHeight || document.documentElement.clientHeight)
          && rect.left < (window.innerWidth || document.documentElement.clientWidth)
      },
      shouldShowImage(){
        if (this.isElementInViewport(this.$el)) {
          this.loadedSrc = this.src;
          this.loadedAlt = this.alt;
          this.$refs.image.addEventListener('load', this.handleImageLoad.bind(this));
          this.handleRemoveListeners();
        }
      },
      handleImageLoad(e) {
        e.target.removeEventListener(e.type, this.handleImageLoad);
        this.isBusy = false;
      },
      handleRemoveListeners(){
        ['scroll', 'resize'].forEach((event) => {
          this.containerEl.removeEventListener(event, this.shouldShowImage);
        })
      }
    },

    mounted() {
      this.shouldShowImage();
      ['scroll', 'resize'].forEach((event) => {
        this.containerEl.addEventListener(event, this.shouldShowImage, { passive: true }, false);
      })
    },

    beforeDestroy() {
      this.handleRemoveListeners()
    },
  }
</script>

<style scoped>
  .IntrinsicWrapper {
    height: 0;
    position: relative;
    width: 100%;
    overflow: hidden;
    background-color: #f1f1f1;
  }

  .IntrinsicImage {
    width: 100%;
    height: auto;
    transition: opacity 1s;
    opacity: 1;
  }

  .IntrinsicImage[aria-busy] {
    opacity: 0;
  }

</style>
