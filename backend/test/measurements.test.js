const mainContract = require('../compile');
const assert = require('assert');
const { Web3 } = require('web3');
const ganache = require('ganache-cli');
const { beforeEach } = require('mocha');

// console.log('🚀 ~ mainContract:', mainContract);

const web3 = new Web3(ganache.provider());

let accounts;
let measurements;
const password = 'Mal0n3';

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  console.log('🚀 ~ accounts:', accounts);
  measurements = await new web3.eth.Contract(mainContract.abi)
    .deploy({
      data: '0x0' + mainContract.evm.bytecode.object,
      arguments: [password],
    })
    .send({ from: accounts[0], gas: 500000, gasPrice: '300000000' });

  console.log('🚀 ~ measurements:', measurements);
});

describe('Measurements', () => {
  it('deploys a contract', () => {
    console.log(
      '🚀 ~ it ~ measurements.options.address:',
      measurements.options.address
    );
    assert.ok(measurements.options.address);
  });

  // it('has a password', async () => {
  //     const contractPassword = await measurements.methods.password().call();
  //     assert.strictEqual(contractPassword, password);
  // });

  // it('can add a measurement', async () => {
  //     const measurement = 'Temperature: 25C';
  //     await measurements.methods.addMeasurement(measurement).send({ from: accounts[0], gas: '1000000' });
  //     const measurementsCount = await measurements.methods.getMeasurementsCount().call();
  //     assert.strictEqual(measurementsCount, '1');
  // });

  // it('can get a measurement', async () => {
  //     const measurement = 'Temperature: 25C';
  //     await measurements.methods.addMeasurement(measurement).send({ from: accounts[0], gas: '1000000' });
  //     const measurementsCount = await measurements.methods.getMeasurementsCount().call();
  //     const measurementResult = await measurements.methods.getMeasurement(0).call();
  //     assert.strictEqual(measurementResult, measurement);
  // });

  // it('can get all measurements', async () => {
  //     const measurement1 = 'Temperature: 25C';
  //     const measurement2 = 'Temperature: 26C';
  //     await measurements.methods.addMeasurement(measurement1).send({ from: accounts[0], gas: '1000000' });
  //     await measurements.methods.addMeasurement(measurement2).send({ from: accounts[0], gas: '1000000' });
  //     const measurementsCount = await measurements.methods.getMeasurementsCount().call();
  //     const measurementsResult = await measurements.methods.getAllMeasurements().call();
  //     assert.strictEqual(measurementsResult.length, 2);
  //     assert.strictEqual(measurementsResult[0], measurement1);
  //     assert.strictEqual(measurementsResult[1], measurement2);
  // });

  // it('can remove a measurement', async () => {
  //     const measurement = 'Temperature: 25C';
  //     await measurements.methods.addMeasurement(measurement).send({ from: accounts[0], gas: '1000000' });
  //     await measurements.methods.removeMeasurement(0).send({ from: accounts[0], gas: '1000000' });
  //     const measurementsCount = await measurements.methods.getMeasurementsCount().call();
  //     assert.strictEqual(measurementsCount, '0');
  // });
});
