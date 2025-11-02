import { Alchemy, Network } from "alchemy-sdk";

const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY;

if (!apiKey) {
  console.warn(
    "⚠️ No Alchemy API key found in environment. Check your .env file!"
  );
}

const settings = {
  apiKey: apiKey ?? "MISSING_KEY",
  network: Network.ETH_MAINNET,
  websocketUrl: `wss://eth-mainnet.g.alchemy.com/v2/4EmjvvcTXN3pEcDXpRvXc`,
};
export const alchemy = new Alchemy(settings);
