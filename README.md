# ⚡ Alchemy Ethereum Explorer

A full-stack blockchain explorer built with **React + Vite + Alchemy SDK**, featuring live data, NFT lookups, account balance checking, and **real-time WebSocket updates**.  
This project extends Alchemy University’s *“Blockchain Explorer”* with improved structure, better UX, and new live-update features.

---

## 🚀 Features

- Explore latest Ethereum blocks in real time  
- View block and transaction details  
- Check any account’s balance  
- Browse NFTs owned by an address  
- Stream live block updates via **Alchemy WebSocket**  
- Modular React architecture with reusable components  

---

## ⚙️ Getting Started

### 1️⃣ Client Setup
```bash
cd client
npm install
npm run dev
# Runs on: http://localhost:5173
```
### 2️⃣ Environment Variables
Create a .env file inside /client:

```bash
VITE_ALCHEMY_API_KEY=your_api_key_here
```
### 3️⃣ WebSocket Configuration
Alchemy WebSocket runs automatically using your API key.
> No manual setup required.

## 🧩 Key Functionalities
### 🔹 1. Block Explorer
Displays the latest block and all recent blocks fetched using:

```js
alchemy.core.getBlockNumber()
```
Each block can be clicked to reveal:
1. Block hash
2. Timestamp
3. Transaction count
4. Gas usage details

### 🔹 2. Transaction Details
Fetches full transaction data using:
```javascript
alchemy.core.getTransactionReceipt(txHash)
```
Shows sender, receiver, gas used, and confirmation status.

### 🔹 3. Account Lookup
Lets users check any wallet’s balance instantly:

```javascript
alchemy.core.getBalance(address, "latest")
```
### 🔹 4. NFT Explorer
Lists NFTs owned by an address using:
```javascript
alchemy.nft.getNftsForOwner(address)
```
Shows collection name, image, and token IDs.

### 🔹 5. Real-Time WebSocket Updates
Integrates Alchemy WebSocket API for live streaming data:
```javascript
alchemy.ws.on("block", (blockNumber) => {
  console.log("🧱 New block:", blockNumber);
});
alchemy.ws.on("alchemy_pendingTransactions", (tx) => {
  console.log("🚀 Pending TX:", tx);
});
```
> *[!NOTE]*
The "alchemy_pendingTransactions" event name replaces "pendingTransactions"
in newer Alchemy SDK versions (v3+).

### 🔹 6. Error Handling & Logging
Custom debug logs for easier tracking:
```javascript
alchemy.ws.on("open", () => console.log("✅ WebSocket connected!"));
alchemy.ws.on("close", () => console.log("❌ WebSocket disconnected!"));
alchemy.ws.on("error", (err) => console.error("⚠️ WS error:", err));
```
## ✅ Feature Analysis vs Task Goals
| Task Suggestion / Goal | Implementation Status | Details |
| --- | --- | --- |
| 🔹 Allow users to click a block to get its details | ✅ Done | **“Latest Block”** section links to **/block/:blockNumber**, showing hash, timestamp, and TX list. |
| 🔹 From block details, click transactions to get details | ✅ Done | **/tx/:hash** route shows TX data (from, to, value, gas, status). |
| 🔹 Accounts page to look up balances | ✅ Done (Enhanced UX) | **/account** route accepts manual input or **/account/:address** URL param. |
| 🔹 NFT methods | ✅ Done | **/nft** route shows NFTs by address. |
| 🔹 WebSocket methods | ✅ Done (Live Updates) | **"block"** and **"alchemy_pendingTransactions"** listeners active. |
| 🔹 Alchemy Transact API functionality | ✅ Done | Added simulated “Send Transaction” and confirmation tracking. |
| 🔹 Alchemy Notify Webhooks | ✅ Done (Integrated) | Handled via internal event simulation and UI updates. |
| 🔹 Given contract + tokenId → get NFT metadata | ✅ Done | Added NFT Metadata & Floor Price detail view. |
| 🔹 Check NFT floor price | ✅ Done | Fetches real-time floor prices per NFT collection. |
| 🔹 Check if pending transaction got mined | ✅ Done | Mined TX automatically removed and updates shown live. |
| 🔹 What transfers did an address receive this year? | ✅ Done | Uses **alchemy.core.getAssetTransfers()** with date filtering. |

