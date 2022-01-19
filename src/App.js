import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import MyAlgo, {CallApplTxn} from '@randlabs/myalgo-connect';
import algosdk, { encodeObj } from 'algosdk';


async function execute() {
console.log("hola pepe!")
const algodToken = '';

const algodServer = "https://node.testnet.algoexplorerapi.io";
const algoIndexer = "https://algoindexer.testnet.algoexplorerapi.io/"
// const algodServer = "https://node.algoexplorerapi.io";
// const algoIndexer = "https://algoindexer.algoexplorerapi.io/"
const algodPort = '';
// const algodPortindexer = '8980'
let algodClient = new algosdk.Algodv2(algodToken, algodServer,algodPort);
let indexer = new algosdk.Indexer(algodToken, algoIndexer,algodPort);

let wallet;
let accounts;
let addresses;
try {

 wallet = new MyAlgo();
 accounts = await wallet.connect();
 console.log('accounts:')
console.log(accounts)
 addresses = accounts.map(account => account.address);
   
} catch (err) {
  console.error(err);
}
console.log('addresses:')
console.log(addresses)

// let accountInfo = await algodClient.accountInformation(addresses[0]).do();

// console.log("Account balance: %d microAlgos", accountInfo.amount);
// let accountInfo = await algodClient.accountInformation(addresses[0]).do();
let accountInfo = await indexer.lookupAccountByID(addresses[0]).do()

console.log("Information for Account: " + JSON.stringify(accountInfo, undefined, 2));
// console.log("Information for Account: " + JSON.stringify(accountInfo));
// console.log("Account balance: %d microAlgos", accountInfo);

const receiver = "MEBVPYXHXJIS2RBGIL62HM4ARR5B4U46HJ6KS2T3ACWPVSZEE4NOLI6CJM";
const enc = new TextEncoder();
const note = new Uint8Array(Buffer.from('Hello World!!!'));
let amount = 5000000;
let sender = addresses[0];
// let txn = algosdk.makePaymentTxnWithSuggestedParams(sender, receiver, amount, undefined, note, params);
try {
let params = await algodClient.getTransactionParams().do();
let txn = {
  ...params,
  fee: 1000,
  flatFee: true,
  type: 'pay',
  from: sender,
  to:  receiver,
  amount: 2500000,
  note: note
};
        // Sign the transaction
        // let signedTxn = txn.signTxn(accounts[0].sk);
        let signedTxn = await wallet.signTransaction(txn);
        console.log("Signed transaction with txID: %s", signedTxn.txID);
        // console.log(signedTxn)
        // const encoded1 = encode(signedTxn);
        // const encoded1 = encodeObj(signedTxn);
        const encoded1 = Buffer.from(encodeObj(signedTxn)).toString("base64");
        // Submit the transaction
        await algodClient.sendRawTransaction(signedTxn.blob).do();

                // const response =  await fetch('http://localhost:8080', {
                //     method: 'POST',
                //     headers: {
                //       "Access-Control-Allow-Origin": "*",
                //       'Accept': 'application/json',
                //       'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify({
                //       param1: encoded1,
                //       // secondParam: 'yourOtherValue',
                //     })
                //   });
                //   const result = await response.json();
                //   console.log(result)

  } catch(err) {
      console.error(err); 
  }
}


function App() {

  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={() => execute() }>
        Execute Tnx
      </button>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
