import { Link } from "react-router-dom";

export default function TransactionCard({ tx }) {
  return (
    <div className="border border-gray-200 rounded-md p-3 mb-2">
      <p><strong>Hash:</strong> {tx.hash}</p>
      <p><strong>From:</strong> {tx.from}</p>
      <p><strong>To:</strong> {tx.to}</p>
      <Link to={`/tx/${tx.hash}`} className="text-blue-500 underline text-sm">
        Details
      </Link>
    </div>
  );
}
