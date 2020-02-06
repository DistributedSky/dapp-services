import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./plugins/i18n";
import "./plugins";
import * as filters from "./utils/filters";
import LinkExplorer from "./components/common/LinkExplorer";

Vue.config.productionTip = false;

Vue.component("LinkExplorer", LinkExplorer);
Vue.filter("fromWei", filters.fromWei);
Vue.filter("urlExplorer", filters.urlExplorer);
Vue.filter("urlIpfs", filters.urlIpfs);

new Vue({
  store,
  i18n,
  router,
  render: h => h(App)
}).$mount("#app");
