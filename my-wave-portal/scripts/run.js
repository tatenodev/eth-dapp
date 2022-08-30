const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");

  // 0.1ethをコントラクトに提供してデプロイ
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();
  console.log("Contract deployed to: ", waveContract.address);

  // コントラクトの残高を取得し、結果を出力(0.1ethの確認)
  let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));

  // waveし、トランザクションが完了するまで待機
  let waveTxn = await waveContract.wave("A message!");
  await waveTxn.wait();

  // waveした後のコントラクトの残高を取得し、結果を出力(0.0001引かれているか確認)
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

runMain();