// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract WavePortal {
  uint256 totalWaves;

  // 乱数生成のための基盤となるシード
  uint256 private seed;

  event NewWave(address indexed from, uint256 timestamp, string message);

  struct Wave {
    address waver; // waveを送ったユーザーのaddress
    string message; // ユーザーが送ったメッセージ
    uint256 timestamp; // ユーザーがwaveを送った瞬間のtimestamp
  }

  Wave[] waves;
  
  constructor() payable {
    console.log("WavePortal - Smart Contract!");

    // 初期シード設定
    seed = (block.timestamp + block.difficulty) % 100;
  }

  function wave(string memory _message) public {
    totalWaves += 1;
    console.log("%s waved w/ message %s", msg.sender, _message);
    waves.push(Wave(msg.sender, _message, block.timestamp));

    // ユーザーのために乱数を生成
    seed = (block.difficulty + block.timestamp + seed) % 100;
    console.log("Random # generated: %d", seed);

    // ユーザーがethを獲得する確率を50%に設定
    if (seed < 50) {
      console.log("%s won!", msg.sender);
      // waveを送ったユーザーに0.0001ethを送る
      uint256 prizeAmout = 0.0001 ether;
      require(prizeAmout <= address(this).balance, "Trying to withdraw more money than the contract has.");
      (bool success, ) = (msg.sender).call{value: prizeAmout}("");
      require(success, "Failed to withdraw money from contract.");
    } else {
      console.log("%s did not win.", msg.sender);
    }
    
    emit NewWave(msg.sender, block.timestamp, _message);
  }

  function getAllWaves() public view returns (Wave[] memory) {
    return waves;
  }

  function getTotalWaves() public view returns(uint256) {
    console.log("We have %d total waves!", totalWaves);
    return totalWaves;
  }
}
