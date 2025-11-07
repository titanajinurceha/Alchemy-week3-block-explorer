import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { alchemy } from "../services/alchemy";
import { initWebSocketListeners } from "../services/websocket";
import SkeletonLoader from "../components/SkeletonLoader";

export default function Home() {
  const [recentBlocks, setRecentBlocks] = useState([]);
  const [recentTxs, setRecentTxs] = useState([]);
  const [latestBlock, setLatestBlock] = useState(null);
  const [flash, setFlash] = useState(false);
  const navigate = useNavigate();

  const handleClick = (type, value) => {
    if (!value) return; // prevent navigation if not ready
    navigate(`/${type}/${value}`);
  };
  // Fetch initial 10 blocks
  useEffect(() => {
    async function loadInitialBlocks() {
      const currentBlock = await alchemy.core.getBlockNumber();
      const blockPromises = Array.from({ length: 10 }, (_, i) =>
        alchemy.core.getBlockWithTransactions(currentBlock - i)
      );
      const blocks = await Promise.all(blockPromises);
      setRecentBlocks(blocks);
      setLatestBlock(blocks[0]);
      setRecentTxs(blocks[0].transactions.slice(0, 10));
    }
    loadInitialBlocks();
  }, []);

  // WebSocket listener for new blocks
  useEffect(() => {
    const unsubscribe = initWebSocketListeners({
      onNewBlock: async (newBlockNumber) => {
        const newBlock = await alchemy.core.getBlockWithTransactions(
          newBlockNumber
        );

        setRecentBlocks((prev) => {
          const alreadyExists = prev.some((b) => b.number === newBlock.number);
          if (alreadyExists) return prev;
          return [newBlock, ...prev].slice(0, 10);
        });

        setRecentTxs((prev) => {
          const newTxs = newBlock.transactions.slice(0, 10);
          const uniqueTxs = [
            ...newTxs.filter((tx) => !prev.some((p) => p.hash === tx.hash)),
            ...prev,
          ].slice(0, 10);
          return uniqueTxs;
        });

        setLatestBlock(newBlock);
        setFlash(true);
        setTimeout(() => setFlash(false), 600);
      },
    });

    return unsubscribe;
  }, []);

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    if (seconds < 60) return `${seconds} secs ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} mins ago`;
  };

  const formatEth = (weiValue) => {
    const eth = Number(weiValue) / 1e18;
    return `${eth.toFixed(5)} ETH`;
  };

  return (
    <section className="min-h-screen bg-[#fafafa] text-[#171717]">
      {/* Recent Block */}
      <div className="border border-[#e5e5e5] rounded-lg bg-[#fefefe] mb-6 px-6 py-5 transition-all">
        {/* Top Section: Recent Block + Timestamp */}
        <div className="flex justify-between items-end mb-3">
          {/* Left: Block Number */}
          <div>
            <h2 className="text-sm font-medium text-[#171717] mb-1">
              Recent Block
            </h2>
            <h1
              className={`text-xl font-semibold font-mono leading-tight transition-all ${
                flash ? "text-green-500 scale-105" : "text-[#171717]"
              }`}
            >
              {latestBlock?.number ?? <SkeletonLoader lines={1} />}
            </h1>
          </div>
          <Link
            to={`/account/${latestBlock?.miner}`}
            className="sr-only lg:not-sr-only"
          >
            <p className="text-sm font-medium text-[#666]">Miner:</p>
            <h1 className="text-xl font-semibold font-mono text-[#171717] hover:text-green-600 tuncrate">
              {latestBlock?.miner ?? <SkeletonLoader lines={1} />}
            </h1>
          </Link>

          {/* Right: Timestamp */}
          <div className="text-right">
            <h2 className="text-sm font-medium text-[#666] mb-1">Timestamp</h2>
            <p className="text-xl font-semibold font-mono text-[#171717] leading-tight">
              {latestBlock ? (
                new Date(latestBlock.timestamp * 1000).toLocaleTimeString()
              ) : (
                <SkeletonLoader lines={1} />
              )}
            </p>
          </div>
        </div>

        {/* Bottom Section: Meta Info */}
        <div className="flex justify-between items-center text-sm">
          <Link
            to={`/block/${latestBlock?.number}`}
            className="text-[#666] hover:text-green-600 transition-colors"
          >
            View Details
          </Link>
          <Link to={`/block/${latestBlock?.number}`} className="text-[#666]">
            {formatTimeAgo(latestBlock?.timestamp)} •{" "}
            {latestBlock?.transactions?.length ?? 0} txns
          </Link>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Latest Blocks */}
        <div className="border border-[#e5e5e5] rounded-lg bg-[#fefefe]">
          <div className="border-b border-[#e5e5e5] px-4 py-2">
            <h3 className="font-medium text-lg">Latest Blocks</h3>
          </div>
          {recentBlocks.length === 0 ? (
            <div className="p-4">
              <SkeletonLoader lines={10} />
            </div>
          ) : (
            <ul className="divide-y divide-[#f0f0f0]">
              {recentBlocks.map((block, index) => (
                <li
                  key={block.number}
                  onClick={() => handleClick("block", block?.number)}
                  className={`block group px-4 py-3 text-sm cursor-pointer transition-all hover:bg-[#fafafa] ${
                    index === 0 && flash ? "bg-green-50" : ""
                  }`}
                >
                  {/* Outer container for hover */}
                  <div className="flex justify-between">
                    <div>
                      <Link
                        to={`/block/${block.number}`}
                        className="font-semibold mb-1 text-[#171717] group-hover:text-green-600 transition-colors inline-block"
                      >
                        Block <span className="font-mono">#{block.number}</span>
                      </Link>

                      <p className="text-[#666] font-light mb-1 text-xs">
                        Miner
                      </p>
                      <Link
                        to={`/account/${block.miner}`}
                        onClick={(e) => e.stopPropagation()} // prevent triggering parent link hover
                        className="text-xs text-[#171717] font-mono truncate hover:text-green-600 transition-colors"
                      >
                        {block.miner}
                      </Link>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold mb-2">
                        {block.transactions.length} txns
                      </p>
                      <p className="text-[#666] text-xs">
                        {formatTimeAgo(block.timestamp)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: Latest Transactions */}
        <div className="border border-[#e5e5e5] rounded-lg bg-[#fefefe]">
          <div className="border-b border-[#e5e5e5] px-4 py-2">
            <h3 className="font-medium text-lg">Latest Transactions</h3>
          </div>
          {recentTxs.length === 0 ? (
            <div className="p-4">
              <SkeletonLoader lines={10} />
            </div>
          ) : (
            <ul className="divide-y divide-[#f0f0f0]">
              {recentTxs.map((tx) => (
                <li
                  key={tx.hash}
                  onClick={() => handleClick("tx", tx?.hash)}
                  className="block group px-4 py-3 text-sm cursor-pointer hover:bg-[#fafafa] transition-colors"
                >
                  <p className="font-medium font-mono mb-2 text-sm text-[#171717] truncate group-hover:text-green-600">
                    {tx.hash}
                  </p>
                  <div className="flex mb-1 justify-between pr-2 text-[#666] text-xs">
                    <Link
                      to={`/account/${tx?.from}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-green-600 font-mono truncate"
                    >
                      From{" "}
                      <span className="font-medium font-mono">
                        {tx.from?.slice(0, 15)}...
                      </span>
                    </Link>
                    <Link
                      to={`/account/${tx?.to}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-green-600 font-mono truncate text-right"
                    >
                      to{" "}
                      <span className="font-medium font-mono">
                        {tx.to?.slice(0, 15)}...
                      </span>
                    </Link>
                  </div>
                  <p className="text-[#171717] font-medium text-xs text-right pr-3">
                    {formatEth(tx.value)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
