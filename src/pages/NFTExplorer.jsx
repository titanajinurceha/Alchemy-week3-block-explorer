import { useNavigate } from "react-router-dom";
import { useNftStore } from "../store/useNftStore";
import Loader from "../components/Loader";

function resolveIpfsUrl(url) {
  if (!url) return null;
  return url.startsWith("ipfs://")
    ? url.replace("ipfs://", "https://ipfs.io/ipfs/")
    : url;
}

export default function NFTExplorer() {
  const navigate = useNavigate();
  const { address, setAddress, nfts, fetchNFTs, loading, error } = useNftStore();

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">NFT Explorer</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Enter wallet address"
          value={address}
          onChange={(e) => setAddress(e.target.value.trim())}
        />
        <button
          onClick={() => fetchNFTs(address)}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          Search
        </button>
      </div>

      {loading && <Loader />}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && nfts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {nfts.map((nft, i) => {
            const tokenId =
              typeof nft.tokenId === "object" ? nft.tokenId.tokenId : nft.tokenId;

            // Pick the best image source
            const imageUrl =
              resolveIpfsUrl(
                nft.media?.[0]?.gateway ||
                  nft.media?.[0]?.raw ||
                  nft.rawMetadata?.image ||
                  nft.metadata?.image
              ) || null;

            // Smart title fallback
            const title =
              nft.title ||
              nft.rawMetadata?.name ||
              nft.metadata?.name ||
              `${nft.contract?.name || "NFT"} #${tokenId?.slice(0, 6)}`;

            return (
              <div
                key={i}
                onClick={() => navigate(`/nft/${nft.contract.address}/${tokenId}`)}
                className="border rounded p-3 cursor-pointer hover:shadow-lg transition"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={title}
                    className="rounded mb-2 w-full h-60 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-60 bg-gray-200 flex items-center justify-center rounded mb-2 text-gray-500">
                    No Image
                  </div>
                )}

                <p className="font-semibold truncate">{title}</p>
                <p className="text-sm text-gray-500 truncate">
                  Token ID: {tokenId ? tokenId.slice(0, 6) + "..." : "N/A"}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && nfts.length === 0 && address && (
        <p className="text-gray-500">No NFTs found for this address.</p>
      )}
    </section>
  );
}
