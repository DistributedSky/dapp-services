const chains = {
  1: {
    ROBONOMICS: {
      ens: "",
      ensSuffix: "eth",
      lighthouse: "airalab.lighthouse.5.robonomics.eth"
    }
  },
  4451: {
    ROBONOMICS: {
      ens: "0xaC4Ac4801b50b74aa3222B5Ba282FF54407B3941",
      ensSuffix: "sid",
      lighthouse: "airalab.lighthouse.5.robonomics.sid"
    }
  }
};

let currentChain;
function set(id) {
  currentChain = id;
}
function get() {
  if (currentChain) {
    return chains[currentChain];
  }
  throw new Error("Chain not selected");
}
function getListId() {
  return Object.keys(chains);
}
export default {
  set,
  get,
  getListId
};
