import React, { useEffect, useState } from "react";
import './App.css';
import { ethers } from "ethers";
import abi from './utils/WavePortal.json'

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");

  const contractAddress = "0x23E1C7341aEE6d0D2548d623E17d5bC6d979AFF9"
  const contractABI = abi.abi

  useEffect(() => checkIfWalletIsConnected(), [])

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (ethereum) {
      console.log("We have the ethereum object", ethereum);
    } else {
      console.log("make sure you have metamask installed on your broswer");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0]
      console.log("find a authorized account", account)
      setCurrentAccount(account)
    } else {
      console.log("no authroized account found")
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask right now !")
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("connected", accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }


  const wave = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const providers = new ethers.providers.Web3Provider(ethereum)
        const signer = providers.getSigner()
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)

        let count = await wavePortalContract.getWaves()
        console.log("retrived total wave count " + count)

        const waveTxn = await wavePortalContract.wave()
        console.log("Mining...", waveTxn.hash)

        await waveTxn.wait()
        console.log("Mined--", waveTxn.hash)

        count = await wavePortalContract.getWaves()
        console.log("updated waves " + count)

      } else {
        console.log("ethereum object does not exist at all")
      }
    } catch (error) {
      console.log("error found", error)
    }
  }

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        <button className="waveButton" onClick={connectWallet}>
          Connect Wallet
        </button>
      </div>
    </div>
  );
}
