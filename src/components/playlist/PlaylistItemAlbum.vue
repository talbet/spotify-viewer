<template>
  <div class="Wrapper">
    <div class="Sidebar">
        <div class="AlbumImage">
      <a :href="album.uri">
          <lazy-image
            v-if="thumbnailUrl"
            :src="thumbnailUrl"
            ratio="1:1"
            :alt="album.name"
            container=".Panel--main"/>
      </a>
        </div>
    </div>
    <div class="Main">
      <div class="AlbumMeta">
        <div class="HeadingGroup">
          <h1 class="h3">
            <a :href="album.artists[0].uri"> {{ album.artists[0].name }} </a>
          </h1>
          <h2 class="h4">
            <a :href="album.uri"> {{ album.name }} </a>
          </h2>
          <ul class="Meta">
            <li v-if="albumExtra.popularity">
              Popularity:
              <div class="Popularity" v-for="i in range(0, popularity)">
                <icon class="Popularity-icon" name="star"></icon>
              </div>
            </li>
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
  import Button from 'components/common/Button';
  import LazyImage from 'components/common/LazyImage';

  export default {
    props: {
      index: Number,
      data: Array,
      extraData: Object,
      discogsData: Object,
    },
    data() {
      return { isBusy: false };
    },
    components: {
      'v-button': Button,
      'lazy-image': LazyImage,
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
      },
      popularity() {
        return Math.ceil(this.albumExtra.popularity / 10);
      },
    },
    methods: {
      range(begin, end) {
        const offset = begin > end ? end : begin;
        const delta = Math.abs(end - begin);
        const result = [];
        for (let i = 0; i <= delta; i++) {
          result.push(i + offset);
        }
        return result;
      },
      handleDiscogsSearch() {
        const searchString = `${this.album.artists[0].name} ${this.album.name}`;
        const id = this.album.id;
        const dataStore = this.$store.state.discogsAlbumsData;
        this.isBusy = true;

        if (dataStore[id] === undefined) {
          fetch(`/discogs?search=${encodeURI(searchString)}`)
            .then(response => response.text())
            .then(text => {
              this.isBusy = false;
              const data = JSON.parse(text);
              this.$store.commit('addDiscogsAlbumsData', { [id]: data });
            });
        }
      },
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
    width: 25%;
  }

  .Main {
    flex: 1;
  }

  .AlbumImage {
    box-shadow: 0px 2px 10px 0 rgba(0,0,0,.5);
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

  .Popularity {
    display: inline-block;
  }

  .Popularity-icon {
    display: inline-block;
  }

</style>
