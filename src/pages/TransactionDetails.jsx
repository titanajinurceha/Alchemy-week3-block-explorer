import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { alchemy } from "../services/alchemy";
import Loader from "../components/Loader";

export default function TransactionDetails() {
  const { txHash } = useParams();
  const [tx, setTx] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧮 Format ETH
  const formatEth = (wei) => {
    if (!wei) return "—";
    const eth = Number(wei) / 1e18;
    return `${eth.toFixed(8)} ETH`;
  };

  // ⏱️ Format "time ago"
const formatTimeAgo = (timestamp) => {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`;
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hr${hours !== 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  return "over a month ago";
};

  useEffect(() => {
    async function fetchTx() {
      try {
        const txData = await alchemy.core.getTransaction(txHash);
        const receiptData = await alchemy.core.getTransactionReceipt(txHash);

        setTx(txData);
        setReceipt(receiptData);

        if (txData?.blockNumber) {
          const blockData = await alchemy.core.getBlock(txData.blockNumber);
          setBlock(blockData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTx();
  }, [txHash]);

  if (loading) return <Loader />;
  if (!tx)
    return (
      <div className="text-center py-8 text-[#666]">Transaction not found.</div>
    );

  const statusText = receipt?.status ? "Success" : "Failed";
  const gasUsed = Number(receipt?.gasUsed || 0);
  const gasPrice = Number(tx?.gasPrice || 0);
  const txFeeWei = gasUsed * gasPrice;
  const txFeeEth = txFeeWei / 1e18;

  return (
    <section className=" bg-[#fefefe] border border-[#e5e5e5] rounded-lg mb-8">
      {/* HEADER */}
      <div className="px-5 py-3 flex justify-between bg-[#fafafa] rounded-t-lg border-b border-[#e5e5e5]">
        <div>
          <h2 className="text-lg font-black mb-1">Transaction Details</h2>
          <p className="text-sm text-[#666]">
            Transfer{" "}
            <span className="font-mono text-[#171717] font-medium">
              {formatEth(tx.value)}{" "}
            </span>{" "}
            to{" "}
            <Link
              to={`/account/${tx.to}`}
              className="font-mono hover:text-green-600 text-[#171717] font-medium"
            >
              {" "}
              {tx.to}{" "}
            </Link>{" "}
          </p>{" "}
        </div>
        <div className="text-right">
          <p className="text-sm text-[#666] mb-1">Timestamp</p>
          <p className="font-mono text-base font-medium truncate text-[#171717]">
          {block
            ? `${new Date(
                block.timestamp * 1000
              ).toLocaleTimeString()}`
            : "—"}
            </p>
        </div>
      </div>

      {/* GRID DETAILS */}
      <div className="px-5 py-4 grid grid-cols-3 gap-x-4 gap-y-4 text-sm">
        <p className="text-[#666] text-base">Hash</p>
        <p className="col-span-2 text-base truncate">
          :{" "} <span className="font-mono">{tx.hash}</span>
        </p>

        <p className="text-[#666] text-base">Status</p>
        <p className="col-span-2 text-base">
          :{" "}
          <span
            className={`font-semibold ${
              statusText === "Success" ? "text-green-600" : "text-red-500"
            }`}
          >
            {statusText}
          </span>
        </p>

        <p className="text-[#666] text-base">Block</p>
        <p className="col-span-2 text-base">
          :{" "}
          <Link
            to={`/block/${tx.blockNumber}`}
            className="font-mono text-[#171717] hover:text-green-600"
          >
            {tx.blockNumber}
          </Link>
          <span className="text-[#666] ml-2">• 1 Block Confirmation</span>
        </p>

        <p className="text-[#666] text-base">Timestamp</p>
        <p className="col-span-2 text-[#171717] text-base">
          :{" "}
          {block
            ? `${formatTimeAgo(block.timestamp)} (${new Date(
                block.timestamp * 1000
              ).toLocaleString()})`
            : "—"}
        </p>

        <p className="text-[#666] text-base">From</p>
        <p className="col-span-2 text-base truncate">
          :{" "}
          <Link
            to={`/account/${tx.from}`}
            className="font-mono text-[#171717] hover:text-green-600"
          >
            {tx.from}
          </Link>
        </p>

        <p className="text-[#666] text-base">To</p>
        <p className="col-span-2 text-base truncate">
          :{" "}
          <Link
            to={`/account/${tx.to}`}
            className="font-mono text-[#171717] hover:text-green-600"
          >
            {tx.to}
          </Link>
        </p>

        <p className="text-[#666] text-base">Value</p>
        <p className="col-span-2 text-[#171717] font-mono text-base">:{formatEth(tx.value)}</p>

        <p className="text-[#666] text-base">Transaction Fee</p>
        <p className="col-span-2 text-[#171717] font-mono text-base">
        :{txFeeEth.toFixed(10)} ETH
        </p>

        <p className="text-[#666] text-base">Gas Price</p>
        <p className="col-span-2 text-[#171717] font-mono text-base">
        :{(gasPrice / 1e9).toFixed(6)} Gwei
        </p>
      </div>
    </section>
  );
}
