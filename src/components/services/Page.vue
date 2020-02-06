<template>
  <fragment>
    <h1>{{ $t('services.title') }}</h1>
    <section class="flex-grid">
      <div
        v-for="(service, index) in services"
        :key="index"
        class="section-light item"
        :class="{disabled: service.disabled}"
      >
        <router-link class="item-avatar" :to="{ name: service.link }">
          <span class="item-avatar--image" :style="`background-image: url('${service.img}')`"></span>
        </router-link>
        <div class="item-content">
          <h2>
            <router-link :to="{ name: service.link }">{{service[$i18n.locale].name}}</router-link>
          </h2>
          <div class="t-hyphen">{{service[$i18n.locale].desc}}</div>
          <div class="item-bottom">
            <div class="item-bottom--line">
              <span>{{ $t('services.provider') }}:</span>
              <span class="item-bottom--info">{{service.by.label}}</span>
            </div>
            <div v-if="service.token && service.token.name" class="item-bottom--line">
              <span>{{ $t('services.token') }}:</span>
              <span class="item-bottom--info">{{service.token.name}}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </fragment>
</template>

<script>
import { Token } from "robonomics-js";
import Web3Check from "vue-web3-check";

export default {
  data() {
    return {
      services: [
        {
          en: {
            name: "Drone passport registration",
            desc:
              "Global drone registration service in the Ethereum Blockchain."
          },
          ru: {
            name: "Регистрация паспорта дрона",
            desc: "Сервис глобальной регистрации дронов в Ethereum Blockchain."
          },
          link: "registration",
          img: "assets/i/services/drone-passport.png",
          by: {
            link: "#",
            label: "Distributed sky"
          },
          token: "0x7dE91B204C1C737bcEe6F000AAA6569Cf7061cb7",
          disabled: false
        },
        {
          en: {
            name: "Drone flight report",
            desc: "Drone flight public reporting service."
          },
          ru: {
            name: "Отчёт о полётах дронов",
            desc: "Сервис публичных отчетов о выполненных полетах дронов."
          },
          link: "flight",
          img: "assets/i/services/drone-route.png",
          by: {
            link: "#",
            label: "Distributed sky"
          },
          token: "0x7dE91B204C1C737bcEe6F000AAA6569Cf7061cb7",
          disabled: false
        }
      ]
    };
  },
  created() {
    document.title = this.$t("title");
  },
  mounted() {
    this.loadTokens();
  },
  methods: {
    loadTokens() {
      if (Web3Check.store.state.networkId === 1) {
        this.services.forEach(async (service, i) => {
          if (service.token) {
            const token = new Token(
              this.$robonomics.web3,
              this.services[i].token
            );
            const name = await token.methods.name().call();
            const symbol = await token.methods.symbol().call();
            this.services[i].token = {
              address: this.services[i].token,
              name: `${name} (${symbol})`
            };
          }
        });
      }
    }
  }
};
</script>
