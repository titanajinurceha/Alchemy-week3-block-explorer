import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useNftStore } from "../store/useNftStore";
import Loader from "../components/Loader";

function resolveIpfsUrl(url) {
  if (!url) return null;
  if (url.startsWith("ipfs://")) {
    const cleanUrl = url.replace("ipfs://ipfs/", "").replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${cleanUrl}`;
  }
  // handle broken IPFS gateways or embedded images
  if (url.startsWith("data:image")) return url;
  if (url.startsWith("http")) return url;
  return null;
}

export default function NFTExplorer() {
  const navigate = useNavigate();
  const { address, setAddress, nfts, fetchNFTs, loading, error, hasFetched } =
    useNftStore();

  useEffect(() => {
    if (address && !hasFetched && nfts.length === 0) {
      fetchNFTs(address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, hasFetched]);

  const handleSearch = () => {
    fetchNFTs(address);
  };

  return (
    <section className="border border-[#e5e5e5] p-4 rounded-lg mb-6">
      <h2 className="px-1 font-black text-lg text-[#171717]">NFT Explorer</h2>
      <label
        htmlFor="eth-address"
        className="block px-1 text-sm font-medium text-[#666] mb-4"
      >
        Enter a Wallet address to view NFTs collection.
      </label>
      <div className="flex gap-2 mb-4 pb-6 border-b border-[#e5e5e5]">
        <input
          placeholder="Enter wallet address"
          value={address}
          onChange={(e) => setAddress(e.target.value.trim())}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="border border-[#e5e5e5] bg-[#fefefe] font-mono px-3 py-2 rounded-lg w-full focus:outline-none focus:ring focus:ring-black/50 transition"
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white font-semibold px-6 rounded-lg hover:bg-black/80 hover:shadow-sm hover:shadow-black/30 transition"
        >
          Search
        </button>
      </div>

      {loading && <Loader />}
      {!loading && error && hasFetched && (
        <p className="text-[#666] italic text-base text-center mt-4">{error}</p>
      )}

      {!loading && !error && hasFetched && nfts.length === 0 && address && (
        <p className="text-gray-500">No NFTs found for this address.</p>
      )}

      {!loading && !error && hasFetched && nfts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {nfts.map((nft, i) => {
            const tokenId =
              typeof nft.tokenId === "object"
                ? nft.tokenId.tokenId
                : nft.tokenId;

            // Pick the best image source
            const imageUrl = resolveIpfsUrl(
              nft.media?.[0]?.gateway ||
                nft.media?.[0]?.thumbnail ||
                nft.media?.[0]?.raw ||
                nft.rawMetadata?.image ||
                nft.metadata?.image
            );

            // Smart title fallback
            const title =
              nft.title ||
              nft.rawMetadata?.name ||
              nft.metadata?.name ||
              `${nft.contract?.name || "NFT"} #${tokenId}`;

            return (
              <div
                key={i}
                onClick={() =>
                  navigate(`/nft/${nft.contract.address}/${tokenId}`)
                }
                className="border border-[#e5e5e5] rounded-lg p-3 cursor-pointer hover:shadow-lg transition"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={title}
                    className="rounded mb-2 w-full h-60 object-cover transition-transform duration-200 hover:scale-[1.02]"
                    loading="lazy"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div className="h-60 bg-[#171717] flex items-center justify-center rounded-lg mb-2 text-[#fefefe] text-sm">
                    🖼 Image not available
                  </div>
                )}

                <p className="font-semibold font-mono text-sm px-2 mb-1 truncate">{title}</p>
                <p className="text-sm text-gray-500 font-mono px-2 mb-1 truncate">
                  Token ID: <span className="text-[#171717] font-medium">{tokenId ? tokenId.slice(0, 6) : "N/A"}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
