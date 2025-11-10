// src/services/wsswebsocket.js
export function initWSSWebSocketListeners({ onPendingTx }) {
  console.log("🔌 Connecting to Alchemy WebSocket...");

  const wsUrl = import.meta.env.VITE_ALCHEMY_WEBSOCKET_KEY;
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log("✅ WebSocket connected. Subscribing to pending transactions...");
    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_subscribe",
        params: ["alchemy_pendingTransactions", { hashesOnly: false }],
      })
    );
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.method === "eth_subscription" && data.params?.result) {
        const tx = data.params.result;
        if (onPendingTx) onPendingTx(tx);
      }
    } catch (err) {
      console.error("Failed to parse WS message:", err);
    }
  };

  ws.onerror = (err) => console.error("⚠️ WebSocket error:", err);
  ws.onclose = (e) => console.log("🔌 WebSocket closed:", e.code, e.reason);

  // Return cleanup safely after delay to avoid React double mount close
  return () => {
    setTimeout(() => {
      console.log("🧹 Cleaning up WebSocket...");
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    }, 500);
  };
}
