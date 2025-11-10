import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { alchemy } from "../services/alchemy";
import SkeletonLoader from "../components/SkeletonLoader";

export default function NftDetail() {
  const { contractAddress, tokenId } = useParams();
  const navigate = useNavigate();

  const [nft, setNft] = useState(null);
  const [floorPrice, setFloorPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNftDetail() {
      setError(null);
      setNft(null);
      setFloorPrice(null);
      setLoading(true);
      try {
        const [meta, price] = await Promise.all([
          alchemy.nft.getNftMetadata(contractAddress, tokenId.toString(), {
            refreshCache: true,
          }),
          alchemy.nft.getFloorPrice(contractAddress),
        ]);

        setNft(meta);
        setFloorPrice(price?.openSea?.floorPrice ?? "N/A");
      } catch (err) {
        console.error("Error fetching NFT detail:", err);
        setError("Failed to load NFT details.");
      } finally {
        setLoading(false);
      }
    }

    fetchNftDetail();
  }, [contractAddress, tokenId]);

  // 🧩 Handle error state
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-800 transition"
        >
          ← Back
        </button>
      </div>
    );
  }

  // 🖼 Resolve IPFS URLs safely
  const resolveIpfs = (url) =>
    url?.startsWith("ipfs://")
      ? url.replace("ipfs://", "https://ipfs.io/ipfs/")
      : url;

  const title = loading ? (
    <SkeletonLoader lines={1} />
  ) : (
    nft?.title ||
    nft?.rawMetadata?.name ||
    nft?.metadata?.name ||
    `${nft?.contract?.name || "NFT"} #${tokenId}`
  );

  const imageUrl = nft
    ? resolveIpfs(
        nft.media?.[0]?.gateway || nft.rawMetadata?.image || nft.metadata?.image
      )
    : null;

  return (
    <div className="border border-[#e5e5e5] rounded-lg bg-[#fefefe]">
      {/* Header */}
      <div className="p-4 border-b border-[#e5e5e5] bg-[#fafafa] rounded-t-lg">
        <h1 className="font-black text-lg text-gray-900">NFT Details</h1>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Image Section */}
        <div className="md:col-span-1">
          {loading ? (
            <div className="w-full h-72 bg-gray-200 animate-pulse rounded-lg" />
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="rounded-lg w-full object-cover"
            />
          ) : (
            <div className="h-72 bg-[#171717] flex items-center justify-center text-[#fefefe] rounded-lg">
              🖼 No Image
            </div>
          )}
        </div>

        {/* NFT Info */}
        <div className="md:col-span-2 space-y-5">
          <h2 className="text-xl font-semibold">{title}</h2>

          <div className="px-2 grid grid-cols-2 gap-4 text-sm">
            <div className="truncate pr-1">
              <p className="text-[#666]">Contract</p>
              <Link
                to={`/account/${nft?.contract?.address}`}
                className="font-mono text-base text-gray-900 hover:text-green-600"
              >
                {nft?.contract?.address}
              </Link>
            </div>
            <div>
              <p className="text-[#666]">Token ID</p>
              <p className="font-mono text-base text-gray-900">{tokenId}</p>
            </div>
            <div>
              <p className="text-[#666]">Type</p>
              <p className="font-mono text-base">
                {nft?.contract?.tokenType || "—"}
              </p>
            </div>
            <div>
              <p className="text-[#666]">Total Supply</p>
              <p className="font-mono text-base">
                {nft?.contract?.totalSupply || "N/A"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-[#fafafa] rounded-lg text-base text-gray-900 leading-relaxed">
            {loading ? (
              <SkeletonLoader lines={3} />
            ) : (
              nft?.description ||
              nft?.metadata?.description ||
              "No description available."
            )}
          </div>

          {/* Attributes */}
          {nft?.rawMetadata?.attributes?.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Attributes</h3>
              <div className="flex flex-wrap gap-2">
                {nft.rawMetadata.attributes.map((attr, i) => (
                  <div
                    key={i}
                    className="px-3 py-1 bg-gray-100 border rounded text-sm"
                  >
                    <strong>{attr.trait_type}:</strong> {attr.value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Market Data */}
      <div className="px-6 py-4 bg-[#fafafa] border-t border-[#e5e5e5] rounded-b-lg">
        <div className="grid grid-cols-5 gap-2 text-sm py-4 items-end">
          <div className="col-span-2 text-right px-8 py-2 rounded-lg border border-[#e5e5e5]">
            <p className="text-[#666]">OpenSea Floor Price</p>
            <p className="text-lg text-[#171717] font-mono font-semibold">{floorPrice} ETH</p>
          </div>
        <button
          onClick={() => navigate(-1)}
          className="col-start-4 text-[#171717] mx-4 py-2 border border-[#171717] rounded hover:bg-[#171717] hover:text-[#fefefe]  transition"
        >
          ← Back
        </button>
          <a
            href={`https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#171717] text-white mx-4 py-2 border border-[#171717] rounded hover:bg-[#fafafa] hover:text-[#171717]  transition text-center"
          >
            OpenSea ↗
          </a>
        </div>


      </div>
    </div>
  );
}
