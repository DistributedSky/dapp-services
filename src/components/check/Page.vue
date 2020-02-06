<template>
  <fragment>
    <section class="section-light section-centered">
      <h2>
        Check registration |
        <router-link :to="{name:'registration'}" style="font-size: 14px">registration</router-link>
      </h2>
      <form v-on:submit.prevent="check">
        <section>
          <div class="form-item form-line-label">
            <label>
              Serial number *
              <span
                v-if="form.fields.id_serial.error"
                class="input-msg"
              >Check if data correct, please. Example: INTCJ123-4567-890</span>
            </label>
            <input
              v-model="form.fields.id_serial.value"
              class="container-full"
              :class="{ error: form.fields.id_serial.error }"
              type="text"
              required
            />
          </div>
          <div class="form-item form-line-label">
            <label>
              Liability address *
              <span
                v-if="form.fields.liability.error"
                class="input-msg"
              >Check if data correct, please. Example: 0x....</span>
            </label>
            <input
              v-model="form.fields.liability.value"
              class="container-full"
              :class="{ error: form.fields.liability.error }"
              type="text"
              required
            />
          </div>
        </section>
        <section>
          <button :disabled="loadingCheck" class="btn-green input-sm" @click="check">Check</button>
          <div
            v-if="submit && isCheck === true"
            class="d-table--cell align-vertical"
            style="margin-left: 20px;"
          >
            <div class="m-r-15 i-check green"></div>
          </div>
          <div
            v-if="submit && isCheck === false"
            class="d-table--cell align-vertical"
            style="margin-left: 20px;"
          >
            <div class="m-r-15 i-stop"></div>
          </div>
        </section>
      </form>
    </section>
  </fragment>
</template>

<script>
import { Liability } from "robonomics-js";
import { cat as ipfsCat } from "../../utils/ipfs";
import rosBag from "../../utils/rosBag";

export default {
  data() {
    return {
      submit: false,
      isCheck: false,
      loadingCheck: false,
      form: {
        fields: {
          id_serial: {
            value: "",
            rules: ["require"],
            error: false
          },
          liability: {
            value: "",
            rules: ["require", "address"],
            error: false
          }
        },
        error: false
      }
    };
  },
  methods: {
    validateForm() {
      this.form.error = false;
      for (let field in this.form.fields) {
        this.form.fields[field].error = false;
        this.form.fields[field].rules.forEach(rule => {
          if (rule === "require" && !this.form.fields[field].value) {
            this.form.fields[field].error = true;
            this.form.error = true;
          } else if (
            rule === "address" &&
            !this.$robonomics.web3.utils.isAddress(
              this.form.fields[field].value
            )
          ) {
            this.form.fields[field].error = true;
            this.form.error = true;
          }
        });
      }
      return !this.form.error;
    },
    check() {
      if (this.validateForm()) {
        this.loadingCheck = true;
        const liability = new Liability(
          this.$robonomics.web3,
          this.form.fields.liability.value,
          this.form.fields.liability.value
        );
        liability.getInfo().then(r => {
          if (r.result !== "") {
            ipfsCat(r.result).then(r => {
              rosBag(
                new Blob([r]),
                bag => {
                  this.submit = true;
                  this.loadingCheck = false;
                  if (this.form.fields.id_serial.value === bag.message.data) {
                    this.isCheck = true;
                  }
                },
                {
                  topics: [`/liability/eth_${liability.address}/id_serial`]
                }
              );
            });
          } else {
            this.submit = true;
            this.loadingCheck = false;
            this.isCheck = false;
          }
        });
      }
    }
  }
};
</script>
