import web3 from "./web3";
import dotenv from "dotenv";

import CrowdfundingFactory from "../ethereum/build/CrowdfundingFactory.json" assert { type: "json" };

dotenv.config();
const { abi } = CrowdfundingFactory.CrowdfundingFactory;

const factoryContract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

export default factoryContract;
