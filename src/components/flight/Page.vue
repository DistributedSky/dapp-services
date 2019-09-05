<template>
  <fragment>
    <section class="section-light section-centered">
      <h2>Drone mission registration</h2>
      <Form ref="regForm" />
      <section>
        <div>
          <div v-if="demand">
            <section v-if="demand.status >= 2">
              <div class="form-item d-table" :class="{disabled: demand.status < 2}">
                <div class="d-table--cell align-vertical">
                  <div
                    class="m-r-15"
                    :class="{'i-check': demand.status >= 3, 'green': demand.status >= 3, 'loader-ring': demand.status == 2 || demand.status == 3, 'i-stop': demand.status < 2}"
                  ></div>
                </div>
                <div class="d-table--cell align-vertical">Message broadcast</div>
              </div>
              <div class="form-item d-table" :class="{disabled: demand.status < 4}">
                <div class="d-table--cell align-vertical">
                  <div
                    class="m-r-15"
                    :class="{'i-check': demand.status >= 4, 'green': demand.status >= 4, 'i-stop': demand.status < 4}"
                  ></div>
                </div>
                <div class="d-table--cell align-vertical">Service responded to demand</div>
              </div>
              <div class="form-item d-table" :class="{disabled: demand.status < 4}">
                <div class="d-table--cell align-vertical">
                  <div
                    class="m-r-15"
                    :class="{'i-check': demand.status >= 6, 'green': demand.status >= 6, 'loader-ring': demand.status == 4 || demand.status == 5, 'i-stop': demand.status < 4}"
                  ></div>
                </div>
                <div class="d-table--cell align-vertical">
                  A smart contract has been created, we are waiting for the robot to execute the service.
                  <a
                    v-if="demand.status >= 6"
                    :href="demand.liability | urlExplorer"
                    target="_blank"
                  >View contact.</a>
                </div>
              </div>
              <div class="form-item d-table" :class="{disabled: demand.status < 6}">
                <div class="d-table--cell align-vertical">
                  <div
                    class="m-r-15"
                    :class="{'i-check': demand.status == 8, 'green': demand.status == 8, 'loader-ring': demand.status == 6 || demand.status == 7, 'i-stop': demand.status < 6}"
                  ></div>
                </div>
                <div class="d-table--cell align-vertical">Smart contract is executed!</div>
              </div>
            </section>
          </div>

          <button
            v-if="!demand || demand.status < statuses.RESULT"
            class="container-full btn-big"
            :disabled="demand && demand.status != statuses.EMPTY && demand.status != statuses.RESULT"
            @click="order"
          >Order</button>
        </div>
      </section>
    </section>
  </fragment>
</template>

<script>
import { mapState } from "vuex";
import Form from "./Form";
import config from "../../config";
import { genRosbagIpfs } from "../../utils/utils";

export default {
  components: {
    Form
  },
  data() {
    return {
      id: 0,
      nonce: 0
    };
  },
  computed: {
    ...mapState("sender", ["statuses"]),
    demand() {
      return this.$store.getters["sender/demandById"](this.id);
    }
  },
  created() {
    this.$robonomics.factory.call
      .nonceOf(this.$robonomics.account.address)
      .then(r => {
        this.nonce = Number(r);
      });
  },
  methods: {
    getObjective() {
      const payload = {};
      Object.keys(this.$refs.regForm.form.fields).forEach(field => {
        payload[field] = this.$refs.regForm.form.fields[field].value;
      });
      return genRosbagIpfs(payload);
    },
    order() {
      if (this.$refs.regForm.validateForm()) {
        this.$robonomics.web3.eth.getBlock("latest", (e, r) => {
          if (e) {
            return;
          }
          this.getObjective().then(objective => {
            const demand = {
              model: config.ROBONOMICS.model.flight,
              objective,
              token: this.$robonomics.xrt.address,
              cost: 0,
              lighthouse: this.$robonomics.lighthouse.address,
              validator: config.ROBONOMICS.validator,
              validatorFee: 0,
              deadline: r.number + 1000,
              nonce: this.nonce
            };

            this.$store.dispatch("sender/send", demand).then(id => {
              this.id = id;
            });
          });
        });
      }
    }
  }
};
</script>
