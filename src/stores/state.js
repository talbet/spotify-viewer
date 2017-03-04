/* eslint-disable no-param-reassign */

import concat from 'lodash/concat';

export const State = {
  backgroundColor: 'undefined',
  userStatus: 'offline',
  userData: {},
  currentPlaylistData: {},
  currentPlaylistTracks: [],
  currentPlaylistAlbums: {},
  discogsAlbumsData: {},
};

export const Mutations = {
  setBackgroundColor(state, data) {
    state.backgroundColor = data;
  },
  setUserData(state, data) {
    state.userData = Object.assign({}, data);
  },
  clearCurrentPlaylistData(state) {
    state.currentPlaylistData = {};
  },
  setCurrentPlaylistData(state, data) {
    state.currentPlaylistData = Object.assign({}, data);
  },
  clearCurrentPlaylistTracks(state) {
    state.currentPlaylistTracks = [];
  },
  addCurrentPlaylistTracks(state, data) {
    state.currentPlaylistTracks = concat(state.currentPlaylistTracks, data);
  },
  clearCurrentPlaylistAlbums(state) {
    state.currentPlaylistAlbums = {};
  },
  setCurrentPlaylistAlbums(state, data) {
    state.currentPlaylistAlbums = Object.assign({}, data);
  },
  addDiscogsAlbumsData(state, data) {
    state.discogsAlbumsData = Object.assign({}, state.discogsAlbumsData, data);
  },
};
