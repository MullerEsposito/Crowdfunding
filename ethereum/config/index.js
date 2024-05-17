const path = require("path");
const fs = require("fs");

const findImports = (importPath) => {
  try {
    const filePath = path.resolve(__dirname, "..", importPath);
    
    return { contents: fs.readFileSync(filePath, 'utf8') };
  } catch (error) {
    return { error: 'File not found bla' };
  }
};

const solcConfig = (source) => ({
  language: 'Solidity',
  sources: {
    'CrowdfundingFactory.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
});

module.exports = { findImports, solcConfig };