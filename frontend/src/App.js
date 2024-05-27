import './App.css';
import React, { useState } from 'react';
const fetch = require('node-fetch');
const Web3 = require('web3');
const crypto = require('crypto-js');

window.ethereum.request({ method: 'eth_requestAccounts' });
const web3 = new Web3(window.ethereum);

function App() {
  const [clearPassword, setClearPassword] = useState('');
  const [clearBasicPassword, setClearBasicPassword] = useState('');
  const [clearDPassword, setClearDPassword] = useState('');
  const [basicMeasurements, setBasicMeasurements] = useState({
    height: 0,
    weight: 0,
    age: 0,
  });
  const [dMeasurements, setDMeasurements] = useState({
    waist: 0,
    leg: 0,
    arms: 0,
  });
  const [deployedContract, setDeployedContract] = useState('');
  const [deployedAddress, setDeployedAddress] = useState('');

  const handleClearPassword = (e) => {
    setClearPassword(e.target.value);
  };

  const handleClearBasicPassword = (e) => {
    setClearBasicPassword(e.target.value);
  };

  const handleClearDPassword = (e) => {
    setClearDPassword(e.target.value);
  };

  const handleBasicMeasurements = (e, key) => {
    setBasicMeasurements({ ...basicMeasurements, [key]: e.target.value });
  };

  const handleDMeasurements = (e, key) => {
    setDMeasurements({ ...dMeasurements, [key]: e.target.value });
  };

  async function deployContract() {
    console.log('Deploying contract...', clearPassword);
    fetch('http://localhost:4000')
      .then((res) => res.json())
      .then(async (compiledContract) => {
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(compiledContract.abi);
        const contractInstance = await contract
          .deploy({
            data: compiledContract.evm.bytecode.object,
            arguments: [clearPassword],
          })
          .send({ from: accounts[0], gas: '1000000' });
        console.log(
          'Contract deployed at address:',
          contractInstance.options.address
        );
        setDeployedContract(contractInstance);
        setDeployedAddress(contractInstance.options.address);
      });
  }

  async function updateMeasurements() {
    try {
      const accounts = await web3.eth.getAccounts();
      let basicMeasurementsString = JSON.stringify(basicMeasurements);
      let dMeasurementsString = JSON.stringify(dMeasurements);
      const encryptedMapBasic = crypto.AES.encrypt(
        basicMeasurementsString,
        clearBasicPassword
      ).toString();
      // console.log(
      //   '🚀 ~ updateMeasurements ~ encryptedMapBasic:',
      //   encryptedMapBasic
      // );
      const encryptedMapTailor = crypto.AES.encrypt(
        dMeasurementsString,
        clearDPassword
      ).toString();
      await deployedContract.methods
        .setMeasurements(clearPassword, encryptedMapBasic, encryptedMapTailor)
        .send({ from: accounts[0], gas: 5000000 });
    } catch (error) {
      console.error('Error updating maps: ', error);
    }
  }

  async function loadMeasurements() {
    let newMapBasicEncrypted = await deployedContract.methods
      .basicMeasurements()
      .call();
    console.log(
      '🚀 ~ loadMeasurements ~ newMapBasicEncrypted:',
      newMapBasicEncrypted
    );
    let newMapTailorEncrypted = await deployedContract.methods
      .detailedMeasurements()
      .call();

    let mapBasicBytes = crypto.AES.decrypt(
      newMapBasicEncrypted,
      clearBasicPassword
    );
    let mapTailorBytes = crypto.AES.decrypt(
      newMapTailorEncrypted,
      clearDPassword
    );
    setBasicMeasurements(JSON.parse(mapBasicBytes.toString(crypto.enc.Utf8)));
    setDMeasurements(JSON.parse(mapTailorBytes.toString(crypto.enc.Utf8)));
  }

  return (
    <div className='App'>
      <h1>Shy Things Body Measurements</h1>
      <h3>Contract address: {deployedAddress}</h3>
      <div>
        <label>Contract password</label>
        <input type='text' onChange={handleClearPassword} />
        <button onClick={deployContract}>Deploy Contract</button>
      </div>
      <div>
        <label>Basic Password</label>
        <input type='text' onChange={handleClearBasicPassword} />
      </div>
      <div>
        <label>Tailor Password</label>
        <input type='text' onChange={handleClearDPassword} />
      </div>
      <h3>Basic Body Measurements</h3>
      {Object.keys(basicMeasurements).map((key) => (
        <div key={key}>
          <label>
            {key}:
            <input
              type='text'
              value={basicMeasurements[key]}
              onChange={(e) => handleBasicMeasurements(e, key)}
            />
          </label>
        </div>
      ))}
      <h3>Basic Detailed Measurements</h3>
      {Object.keys(dMeasurements).map((key) => (
        <div key={key}>
          <label>
            {key}:
            <input
              type='text'
              value={dMeasurements[key]}
              onChange={(e) => handleDMeasurements(e, key)}
            />
          </label>
        </div>
      ))}
      <br />
      <button onClick={updateMeasurements}>Update Body Maps</button>
      <br />
      <button onClick={loadMeasurements}>Load Body Maps</button>
    </div>
  );
}

export default App;
