import { useEffect, useState } from "react";
import { initWebSocketListeners } from "../services/websocket";
import Loader from "../components/Loader";

export default function PendingTracker() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    // Initial placeholder data (optional)
    setLoading(false);

    // Start WebSocket listeners
    const unsubscribe = initWebSocketListeners({
      onPendingTx: (tx) => {
        // Add new tx to top, keep last 10
        setPending((prev) => [tx, ...prev.slice(0, 9)]);

        // Set last update time
        setLastUpdate(new Date().toLocaleTimeString());

        // Trigger flash animation
        setFlash(true);
        setTimeout(() => setFlash(false), 600);
      },
    });

    // Cleanup listener when component unmounts
    return unsubscribe;
  }, []);

  if (loading) return <Loader />;

  return (
    <section
      className={`border rounded p-4 transition-all duration-500 ${
        flash ? "shadow-lg shadow-green-400/50" : ""
      }`}
    >
      <h2 className="text-xl font-semibold mb-3">Pending Transactions</h2>

      <p
        className={`text-sm mb-3 transition-colors duration-300 ${
          flash ? "text-green-500 font-medium" : "text-gray-500"
        }`}
      >
        Last updated: {lastUpdate || "waiting for updates..."}
      </p>

      {pending.length === 0 && (
        <p className="text-gray-500 italic">No pending transactions yet...</p>
      )}

      <div className="space-y-2">
        {pending.map((tx) => (
          <div
            key={tx.hash}
            className={`border rounded p-3 text-sm transition-all duration-300 ${
              flash && tx === pending[0] ? "bg-green-50" : ""
            }`}
          >
            <p>
              <strong>Hash:</strong> {tx.hash}
            </p>
            <p>
              <strong>From:</strong> {tx.from}
            </p>
            <p>
              <strong>To:</strong> {tx.to || "Contract Creation"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
