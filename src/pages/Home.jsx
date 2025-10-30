import { useEffect, useState } from "react";
import useExplorerStore from "../store/useExplorerStore";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import BlockCard from "../components/BlockCard";
import { initWebSocketListeners } from "../services/websocket";

export default function Home() {
  const { blockNumber, blocks, isLoading, error, fetchLatestBlock } =
    useExplorerStore();

  const [lastUpdated, setLastUpdated] = useState(null);
  const [highlight, setHighlight] = useState(false);
  const [latestBlock, setLatestBlock] = useState(null);

  useEffect(() => {
    // Fetch initial block data
    fetchLatestBlock();

    // Set up WebSocket listeners
    const unsubscribe = initWebSocketListeners({
      onNewBlock: async (newBlockNumber) => {
        await fetchLatestBlock();
        setLatestBlock(newBlockNumber);
        setLastUpdated(new Date());
        setHighlight(true);

        // Remove highlight after half a second
        setTimeout(() => setHighlight(false), 500);
      },
    });

    return () => unsubscribe();
  }, [fetchLatestBlock]);

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section>
        <h1 className="text-2xl font-semibold mb-4">
          Latest Block:{" "}
          <span
            className={`transition-colors duration-300 ${
              highlight ? "text-green-500" : ""
            }`}
          >
            {blockNumber}
          </span>
        </h1>

        {/* Show the update info only when data exists */}
        {lastUpdated && (
          <p
            className={`text-sm mb-3 transition-colors duration-300 ${
              highlight ? "text-green-500 font-medium" : "text-gray-500"
            }`}
          >
            ✅ Updated to block #{latestBlock} at{" "}
            {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        {blocks.map((block) => (
          <BlockCard key={block.number} block={block} />
        ))}
    </section>
  );
}
