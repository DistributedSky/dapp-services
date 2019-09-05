<template>
  <fragment>
    <slot :status="status" :liability="liability" :result="result" :send="send">
      <button :disabled="status > 0" @click="send">Send</button>
    </slot>
  </fragment>
</template>

<script>
export const STATUS = {
  EMPTY: 0,
  BTN: 1,
  BROADCAST: 2,
  SEND: 3,
  OFFER: 4,
  TX: 5,
  CONTRACT: 6,
  REPORT: 7,
  RESULT: 8
};

export default {
  props: {
    getDemand: Function,
    onLiability: Function,
    timeout: {
      type: Number,
      default: 5000
    }
  },
  data() {
    return {
      status: STATUS.EMPTY,
      demand: null,
      offer: null,
      result: null,
      liability: null,
      interval: null,
      intervalFallback: null
    };
  },
  methods: {
    listen(model) {
      const offerListener = this.$robonomics.onOffer(model, msg => {
        console.log("offer", msg);
        if (
          msg.objective === this.demand.objective &&
          msg.token === this.demand.token &&
          msg.cost === this.demand.cost
        ) {
          this.status = STATUS.OFFER;
          this.offer = msg;
          this.$robonomics.messenger.off(offerListener);
          clearInterval(this.interval);
        }
      });
      const resultListener = this.$robonomics.onResult(msg => {
        console.log("result unverified", msg);
        if (this.liability !== null && msg.liability === this.liability) {
          this.status = STATUS.REPORT;
          this.result = msg;
          this.$robonomics.messenger.off(resultListener);
        }
      });
    },
    send() {
      this.status = STATUS.BTN;
      return this.getDemand()
        .then(this.broadcast)
        .catch(() => {
          this.status = STATUS.EMPTY;
        });
    },
    broadcast(demand) {
      this.status = STATUS.BTN;
      this.demand = demand;
      this.listen(demand.model);
      this.$robonomics
        .sendDemand(demand, true, msg => {
          if (this.timeout > 0) {
            this.status = STATUS.BROADCAST;
            this.interval = setInterval(() => {
              this.$robonomics.messenger.channel.send(msg.encode());
            }, this.timeout);
          } else {
            this.status = STATUS.SEND;
          }
        })
        .then(liability => {
          this.status = STATUS.CONTRACT;
          console.log("liability demand", liability.address);
          this.liability = liability.address;
          this.onLiability(liability);
          // if (this.timeout > 0) {
          //   liability.getInfo().then(info => {
          //     if (info.demandHash === this.hash) {
          //       clearInterval(this.interval);
          //     }
          //   });
          // }
          this.intervalFallback = setInterval(() => {
            liability.contract.result((e, r) => {
              if (e) {
                clearInterval(this.intervalFallback);
                return;
              }
              if (r && r !== "0x") {
                clearInterval(this.intervalFallback);
                console.log("result fallback");
                // console.log("r", hexToStr(r));
                this.status = STATUS.RESULT;
              }
            });
          }, 1000);
          return liability.onResult();
        })
        .then(result => {
          clearInterval(this.intervalFallback);
          console.log("result", result);
          this.status = STATUS.RESULT;
        })
        .catch(() => {
          this.status = STATUS.EMPTY;
        });
    }
  }
};
</script>
