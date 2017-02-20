<template>
<div class="UserPlaylists">
  <h4>Playlists</h4>
  <div class="UserPlaylists-item" v-if="playlists" v-for="playlist in playlists">
    <div class="UserPlaylists-link">
      <playlist-link :id="playlist.id" :user="playlist.owner.id" :name="playlist.name" />
    </div>
  </div>
</div>
</template>

<script>
import spotify from '../mixins/spotify';
import PlaylistLink from './PlaylistLink.vue';

export default {
  // Options / Data
  data() {
    return {
      // playlists: undefined,
    };
  },
  props: [],
  components: {
    'playlist-link': PlaylistLink,
  },
  computed: {
    // playlistLink: () => ,
  },
  methods: {},
  mixins: [spotify],
  mounted() {
    // this.spotifyApi().getUserPlaylists().then((data) => {
    //   console.log(data.body);
    //   this.playlists = data.body.items;
    // });
    this.getPlaylists();
  },
};
</script>

<style scoped>
.UserPlaylists {
  overflow-x: hidden;
}

.UserPlaylists-item {
  overflow: hidden;
}

.UserPlaylists-link {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  /*left: 0%;*/
  /*right: 0%;*/
  width: 100%;
  transition: left 3s, width 3s, right 3s, transform 3s;
}

/*.UserPlaylists-item:hover .UserPlaylists-link {*/
  /* This is not completely accurate. It resizes to 2x the current width. */
  /*left: -100%;*/
  /*width: 200%;*/
  /*right: 100%;*/
  /*overflow: visible;*/
  /*transform: translateX(-100%);*/
/*}*/
</style>
