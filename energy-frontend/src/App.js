import { useState } from "react";
import { ethers } from "ethers";
import EnergyTrading from "./EnergyTrading.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const sellerAddress = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);

  const [balance, setBalance] = useState("0");
  const [energy, setEnergy] = useState("0");
  const [sellerEnergy, setSellerEnergy] = useState("0");

  const unitsToBuy = 5;

  const loadData = async (contractInstance, userAccount) => {
    if (!contractInstance || !userAccount) return;

    try {
      const bal = await contractInstance.getBalance(userAccount);
      const en = await contractInstance.getEnergy(userAccount);
      const sellerEn = await contractInstance.getEnergy(sellerAddress);

      setBalance(bal.toString());
      setEnergy(en.toString());
      setSellerEnergy(sellerEn.toString());
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contractInstance = new ethers.Contract(
      contractAddress,
      EnergyTrading.abi,
      signer
    );

    setAccount(accounts[0]);
    setContract(contractInstance);

    await loadData(contractInstance, accounts[0]);
  };

  const addBalance = async () => {
    const tx = await contract.addBalance({
      value: ethers.utils.parseEther("1.0"),
    });
    await tx.wait();
    await loadData(contract, account);
  };

  const addEnergy = async () => {
    const tx = await contract.addEnergy(10);
    await tx.wait();
    await loadData(contract, account);
  };

  const buyEnergy = async () => {
    try {
      const tx = await contract.buyEnergy(sellerAddress, unitsToBuy);
      await tx.wait();
      await loadData(contract, account);
    } catch (err) {
      if (err.message.includes("Not enough balance")) {
        alert(`Need ${unitsToBuy} ETH`);
      } else if (err.message.includes("Not enough energy")) {
        alert("Seller has no energy");
      } else {
        alert("Transaction failed");
      }
    }
  };

  // 🎨 STYLES
  const container = {
    textAlign: "center",
    padding: "30px",
    fontFamily: "Arial",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
  };

  const card = {
    background: "#1e293b",
    padding: "20px",
    margin: "15px auto",
    width: "400px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  };

  const button = {
    margin: "10px",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  };

  return (
    <div style={container}>
      <h1 style={{ color: "#38bdf8" }}>⚡ Energy Trading System</h1>

      <button
        style={{ ...button, background: "#22c55e", color: "white" }}
        onClick={connectWallet}
      >
        Connect Wallet
      </button>

      {/* 👤 USER CARD */}
      <div style={card}>
        <h2>👤 Buyer</h2>
        <p><b>Address:</b></p>
        <small>{account || "Not connected"}</small>

        <h3 style={{ color: "#22c55e" }}>
          Balance: {balance !== "0" ? ethers.utils.formatEther(balance) : "0"} ETH
        </h3>

        <h3 style={{ color: "#facc15" }}>Energy: {energy}</h3>
      </div>

      {/* 🏭 SELLER CARD */}
      <div style={card}>
        <h2>🏭 Seller</h2>
        <small>{sellerAddress}</small>

        <h3 style={{ color: "#f97316" }}>
          Available Energy: {sellerEnergy}
        </h3>
      </div>

      {/* 💰 TRANSACTION CARD */}
      <div style={card}>
        <h2>💰 Trade</h2>
        <p>
          Buying <b>{unitsToBuy}</b> units costs{" "}
          <b style={{ color: "#38bdf8" }}>{unitsToBuy} ETH</b>
        </p>

        <button
          style={{ ...button, background: "#3b82f6", color: "white" }}
          onClick={addBalance}
        >
          Add Balance
        </button>

        <button
          style={{ ...button, background: "#f59e0b", color: "white" }}
          onClick={addEnergy}
        >
          Add Energy (Seller)
        </button>

        <button
          style={{ ...button, background: "#ef4444", color: "white" }}
          onClick={buyEnergy}
        >
          Buy Energy
        </button>
      </div>
    </div>
  );
}

export default App;