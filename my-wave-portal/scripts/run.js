const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  // const [owner, randomPerson1, randomPerson2] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  const wavePortal = await waveContract.deployed();

  console.log("Contract deployed to:", wavePortal.address);
  console.log("Contract deployed by:", owner.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave();
  // .wait()とすることで取引の承認を待つ
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();

  // .connect(randomPerson)で他のユーザーにwaveを送った状態をシミュレーションしている
  waveTxn = await waveContract.connect(randomPerson).wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();
}

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
