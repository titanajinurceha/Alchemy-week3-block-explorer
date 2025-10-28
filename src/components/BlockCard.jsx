import { Link } from "react-router-dom";

export default function BlockCard({ block }) {
  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-3">
      <p><strong>Block Number:</strong> {block.number}</p>
      <p><strong>Hash:</strong> {block.hash}</p>
      <p><strong>Transactions:</strong> {block.transactions.length}</p>
      <Link
        to={`/block/${block.number}`}
        className="text-blue-500 underline text-sm"
      >
        View Details
      </Link>
    </div>
  );
}
