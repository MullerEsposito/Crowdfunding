import web3 from "./web3";
import dotenv from "dotenv";

import CrowdfundingFactory from "./build/CrowdfundingFactory.json" assert { type: "json" };

dotenv.config();
const { abi } = CrowdfundingFactory.CrowdfundingFactory;

const factoryContract = new web3.eth.Contract(abi, '0x55Eb3B48290b0CB5631BA019903e8ff233dD5587');

export default factoryContract;
