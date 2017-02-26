import SpotifyWebApi from 'spotify-web-api-node';
import request from 'superagent';
import Cookies from 'cookies-js';
import chunk from 'lodash.chunk';
import uniq from 'lodash.uniq';
import flatMap from 'lodash.flatmap';
import ENV from '../../env';

/* From: https://github.com/thelinmichael/spotify-web-api-node */
/* API: http://michaelthelin.se/spotify-web-api-node/ */

const spotifyApi = new SpotifyWebApi({
  clientId: ENV.CLIENT_ID,
  clientSecret: ENV.CLIENT_SECRET,
});

function refreshAuth() {
  const refreshToken = Cookies.get('refresh_token');
  return request
    .get('/refresh_token')
    .query({ refresh_token: refreshToken })
    .then(res => {
      const { access_token } = res.body;
      spotifyApi.setAccessToken(access_token);
      Cookies.set('access_token', access_token);
    })
    .catch(err => {
      throw err;
    });
}

/* Sequence an array of promises */
function sequence(factories) {
  let result = Promise.resolve();
  factories.forEach(factory => {
    result = result.then(factory);
  });
  return result;
}

/* Retry a failed promise */
function retry(fn, maxRetries = 3) {
  return fn().catch(err => {
    if (maxRetries <= 0) {
      throw err;
    }
    return sequence([refreshAuth, fn]);
  });
}

const spotifyMixin = {
  created() {
    const accessToken = Cookies.get('access_token');
    spotifyApi.setAccessToken(accessToken);
  },
  data() {
    return {
      playlists: [],
    };
  },
  methods: {
    spotifyApi() {
      return spotifyApi;
    },
    getMe() {
      /* Since the retry method expects a factory that returns a promise
       * we need to wrap the promise method in a function. */
      const getMe = () => spotifyApi.getMe();

      retry(getMe).then(data => {
        this.$store.commit('setUserData', data.body);
      });
    },
    getPlaylists(offset = 0, callback) {
      const options = { offset, limit: 50 };
      const getUserPlaylists = () => spotifyApi.getUserPlaylists(null, options);

      retry(getUserPlaylists).then(data => {
        const nextOffset = offset + data.body.limit;
        this.playlists = this.playlists.concat(data.body.items);

        if (data.body.next != null) {
          this.getPlaylists(nextOffset, callback);
        } else if (callback) {
          callback();
        }
      });
    },
    getPlaylist({ userId, playlistId, options = {}, offset = 0, callback }) {
      if (offset === 0) {
        this.$store.commit('clearCurrentPlaylistData');
        this.$store.commit('clearCurrentPlaylistTracks');
      }

      const o = Object.create({}, options);
      o.offset = offset;
      const getPlaylist = () => spotifyApi.getPlaylist(userId, playlistId);
      const getTracks = () =>
        spotifyApi.getPlaylistTracks(userId, playlistId, o);

      /* This api call does not support options at the moment */
      retry(getPlaylist).then(data => {
        this.$store.commit('setCurrentPlaylistData', data.body);
      });

      retry(getTracks).then(data => {
        const nextOffset = offset + data.body.limit;
        const { items } = data.body;
        this.$store.commit('addCurrentPlaylistTracks', items);

        if (data.body.next != null) {
          this.getPlaylist({
            userId,
            playlistId,
            options,
            offset: nextOffset,
            callback,
          });
        } else if (callback) {
          callback();
        }
      });
    },
    updateAlbumInfo() {
      const MAX_QUERY_SIZE = 20;

      const state = this.$store.state;
      const albumIds = state.currentPlaylistTracks.map(
        item => item.track.album.id,
      );
      const groups = chunk(uniq(albumIds), MAX_QUERY_SIZE);

      const promises = [];
      groups.forEach(group => {
        promises.push(retry(() => spotifyApi.getAlbums(group)));
      });

      // When all promises are completed, update state
      Promise.all(promises).then(values => {
        const albumsArray = flatMap(values, n => n.body.albums);
        const albumsKeyed = albumsArray.reduce(
          (collection, album) =>
            Object.assign(collection, { [album.id]: album }),
          {},
        );

        this.$store.commit('setCurrentPlaylistAlbums', albumsKeyed);
      });
    },
  },
};

export default spotifyMixin;
