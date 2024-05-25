import pkg from "fs-extra";
import path from "path";
import solc from "solc";

import { getDirName } from "./config/index.js";

import { findImports, solcConfig } from "./config/index.js";
const { removeSync, readFileSync, ensureDirSync, outputJSONSync } = pkg;

const __dirname = getDirName(import.meta.url);
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

