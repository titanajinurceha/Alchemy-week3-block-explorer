// src/pages/PendingTracker.jsx
import { useEffect, useRef, useState } from "react";
import { initWSSWebSocketListeners } from "../services/wsswebsocket";
import Loader from "../components/Loader";

// config
const FLUSH_INTERVAL_MS = 2000; // UI update cadence (2s)
const MAX_ITEMS = 10; // keep latest 10 pending txs

function formatTimeAgoMs(msTimestamp) {
  if (!msTimestamp) return "";
  const diff = Math.floor((Date.now() - msTimestamp) / 1000); // seconds
  if (diff < 60) return `${diff} sec${diff !== 1 ? "s" : ""} ago`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 7)} week${Math.floor(days / 7) !== 1 ? "s" : ""} ago`;
}

function formatEth(weiValue) {
  if (!weiValue) return "0 ETH";
  const eth = Number(weiValue) / 1e18;
  return `${eth.toFixed(6)} ETH`;
}

export default function PendingTracker() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [flash, setFlash] = useState(false);
  const [paused, setPaused] = useState(false);
  const [minValueEth, setMinValueEth] = useState(""); // empty = no filter

  // buffer ref that websocket will push into
  const bufferRef = useRef([]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    let firstEvent = false;

    const unsubscribe = initWSSWebSocketListeners({
      onPendingTx: (tx) => {
        // Add arrival timestamp in ms
        const enriched = { ...tx, __receivedAt: Date.now() };

        // Quick filter by min value (if set)
        if (minValueEth) {
          const minWei = Number(minValueEth) * 1e18;
          if (!tx.value || Number(tx.value) < minWei) return;
        }

        bufferRef.current.push(enriched);

        if (!firstEvent) {
          setLoading(false);
          firstEvent = true;
        }
      },
    });

    // Flush interval: move buffered txs to state every FLUSH_INTERVAL_MS
    const flushInterval = setInterval(() => {
      if (paused) return; // don't flush while paused
      const buffer = bufferRef.current;
      if (!buffer.length) return;

      // Merge buffer with existing state (dedupe by hash)
      setPending((prev) => {
        // put newest first
        const combined = [...buffer.reverse(), ...prev];

        // dedupe by hash, keep first occurrence
        const seen = new Set();
        const deduped = [];
        for (const tx of combined) {
          if (!tx || !tx.hash) continue;
          if (seen.has(tx.hash)) continue;
          seen.add(tx.hash);
          deduped.push(tx);
          if (deduped.length >= MAX_ITEMS) break;
        }
        return deduped;
      });

      // clear buffer
      bufferRef.current = [];

      // UI meta
      setLastUpdate(Date.now());
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    }, FLUSH_INTERVAL_MS);

    return () => {
      isMounted.current = false;
      clearInterval(flushInterval);
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [paused, minValueEth]);

  // rendering
  return (
    <section className={`border rounded-lg border-[#e5e5e5] p-4 transition-all ${flash ? "shadow-lg shadow-green-300/40" : ""}`}>
      <div className="flex items-center justify-between mb-1 px-2">
        <h2 className="text-lg font-black text-[#171717]">Pending Transactions</h2>

        <div className="flex items-center gap-5 px-2">
          <label className="text-sm text-[#666]">Min ETH</label>
          <input
            type="number"
            step="0.0001"
            placeholder="e.g. 0.1"
            value={minValueEth}
            onChange={(e) => setMinValueEth(e.target.value)}
            className="border border-[#e5e5e5] text-right px-2 py-1 bg-[#fefefe] rounded-lg w-30 text-sm font-mono"
          />
          <button
            onClick={() => setPaused((p) => !p)}
            className={`px-3 py-1 rounded text-sm ${paused ? "bg-yellow-400" : "bg-black text-white"}`}
          >
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      <p className={`text-sm mb-5 px-2 ${flash ? "text-green-600" : "text-gray-600"}`}>
        {lastUpdate ? `Last update: ${formatTimeAgoMs(lastUpdate)}` : "Listening..."}
      </p>

      {loading ? (
        <Loader />
      ) : pending.length === 0 ? (
        <p className="text-gray-500 italic">No pending transactions yet...</p>
      ) : (
        <div className="space-y-2">
          {pending.map((tx, idx) => (
            <div
              key={tx.hash}
              className={`border rounded-lg border-[#e5e5e5] py-3 px-6 text-sm transition-all
                grid bg-[#fefefe] grid-cols-5 ${flash && idx === 0 ? "bg-green-50" : ""}`}
            >
              <div className="text-[#666]">
                <p className="mb-2">Hash</p>
                <p className="mb-2">From</p>
                <p className="mb-2">To</p>
                <p className="mb-2">Value</p>
                <p className="mb-2">Recieved</p>                
              </div>
              <div className="col-span-4 text-[#171717] font-mono">
              <p className="truncate mb-2">: {tx.hash}</p>
              <p className="truncate mb-2">: {tx.from}</p>
              <p className="truncate mb-2">: {tx.to || "Contract Creation"}</p>
              <p className=" mb-2">: {tx.value ? formatEth(tx.value) : "0 ETH"}</p>
              <p className="truncate mb-2">: {formatTimeAgoMs(tx.__receivedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
