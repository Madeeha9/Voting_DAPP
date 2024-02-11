/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractAbi } from "../constants/constants";
import VoteClosed from "./VoteClosed";

function VotePage(props) {
  const [votingStatus, setVotingStatus] = useState(false);
  const [remainingTime, setremainingTime] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState("");
  const [CanVote, setCanVote] = useState(true);

  useEffect(() => {
    getCandidates();
    getRemainingTime();
    getCurrentStatus();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", props.handleAccountChange);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          props.handleAccountChange
        );
      }
    };
  });

  const getCurrentStatus = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    const status = await contractInstance.getVotingStatus();
    // console.log(status);
    setVotingStatus(status);
  };

  const getRemainingTime = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    const time = await contractInstance.getRemainingTime();
    setremainingTime(parseInt(time, 16));
  };

  const getCandidates = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    const candidatesList = await contractInstance.getAllVotesOfCandiates();
    const formattedCandidates = candidatesList.map((candidate, index) => {
      return {
        index: index,
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber(),
      };
    });
    setCandidates(formattedCandidates);
  };

  const vote = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    const tx = await contractInstance.vote(number);
    await tx.wait();
    canVote();
  };

  const canVote = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    const voteStatus = await contractInstance.voters(await signer.getAddress());
    setCanVote(voteStatus);
  };

  async function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  return (
    <div>
      {votingStatus ? (
        <div>
          <h1 className="connected-header">You are Connected to Metamask</h1>
          <p className="connected-account">Metamask Account: {props.account}</p>
          <p className="connected-account">Remaining Time: {remainingTime}</p>
          {CanVote ? (
            <p className="connected-account">You have already voted</p>
          ) : (
            <div>
              <input
                type="number"
                placeholder="Entern Candidate Index"
                value={number}
                onChange={handleNumberChange}
              ></input>
              <br />
              <button className="login-button" onClick={vote}>
                Vote
              </button>
            </div>
          )}

          <table id="myTable" className="candidates-table">
            <thead>
              <tr>
                <th>Index</th>
                <th>Candidate name</th>
                <th>Candidate votes</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, index) => (
                <tr key={index}>
                  <td>{candidate.index}</td>
                  <td>{candidate.name}</td>
                  <td>{candidate.voteCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <VoteClosed />
      )}
    </div>
  );
}

export default VotePage;
