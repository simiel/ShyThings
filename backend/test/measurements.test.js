const { compiledContract } = require('../compile');
const assert = require('assert');
const Web3 = require('web3');
const ganache = require('ganache-cli');
const { beforeEach } = require('mocha');

const web3 = new Web3(ganache.provider());

const clearPassword = 'password';
let accounts;
let measurements;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  // console.log('🚀 ~ accounts:', accounts);
  measurements = await new web3.eth.Contract(compiledContract.abi)
    .deploy({
      data: compiledContract.evm.bytecode.object,
      arguments: [clearPassword],
    })
    .send({ from: accounts[0], gas: '1000000' });

  // console.log('🚀 ~ measurements:', measurements);
});

describe('Measurements', () => {
  it('deploys contract', () => {
    assert.ok(measurements.options.address);
    console.log(measurements.options.address);
  });

  it('changes measurements', async () => {
    await measurements.methods
      .setMeasurements(clearPassword, 'New basic map', 'New tailor map')
      .send({ from: accounts[0], gas: 5000000 });
    const updatedBasicMeasurements = await measurements.methods
      .basicMeasurements()
      .call();
    const updatedDetailedMeasurements = await measurements.methods
      .detailedMeasurements()
      .call();
    assert.equal('New basic map', updatedBasicMeasurements);
    assert.equal('New tailor map', updatedDetailedMeasurements);
  });

  it('cannot change measurements with wrong password', async () => {
    await measurements.methods
      .setMeasurements('wrong password', 'New basic map', 'New tailor map')
      .send({ from: accounts[0], gas: 5000000 });
    const updatedBasicMeasurements = await measurements.methods
      .basicMeasurements()
      .call();
    const updatedDetailedMeasurements = await measurements.methods
      .detailedMeasurements()
      .call();
    assert.notEqual('New basic map', updatedBasicMeasurements);
    assert.notEqual('New tailor map', updatedDetailedMeasurements);
  });
});
