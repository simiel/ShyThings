// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.19;

// This contract is used to store basic and detailed body measurements for a user
// They will be encrypted and stored on the blockchain accessible only by seperate passwords
// The user can add measurements and edit them
// The user can also delete measurements

contract Measurements {
    bytes32 private passwordHash;
    string public basicMeasurements;
    string public detailedMeasurements;
    address public owner;

    constructor(string memory _password) {
        passwordHash = keccak256(abi.encodePacked(_password));
        owner = msg.sender;
        }

    function setMeasurements(string memory passwordClearText, string memory newBasicMap, string memory newTailorMap) public {
        bytes32 givenPasswordHash = keccak256(abi.encodePacked(passwordClearText));
        if(passwordHash == givenPasswordHash) {
            basicMeasurements = newBasicMap;
            detailedMeasurements = newTailorMap;
        }
    }
    
    }