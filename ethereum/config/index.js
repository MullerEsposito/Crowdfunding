import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export { findImports, solcConfig };