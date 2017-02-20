<template>
<div class="TrackItem">
  <span class="TrackItem-index">{{ index }}</span>
  <div class="TrackItem-thumbnail">
      <a :href="data.track.uri">
         <img class="TrackItem-thumbnailImage" v-if="thumbnailUrl" :src="thumbnailUrl" />
      </a>
  </div>
  <div class="TrackItem-body">
    {{ artist}} - {{ album }} <br> {{ data.track.name }} ({{ duration }})
  </div>
</div>
</template>

<script>
export default {
  props: {
    index: Number,
    data: Object,
  },
  computed: {
    artist() {
      return this.data.track.artists[0].name;
    },
    album() {
      return this.data.track.album.name;
    },
    duration() {
      const ms = this.data.track.duration_ms;
      const minutes = Math.floor(ms / 60000);
      const seconds = `0${Math.floor((ms / 1000) % 60)}`.slice(-2);
      return `${minutes}:${seconds}`;
    },
    thumbnailUrl() {
      return this.data.track.album.images[2].url;
    },
    // linkpath() {
    //   return `/playlist/${this.user}/${this.id}`;
    // },
  },
};
</script>

<style scoped>

.TrackItem {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.TrackItem-index {
  padding-right: 1rem;
}

.TrackItem-thumbnail {
  line-height: 1;
  padding-right: 1rem;
}

.TrackItem-thumbnailImage {
  max-height: 3em;
  max-width: 3em;
  border-radius: 4px;
}

</style>