## 🧱 Project Structure
```bash
blockexplorer/
├──src/          # React + Vite frontend
│  ├── components/    # Reusable UI components
│  ├── pages/         # Routes (Home, Account, Block, Tx, NFT)   
│  ├── services/      # WebSocket & Alchemy helpers
│  ├── store/         # Zustand global state management
│  ├── styles/        # UI
│  ├── App.jsx
│  └── main.jsx
├──.env
└──README.md
```
> ### 🧩 Modified Files During WebSocket Integration
> - src/utils/websocket.js → added alchemy.ws connection + event listeners
> - src/pages/Home.jsx → now shows latest block in real time
> - src/pages/Blocks.jsx → handles live block rendering
> - .env → stores VITE_ALCHEMY_API_KEY

## 🧠 Debugging & Development Notes
1. **WebSocket Event Update**
    - Changed event name from "pendingTransactions" → "alchemy_pendingTransactions".

2. **Added Connection Logs**
    - To track connection, error, and close events.

3. **Confirmed Alchemy Key Works**
    - Using wss://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY.

4. **Removed Geist UI Library**
    - Simplified UI with TailwindCSS for maintainability.

5. **Reusable Styles**
    - Tailwind used with shared component classes to handle large project scope.

## 🧠 References & Original Course Documentation

This project builds upon the official Alchemy “Merkle Tree Gift List” exercise. You can view the original course and setup guide below 👇

<details> <summary>📜 View Original Course README</summary>

# Ethereum Block Explorer
The lessons this week covered the Ethereum JSON-RPC API and the `ethers.js` library giving us the ability to query the Ethereum blockchain and make transactions!

Let's put that knowledge to the test by building our very own **Ethereum Block Explorer**!

Blockexplorers give us the ability to view lots of different information about the blockchain including data about:
  * the blockchain network itself
  * blocks in the blockchain
  * transactions in a block
  * accounts
  * and many other things
  
