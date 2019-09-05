<template>
  <form>
    <section>
      <div class="form-section-title">Operator</div>
      <div class="form-item form-line-label">
        <label for="inputdata-email">
          Contact e-mail *
          <span
            v-if="form.fields.email.error"
            class="input-msg"
          >Check if data correct, please.</span>
        </label>
        <input
          v-model="form.fields.email.value"
          class="container-full"
          :class="{ error: form.fields.email.error }"
          type="text"
          required
        />
      </div>
      <div class="form-item form-line-label">
        <label for="inputdata-fullname">
          Fullname *
          <span
            v-if="form.fields.pilot_name.error"
            class="input-msg"
          >Check if data correct, please.</span>
        </label>
        <input
          v-model="form.fields.pilot_name.value"
          class="container-full"
          :class="{ error: form.fields.pilot_name.error }"
          type="text"
          required
        />
      </div>
      <div class="form-item form-line-label">
        <label for="inputdata-id">
          Pilot ID *
          <span
            v-if="form.fields.pilot_reg.error"
            class="input-msg"
          >Check if data correct, please.</span>
        </label>
        <input
          v-model="form.fields.pilot_reg.value"
          class="container-full"
          :class="{ error: form.fields.pilot_reg.error }"
          type="text"
          required
        />
      </div>
    </section>
    <section>
      <div class="form-section-title">UAV</div>
      <div class="form-item form-line-label">
        <label for="inputdata-serial">
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
          placeholder="Example: INTCJ123-4567-890"
          required
        />
      </div>
      <div class="form-item form-line-label">
        <label for="inputdata-model">
          Registration number *
          <span
            v-if="form.fields.id_reg.error"
            class="input-msg"
          >Check if data correct, please. Example: FA123456789</span>
        </label>
        <input
          v-model="form.fields.id_reg.value"
          class="container-full"
          :class="{ error: form.fields.id_reg.error }"
          type="text"
          placeholder="Example: FA123456789"
          required
        />
      </div>
      <div class="form-item form-line-label">
        <label for="inputdata-type">
          Type *
          <span
            v-if="form.fields.drone_type.error"
            class="input-msg"
          >Check if data correct, please. Example: VTOL</span>
        </label>
        <input
          v-model="form.fields.drone_type.value"
          class="container-full"
          :class="{ error: form.fields.drone_type.error }"
          type="text"
          placeholder="Example: VTOL"
          required
        />
      </div>
      <div class="form-item form-line-label">
        <label for="inputdata-manufacturer">
          Manufacturer
          <span
            v-if="form.fields.drone_make.error"
            class="input-msg"
          >Check if data correct, please. Example: DJI</span>
        </label>
        <input
          v-model="form.fields.drone_make.value"
          class="container-full"
          :class="{ error: form.fields.drone_make.error }"
          type="text"
          placeholder="Example: DJI"
        />
      </div>
      <div class="form-item form-line-label">
        <label for="inputdata-model">
          Model
          <span
            v-if="form.fields.drone_model.error"
            class="input-msg"
          >Check if data correct, please. Example: 100</span>
        </label>
        <input
          v-model="form.fields.drone_model.value"
          class="container-full"
          :class="{ error: form.fields.drone_model.error }"
          type="text"
          placeholder="Example: Matrice 100"
        />
      </div>
    </section>
    <section>
      <div class="form-item">
        <input
          v-model="form.fields.checkbox.value"
          :class="{ error: form.fields.checkbox.error }"
          type="checkbox"
          checked
        />
        <label for="inputdata-agreement">
          I agree to the
          <a href="ToS_-_Decentralized_Technology_(draft).doc" target="_blank">Terms</a> and
          <a
            href="Privacy_Policy_Decentralized_Technology_v.3_(draft).docx"
            target="_blank"
          >Privacy Policy</a>
        </label>
      </div>
    </section>
  </form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        fields: {
          id_serial: {
            value: "",
            rules: ["require"],
            error: false
          },
          email: {
            value: "",
            rules: ["require", "email"],
            error: false
          },
          drone_type: {
            value: "",
            rules: ["require"],
            error: false
          },
          drone_make: {
            value: "",
            rules: ["require"],
            error: false
          },
          drone_model: {
            value: "",
            rules: ["require"],
            error: false
          },
          id_reg: {
            value: "",
            rules: ["require"],
            error: false
          },
          pilot_name: {
            value: "",
            rules: ["require"],
            error: false
          },
          pilot_reg: {
            value: "",
            rules: ["require"],
            error: false
          },
          checkbox: {
            value: "",
            rules: ["require"],
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
            rule === "email" &&
            !/.+@.+/.test(this.form.fields[field].value)
          ) {
            this.form.fields[field].error = true;
            this.form.error = true;
          }
        });
      }
      return !this.form.error;
    }
  }
};
</script>
