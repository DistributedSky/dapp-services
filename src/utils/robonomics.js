import Robonomics, { MessageProviderIpfs } from "robonomics-js";
import config from "../config";

let robonomics = null;
export const initRobonomics = (web3, ipfs, account) => {
  robonomics = new Robonomics({
    web3,
    account: {
      address: account
    },
    ens: {
      address: config.chain.get().ROBONOMICS.ens,
      suffix: config.chain.get().ROBONOMICS.ensSuffix,
      version: config.ROBONOMICS.version
    },
    messageProvider: new MessageProviderIpfs(ipfs),
    lighthouse: config.chain.get().ROBONOMICS.lighthouse
  });
  return robonomics;
};
const getRobonomics = () => {
  if (robonomics === null) {
    throw new Error("Robonomics not init");
  }
  return robonomics;
};

export default getRobonomics;
