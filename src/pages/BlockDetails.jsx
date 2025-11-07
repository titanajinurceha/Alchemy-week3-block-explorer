import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { alchemy } from "../services/alchemy";
import Loader from "../components/Loader";
import DashboardCard from "../components/DashboardCard";
import TransactionCard from "../components/TransactionCard";

export default function BlockDetails() {
  const { blockNumber } = useParams();
  const [block, setBlock] = useState(null);
  const [gasPrice, setGasPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const blockData = await alchemy.core.getBlockWithTransactions(
          Number(blockNumber)
        );
        setBlock(blockData);

        const gas = await alchemy.core.getGasPrice();
        setGasPrice(Number(gas));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [blockNumber]);

  if (loading) return <Loader />;
  if (!block) return <div>Block not found.</div>;

  return (
    <section>
      {/* Dashboard Metrics */}
      <section className="border border-[#e5e5e5] rounded-lg">
        <div className="px-5 py-3 flex justify-between border-b border-[#e5e5e5]">
          <h2 className="text-lg font-black">Block Details</h2>
          <h1 className="text-lg font-mono font-semibold text-[#171717]">
            #{block.number}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-6 mx-4">
          <DashboardCard
            title="Transactions"
            value={block.transactions?.length ?? "—"}
          />
          <DashboardCard
            title="Miner/Proposer"
            value={block.miner ?? block.proposer ?? "—"}
          />
          <DashboardCard
            title="Gas Price"
            value={Number(gasPrice?.toFixed(2)).toLocaleString("en-US") || "—"}
            unit="Wei"
          />
          <DashboardCard
            title="Base Fee"
            value={
              block.baseFeePerGas
                ? Number(block.baseFeePerGas).toLocaleString("en-US")
                : "—"
            }
            unit="Wei"
          />
          <DashboardCard
            title="Gas Used"
            value={
              block.gasUsed
                ? Number(block.gasUsed).toLocaleString("en-US")
                : "—"
            }
            unit="Wei"
          />
          <DashboardCard
            title="Gas Limit"
            value={
              block.gasLimit
                ? Number(block.gasLimit).toLocaleString("en-US")
                : "—"
            }
            unit="Wei"
          />
          <DashboardCard
            title="Timestamp"
            value={
              block.timestamp
                ? new Date(Number(block.timestamp) * 1000).toLocaleString()
                : "—"
            }
          />
          <DashboardCard
            title="Network"
            value={alchemy.config.network.replace("eth-", "").toUpperCase()}
          />
        </div>

        <div className="border-t border-[#e5e5e5] bg-[#fafafa] py-2 px-4 mb-1 transition-all">
          <div className="flex items-start justify-between gap-6 my-4 bg-[#fefefe] border border-[#e5e5e5] rounded-lg px-4 py-3">
            <span className="text-[#666] text-sm">Hash</span>
            <span className="text-[#171717] text-base font-mono font-medium overflow-hidden text-ellipsis">
              {block.hash}
            </span>
          </div>
          <div className="flex items-start justify-between gap-6 my-4 bg-[#fefefe] border border-[#e5e5e5] rounded-lg px-4 py-3">
            <span className="text-[#666] text-sm">Parent</span>
            <span className="text-[#171717] text-base font-mono font-medium overflow-hidden text-ellipsis">
              {block.parentHash}
            </span>
          </div>
          <Link
            to="/"
            className="text-[#666666] text-sm mt-4 ml-3 hover:text-green-600 transition-colors"
          >
            ← Back to Blocks
          </Link>
        </div>
      </section>

      {/* Transactions */}
      <div className="border border-[#e5e5e5] rounded-lg mt-4">
        <div className="px-5 py-3 flex justify-between border-b border-[#e5e5e5]">
          <h3 className="text-lg font-black text-[#171717]">
            Transactions <span className="font-mono">({block.transactions?.length ?? 0})</span>
          </h3>
          <h3 className="text-sm italic text-[#666]">
            *10 latest transaction*
          </h3>
        </div>
        {block.transactions.slice(0, 10).map((tx) => (
          <TransactionCard key={tx.hash} tx={tx} />
        ))}
      </div>
    </section>
  );
}
