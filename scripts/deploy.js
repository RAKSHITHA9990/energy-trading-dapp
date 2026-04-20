const { ethers } = require("hardhat");

async function main() {
  const Energy = await ethers.getContractFactory("EnergyTrading");
  const energy = await Energy.deploy();

  await energy.deployed();

  console.log("Contract deployed to:", energy.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});