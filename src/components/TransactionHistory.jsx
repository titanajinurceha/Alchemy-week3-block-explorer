import { useEffect, useState } from "react";
import { alchemy } from "../services/alchemy";
import Loader from "./Loader";
import TransactionCard from "./TransactionCard";

export default function TransactionHistory({ address }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  if (error) return <p className="text-[#666] italic text-center text-base mt-2">{error}</p>;

  return (
    <div className="mt-6 border border-[#e5e5e5] rounded-lg">
      <div className="border-b border-[#e5e5e5] px-4 py-2">
        <h3 className="font-black text-lg text-[#171717]">Transaction History</h3>
      </div>
      {transactions.length === 0 ? (
        <p>No transactions found for this address.</p>
      ) : (
        <ul>
          {transactions.slice(0, 10).map((tx, idx) => (
            <TransactionCard
              key={idx}
              tx={{
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                value: tx.value ? Number(tx.value) : 0n,
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
