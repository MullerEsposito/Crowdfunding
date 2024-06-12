import { Web3 } from "web3";
import dotenv from "dotenv";

dotenv.config();
let web3;

const isInBrowser = typeof window !== "undefined";

if (isInBrowser && typeof window.ethereum !== "undefined") {
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {  
  const provider = new Web3.providers.HttpProvider(process.env.PROVIDER_URL);
  web3 = new Web3(provider);
}

export default web3;