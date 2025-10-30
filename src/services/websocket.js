import { alchemy } from "./alchemy";

export function initWebSocketListeners({
  onPendingTx,
  onNewBlock,
}) {
  // Listen for pending transactions
  if (onPendingTx) {
    alchemy.ws.on("pendingTransactions", (tx) => {
      if (tx && tx.hash) onPendingTx(tx);
    });
  }

  // Listen for new blocks
  if (onNewBlock) {
    alchemy.ws.on("block", onNewBlock);
  }

  // Return unsubscribe function
  return () => {
    alchemy.ws.removeAllListeners("pendingTransactions");
    alchemy.ws.removeAllListeners("block");
  };
}
