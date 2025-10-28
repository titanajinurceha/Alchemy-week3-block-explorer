import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { alchemy } from "../services/alchemy";
import Loader from "../components/Loader";

export default function TransactionDetails() {
  const { txHash } = useParams();
  const [tx, setTx] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTx() {
      try {
        const txData = await alchemy.core.getTransaction(txHash);
        const receiptData = await alchemy.core.getTransactionReceipt(txHash);
        setTx(txData);
        setReceipt(receiptData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTx();
  }, [txHash]);

  if (loading) return <Loader />;
  if (!tx) return <div>Transaction not found.</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Transaction Details</h2>
      <p><strong>Hash:</strong> {tx.hash}</p>
      <p><strong>From:</strong> {tx.from}</p>
      <p><strong>To:</strong> {tx.to}</p>
      <p><strong>Value:</strong> {tx.value?.toString()} wei</p>
      <p><strong>Status:</strong> {receipt?.status ? "Success" : "Failed"}</p>
      <p><strong>Gas Used:</strong> {receipt?.gasUsed?.toString()}</p>
    </div>
  );
}
