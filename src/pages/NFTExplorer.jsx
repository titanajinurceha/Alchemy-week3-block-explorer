import { useState } from "react";
import { alchemy } from "../services/alchemy";
import Loader from "../components/Loader";

export default function NFTExplorer() {
  const [address, setAddress] = useState("");
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchNFTs() {
    setLoading(true);
    try {
      const data = await alchemy.nft.getNftsForOwner(address);
      setNfts(data.ownedNfts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">NFT Explorer</h2>
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Enter wallet address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          onClick={fetchNFTs}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          Search
        </button>
      </div>
      {loading ? (
        <Loader />
      ) : (
        nfts.map((nft, i) => (
          <div key={i} className="border rounded p-3 mb-2">
            <p><strong>Title:</strong> {nft.title}</p>
            <p><strong>Contract:</strong> {nft.contract.address}</p>
          </div>
        ))
      )}
    </section>
  );
}
