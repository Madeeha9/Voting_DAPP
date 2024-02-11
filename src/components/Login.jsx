/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import VotePage from "./VotePage";
import { contractAddress, contractAbi } from "../constants/constants";

const Login = (props) => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountChange);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountChange);
      }
    };
  });

  const handleAccountChange = (accounts) => {
    if (accounts.length > 0 && accounts[0] !== account) {
      setAccount(accounts[0]);
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  };

  const connectToMetamask = async () => {
    if (window.ethereum) {
      try {
        const p = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(p);

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        console.log("Metamask Connected: " + address);
        setIsConnected(true);
        setAccount(address);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Metamask not found in browser!");
    }
  };

  return (
    <div>
      {isConnected ? (
        <VotePage account={account} handleAccountChange={handleAccountChange} />
      ) : (
        <div className="login-container">
          <h1 className="welcome-message">Welcome to Voting DAPP</h1>
          <button className="login-button" onClick={connectToMetamask}>
            Metamask Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
