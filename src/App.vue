<template>
  <div id="vue" class="App">
    <div class="container">
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

        <hr>
        <user-playlists/>
      </div>
      <div class="Main Panel Panel--main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import UserStatus from './components/UserStatus.vue';
  import UserPlaylists from './components/UserPlaylists.vue';

  export default {
    components: {
      'user-status': UserStatus,
      'user-playlists': UserPlaylists,
    },
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

  .Beam {
    display: flex;
    justify-content: space-between;
    padding: ($gutter / 2) 0;
  }

  .Panel {
    overflow-y: auto;
  }

  .MainContent {
    @include grid();
    width: 100vw;
  }

  .Sidebar {
    width: 20%;
    max-width: 240px;
  }

  .Main {
    flex: 1;
  }

  .navbar-nav li {
    padding: 0 2rem;
  }
</style>
