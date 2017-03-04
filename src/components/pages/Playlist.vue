<template>
  <div class="Playlist">
    <div class="Header">
      <div class="Image">
        <a :href="currentPlaylist.uri">
          <img v-if="playlistThumbnailUrl" class="PlaylistThumbnail" :src="playlistThumbnailUrl"
               alt="currentPlaylist.name"/>
        </a>
      </div>
      <div class="Content">
        <a :href="currentPlaylist.uri">
          <h1 class="Playlist-name">{{ currentPlaylist.name }}</h1>
        </a>
        <div v-if="currentPlaylist.description" v-html="currentPlaylist.description" ></div>
      </div>
    </div>
    <hr>

    <tabs animation="slide" :only-fade="false">
      <tab-pane label="Albums" icon="album" selected>
        <div v-if="groupedTracklist" v-for="(data, key, index) in groupedTracklist">
          <playlist-item-album
            :index="index + 1"
            :data="data"
            :extra-data="getExtraAlbumInfo(data[0].track.album.id)"
            :discogs-data="getDiscogsInfo(data[0].track.album.id)"
          />
        </div>
      </tab-pane>
      <tab-pane label="Playlist" icon="list">
        <div v-if="currentPlaylistTracks" v-for="(data, index) in currentPlaylistTracks">
          <playlist-item-track :index="index + 1" :data="data"/>
        </div>
      </tab-pane>
      <tab-pane label="Grid" icon="table">
        <v-table :data="flatTacklist" :columns="gridColumns" :filter-key="searchQuery">
        </v-table>
      </tab-pane>
    </tabs>
  </div>
</template>

<script>
  import ColorThief from 'src/utils/color-thief';
  import { mapState } from 'vuex';
  import groupBy from 'lodash/groupBy';
  import Tabs from 'components/tabs/Tabs';
  import TabPane from 'components/tabs/TabPane';
  import PlaylistItemTrack from 'components/playlist/PlaylistItemTrack';
  import PlaylistItemAlbum from 'components/playlist/PlaylistItemAlbum';
  import Table from 'components/common/Table';
  import spotify from 'src/mixins/spotify';

  export default {
    data() {
      return {
        searchQuery: '',
        gridColumns: ['index', 'song', 'artist', 'album'],
        gridData: [],
      };
    },
    props: [],
    components: {
      'playlist-item-track': PlaylistItemTrack,
      'playlist-item-album': PlaylistItemAlbum,
      Tabs,
      TabPane,
      'v-table': Table,
    },
    created() {
      this.loadPlaylist();
    },
    computed: mapState({
      currentPlaylist: 'currentPlaylistData',
      currentPlaylistTracks: 'currentPlaylistTracks',
      currentPlaylistAlbums: 'currentPlaylistAlbums',
      discogsAlbumsData: 'discogsAlbumsData',
      playlistThumbnailUrl() {
        const { images } = this.currentPlaylist;
        let url = undefined;
        /* Get the medium image or the only image */
        if (images && Array.isArray(images)) {
          const index = (images.length >= 2) ? 1 : 0;
          url = images[index].url;
        }

        /* find color from playlist image and update global state */
        if (url) {
          this.getMainColorOfImage(url).then(color => {
            this.$store.commit('setBackgroundColor', color);
          });
        }

        return url;
      },
      groupedTracklist() {
        // TODO: This is a quick approach that can be improved
        // a better way would be to iterate through the list and split wherever the
        // album id changes.
        const tracks = this.currentPlaylistTracks.filter(obj => obj.track);
        return groupBy(tracks, i => i.track.album.id);
      },
      flatTacklist() {
        if (typeof this.currentPlaylistTracks === 'object') {
          const tracks = this.currentPlaylistTracks.filter(obj => obj.track);
          return tracks.map((item, index) => {
            return {
              index,
              image: 'WIP',
              song: item.track.name,
              artist: item.track.artists[0].name,
              album: item.track.album.name,
            };
          });
        }
        return [];
      },
    }),
    methods: {
      loadPlaylist() {
        this.getPlaylist({
          userId: this.$route.params.user,
          playlistId: this.$route.params.id,
          callback: this.updateAlbumInfo,
        });
      },
      getExtraAlbumInfo(id) {
        return this.currentPlaylistAlbums[id] ? this.currentPlaylistAlbums[id] : {};
      },
      getDiscogsInfo(id) {
        return this.discogsAlbumsData[id] ? this.discogsAlbumsData[id] : {};
      },
      convertArrayToRGBA(arr) {
        const obj = arr.reduce((result, item, index) => {
          result[index] = item;
          return result;
        }, {});
        const defaults = {
          0: 20,
          1: 20,
          2: 20,
          3: '0.5',
        };
        const color = Object.assign({}, defaults, obj);
        return `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
      },
      getMainColorOfImage(url) {
        const colorPromise = new Promise(resolve => {
          const img = document.createElement('img');
          img.crossOrigin = 'Anonymous';
          img.setAttribute('src', url);
          img.addEventListener('load', () => {
            const colorThief = new ColorThief();
            const color = colorThief.getColor(img);
            resolve(this.convertArrayToRGBA(color));
          });
          /* default if image cannot load */
          img.addEventListener('error', () => {
            resolve(this.convertArrayToRGBA([]));
          });
        });

        return colorPromise;
      },
    },
    mixins: [spotify],
    watch: {
      $route() {
        this.loadPlaylist();
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "~assets/mixins";

  .Header {
    @include grid();
    @include rhythm();
  }

  .Image {
    max-width: 250px;
  }

  .Content {
    flex: 1;
  }

  .PlaylistThumbnail {
    display: inline-block;
    max-width: 8rem;
    max-height: 8rem;
  }

  .Playlist-name {
    display: inline-block;
  }
</style>
