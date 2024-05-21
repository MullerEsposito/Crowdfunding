import pkg from "fs-extra";
import path from "path";
import solc from "solc";
import { fileURLToPath } from "url";

import { findImports, solcConfig } from "./config/index.js";
const { removeSync, readFileSync, ensureDirSync, outputJSONSync } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.resolve(__dirname, "build");
const crowdfundingPath = path.resolve(__dirname, "contracts", "CrowdfundingFactory.sol");

removeSync(buildPath);
const source = readFileSync(crowdfundingPath, "utf8");
const contracts = JSON.parse(solc.compile(JSON.stringify(solcConfig(source)), { import: findImports })).contracts;
ensureDirSync(buildPath);

for (let contract in contracts) {
  outputJSONSync(
    path.resolve(buildPath, contract.replace(".sol", "").replace("contracts/", "") + ".json"),
    contracts[contract]
  );
}

