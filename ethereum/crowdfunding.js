import web3 from "./web3";
import dotenv from "dotenv";

import Crowdfunding from "./build/Crowdfunding.json" assert { type: "json" };

dotenv.config();
const { abi } = Crowdfunding.Crowdfunding;

export default (crowdfundingAddress) => {
  return new web3.eth.Contract(abi, crowdfundingAddress);
};