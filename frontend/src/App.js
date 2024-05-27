import './App.css';
import React, { useState } from 'react';
const fetch = require('node-fetch');
const Web3 = require('web3');
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
    fetch('http://localhost:3000')
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
        passwordClearTextBasic
      ).toString();
      const encryptedMapTailor = crypto.AES.encrypt(
        dMeasurementsString,
        passwordClearTextTailor
      ).toString();
      await deployedContract.methods
        .setMeasurements(
          passwordClearText,
          encryptedMapBasic,
          encryptedMapTailor
        )
        .send({ from: accounts[0], gas: 5000000 });
    } catch (error) {
      console.error('Error updating maps: ', error);
    }
  }

  async function loadMeasurements() {
    let newMapBasicEncrypted = await deployedContract.methods
      .basicMeasurements()
      .call();
    let newMapTailorEncrypted = await deployedContract.methods
      .detailedMeasurements()
      .call();

    let mapBasicBytes = crypto.AES.decrypt(
      newMapBasicEncrypted,
      passwordClearTextBasic
    );
    let mapTailorBytes = crypto.AES.decrypt(
      newMapTailorEncrypted,
      passwordClearTextTailor
    );
    SetMapBasic(JSON.parse(mapBasicBytes.toString(crypto.enc.Utf8)));
    setMapTailor(JSON.parse(mapTailorBytes.toString(crypto.enc.Utf8)));
  }

  return <div className='App'></div>;
}

export default App;
