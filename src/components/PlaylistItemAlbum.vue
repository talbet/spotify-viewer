<template>
  <div class="Wrapper">
    <div class="Sidebar">
      <a :href="album.uri">
        <lazy-image v-if="thumbnailUrl" :src="thumbnailUrl" ratio="1:1" :alt="album.name" container=".Panel--main"/>
      </a>
    </div>
    <div class="Main">
      <div class="AlbumMeta">
        <div class="HeadingGroup">
          <h1 class="h3">{{ album.artists[0].name }}</h1>
          <h2 class="h4">{{ album.name }}</h2>
          <ul class="Meta">
            <li v-if="albumExtra.popularity">Popularity: {{ albumExtra.popularity }}</li>
            <li v-if="releaseYear">Date: {{ releaseYear }}</li>
            <li v-if="albumExtra.label">Label: {{ albumExtra.label }}</li>
            <li v-if="genres">Genre: {{ genres }}</li>
            <li v-if="styles">Styles: {{ styles }}</li>
          </ul>
        </div>
        <div>
          <v-button @click=handleDiscogsSearch>
            More Info <span v-if="isBusy"> - Loading</span>
          </v-button>
        </div>
      </div>
      <div class="TrackMeta">
        <ul class="TrackList">
          <li v-for="(track, key, index) in data">
            {{ track.track.track_number }}. {{ track.track.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      index: Number,
      data: Array,
      extraData: Object,
      discogsData: Object,
    },
    data: function () {
      return { isBusy: false }
    },
    components: {
      'v-button': require('./Button'),
      'lazy-image': require('./LazyImage'),
    },
    computed: {
      album() {
        return this.data[0].track.album;
      },
      albumExtra() {
        return this.extraData;
      },
      thumbnailUrl() {
        return this.album.images[1].url;
      },
      releaseYear() {
        const releaseDate = this.albumExtra.release_date;
        return releaseDate ? releaseDate.split('-')[0] : '';
      },
      genres() {
        return this.discogsData.genres ? this.discogsData.genres.join(', ') : '';
      },
      styles() {
        return this.discogsData.styles ? this.discogsData.styles.join(', ') : '';
      }

    },
    methods: {
      handleDiscogsSearch() {
        const searchString = `${this.album.artists[0].name} ${this.album.name}`;
        const id = this.album.id;
        const dataStore = this.$store.state.discogsAlbumsData;
        this.isBusy = true;

        if (dataStore[id] === undefined) {
          fetch(`/discogs?search=${encodeURI(searchString)}`)
            .then(response => response.text())
            .then((text) => {
              this.isBusy = false;
              const data = JSON.parse(text);
              this.$store.commit('addDiscogsAlbumsData', { [id]: data });
            });
        }
      }
    },
  };
</script>

<style lang="scss" scoped>
  @import "~assets/mixins";

  .Wrapper {
  @include grid();
  @include rhythm(2);
  }

  .Sidebar {
  @include bleed();
    width: 25%;
  }

  .Main {
    flex: 1;
    /*background: #222326;*/
  }

  .AlbumMeta {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #ccc;
  }

  .AlbumTitle {
    font-size: 1.1rem;
    margin-bottom: 0;
    line-height: 1;
  }

  .AlbumArtist {
    display: inline-block;
    font-size: 1rem;
    margin-bottom: 0;
    line-height: 1;
  }

  .TrackList {
    columns: 2;
  }

</style>
