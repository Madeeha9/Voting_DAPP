/* eslint-disable no-unused-vars */
import {useState, useEffect} from 'react';
import {ethers} from 'ethers';
import {contractAddress, contractAbi} from './constants/constants';
import Login from './components/Login';
import './App.css';

function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
