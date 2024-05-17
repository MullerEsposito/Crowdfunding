const fs = require("fs-extra");
const path = require("path");
const solc = require("solc");

const { findImports, solcConfig } = require("./config");

const buildPath = path.resolve(__dirname, "build");
const crowdfundingPath = path.resolve(__dirname, "contracts", "CrowdfundingFactory.sol");

fs.removeSync(buildPath);
const source = fs.readFileSync(crowdfundingPath, "utf8");
const contracts = JSON.parse(solc.compile(JSON.stringify(solcConfig(source)), { import: findImports })).contracts;
fs.ensureDirSync(buildPath);

for (let contract in contracts) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(".sol", "").replace("contracts/", "") + ".json"),
    contracts[contract]
  );
}

