<template>
  <button
    class="Button"
    :id="id"
    :class="customClass"
    :name="name"
    :disabled="disabled"
    :large="large"
    :markup="markup"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        default: null
      },
      customClass: {
        type: String,
        default: null
      },
      name: {
        type: String,
        default: null
      },
      disabled: {
        type: Boolean,
        default: false
      },
      large: {
        type: Boolean,
        default: false
      },
      markup: {
        type: String,
        default: 'default'
      }
    },
    methods: {
      handleClick (e) {
        this.$emit('click', e)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/variables";

  .Button {
    cursor: pointer;
    border: 1px solid $brand;
    background: $brand;
    color: $white;
    padding: 0.2rem 0.6rem;
    border-radius: 4px;

    &:hover {
       background: lighten($brand, 10%);
       border: 1px solid lighten($brand, 10%);
   }

    &:disabled {
      cursor: not-allowed;
      color: $grey;
      box-shadow: 0 0 0 1px $grey inset;
    }
  }


</style>
