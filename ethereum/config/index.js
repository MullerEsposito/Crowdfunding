import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const getDirName = (url) => {
  const filename = fileURLToPath(url);
  const dirname = path.dirname(filename);

  return dirname;
}

const __dirname = getDirName(import.meta.url);

const findImports = (importPath) => {
  try {
    const filePath = path.resolve(__dirname, "..", importPath);
console.log(filePath);
    
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

export { findImports, solcConfig, getDirName };