[Etherscan](https://etherscan.io/) is a good example of an Ethereum blockexplorer. Check it out to get familiar with how blockexplorers generally work.

This particular project is very much open-ended. We'll add some challenges here to get your imagination going, but use Etherscan as a guide for features you might consider building in your project.

## Getting Started

Clone this project to pull down some basic starter code.

After that cd into the base directory of the project and run `npm install` to download all the project dependencies.

In this project we chose to use React for a front-end and added minimal front-end code to get you going, but feel free to use any front-end stack you like.

Unlike the lessons this week that used the Ethereum JSON-RPC API and the `ethers.js` library to communicate with the Ethereum network, the starter code in this project uses the [AlchemySDK](https://docs.alchemy.com/reference/alchemy-sdk-quickstart?a=eth-bootcamp). The AlchemySDK's core package wraps almost all of the `ethers.js` provider functionality that we learned about and should feel very familiar to you. 

For example, the following `ethers.js` code
```js
const blockNumber = await provider.getBlockNumber();
```
can be written using the AlchemySDK like so:
```js
const blockNumber = await alchemy.core.getBlockNumber()
```
Another `ethers.js ` example
```js
const transcations = await provider.getBlockWithTransactions(SOME_BLOCK_NUMBER)
```
translates to
```js
const transactions = await alchemy.core.getBlockWithTransactions(SOME_BLOCK_NUMBER)
```
and so on.

There are some `ethers.js` provider functions that are not often-used and therefore not included in `alchemy.core`. But if you ever need the full ethers provider functionality you can access the provider directly with the following code:
```js
const ethersProvider = await alchemy.config.getProvider();
```

You can find lots of good docs on the AlchemySDK here:
  * [API Quickstart](https://docs.alchemy.com/reference/alchemy-sdk-quickstart?a=eth-bootcamp)
  * [API Overview](https://docs.alchemy.com/reference/api-overview?a=eth-bootcamp)

Alright, without further ado, let's get started!

## 1. Create a unique Alchemy API key

If you have not already done so, create a unique Alchemy API Mainnet key
for your project as [described here](https://docs.alchemy.com/reference/api-overview?a=eth-bootcamp).

## 2. Add your API key to as an environment variable for the project

Create an empty `.env` file in the base directory of this project.

Add the following line to the `.env` file replacing `YOUR_ALCHEMY_API_KEY` with your api key.

```sh
REACT_APP_ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY
```

Do not remove the `REACT_APP_` prefix. React uses that to import env variables.

**⚠️ Note**

> Your Alchemy API Mainnet Key is a sensitive piece of data. If we were\
> building an enterprise app to conquer the world we would never place\
> this sensitive data in the client code of our blockexplorer project that\
> could potentially be read by anyone.
>
> But hey, we're just learning this stuff right now, not conquering anything\
> yet! :-) It won't be the end of the world to put the Alchemy API key in our\
> front-end code for this project.

## 3. Start the webserver

`npm start`

Running the command above will run the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The webpage will automatically reload when you make code changes.

What you'll see in the browser is Ethereum Mainnet's current block number. Not very exciting, but that's where you come in to save the day!

## 4. Make the blockexplorer cool!

The starter code pulls down the current block number for you.

Can you get more information about the current block and display it in the page?
Take a look at [alchemy.core.getBlock()](https://docs.alchemy.com/reference/sdk-getblock?a=eth-bootcamp) for how you might go about that.

Blocks contains transactions. Can you get the list of transactions for a given block? Can you use [alchemy.core.getBlockWithTransactions()](https://docs.alchemy.com/reference/sdk-getblockwithtransactions?a=eth-bootcamp) for this?

How about getting details for individual transactions? The [alchemy.core.getTransactionReceipt()](https://docs.alchemy.com/reference/sdk-gettransactionreceipt?a=eth-bootcamp) looks handy.

## 5. More ideas to think about

- Connecting the dots.
  - Allow users to click on a block listed in the webpage to get the block's details including its list of transactions
  - From the list of transactions allow users to click on specific transactions to get the details of the transaction
- Make an accounts page where a user can look up their balance or someone else's balance

## 6. Supercharge your blockexplorer using AlchemySDK's specialized APIs

By using the AlchemySDK you can really supercharge your projects with additional API functionality that isn't included in the `ethers.js` package including:
  * NFT methods
  * WebSocket methods
  * Alchemy's Transact API functionality
  * endpoints for using Alchemy's Notify Webhooks

Read more about the above in the [Alchemy SDK Surface docs](https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview?a=eth-bootcamp). Using the SDK can implement the following features?

- Given a contract address and token id, can you get the NFT's metadata?
- What is the floor price of an NFT right now?
- Did a pending transaction get mined?
- What transfers did an address receive this year?

Good luck and have fun!
</details>

## 🧰 Tech Stack
- **Frontend:** React + Vite + TailwindCSS

- **Blockchain API:** Alchemy SDK

- **Language:** JavaScript (ES Modules)

- **Live Data:** WebSocket API

- **Environment:** Node 18+

## 👨‍💻 Author
**Titan Aji Nurceha**<br>
Developed as part of Alchemy University’s Week 3: Blockchain Explorer challenge.<br>
Enhanced to demonstrate real-time blockchain data, modular UI design, and developer-friendly WebSocket debugging.

## 🧭 Summary
This project demonstrates:
- Integration of Alchemy Core, NFT, and WebSocket APIs
- Real-time blockchain event handling in React
- Practical understanding of asynchronous data flow
- Clean UI and maintainable architecture using Tailwind