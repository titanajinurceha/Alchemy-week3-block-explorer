import { useEffect, useState } from "react";
import { alchemy } from "../services/alchemy";
import Loader from "../components/Loader";

export default function PendingTracker() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPending() {
      try {
        const txs = await alchemy.core.getBlockWithTransactions("pending");
        setPending(txs.transactions.slice(0, 10));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPending();
  }, []);

  if (loading) return <Loader />;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Pending Transactions</h2>
      {pending.map((tx) => (
        <div key={tx.hash} className="border p-3 rounded mb-2">
          <p><strong>Hash:</strong> {tx.hash}</p>
          <p><strong>From:</strong> {tx.from}</p>
          <p><strong>To:</strong> {tx.to}</p>
        </div>
      ))}
    </section>
  );
}
