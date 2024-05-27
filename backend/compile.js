const path = require('path');
const fs = require('fs');
const solc = require('solc');
const contractToCompile = 'Measurements.sol';
const contractPath = path.resolve(__dirname, 'contracts', contractToCompile);
const source = fs.readFileSync(contractPath, 'utf8');

var input = {
  language: 'Solidity',
  sources: {
    [contractToCompile]: {
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
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
// console.log('🚀 ~ output:', output);

const mainContract = output.contracts[contractToCompile]['Measurements'];
// console.log('🚀 ~ mainContract:', mainContract);

module.exports = { compiledContract: mainContract };
