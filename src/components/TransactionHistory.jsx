// src/components/TransactionHistory.jsx
import { useEffect, useState } from "react";
import { alchemy } from "../services/alchemy";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

export default function TransactionHistory({ address }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!address) return;

    async function fetchTransactions() {
      setLoading(true);
      setError(null);

      try {
        const data = await alchemy.core.getAssetTransfers({
          fromBlock: "0x0",
          toBlock: "latest",
          toAddress: address,
          category: ["external", "internal", "erc20", "erc721"],
        });

        setTransactions(data.transfers || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [address]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 mt-2">{error}</p>;

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-3">Transaction History</h3>

      {transactions.length === 0 ? (
        <p>No transactions found for this address.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {transactions.map((tx, idx) => (
            <li
              key={idx}
              className="border rounded p-4 bg-gray-50 mt-3 border-gray-500 overflow-hidden"
            >
              <p>
                <strong>Hash:</strong>{" "}
                <a
                  href={`https://etherscan.io/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  {tx.hash.slice(0, 20)}...
                </a>
              </p>
              <p>
                <strong>From:</strong> {tx.from.slice(0, 15)}...
              </p>
              <p>
                <strong>To:</strong> {tx.to?.slice(0, 15) || "Contract"}...
              </p>
              <p>
                <strong>Value:</strong> {tx.value || "0"}
              </p>
              <button
                onClick={() => navigate(`/tx/${tx.hash}`)}
                className="mt-2 bg-blue-700 text-white px-4 py-1 rounded text-sm hover:bg-blue-800 transition"
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
