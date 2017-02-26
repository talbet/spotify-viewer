# Spotify Viewer

## What is this?

Spotify is an excellent service for discovering music, but the native app interface could be better. In particular, playlists are missing a lot of visual cues that make navigation and discovery easier. Showing album art helps users remember what they have listened to and enjoyed, and makes it easier to find specific parts of long playlists.

Strangely, the native app used to support a thumbnail view, that was removed when the company switched to an HTML wrapped native app a few years ago. A lot of users have asked for that feature back, but the feature is still absent.

This front end is an exploration of how an interface with album art might look. Since there are no public API's for playback on the web (beyond 30 second intros) there are no playback features here, but you can quickly get to selected playlists and albums in the native app using links.


## Build Setup

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
