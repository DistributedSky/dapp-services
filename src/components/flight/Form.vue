<template>
  <form>
    <section>
      <div class="form-item form-line-label">
        <label for="inputdata-liability">
          Drone ID address *
          <span
            v-if="form.fields.liability.error"
            class="input-msg"
          >Check if data correct, please.</span>
        </label>
        <input
          v-model="form.fields.liability.value"
          class="container-full"
          :class="{ error: form.fields.liability.error }"
          type="text"
          required
        />
      </div>
      <div class="form-item form-line-label">
        <label>
          Attach drone mission plan/report *
          <span
            v-if="form.fields.log_hash.error"
            class="input-msg"
          >Check if data correct, please.</span>
        </label>
        <file-pond
          name="test"
          ref="pond"
          label-idle="Перетащите файлы сюда..."
          v-bind:server="upload"
          v-on:init="handleFilePondInit"
        />
        <input
          v-model="form.fields.log_hash.value"
          class="container-full"
          :class="{ error: form.fields.log_hash.error }"
          type="text"
        />
      </div>
    </section>
  </form>
</template>

<script>
import axios from "axios";
import vueFilePond from "vue-filepond";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import getIpfs from "../../utils/ipfs";
import config from "../../config";
import "filepond/dist/filepond.min.css";

const FilePond = vueFilePond(FilePondPluginFileEncode);

export default {
  components: {
    FilePond
  },
  data() {
    return {
      upload: {
        process: (fieldName, file, metadata, load, error, progress, abort) => {
          const fr = new FileReader();
          fr.readAsDataURL(file);
          fr.onload = () => {
            const fileBuffer = new Buffer(
              fr.result.substr(fr.result.indexOf(",") + 1),
              "base64"
            );
            getIpfs()
              .then(ipfs => {
                ipfs.add(fileBuffer, (e, r) => {
                  if (e) {
                    error(e);
                    return;
                  }
                  const hash = r[0].hash;
                  console.log(hash);
                  axios
                    .get(`${config.GATEWAY}${hash}`)
                    .then(() => {
                      this.form.fields.log_hash.value = hash;
                      load(hash);
                    })
                    .catch(e => {
                      console.log(e);
                      error(e);
                    });
                });
              })
              .catch(e => {
                error(e);
              });
          };
          return {
            abort: () => {
              abort();
            }
          };
        },
        revert: (uniqueFileId, load /*, error*/) => {
          this.form.fields.log_hash.value = "";
          load();
        }
      },
      form: {
        fields: {
          liability: {
            value: "",
            rules: ["require", "address"],
            error: false
          },
          log_hash: {
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
            rule === "address" &&
            !this.$robonomics.web3.isAddress(this.form.fields[field].value)
          ) {
            this.form.fields[field].error = true;
            this.form.error = true;
          }
        });
      }
      return !this.form.error;
    },
    handleFilePondInit() {
      console.log("FilePond has initialized");
    }
  }
};
</script>
