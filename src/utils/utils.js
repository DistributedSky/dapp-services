import { web3Utils } from "robonomics-js";
import axios from "axios";
import getIpfs, { cat as ipfsCat } from "./ipfs";
import rosBag, { getRosbag } from "./rosBag";

export const toWei = (price, decimals) => {
  const priceNum = new web3.BigNumber(price);
  return priceNum.shift(decimals).toNumber();
};
export const fromWei = (price, decimals) => {
  const priceNum = new web3.BigNumber(price);
  return priceNum.shift(-decimals).toNumber();
};
export const genRosbagIpfs = data => {
  let bag;
  let hash;
  return getRosbag(data)
    .then(r => {
      bag = r;
      return getIpfs();
    })
    .then(ipfs => {
      return ipfs.add(bag);
    })
    .then(r => {
      hash = r[0].hash;
      return axios.get(`https://ipfs.ipci.io/ipfs/${hash}`);
    })
    .then(() => {
      return hash;
    })
    .catch(e => {
      console.log(e);
    });
};
export const readRosbagIpfs = (hash, cb, topics = {}) => {
  return ipfsCat(hash).then(r => {
    return rosBag(new Blob([r]), cb, topics);
  });
};

export const watchTx = tx => {
  const transactionReceiptAsync = (resolve, reject) => {
    web3.eth.getTransactionReceipt(tx, (error, receipt) => {
      if (error) {
        reject(error);
      } else if (receipt === null) {
        setTimeout(() => transactionReceiptAsync(resolve, reject), 5000);
      } else {
        resolve(receipt);
      }
    });
  };
  if (Array.isArray(tx)) {
    return Promise.all(tx.map(oneTx => watchTx(oneTx)));
  } else if (typeof tx === "string") {
    return new Promise(transactionReceiptAsync);
  }
  throw new Error(`Invalid Type: ${tx}`);
};

export const promisify = fn => {
  return (args = []) =>
    new Promise((resolve, reject) => {
      fn(...args, (e, r) => {
        if (e) {
          return reject(e);
        }
        resolve(r);
      });
    });
};

export const intFormat = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const floatFormat = x => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
};

export const recovery = (data, signature) => {
  const message = web3Utils.utils.isHexStrict(data)
    ? web3Utils.utils.hexToBytes(data)
    : data;
  const messageBuffer = Buffer.from(message);
  const preamble = "\x19Ethereum Signed Message:\n" + message.length;
  const preambleBuffer = Buffer.from(preamble);
  const ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);
  const hash = web3Utils.hash.keccak256s(ethMessage);
  return web3Utils.account.recover(hash, signature);
};

const scan = (block, accounts, lighthouse) => {
  return new Promise(resolve => {
    const res = { ...accounts };
    web3.eth.getBlock(block, true, (e, r) => {
      if (e) {
        return resolve(res);
      }
      if (r === null || r.transactions === null) {
        return resolve(res);
      }
      r.transactions.forEach(item => {
        const from = web3.toChecksumAddress(item.from);
        if (
          Object.prototype.hasOwnProperty.call(accounts, from) &&
          accounts[from] === null
        ) {
          if (web3.toChecksumAddress(item.to) === lighthouse) {
            res[from] = item.blockNumber;
          }
        }
      });
      return resolve(res);
    });
  });
};

const isStop = result => {
  for (const account in result) {
    if (result[account] === null) {
      return false;
    }
  }
  return true;
};

export async function findLastTx(accounts, lighthouse, to, from) {
  let result = {};
  for (let i = 0; i < accounts.length; i++) {
    result[accounts[i]] = null;
  }
  for (let i = to; i > from; i--) {
    result = await scan(i, result, lighthouse);
    if (isStop(result)) {
      return result;
    }
  }
  return result;
}
