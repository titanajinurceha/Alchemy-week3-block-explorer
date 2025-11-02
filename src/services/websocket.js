import { alchemy } from "./alchemy";

export function initWebSocketListeners({ onPendingTx, onNewBlock }) {
  console.log("Initializing Alchemy WebSocket listeners...");

  const ws = alchemy.ws;
  console.log("Alchemy WS instance:", ws);

  ws.on("open", () => console.log("✅ WebSocket connected"));
  ws.on("close", () => console.log("❌ WebSocket disconnected"));
  ws.on("error", (err) => console.error("🔥 WebSocket error:", err));

  if (onPendingTx) {
    ws.on("pendingTransactions", (tx) => {
      console.log("📡 Incoming pending tx:", tx);
      if (tx && tx.hash) onPendingTx(tx);
    });
  }

  if (onNewBlock) {
    ws.on("block", onNewBlock);
  }

  return () => {
    ws.removeAllListeners("pendingTransactions");
    ws.removeAllListeners("block");
  };
}
