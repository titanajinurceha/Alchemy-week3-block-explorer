import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { alchemy } from "../services/alchemy";
import Loader from "../components/Loader";

export default function NftDetail() {
  const { contractAddress, tokenId } = useParams();
  const navigate = useNavigate();

  const [nft, setNft] = useState(null);
  const [floorPrice, setFloorPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNftDetail() {
      try {
        setLoading(true);
        const [meta, price] = await Promise.all([
          alchemy.nft.getNftMetadata(contractAddress, tokenId.toString(), {
            refreshCache: true,
          }),
          alchemy.nft.getFloorPrice(contractAddress),
        ]);

        setNft(meta);
        setFloorPrice(price.openSea?.floorPrice || "N/A");
      } catch (err) {
        console.error("Error fetching NFT detail:", err);
        setError("Failed to load NFT details.");
      } finally {
        setLoading(false);
      }
    }

    fetchNftDetail();
  }, [contractAddress, tokenId]);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-800"
        >
          ← Back
        </button>
      </div>
    );

  if (!nft) return null;

  const title =
    nft.title ||
    nft.rawMetadata?.name ||
    nft.metadata?.name ||
    `${nft.contract?.name || "NFT"} #${tokenId}`;

  const imageUrl =
    nft.media?.[0]?.gateway ||
    (nft.rawMetadata?.image
      ? nft.rawMetadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
      : null);

  return (
    <div className="border border-[#e5e5e5] bg-[#fefefe] rounded-lg">
      <div className="p-4 bg-[#fafafa] rounded-t-lg border-b border-[#e5e5e5] text-lg font-black">
        <h1>NFT Detail</h1>
      </div>
      <div className="p-4 grid grid-cols-3 gap-x-4 gap-y-4">
        <div className="col-span-2 pr-2">
          <h2 className="text-lg font-semibold mb-3">{title}</h2>

          <p>
            <strong>Contract Address:</strong> {contractAddress}
          </p>
          <p>
            <strong>Token ID:</strong> {tokenId}
          </p>
          <p className="mt-2">
            <strong>Description:</strong>{" "}
            {nft.description ||
              nft.rawMetadata?.description ||
              "No description available."}
          </p>

          {/* Attributes */}
          {nft.rawMetadata?.attributes?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Attributes</h3>
              <div className="flex flex-wrap gap-2">
                {nft.rawMetadata.attributes.map((attr, idx) => (
                  <div
                    key={idx}
                    className="border rounded px-3 py-1 bg-gray-50 text-sm"
                  >
                    <strong>{attr.trait_type}:</strong> {attr.value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="size-full rounded mb-4" />
          ) : (
            <div className="h-60 bg-gray-200 flex items-center justify-center rounded-lg mb-4 text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        {/* Market Data */}
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <h3 className="text-lg font-semibold">Market Data</h3>
          <p>
            <strong>Floor Price:</strong> {floorPrice} ETH
          </p>
        </div>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-4 ml-2 bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
      >
        ← Back
      </button>
    </div>
  );
}
