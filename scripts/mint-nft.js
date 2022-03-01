const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("dotenv").config();

//Importing API-key, Public keys, and Private keys of accounts
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PUBLIC_KEY2 = process.env.PUBLIC_KEY2;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_KEY2 = process.env.PRIVATE_KEY2;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

//Importing abi file of smart contract
const contract = require("../artifacts/contracts/Marketplace.sol/Marketplace.json");
const contractAddress = "0xa1D9587282B354645BD19F405Bf030e2380D9976";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

//method to mint erc20 token
app.post("/mintERC20", async (req, res) => {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY2, "latest");
  const tx = {
    from: PUBLIC_KEY2,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mintERC20(req.body.amount).encodeABI(),
  };

  //signing the transaction using private key
  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY2);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            );
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            );
          }
        }
      );
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });
});

//method to mint an NFT
app.post("/mintNFT", async (req, res) => {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY2, "latest");
  const tx = {
    from: PUBLIC_KEY2,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods
      .mintNFT(
        req.body.erc20_id,
        req.body.name,
        req.body.color,

        req.body.description,
        req.body.tokenURI,

        req.body.dateTime
      )
      .encodeABI(),
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY2);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            );
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            );
          }
        }
      );
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });
});

//method to set the price of an NFT
app.post("/setNFTPrice", async (req, res) => {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.setNFTPrice(req.body._setAmount).encodeABI(),
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            );
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            );
          }
        }
      );
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });
});

//Connection of server
app.listen(5000, () => {
  console.log("Listening on port 5000");
});
