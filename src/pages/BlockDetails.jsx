import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { alchemy } from "../services/alchemy";
import Loader from "../components/Loader";
import TransactionCard from "../components/TransactionCard";

export default function BlockDetails() {
  const { blockNumber } = useParams();
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlock() {
      try {
        const data = await alchemy.core.getBlockWithTransactions(Number(blockNumber));
        setBlock(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlock();
  }, [blockNumber]);

  if (loading) return <Loader />;
  if (!block) return <div>Block not found.</div>;

  return (
    <section>
      <h2 className="text-xl font-bold mb-3">Block {block.number}</h2>
      <p><strong>Hash:</strong> {block.hash}</p>
      <p><strong>Timestamp:</strong> {new Date(block.timestamp * 1000).toLocaleString()}</p>
      <h3 className="mt-4 font-semibold">Transactions:</h3>
      {block.transactions.slice(0, 10).map((tx) => (
        <TransactionCard key={tx.hash} tx={tx} />
      ))}
    </section>
  );
}
