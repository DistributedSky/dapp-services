<template>
  <div class="sidebar-col-in">
    <section>
      <LinkExplorer :text="account" classStyle="nowrap" />
      <div
        class="m-t-10 label"
        :class="networkId === 1 ? 'label-green' : 'label-violet'"
      >{{nameChain}}</div>
    </section>
  </div>
</template>

<script>
// import { mapState } from "vuex";
import Web3Check from "vue-web3-check";

export default {
  data() {
    return {
      account: "",
      networkId: 0
    };
  },
  computed: {
    // ...mapState("token", ["tokens"]),
    nameChain: function() {
      return this.networkId === 1 ? "Mainnet" : "Sidechain";
    }
  },
  mounted() {
    this.account = this.$robonomics.account.address;
    this.networkId = Web3Check.store.state.networkId;

    var reference = document.querySelectorAll(".js-tooltip");
    if (reference) {
      reference.forEach(function(e) {
        new window.Tooltip(e, {
          title: e.getAttribute("data-tooltip"),
          placement: "auto",
          container: "body"
        });
      });
    }
  }
};
</script>
