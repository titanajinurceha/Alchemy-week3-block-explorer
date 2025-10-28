import useExplorerStore from "../store/useExplorerStore";
import { useEffect } from "react";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import BlockCard from "../components/BlockCard";



export default function Home() {
  const { blockNumber, blocks, isLoading, error } = useExplorerStore();
  const fetchLatestBlock = useExplorerStore((state) => state.fetchLatestBlock);


  useEffect(() => {
    fetchLatestBlock();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">
        Latest Block: {blockNumber}
      </h1>
      {blocks.map((block) => (
        <BlockCard key={block.number} block={block} />
      ))}
    </section>
  );
}
