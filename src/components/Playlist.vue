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
        <h1 class="Playlist-name">{{ currentPlaylist.name }}</h1>
        <p v-if="currentPlaylist.description">
          {{ currentPlaylist.description }}
        </p>
      </div>
    </div>
    <hr>

    <tabs animation="slide" :only-fade="false">
      <tab-pane label="Albums" selected>
        <div v-if="groupedTracklist" v-for="(data, key, index) in groupedTracklist">
          <playlist-item-album
            :index="index + 1"
            :data="data"
            :extra-data="getExtraAlbumInfo(data[0].track.album.id)"
            :discogs-data="getDiscogsInfo(data[0].track.album.id)"
          />
        </div>
      </tab-pane>
      <tab-pane label="Playlist">
        <div v-if="currentPlaylistTracks" v-for="(data, index) in currentPlaylistTracks">
          <playlist-item-track :index="index + 1" :data="data"/>
        </div>
      </tab-pane>
      <tab-pane label="Grid">
        <demo-grid :data="flatTacklist" :columns="gridColumns" :filter-key="searchQuery">
        </demo-grid>
      </tab-pane>
    </tabs>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import groupBy from 'lodash/groupBy';
  import Tabs from './tabs/Tabs.vue';
  import TabPane from './tabs/TabPane.vue';
  import spotify from '../mixins/spotify';
  import PlaylistItemTrack from './PlaylistItemTrack.vue';
  import PlaylistItemAlbum from './PlaylistItemAlbum.vue';
  import Table from './Table.vue';

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
      'demo-grid': Table,
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
        if (images && Array.isArray(images)) {
          /* Get the medium image or the only image */
          const index = (images.length >= 2) ? 1 : 0;
          return images[index].url;
        }
        return undefined;
      },
      groupedTracklist() {
        // TODO: This is a quick approach that can be improved
        // a better way would be to iterate through the list and split wherever the
        // album id changes.
        return groupBy(this.currentPlaylistTracks, i => i.track.album.id);
      },
      flatTacklist() {
        if (typeof this.currentPlaylistTracks === 'object') {
          return this.currentPlaylistTracks.map((item, index) => {
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
      }
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
