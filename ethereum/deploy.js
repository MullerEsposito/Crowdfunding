import HDWalletProvider from "@truffle/hdwallet-provider";
import dotenv from "dotenv";
import { Web3 } from "web3";

import CrowdfundingFactory from "../ethereum/build/CrowdfundingFactory.json" assert { type: "json" };

dotenv.config();
const { abi, evm } = CrowdfundingFactory.CrowdfundingFactory;
const provider = new HDWalletProvider(
  process.env.MNEMONIC_PHRASE,
  process.env.PROVIDER_URL
);
const web3 = new Web3(provider);

(async function deploy() {
  try {
    const accounts = await web3.eth.getAccounts();
  
    console.log('Attempt to deploy from account:', accounts[0]);
  
    const result = await new web3.eth.Contract(abi)
      .deploy({ data: evm.bytecode.object })
      .send({
        from: accounts[0],
        gas: "10000000"
      });
  
    console.log('Contract deployed to:', result.options.address);    
  } catch (error) {
    console.log("Error: ", error);    
  }

  provider.engine.stop();
})()