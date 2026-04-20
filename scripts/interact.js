const { ethers } = require("hardhat");

async function main() {

  const [consumer, producer] = await ethers.getSigners();

  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const Energy = await ethers.getContractFactory("EnergyTrading");
  const energy = await Energy.attach(contractAddress);

  console.log("Initial balances:");

  console.log("Consumer balance:",
    (await energy.getBalance(consumer.address)).toString());

  console.log("Producer balance:",
    (await energy.getBalance(producer.address)).toString());

  // Add balance to consumer
  await energy.connect(consumer).addBalance({ value: 10 });

  // Producer adds energy
  await energy.connect(producer).addEnergy(10);

  // Consumer buys energy
  await energy.connect(consumer).buyEnergy(producer.address, 5);

  console.log("\nAfter transaction:");

  console.log("Producer balance:",
    (await energy.getBalance(producer.address)).toString());
}

main();