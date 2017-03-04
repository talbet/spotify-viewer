<template>
    <router-link :to="linkpath">{{name}}</router-link>
</template>

<script>
export default {
  props: {
    id: String,
    user: String,
    name: String,
  },
  computed: {
    linkpath() {
      return `/playlist/${this.user}/${this.id}`;
    },
  },
};
</script>
