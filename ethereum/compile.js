const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const contractsPath = path.resolve(__dirname, "contracts");
const contractFiles = fs.readdirSync(contractsPath);

const input = {
  language: "Solidity",
  sources: {},
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

for (const file of contractFiles) {
  if (file.endsWith(".sol")) {
    const contractName = file.split(".")[0];
    const contractPath = path.resolve(contractsPath, file);
    const source = fs.readFileSync(contractPath, "utf8");

    input.sources[contractName] = { content: source };
  }
}

const compiledContracts = JSON.parse(solc.compile(JSON.stringify(input)));

fs.ensureDirSync(buildPath);

for (const contractFileName in compiledContracts.contracts) {
  for (const contractName in compiledContracts.contracts[contractFileName]) {
    const contract = compiledContracts.contracts[contractFileName][contractName];
    fs.outputJsonSync(
      path.resolve(buildPath, `${contractName}.json`),
      contract
    );
  }
}

console.log("Contracts compiled successfully and saved in the build directory.");
