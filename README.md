# Decentralised Voting Application
This is a web3 voting application based on Solidity smart contract and ReactJS.

# Execution
Clone the repository on your system and the install the packages using
```
npm install
```

You first need to compile the contract and upload it to the blockchain network. Run the following commands to compile and upload the contract.

To get the API URL, login to alchemy and create a new dapp named voting. Obtain the api url and paste it in .env file. Also add your private key in the .env file.

Once the contract is uploaded to the blockchain, copy the contract address and copy it in the .env file and run the command

```
npx hardhat compile
```
```
npx hardhat run --network sepolia scripts/deploy.js
```

After deploying your smart contract, simply run the command
```
npm start
```
