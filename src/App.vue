<template>
  <div id="vue" class="App" :style="appStyles">
    <div class="Header">
      <div class="Beam">
        <div class="Beam-section">
          <nav class="">
            <ul class="list-inline">
              <li>
                <router-link to="/home">Home</router-link>
              </li>
              <li>
                <router-link to="/user">User</router-link>
              </li>
              <li><a href="/login">Login</a></li>
            </ul>
          </nav>
        </div>
        <div class="Beam-section">
          <user-status/>
        </div>
      </div>
    </div>


    <div class="MainContent">
      <div class="Sidebar Panel">
        <user-playlists/>
      </div>
      <div class="Main Panel Panel--main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import UserStatus from 'components/frame/UserStatus';
  import UserPlaylists from 'components/frame/UserPlaylists';

  export default {
    components: {
      'user-status': UserStatus,
      'user-playlists': UserPlaylists,
    },
    computed: {
      appStyles() {
        const bgColor = this.$store.state.backgroundColor
          ? this.$store.state.backgroundColor
          : 'rgba(0, 0, 0, 0.3)';
        return {
          'background-image': `linear-gradient(${bgColor}, #141414)`
        };
      }
    }
  };
</script>

<style lang="scss">
  /* Global Styles */
  @import "~assets/minireset";
  @import "~assets/base";
  @import "~assets/typography";
</style>

<style lang="scss" scoped>
  @import "~assets/variables";
  @import "~assets/mixins";

  .App {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .Header {
    @include grid(2, $nested: false);
    flex: 0 0 auto;
    background: rgba(0,0,0,.5);
  }

  .Beam {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: ($gutter / 2);
    padding-bottom: ($gutter / 2);
    flex: 1;
  }

  .Panel {
    overflow-y: auto;
  }

  .MainContent {
    @include grid(2, $nested: false);
    width: 100vw;
    overflow: auto;
  }

  .Sidebar {
    width: 20%;
    max-width: 280px;
    background: rgba(0,0,0,.5);
  }

  .Main {
    flex: 1;
    padding-top: $gutter;
    padding-bottom: $gutter;
  }

  .navbar-nav li {
    padding: 0 2rem;
  }
</style>
