<template>
  <div class="sidebar flexcols">
    <div class="sidebar-col sidebar-col--sm">
      <div class="sidebar-col-in">
        <section>
          <router-link to="/">
            <img class="theme-day" alt="dApp logo" src="assets/i/logo-dapp-dczd-light.svg" />
            <img class="theme-night" alt="dApp logo" src="assets/i/logo-dapp-dczd-dark.svg" />
          </router-link>
        </section>
        <section>
          <a class="sidebar-i--lg js-sidebar-link" href="javascript:;" on-toggle="#sidebar-nav1">
            <i class="i-menu"></i>
          </a>
          <a
            class="sidebar-i--lg js-sidebar-link"
            href="javascript:;"
            on-toggle="#sidebar-lang"
          >{{$i18n.locale.toUpperCase()}}</a>
          <div id="themeMode">
            <a class="sidebar-i--lg" href="javascript:;" @click="toggleTheme()">
              <i class="i-day" v-show="theme === 'light'"></i>
              <i class="i-night" v-show="theme === 'dark'"></i>
            </a>
          </div>
        </section>
        <section class="sidebar-col--bottom">
          <a class="sidebar-i--lg js-sidebar-link" href="javascript:;" on-toggle="#sidebar-user">
            <i class="i-user"></i>
          </a>
          <a class="sidebar-i--lg js-sidebar-link" href="javascript:;" on-toggle="#sidebar-info">?</a>
        </section>
      </div>
    </div>
    <div class="sidebar-col sidebar-col-padding js-sidebar-content" id="sidebar-nav1">
      <div class="sidebar-col-in">
        <section>
          <nav class="nav-vertical">
            <router-link to="/" active-class="active" exact>
              <span class="i-app align-vertical"></span>
              <span class="align-vertical">{{ $t('menu.services') }}</span>
            </router-link>
          </nav>
        </section>
      </div>
    </div>
    <div class="sidebar-col sidebar-col-padding js-sidebar-content" id="sidebar-lang">
      <div class="sidebar-col-in">
        <section>
          <LangSwitcher :loadContent="loadContent" />
        </section>
      </div>
    </div>
    <div class="sidebar-col sidebar-col-padding js-sidebar-content" id="sidebar-user">
      <Wallet />
    </div>
    <div class="sidebar-col sidebar-col-padding js-sidebar-content" id="sidebar-info">
      <div class="sidebar-col-in">
        <section>
          <nav class="nav-vertical">
            <a href="https://github.com/airalab" target="_blank">
              <span class="i-github align-vertical"></span>
              <span class="align-vertical">Github</span>
            </a>
            <a href="https://www.reddit.com/r/robonomics/" target="_blank">
              <span class="i-reddit align-vertical"></span>
              <span class="align-vertical">Reddit</span>
            </a>
            <a href="https://robonomics.network/" target="_blank">
              <span class="i-cursor align-vertical"></span>
              <span class="align-vertical">robonomomics.network</span>
            </a>
            <a href="https://aira.life/" target="_blank">
              <span class="i-cursor align-vertical"></span>
              <span class="align-vertical">aira.life</span>
            </a>
          </nav>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LangSwitcher from "./LangSwitcher";
import Wallet from "./Wallet";

export default {
  props: ["loadContent"],
  components: {
    LangSwitcher,
    Wallet
  },
  computed: {
    ...mapState("theme", ["theme"])
  },
  mounted() {
    window.init();
  },
  methods: {
    toggleTheme() {
      if (this.theme === "light") {
        this.$store.dispatch("theme/setTheme", "dark");
      } else {
        this.$store.dispatch("theme/setTheme", "light");
      }
    }
  }
};
</script>
