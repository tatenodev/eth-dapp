// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract WavePortal {
  uint256 totalWaves;

  event NewWave(address indexed from, uint256 timestamp, string message);

  struct Wave {
    address waver; // waveを送ったユーザーのaddress
    string message; // ユーザーが送ったメッセージ
    uint256 timestamp; // ユーザーがwaveを送った瞬間のtimestamp
  }

  Wave[] waves;
  
  constructor() payable {
    console.log("WavePortal - Smart Contract!");
  }

  function wave(string memory _message) public {
    totalWaves += 1;
    console.log("%s waved w/ message %s", msg.sender, _message);
    // waveとmessageを配列に格納
    waves.push(Wave(msg.sender, _message, block.timestamp));
    emit NewWave(msg.sender, block.timestamp, _message);

    // waveを送ったユーザーに0.0001ethを送る
    uint256 prizeAmout = 0.0001 ether;
    require(prizeAmout <= address(this).balance, "Trying to withdraw more money than the contract has.");
    (bool success, ) = (msg.sender).call{value: prizeAmout}("");
    require(success, "Failed to withdraw money from contract.");
  }

  // wavesを返す
  function getAllWaves() public view returns (Wave[] memory) {
    return waves;
  }

  function getTotalWaves() public view returns(uint256) {
    console.log("We have %d total waves!", totalWaves);
    return totalWaves;
  }
}
