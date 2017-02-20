<template>
  <div class="hello">
    <h1>Spotify Search</h1>
    <input v-model.lazy="search">
    <div v-for="result in results">
      <img :src="result.images[2].url" :alt="result.name"/>
      {{ result.artists[0].name }} - {{ result.name }} ({{ result.popularity }})

    </div>
  </div>
</template>

<script>
  import {Client, AlbumHandler } from 'spotify-sdk';

  const client = Client.instance;
  const album = new AlbumHandler();

  client.settings = {
    clientId: '800e3c43e1b8442dab81f15080c6e385',
    secretId: '03e2f8ca63064f479cc250018c18b798'
  };

  export default {
    data() {
      return { search: '', results: [] };
    },
    watch: {
      search(term) {
        album.search(term, { limit: 10 }).then(albumCollection => {
          album.get([ albumCollection.map(i => i.id) ]).then(collection => {
            this.results = collection;
          });
        });
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    color: #42b983;
  }
</style>
