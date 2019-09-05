<template>
  <fragment>
    <section class="section-light section-centered">
      <h2>
        Passport |
        <router-link :to="{name:'registration'}" style="font-size: 14px">registration</router-link>
      </h2>
      <div class="loader" v-if="!ready">
        <div class="loader-ring align-vertical m-r-15"></div>
      </div>
      <div v-else>
        <section>
          <h4>Operator</h4>
          <div class="form-item form-line-label">
            <label>Contact e-mail</label>
            <div>{{ email }}</div>
          </div>
          <div class="form-item form-line-label">
            <label>Fullname</label>
            <div>{{ pilot_name }}</div>
          </div>
          <div class="form-item form-line-label">
            <label>Pilot ID</label>
            <div>{{ pilot_reg }}</div>
          </div>
        </section>
        <section>
          <h4>UAV</h4>
          <div class="form-item form-line-label">
            <label>Serial number</label>
            <div>{{ id_serial }}</div>
          </div>
          <div class="form-item form-line-label">
            <label>Registration number</label>
            <div>{{ id_reg }}</div>
          </div>
          <div class="form-item form-line-label">
            <label>Type</label>
            <div>{{ drone_type }}</div>
          </div>
          <div class="form-item form-line-label">
            <label>Manufacturer</label>
            <div>{{ drone_make }}</div>
          </div>
          <div class="form-item form-line-label">
            <label>Model</label>
            <div>{{ drone_model }}</div>
          </div>
        </section>
        <section>
          <h4>Result</h4>
          <div class="form-item form-line-label">
            <div v-if="result">
              <div class="d-table--cell align-vertical">
                <div class="m-r-15 i-check green"></div>
              </div>
              <LinkExplorer type="ipfs" :text="result" />
            </div>
            <div v-else class="d-table--cell align-vertical">
              <div class="m-r-15 i-stop"></div>
            </div>
          </div>
        </section>
      </div>
    </section>
  </fragment>
</template>

<script>
import { Liability } from "robonomics-js";
import { readRosbagIpfs } from "../../utils/utils";

export default {
  props: ["liability"],
  data() {
    return {
      ready: false,
      id_serial: "",
      email: "",
      drone_type: "",
      drone_make: "",
      drone_model: "",
      id_reg: "",
      pilot_name: "",
      pilot_reg: "",
      result: ""
    };
  },
  mounted() {
    const liability = new Liability(
      this.$robonomics.web3,
      this.liability,
      this.liability
    );
    liability.getInfo().then(r => {
      readRosbagIpfs(r.objective, bag => {
        this[bag.topic.substr(1)] = bag.message.data;
      })
        .then(() => {
          if (r.result !== "") {
            this.result = r.result;
          }
        })
        .then(() => {
          this.ready = true;
        });
    });
  }
};
</script>
